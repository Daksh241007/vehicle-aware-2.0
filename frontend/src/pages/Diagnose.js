import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Loader2, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Diagnose = () => {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleDiagnose = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your vehicle symptoms');
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post(
        `${API}/diagnose`,
        { symptoms },
        { headers }
      );
      setResult(response.data);
      toast.success('Diagnosis complete!');
    } catch (error) {
      toast.error('Diagnosis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getColorByProbability = (prob) => {
    if (prob >= 50) return 'from-cyan-500 to-blue-600';
    if (prob >= 30) return 'from-purple-500 to-pink-600';
    return 'from-slate-500 to-slate-600';
  };

  return (
    <div className="min-h-screen" data-testid="diagnose-page">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.6)]">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-['Sora']" data-testid="diagnose-title">
              AI Vehicle Diagnosis
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Describe what's happening with your vehicle, and our AI will analyze the symptoms
              to identify possible faults.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-8 mb-8">
              <label className="text-white font-semibold mb-4 block text-lg" htmlFor="symptoms-input">
                Describe Your Vehicle Issue
              </label>
              <Textarea
                id="symptoms-input"
                placeholder="Example: My car is overheating when I drive on the highway. The temperature gauge goes into the red zone, and I can see steam coming from under the hood. The coolant level seems fine..."
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={8}
                className="chat-input text-white text-base mb-6 resize-none"
                data-testid="symptoms-input"
              />
              
              <div className="flex justify-between items-center">
                <p className="text-slate-400 text-sm">
                  {symptoms.length} characters
                </p>
                <Button
                  onClick={handleDiagnose}
                  disabled={loading || !symptoms.trim()}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-8 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
                  data-testid="analyze-btn"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Analyze Issue
                    </>
                  )}
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                data-testid="diagnosis-result"
              >
                <GlassCard className="p-8 glow-cyan">
                  <h2 className="text-2xl font-bold text-white mb-6 font-['Sora']" data-testid="results-title">
                    Diagnosis Results
                  </h2>
                  
                  <div className="space-y-6">
                    {result.predictions.map((prediction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 }}
                        className="glass-card p-6 hover:border-cyan-500/50 transition-all"
                        data-testid={`prediction-${index}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-1 font-['Sora']">
                              {prediction.fault_name}
                            </h3>
                            <p className="text-cyan-400 text-sm font-mono">{prediction.system}</p>
                          </div>
                          <div className="text-right">
                            <div className={`text-3xl font-bold text-white font-mono`}>
                              {prediction.probability}%
                            </div>
                            <div className="text-xs text-slate-400">Probability</div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Progress 
                            value={prediction.probability} 
                            className="h-3 bg-slate-800"
                            data-testid={`progress-bar-${index}`}
                          />
                        </div>

                        <p className="text-slate-300 mb-4">{prediction.description}</p>
                        
                        {prediction.probability >= 40 && (
                          <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <p className="text-yellow-200 text-sm">
                              High probability fault detected. Professional inspection recommended.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                    <p className="text-slate-400 text-sm">
                      <strong className="text-white">Note:</strong> These are AI-generated suggestions based on your symptoms.
                      Always consult a professional mechanic for accurate diagnosis and repair.
                    </p>
                  </div>

                  {token && (
                    <div className="mt-6 text-center">
                      <Button
                        onClick={() => navigate('/dashboard')}
                        variant="outline"
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                        data-testid="view-history-btn"
                      >
                        View Diagnosis History
                      </Button>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          {!token && !result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <GlassCard className="p-6 text-center">
                <p className="text-slate-300">
                  <strong className="text-cyan-400">Tip:</strong> Login or register to save your diagnosis history
                  and access past results anytime.
                </p>
                <Button
                  onClick={() => navigate('/register')}
                  variant="outline"
                  className="mt-4 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  data-testid="register-prompt-btn"
                >
                  Create Free Account
                </Button>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Diagnose;