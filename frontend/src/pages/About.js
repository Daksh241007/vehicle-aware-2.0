import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Thermometer, 
  Activity, 
  Wrench,
  BookOpen,
  Target
} from 'lucide-react';

const About = () => {
  const relevanceAreas = [
    {
      icon: Wrench,
      title: 'Automotive Diagnostics',
      description: 'Understanding fault identification, root cause analysis, and systematic troubleshooting methodologies in modern vehicles.'
    },
    {
      icon: Thermometer,
      title: 'Heat Transfer',
      description: 'Analysis of cooling systems, thermal management, and heat dissipation principles in automotive engineering.'
    },
    {
      icon: Activity,
      title: 'Vibrations & Dynamics',
      description: 'Study of mechanical vibrations, suspension systems, and their impact on vehicle performance and comfort.'
    },
    {
      icon: Target,
      title: 'Maintenance Engineering',
      description: 'Preventive maintenance strategies, reliability engineering, and life-cycle management of vehicle systems.'
    }
  ];

  return (
    <div className="min-h-screen" data-testid="about-page">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(168,85,247,0.6)]">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 font-['Sora']" data-testid="about-title">
              Why This Project?
            </h1>
            <p className="text-slate-300 text-lg max-w-3xl mx-auto">
              Bridging the gap between artificial intelligence and mechanical engineering
              to create smarter automotive diagnostic solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white font-['Sora']">Project Overview</h2>
              </div>
              <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                <p>
                  <strong className="text-white">VehicleAware</strong> is an AI-powered vehicle fault diagnosis system
                  designed to make automotive troubleshooting accessible to everyone—from mechanical engineering
                  students to vehicle owners and professional technicians.
                </p>
                <p>
                  By leveraging advanced artificial intelligence and a comprehensive database of vehicle faults,
                  we provide instant, accurate diagnostic suggestions based on symptom descriptions. Our system
                  analyzes patterns, correlates symptoms with known issues, and presents probable faults with
                  confidence scores.
                </p>
                <p>
                  This project demonstrates the practical application of AI in solving real-world engineering
                  problems, while maintaining a strong foundation in mechanical engineering principles.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center font-['Sora']" data-testid="relevance-title">
              Mechanical Engineering Relevance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relevanceAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    data-testid={`relevance-card-${index}`}
                  >
                    <GlassCard className="p-6 h-full card-3d">
                      <Icon className="w-10 h-10 text-cyan-400 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-3 font-['Sora']">{area.title}</h3>
                      <p className="text-slate-300">{area.description}</p>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-white mb-6 font-['Sora']">Technical Approach</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-400 mb-2">AI-Powered Analysis</h3>
                  <p className="text-slate-300">
                    Our system uses GPT-5.2, a state-of-the-art language model, to analyze symptom descriptions
                    and correlate them with known vehicle faults. The AI has been trained to understand automotive
                    terminology and mechanical relationships.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Probability Scoring</h3>
                  <p className="text-slate-300">
                    Each diagnosis includes probability scores that help users understand the likelihood of each
                    fault. This quantitative approach mirrors the diagnostic process used by professional mechanics.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-pink-400 mb-2">Comprehensive Database</h3>
                  <p className="text-slate-300">
                    Our fault library covers all major vehicle systems with detailed information on symptoms,
                    causes, solutions, and preventive maintenance—making it an educational resource as well.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 text-center bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-cyan-500/20">
              <h2 className="text-2xl font-bold text-white mb-4 font-['Sora']">Educational Value</h2>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                This project serves as a practical learning tool for mechanical engineering students,
                demonstrating the integration of theoretical knowledge with modern AI technology.
                It encourages systematic problem-solving and deepens understanding of vehicle systems.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;