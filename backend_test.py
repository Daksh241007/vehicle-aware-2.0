import requests
import sys
import json
from datetime import datetime

class VehicleAwareAPITester:
    def __init__(self, base_url="https://engine-scanner-ai.preview.emergentagent.com"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_data = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if not headers:
            headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            print(f"   Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response keys: {list(response_data.keys()) if isinstance(response_data, dict) else 'Non-dict response'}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Raw response: {response.text[:200]}")
                return False, {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Request Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        success, response = self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )
        return success

    def test_register(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user = {
            "name": f"Test User {timestamp}",
            "email": f"testuser{timestamp}@example.com",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "api/auth/register",
            200,
            data=test_user
        )
        
        if success and 'token' in response and 'user' in response:
            self.token = response['token']
            self.user_data = response['user']
            print(f"   Registered user: {self.user_data['name']} ({self.user_data['email']})")
            return True
        return False

    def test_login(self):
        """Test user login with registered user"""
        if not self.user_data:
            print("❌ Cannot test login - no user registered")
            return False
            
        login_data = {
            "email": self.user_data['email'],
            "password": "TestPass123!"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST", 
            "api/auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            # Update token with login token
            self.token = response['token']
            return True
        return False

    def test_systems_endpoint(self):
        """Test vehicle systems endpoint"""
        success, response = self.run_test(
            "Get Vehicle Systems",
            "GET",
            "api/systems",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} vehicle systems")
            for system in response[:3]:  # Show first 3
                print(f"   - {system.get('name', 'Unknown')}: {system.get('description', 'No description')[:50]}...")
        
        return success

    def test_faults_endpoint(self):
        """Test faults endpoint"""
        success, response = self.run_test(
            "Get All Faults",
            "GET",
            "api/faults",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} faults")
            # Test individual fault detail
            first_fault_id = response[0].get('id')
            if first_fault_id:
                fault_success, fault_data = self.run_test(
                    f"Get Fault Detail ({first_fault_id})",
                    "GET",
                    f"api/faults/{first_fault_id}",
                    200
                )
                if fault_success:
                    print(f"   Fault detail: {fault_data.get('name', 'Unknown fault')}")
        
        return success

    def test_ai_diagnosis(self):
        """Test AI diagnosis endpoint"""
        test_symptoms = "My car is overheating when I drive on the highway. The temperature gauge goes into the red zone and I can see steam coming from under the hood."
        
        success, response = self.run_test(
            "AI Diagnosis",
            "POST",
            "api/diagnose",
            200,
            data={"symptoms": test_symptoms}
        )
        
        if success and 'predictions' in response:
            predictions = response['predictions']
            print(f"   AI generated {len(predictions)} fault predictions:")
            for i, pred in enumerate(predictions):
                print(f"   {i+1}. {pred.get('fault_name', 'Unknown')} - {pred.get('probability', 0)}% ({pred.get('system', 'Unknown system')})")
        
        return success

    def test_diagnosis_history(self):
        """Test getting diagnosis history (requires auth)"""
        if not self.token:
            print("❌ Cannot test diagnosis history - no auth token")
            return False
            
        success, response = self.run_test(
            "Get Diagnosis History",
            "GET",
            "api/diagnoses",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} diagnosis records in history")
            if len(response) > 0:
                latest = response[0]
                print(f"   Latest: {latest.get('symptoms', 'No symptoms')[:50]}...")
        
        return success

    def test_invalid_endpoints(self):
        """Test some invalid endpoints to check error handling"""
        print(f"\n🔍 Testing Invalid Endpoints...")
        
        # Test invalid fault ID
        try:
            response = requests.get(f"{self.base_url}/api/faults/invalid-id", timeout=10)
            if response.status_code == 404:
                print("✅ Invalid fault ID correctly returns 404")
                self.tests_passed += 1
            else:
                print(f"❌ Invalid fault ID returned {response.status_code} instead of 404")
            self.tests_run += 1
        except Exception as e:
            print(f"❌ Error testing invalid fault ID: {e}")
            self.tests_run += 1

        # Test unauthorized diagnosis history
        try:
            headers = {'Content-Type': 'application/json'}
            response = requests.get(f"{self.base_url}/api/diagnoses", headers=headers, timeout=10)
            if response.status_code == 401:
                print("✅ Unauthorized diagnosis history correctly returns 401")
                self.tests_passed += 1
            else:
                print(f"❌ Unauthorized diagnosis history returned {response.status_code} instead of 401")
            self.tests_run += 1
        except Exception as e:
            print(f"❌ Error testing unauthorized access: {e}")
            self.tests_run += 1

        return True

def main():
    print("🚀 Starting VehicleAware API Testing...")
    print("=" * 60)
    
    # Setup
    tester = VehicleAwareAPITester()
    
    # Run all tests
    test_results = []
    
    # Basic API tests
    test_results.append(("Root API", tester.test_root_endpoint()))
    test_results.append(("Vehicle Systems", tester.test_systems_endpoint()))
    test_results.append(("Faults", tester.test_faults_endpoint()))
    
    # AI Diagnosis (no auth required)
    test_results.append(("AI Diagnosis", tester.test_ai_diagnosis()))
    
    # Auth flow tests
    test_results.append(("User Registration", tester.test_register()))
    test_results.append(("User Login", tester.test_login()))
    
    # Authenticated tests
    test_results.append(("Diagnosis History", tester.test_diagnosis_history()))
    
    # Error handling tests
    test_results.append(("Invalid Endpoints", tester.test_invalid_endpoints()))
    
    # Print final results
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 60)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\n📈 Overall: {tester.tests_passed}/{tester.tests_run} tests passed ({(tester.tests_passed/tester.tests_run*100):.1f}%)")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! Backend API is working correctly.")
        return 0
    else:
        print("⚠️  Some tests failed. Check the details above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())