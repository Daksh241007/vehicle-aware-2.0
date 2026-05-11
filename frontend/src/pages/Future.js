import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { 
  Smartphone,
  Radio,
  BarChart3,
  MessageSquare,
  Cpu,
  Zap,
  Rocket
} from 'lucide-react';

const Future = () => {
  const futureFeatures = [
    {
      icon: Radio,
      title: 'IoT Sensor Integration',
      description: 'Real-time vehicle data collection through IoT sensors for continuous monitoring and predictive diagnostics.',
      status: 'Planned',
      color: 'cyan'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Monitoring',
      description: 'Live dashboard displaying vehicle health metrics, performance data, and early warning systems.',
      status: 'In Development',
      color: 'purple'
    },
    {
      icon: Smartphone,
      title: 'Mobile Application',
      description: 'Native iOS and Android apps for on-the-go diagnostics with push notifications for critical alerts.',
      status: 'Planned',
      color: 'blue'
    },
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Conversational AI interface for interactive troubleshooting and step-by-step repair guidance.',
      status: 'Research Phase',
      color: 'pink'
    },
    {
      icon: Cpu,
      title: 'Edge Computing',
      description: 'On-device AI processing for instant diagnostics without internet connectivity requirements.',
      status: 'Exploring',
      color: 'cyan'
    },
    {
      icon: Zap,
      title: 'Predictive Maintenance',
      description: 'Machine learning models to predict component failures before they occur, reducing downtime.',
      status: 'Research Phase',
      color: 'purple'
    }
  ];

  const statusColors = {
    'Planned': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'In Development': 'text-green-400 bg-green-500/10 border-green-500/20',
    'Research Phase': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    'Exploring': 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  };

  return (
    <div className="min-h-screen" data-testid="future-page">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.6)] float-animation">
              <Rocket className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-['Sora']" data-testid="future-title">
              Future Scope
            </h1>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Exciting features and innovations on our roadmap to revolutionize
              vehicle diagnostics and maintenance.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {futureFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  data-testid={`future-feature-${index}`}
                >
                  <GlassCard className="p-6 h-full card-3d group hover:border-cyan-500/50">
                    <div className="flex justify-between items-start mb-4">
                      <Icon className={`w-10 h-10 text-${feature.color}-400 group-hover:scale-110 transition-transform`} />
                      <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[feature.status]}`}>
                        {feature.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 font-['Sora'] group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 font-['Sora']" data-testid="vision-title">
                Our Vision
              </h2>
              <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                <p>
                  We envision a future where vehicle diagnostics is seamlessly integrated into everyday driving experiences.
                  By combining IoT sensors, edge computing, and advanced AI, we aim to create a proactive maintenance
                  ecosystem that prevents failures before they occur.
                </p>
                <p>
                  Our ultimate goal is to make vehicle ownership safer, more economical, and less stressful by providing
                  owners with unprecedented insight into their vehicle's health. Through continuous innovation and
                  user-centered design, we're building the diagnostic platform of tomorrow.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 font-['Sora']">Technology Stack Evolution</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Current Stack</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                      React + FastAPI
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                      MongoDB Database
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full" />
                      GPT-5.2 AI
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Near Future</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full" />
                      React Native Mobile
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full" />
                      WebSocket Real-time
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full" />
                      Time-series Database
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pink-400 mb-3">Long Term</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full" />
                      Edge AI Processors
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full" />
                      Blockchain Logging
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-pink-400 rounded-full" />
                      Quantum ML Models
                    </li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Future;