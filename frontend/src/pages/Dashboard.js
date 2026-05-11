import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { motion } from 'framer-motion';
import { History, Calendar, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  const fetchDiagnoses = async () => {
    try {
      const response = await axios.get(`${API}/diagnoses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDiagnoses(response.data);
    } catch (error) {
      toast.error('Failed to load diagnosis history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" data-testid="dashboard-page">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-['Sora']" data-testid="dashboard-title">
              Welcome, {user?.name}!
            </h1>
            <p className="text-slate-300 text-lg">
              View and manage your vehicle diagnosis history
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="text-center card-3d">
                <History className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-2 font-mono">{diagnoses.length}</div>
                <div className="text-slate-400">Total Diagnoses</div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <GlassCard className="text-center card-3d">
                <AlertTriangle className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-2 font-mono">
                  {diagnoses.reduce((acc, d) => acc + d.predictions.length, 0)}
                </div>
                <div className="text-slate-400">Faults Detected</div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="text-center card-3d">
                <Calendar className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                <div className="text-4xl font-bold text-white mb-2 font-mono">
                  {diagnoses.length > 0 ? format(new Date(diagnoses[0].timestamp), 'MMM dd') : '--'}
                </div>
                <div className="text-slate-400">Last Diagnosis</div>
              </GlassCard>
            </motion.div>
          </div>

          {loading ? (
            <div className="text-center py-20" data-testid="dashboard-loading">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading diagnosis history...</p>
            </div>
          ) : diagnoses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              data-testid="no-diagnoses"
            >
              <GlassCard className="text-center py-20">
                <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4 font-['Sora']">No Diagnoses Yet</h3>
                <p className="text-slate-400 mb-8 max-w-md mx-auto">
                  Start by analyzing your vehicle symptoms to build your diagnosis history.
                </p>
                <Button
                  onClick={() => navigate('/diagnose')}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  data-testid="start-diagnosis-btn"
                >
                  Start Diagnosis
                </Button>
              </GlassCard>
            </motion.div>
          ) : (
            <div className="space-y-6" data-testid="diagnosis-list">
              <h2 className="text-2xl font-bold text-white font-['Sora']">Diagnosis History</h2>
              {diagnoses.map((diagnosis, index) => (
                <motion.div
                  key={diagnosis.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`diagnosis-item-${index}`}
                >
                  <GlassCard className="p-6 hover:border-cyan-500/50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="text-slate-300 mb-2">
                          <strong className="text-white">Symptoms:</strong> {diagnosis.symptoms}
                        </p>
                        <p className="text-slate-500 text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(diagnosis.timestamp), 'PPpp')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {diagnosis.predictions.map((pred, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg" data-testid={`prediction-${i}`}>
                          <div className="flex-1">
                            <p className="text-white font-semibold">{pred.fault_name}</p>
                            <p className="text-cyan-400 text-sm">{pred.system}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white font-mono">{pred.probability}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;