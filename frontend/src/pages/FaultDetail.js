import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Wrench, 
  Shield,
  ArrowLeft,
  Loader2
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FaultDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fault, setFault] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaultDetail();
  }, [id]);

  const fetchFaultDetail = async () => {
    try {
      const response = await axios.get(`${API}/faults/${id}`);
      setFault(response.data);
    } catch (error) {
      toast.error('Failed to load fault details');
      navigate('/systems');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" data-testid="fault-detail-loading">
        <Navbar />
        <div className="pt-32 pb-20 px-4 text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading fault details...</p>
        </div>
      </div>
    );
  }

  if (!fault) return null;

  return (
    <div className="min-h-screen" data-testid="fault-detail-page">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <Button
            onClick={() => navigate('/systems')}
            variant="ghost"
            className="mb-8 text-slate-300 hover:text-cyan-400 hover:bg-white/10"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Systems
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassCard className="p-8 glow-cyan">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 font-['Sora']" data-testid="fault-name">
                    {fault.name}
                  </h1>
                  <p className="text-cyan-400 text-lg">{fault.system_id.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())} System</p>
                </div>
              </div>
              <p className="text-slate-300 text-lg" data-testid="fault-description">{fault.description}</p>
            </GlassCard>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h2 className="text-xl font-bold text-white font-['Sora']">Symptoms</h2>
                </div>
                <ul className="space-y-3" data-testid="symptoms-list">
                  {fault.symptoms.map((symptom, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-xl font-bold text-white font-['Sora']">Common Causes</h2>
                </div>
                <ul className="space-y-3" data-testid="causes-list">
                  {fault.causes.map((cause, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300">
                      <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                      <span>{cause}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wrench className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-white font-['Sora']">Repair Solutions</h2>
              </div>
              <ul className="space-y-3" data-testid="solutions-list">
                {fault.solutions.map((solution, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white font-['Sora']">Preventive Maintenance</h2>
              </div>
              <ul className="space-y-3" data-testid="prevention-list">
                {fault.prevention.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300">
                    <Shield className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <GlassCard className="p-6 bg-yellow-500/5 border-yellow-500/20">
              <p className="text-yellow-200 text-center">
                <strong>Disclaimer:</strong> This information is for educational purposes only.
                Always consult a certified mechanic for professional diagnosis and repair.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FaultDetail;