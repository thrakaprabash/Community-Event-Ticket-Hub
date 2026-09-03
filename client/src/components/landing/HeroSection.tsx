import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Ticket, Calendar, MapPin, Users } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 overflow-hidden">
      {/* Dynamic Animated Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.3, 0.15],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] bg-violet-600/30 rounded-full blur-3xl"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headlines & CTAs */}
        <div className="lg:col-span-7 text-center lg:text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-300 border border-white/15"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Multi-Tenant Event Orchestration Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Discover, Book & Manage{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
              Live Experiences
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal"
          >
            From premier tech summits to university fests and musical evenings.
            Seamless bookings, instant cryptographically secure QR admissions, and powerful real-time organizer telemetry.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/discover"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-semibold rounded-xl border border-slate-700 transition-all backdrop-blur-sm"
              >
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>Host Your Event</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-400"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Instant QR Generation</span>
            </div>
            <span>•</span>
            <div>Zero Processing Delays</div>
            <span>•</span>
            <div>Enterprise Multitenancy</div>
          </motion.div>
        </div>

        {/* Right Column: Floating Interactive Mock Event Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full max-w-md"
          >
            {/* Animated card hovering float */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="bg-slate-900/90 border border-slate-700/60 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
            >
              {/* Badge */}
              <div className="flex justify-between items-center mb-4">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-full flex items-center space-x-1">
                  <Ticket className="w-3.5 h-3.5 mr-1" />
                  Featured Event
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
                  Booking Live
                </span>
              </div>

              {/* Event Preview Content */}
              <div className="h-44 rounded-2xl overflow-hidden relative mb-5 bg-gradient-to-tr from-indigo-900 via-slate-800 to-indigo-950">
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80"
                  alt="NextGen Tech Summit"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <div className="text-white text-xs font-semibold bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    Tech & Innovation
                  </div>
                  <div className="text-sm font-black text-amber-300 bg-amber-950/70 border border-amber-500/30 px-3 py-1 rounded-lg">
                    $49.00
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">
                NextGen AI & Cloud Summit 2026
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 mb-4">
                Join 500+ creators, cloud architects, and engineers for keynote talks, live hack demos, and exclusive networking.
              </p>

              <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>October 14, 2026 • 09:30 AM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-rose-400" />
                  <span>Grand Convention Arena, San Francisco</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>380 / 450 Tickets Claimed</span>
                </div>
              </div>

              <div className="mt-5 pt-3">
                <Link
                  to="/discover"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-md shadow-indigo-600/30"
                >
                  <span>Reserve Seat With Instant Pass</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
