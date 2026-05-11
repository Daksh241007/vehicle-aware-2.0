import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { GlassCard } from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      login(response.data.token, response.data.user);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" data-testid="login-page">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2 font-['Sora']" data-testid="login-title">
                  Welcome Back
                </h1>
                <p className="text-slate-400">Login to access your diagnosis history</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" data-testid="login-form">
                <div>
                  <Label htmlFor="email" className="text-slate-300 mb-2 block">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-950/50 border-slate-700 focus:border-cyan-500 text-white"
                    data-testid="login-email-input"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-slate-300 mb-2 block">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-950/50 border-slate-700 focus:border-cyan-500 text-white"
                    data-testid="login-password-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-6 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all duration-300 hover:scale-105 active:scale-95"
                  data-testid="login-submit-btn"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-400">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold" data-testid="login-register-link">
                    Register here
                  </Link>
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;