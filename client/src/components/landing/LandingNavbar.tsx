import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, ArrowRight, ShieldCheck, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

export const LandingNavbar: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/85 backdrop-blur-md border-b border-white/10 shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20"
          >
            <Ticket className="w-5 h-5" />
          </motion.div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-indigo-100 to-slate-200 bg-clip-text text-transparent">
              EventHub
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
              Community Portal
            </span>
          </div>
        </Link>

        {/* Action Links */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link
            to="/discover"
            className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5"
          >
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>Browse Events</span>
          </Link>

          {isAuthenticated ? (
            <Link
              to={user?.role === 'organizer' ? '/dashboard' : '/discover'}
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-600/30"
            >
              <span>Go to App</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600/90 hover:bg-indigo-600 px-4 py-2 rounded-xl border border-indigo-400/30 transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Organizer Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};
