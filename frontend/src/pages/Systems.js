import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { toast } from 'sonner';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Cog, 
  CircleStop, 
  Droplets, 
  Settings2, 
  Move, 
  Zap,
  ArrowRight,
  Loader2
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const iconMap = {
  Cog, CircleStop, Droplets, Settings2, Move, Zap
};

const Systems = () => {
  const [systems, setSystems] = useState([]);
  const [faults, setFaults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemsAndFaults();
  }, []);

  const fetchSystemsAndFaults = async () => {
    try {
      const [systemsRes, faultsRes] = await Promise.all([
        axios.get(`${API}/systems`),
        axios.get(`${API}/faults`)
      ]);
      
      setSystems(systemsRes.data);
      
      // Group faults by system_id
      const faultsBySystem = {};
      faultsRes.data.forEach(fault => {
        if (!faultsBySystem[fault.system_id]) {
          faultsBySystem[fault.system_id] = [];
        }
        faultsBySystem[fault.system_id].push(fault);
      });
      setFaults(faultsBySystem);
    } catch (error) {
      toast.error('Failed to load systems');
    } finally {
      setLoading(false);
    }
  };

  const colorMap = {
    'engine': 'cyan',
    'brake': 'purple',
    'cooling': 'blue',
    'transmission': 'pink',
    'suspension': 'cyan',
    'electrical': 'purple'
  };

  if (loading) {
    return (
      <div className="min-h-screen" data-testid="systems-loading">
        <Navbar />
        <div className="pt-32 pb-20 px-4 text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading vehicle systems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="systems-page">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-['Sora']" data-testid="systems-page-title">
              Vehicle Systems
            </h1>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Explore common faults across different vehicle systems. Click on any fault
              to learn more about causes, symptoms, and solutions.
            </p>
          </motion.div>

          <div className="space-y-12">
            {systems.map((system, index) => {
              const Icon = iconMap[system.icon] || Cog;
              const color = colorMap[system.id] || 'cyan';
              const systemFaults = faults[system.id] || [];

              return (
                <motion.div
                  key={system.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`system-section-${system.id}`}
                >
                  <GlassCard className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white font-['Sora']">{system.name}</h2>
                        <p className="text-slate-400">{system.description}</p>
                      </div>
                    </div>

                    {systemFaults.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {systemFaults.map((fault, i) => (
                          <Link
                            key={fault.id}
                            to={`/fault/${fault.id}`}
                            data-testid={`fault-card-${fault.id}`}
                          >
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: i * 0.05 }}
                              whileHover={{ scale: 1.02 }}
                              className="glass-card p-5 hover:border-cyan-500/50 transition-all cursor-pointer group"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors font-['Sora']">
                                  {fault.name}
                                </h3>
                                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                              </div>
                              <p className="text-slate-400 text-sm mb-3 line-clamp-2">{fault.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {fault.symptoms.slice(0, 2).map((symptom, si) => (
                                  <span
                                    key={si}
                                    className="text-xs px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20"
                                  >
                                    {symptom}
                                  </span>
                                ))}
                                {fault.symptoms.length > 2 && (
                                  <span className="text-xs px-3 py-1 bg-slate-700/50 text-slate-400 rounded-full">
                                    +{fault.symptoms.length - 2} more
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-center py-8">No faults available for this system</p>
                    )}
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Systems;