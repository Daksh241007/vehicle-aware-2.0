from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import bcrypt
import jwt
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

SECRET_KEY = "vehicleaware_secret_key_2024"
ALGORITHM = "HS256"

# Models
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DiagnosisRequest(BaseModel):
    symptoms: str

class FaultPrediction(BaseModel):
    fault_name: str
    probability: int
    description: str
    system: str

class DiagnosisResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    symptoms: str
    predictions: List[FaultPrediction]
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class VehicleSystem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: str
    icon: str

class Fault(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    system_id: str
    name: str
    description: str
    symptoms: List[str]
    causes: List[str]
    solutions: List[str]
    prevention: List[str]

# Helper functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    return jwt.encode({"user_id": user_id}, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> str:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("user_id")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(authorization: str = None) -> Optional[str]:
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ")[1]
    return verify_token(token)

# AI Diagnosis Function
async def diagnose_with_ai(symptoms: str) -> List[FaultPrediction]:
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        chat = LlmChat(
            api_key=api_key,
            session_id=str(uuid.uuid4()),
            system_message="""You are an expert automotive diagnostic AI. Analyze vehicle symptoms and return possible faults with probability scores.
            
Return ONLY a valid JSON array with this exact structure:
            [
              {
                "fault_name": "Radiator Blockage",
                "probability": 55,
                "description": "Brief technical explanation",
                "system": "Cooling System"
              }
            ]
            
Rules:
            - Return 3-5 most likely faults
            - Probabilities must sum to ~100
            - Systems: Engine System, Brake System, Cooling System, Transmission, Suspension, Electrical System
            - Be technically accurate but concise"""
        ).with_model("openai", "gpt-5.2")
        
        user_message = UserMessage(text=f"Analyze these vehicle symptoms: {symptoms}")
        response = await chat.send_message(user_message)
        
        # Parse AI response
        predictions_data = json.loads(response)
        predictions = [FaultPrediction(**pred) for pred in predictions_data]
        return predictions
    except Exception as e:
        logging.error(f"AI diagnosis error: {e}")
        # Fallback predictions
        return [
            FaultPrediction(
                fault_name="Diagnostic System Error",
                probability=100,
                description="Unable to process symptoms. Please try again.",
                system="System Error"
            )
        ]

# Routes
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = User(name=user_data.name, email=user_data.email)
    user_doc = user.model_dump()
    user_doc['password_hash'] = hash_password(user_data.password)
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    await db.users.insert_one(user_doc)
    token = create_token(user.id)
    
    return {"token": token, "user": {"id": user.id, "name": user.name, "email": user.email}}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user['password_hash']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user['id'])
    return {"token": token, "user": {"id": user['id'], "name": user['name'], "email": user['email']}}

@api_router.post("/diagnose", response_model=DiagnosisResponse)
async def diagnose(request: DiagnosisRequest, authorization: Optional[str] = None):
    user_id = None
    if authorization and authorization.startswith("Bearer "):
        try:
            user_id = await get_current_user(authorization)
        except Exception:
            pass
    
    predictions = await diagnose_with_ai(request.symptoms)
    
    diagnosis = DiagnosisResponse(
        user_id=user_id,
        symptoms=request.symptoms,
        predictions=predictions
    )
    
    # Save to database
    diagnosis_doc = diagnosis.model_dump()
    diagnosis_doc['timestamp'] = diagnosis_doc['timestamp'].isoformat()
    await db.diagnoses.insert_one(diagnosis_doc)
    
    return diagnosis

