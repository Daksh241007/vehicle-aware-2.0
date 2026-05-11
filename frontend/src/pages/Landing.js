import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Cog, 
  CircleStop, 
  Droplets, 
  Settings2, 
  Move, 
  Zap,
  CheckCircle2,
  TrendingUp,
  Shield
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const systems = [
    { icon: Cog, name: 'Engine System', color: 'cyan' },
    { icon: CircleStop, name: 'Brake System', color: 'purple' },
    { icon: Droplets, name: 'Cooling System', color: 'blue' },
    { icon: Settings2, name: 'Transmission', color: 'pink' },
    { icon: Move, name: 'Suspension', color: 'cyan' },
    { icon: Zap, name: 'Electrical', color: 'purple' }
  ];

  const features = [
    { icon: Sparkles, title: 'AI-Powered Analysis', desc: 'Advanced diagnostics using GPT-5.2' },
    { icon: TrendingUp, title: 'Probability Scoring', desc: 'Ranked fault predictions with confidence levels' },
    { icon: Shield, title: 'Comprehensive Database', desc: 'Extensive fault library with solutions' }
  ];

  return (
    <div className="min-h-screen" data-testid="landing-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass-card mb-6"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">AI-Based Vehicle Fault Diagnosis</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 font-['Sora']" data-testid="hero-title">
              Understand Your Vehicle
              <br />
              <span className="hero-title">with AI</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-12" data-testid="hero-subtitle">
              Enter your vehicle symptoms and get instant, AI-powered fault predictions
              with detailed explanations and repair solutions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate('/diagnose')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-6 px-10 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 text-lg"
                data-testid="hero-diagnose-btn"
              >
                Start Diagnosis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate('/systems')}
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white backdrop-blur-md py-6 px-10 rounded-full text-lg"
                data-testid="hero-explore-btn"
              >
                Explore Systems
              </Button>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="glass-card p-4 glow-cyan">
              <img
                src="https://images.unsplash.com/photo-1710355064855-f46b023e5f59?q=80&w=2070&auto=format&fit=crop"
                alt="Vehicle Dashboard"
                className="w-full h-auto rounded-lg"
                data-testid="hero-image"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-['Sora']" data-testid="how-it-works-title">
              How It Works
            </h2>
            <p className="text-slate-400 text-lg">Simple, fast, and accurate diagnostics in three steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Describe Symptoms', desc: 'Enter what you notice about your vehicle', icon: '🔍' },
              { step: '02', title: 'AI Analysis', desc: 'Our AI processes and identifies likely faults', icon: '🤖' },
              { step: '03', title: 'Get Results', desc: 'Receive ranked predictions with solutions', icon: '📊' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                data-testid={`how-it-works-step-${i + 1}`}
              >
                <GlassCard className="text-center h-full hover:border-cyan-500/50 card-3d">
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <div className="text-cyan-400 font-mono text-sm mb-2">{item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-3 font-['Sora']">{item.title}</h3>
                  <p className="text-slate-400">{item.desc}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Systems */}
      <section className="py-20 px-4" data-testid="vehicle-systems-section">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-['Sora']" data-testid="systems-title">
              Vehicle Systems Coverage
            </h2>
            <p className="text-slate-400 text-lg">Comprehensive diagnosis across all major vehicle systems</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {systems.map((system, i) => {
              const Icon = system.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  data-testid={`system-card-${i}`}
                >
                  <GlassCard className="text-center cursor-pointer group">
                    <Icon className={`w-12 h-12 mx-auto mb-3 text-${system.color}-400 group-hover:scale-110 transition-transform`} />
                    <p className="text-sm text-white font-medium">{system.name}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4" data-testid="features-section">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  data-testid={`feature-card-${i}`}
                >
                  <GlassCard className="card-3d">
                    <Icon className="w-10 h-10 text-cyan-400 mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2 font-['Sora']">{feature.title}</h3>
                    <p className="text-slate-400">{feature.desc}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" data-testid="cta-section">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="text-center p-12 glow-purple">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-['Sora']" data-testid="cta-title">
              Ready to Diagnose Your Vehicle?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Join thousands of users getting instant AI-powered vehicle diagnostics
            </p>
            <Button
              onClick={() => navigate('/register')}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white font-semibold py-6 px-12 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105 text-lg"
              data-testid="cta-register-btn"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;