import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Github, Linkedin, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="glass-card border-t border-white/10 mt-20" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Car className="w-8 h-8 text-cyan-400" />
              <span className="text-xl font-bold text-white font-['Sora']">
                Vehicle<span className="text-cyan-400">Aware</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              AI-powered vehicle fault diagnosis for the modern era.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 font-['Sora']">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/diagnose" className="text-slate-400 hover:text-cyan-400 transition-colors">Diagnose</Link></li>
              <li><Link to="/systems" className="text-slate-400 hover:text-cyan-400 transition-colors">Systems</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-cyan-400 transition-colors">About</Link></li>
              <li><Link to="/future" className="text-slate-400 hover:text-cyan-400 transition-colors">Future Scope</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 font-['Sora']">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className="text-slate-400 hover:text-cyan-400 transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-slate-400 hover:text-cyan-400 transition-colors">Register</Link></li>
              <li><Link to="/dashboard" className="text-slate-400 hover:text-cyan-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 font-['Sora']">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 glass-card flex items-center justify-center hover:border-cyan-500/50 transition-colors" data-testid="footer-github">
                <Github className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
              </a>
              <a href="#" className="w-10 h-10 glass-card flex items-center justify-center hover:border-cyan-500/50 transition-colors" data-testid="footer-linkedin">
                <Linkedin className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
              </a>
              <a href="#" className="w-10 h-10 glass-card flex items-center justify-center hover:border-cyan-500/50 transition-colors" data-testid="footer-email">
                <Mail className="w-5 h-5 text-slate-400 hover:text-cyan-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm">
            &copy; 2026 VehicleAware. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs mt-2">
            This system provides diagnostic suggestions and does not replace professional inspection.
          </p>
        </div>
      </div>
    </footer>
  );
};