@api_router.get("/diagnoses", response_model=List[DiagnosisResponse])
async def get_diagnoses(authorization: str = None):
    from fastapi import Header
    user_id = await get_current_user(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    diagnoses = await db.diagnoses.find({"user_id": user_id}, {"_id": 0}).sort("timestamp", -1).to_list(100)
    
    for diag in diagnoses:
        if isinstance(diag['timestamp'], str):
            diag['timestamp'] = datetime.fromisoformat(diag['timestamp'])
    
    return diagnoses

@api_router.get("/systems", response_model=List[VehicleSystem])
async def get_systems():
    systems = await db.vehicle_systems.find({}, {"_id": 0}).to_list(100)
    if not systems:
        # Initialize default systems
        default_systems = [
            {"id": "engine", "name": "Engine System", "description": "Combustion, fuel delivery, air intake, exhaust", "icon": "Cog"},
            {"id": "brake", "name": "Brake System", "description": "Hydraulic brakes, ABS, brake pads and rotors", "icon": "CircleStop"},
            {"id": "cooling", "name": "Cooling System", "description": "Radiator, coolant circulation, thermostat", "icon": "Droplets"},
            {"id": "transmission", "name": "Transmission", "description": "Gearbox, clutch, drive shafts", "icon": "Settings2"},
            {"id": "suspension", "name": "Suspension", "description": "Shocks, struts, springs, control arms", "icon": "Move"},
            {"id": "electrical", "name": "Electrical System", "description": "Battery, alternator, wiring, sensors", "icon": "Zap"}
        ]
        await db.vehicle_systems.insert_many(default_systems)
        systems = default_systems
    return systems

@api_router.get("/faults", response_model=List[Fault])
async def get_faults(system_id: Optional[str] = None):
    query = {"system_id": system_id} if system_id else {}
    faults = await db.faults.find(query, {"_id": 0}).to_list(100)
    
    if not faults and not system_id:
        # Initialize sample faults
        default_faults = [
            {
                "id": "radiator-blockage",
                "system_id": "cooling",
                "name": "Radiator Blockage",
                "description": "Obstruction in radiator preventing proper coolant flow and heat dissipation",
                "symptoms": ["Engine overheating", "Temperature gauge rising", "Steam from hood", "Coolant leaks"],
                "causes": ["Debris accumulation", "Corrosion buildup", "Sediment deposits", "External damage"],
                "solutions": ["Radiator flush", "Replace damaged radiator", "Clean cooling fins", "Check coolant quality"],
                "prevention": ["Regular coolant changes", "Use quality coolant", "Inspect radiator periodically", "Maintain cooling system"]
            },
            {
                "id": "head-gasket-failure",
                "system_id": "engine",
                "name": "Head Gasket Failure",
                "description": "Seal between engine block and cylinder head compromised",
                "symptoms": ["White smoke from exhaust", "Milky oil", "Engine overheating", "Loss of power"],
                "causes": ["Overheating", "Poor installation", "Age and wear", "Detonation damage"],
                "solutions": ["Replace head gasket", "Machine cylinder head", "Check for warping", "Replace bolts"],
                "prevention": ["Avoid overheating", "Regular maintenance", "Quality coolant", "Proper installation"]
            },
            {
                "id": "water-pump-failure",
                "system_id": "cooling",
                "name": "Water Pump Failure",
                "description": "Mechanical failure of coolant circulation pump",
                "symptoms": ["Coolant leaks", "Whining noise", "Overheating", "Steam from engine"],
                "causes": ["Bearing failure", "Seal damage", "Impeller corrosion", "Belt issues"],
                "solutions": ["Replace water pump", "Check drive belt", "Flush cooling system", "Inspect hoses"],
                "prevention": ["Regular inspections", "Quality coolant", "Belt maintenance", "Timely replacement"]
            },
            {
                "id": "brake-pad-wear",
                "system_id": "brake",
                "name": "Brake Pad Wear",
                "description": "Friction material on brake pads worn beyond safe limits",
                "symptoms": ["Squealing noise", "Longer stopping distance", "Vibration when braking", "Warning light"],
                "causes": ["Normal wear", "Aggressive driving", "Heavy loads", "Poor quality pads"],
                "solutions": ["Replace brake pads", "Resurface rotors", "Check calipers", "Bleed brake system"],
                "prevention": ["Gentle braking", "Regular inspections", "Quality pads", "Avoid overloading"]
            },
            {
                "id": "alternator-failure",
                "system_id": "electrical",
                "name": "Alternator Failure",
                "description": "Charging system unable to maintain battery charge",
                "symptoms": ["Battery warning light", "Dim lights", "Dead battery", "Electrical issues"],
                "causes": ["Worn bearings", "Failed diodes", "Belt problems", "Regulator failure"],
                "solutions": ["Replace alternator", "Check battery", "Inspect belt", "Test electrical system"],
                "prevention": ["Regular testing", "Belt maintenance", "Clean connections", "Avoid overload"]
            },
            {
                "id": "transmission-slip",
                "system_id": "transmission",
                "name": "Transmission Slipping",
                "description": "Transmission unable to maintain proper gear engagement",
                "symptoms": ["RPM spikes", "Delayed shifting", "Loss of acceleration", "Burning smell"],
                "causes": ["Low fluid", "Worn clutches", "Solenoid issues", "Torque converter problems"],
                "solutions": ["Fluid change", "Rebuild transmission", "Replace solenoids", "Check linkage"],
                "prevention": ["Regular fluid changes", "Gentle shifting", "Avoid overloading", "Timely maintenance"]
            }
        ]
        await db.faults.insert_many(default_faults)
        faults = default_faults if not system_id else [f for f in default_faults if f['system_id'] == system_id]
    
    return faults

@api_router.get("/faults/{fault_id}", response_model=Fault)
async def get_fault_detail(fault_id: str):
    fault = await db.faults.find_one({"id": fault_id}, {"_id": 0})
    if not fault:
        raise HTTPException(status_code=404, detail="Fault not found")
    return fault

@api_router.get("/")
async def root():
    return {"message": "VehicleAware API", "status": "operational"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()