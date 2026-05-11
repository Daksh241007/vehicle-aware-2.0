import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Car, LogOut, User, LayoutDashboard } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10"
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group" data-testid="nav-logo">
            <Car className="w-8 h-8 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
            <span className="text-xl font-bold text-white font-['Sora']">
              Vehicle<span className="text-cyan-400">Aware</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/diagnose" data-testid="nav-diagnose">
              <Button variant="ghost" className="text-slate-200 hover:text-cyan-400 hover:bg-white/10">
                Diagnose
              </Button>
            </Link>
            <Link to="/systems" data-testid="nav-systems">
              <Button variant="ghost" className="text-slate-200 hover:text-cyan-400 hover:bg-white/10">
                Systems
              </Button>
            </Link>
            <Link to="/about" data-testid="nav-about">
              <Button variant="ghost" className="text-slate-200 hover:text-cyan-400 hover:bg-white/10">
                About
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard" data-testid="nav-dashboard">
                  <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-slate-200 hover:text-red-400 hover:bg-white/10"
                  data-testid="nav-logout-btn"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" data-testid="nav-login">
                  <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                    <User className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/register" data-testid="nav-register">
                  <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};