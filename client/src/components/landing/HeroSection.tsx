import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Ticket, Calendar, MapPin, Users, PlusCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { EventItem } from '../../types';

export const HeroSection: React.FC = () => {
  const [featuredEvent, setFeaturedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/events?limit=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setFeaturedEvent(data.data[0]);
        } else {
          setFeaturedEvent(null);
        }
      })
      .catch(() => {
        setFeaturedEvent(null);
      });
  }, []);

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
            Seamless bookings, instant cryptographically secure QR admissions, and powerful real-time organizer telemetry for your community.
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
            <div>Real-Time Telemetry</div>
            <span>•</span>
            <div>Tenant Isolation</div>
          </motion.div>
        </div>

        {/* Right Column: Floating Interactive Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full max-w-md"
          >
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
              {featuredEvent ? (
                <>
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

                  <div className="h-44 rounded-2xl overflow-hidden relative mb-5 bg-gradient-to-tr from-indigo-900 via-slate-800 to-indigo-950">
                    <img
                      src={featuredEvent.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
                      alt={featuredEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div className="text-white text-xs font-semibold bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-lg">
                        {featuredEvent.category}
                      </div>
                      <div className="text-sm font-black text-amber-300 bg-amber-950/70 border border-amber-500/30 px-3 py-1 rounded-lg">
                        {featuredEvent.price === 0 ? 'FREE' : `$${featuredEvent.price}`}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                    {featuredEvent.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-2 mb-4">
                    {featuredEvent.description}
                  </p>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      <span>{new Date(featuredEvent.date).toLocaleDateString()} • {featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-rose-400" />
                      <span className="truncate">{featuredEvent.venue}, {featuredEvent.city}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>{featuredEvent.ticketsSold} / {featuredEvent.capacity} Claimed</span>
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
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-full flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      Live Platform
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
                      Ready for Events
                    </span>
                  </div>

                  <div className="h-44 rounded-2xl overflow-hidden relative mb-5 bg-gradient-to-tr from-indigo-900 via-slate-800 to-indigo-950 flex items-center justify-center p-6 text-center">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center mx-auto mb-2 text-indigo-300">
                        <Ticket className="w-6 h-6" />
                      </div>
                      <p className="text-white text-sm font-bold">Your Live Community Events</p>
                      <p className="text-slate-300 text-xs mt-1">Direct booking & instant admission QR passes</p>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    Host Your First Community Event
                  </h3>
                  <p className="text-xs text-slate-300 mb-4">
                    Register your organization workspace, publish real events, and start issuing digital tickets to your community.
                  </p>

                  <div className="space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-4">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-400" />
                      <span>Dynamic Workspace Management</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Ticket className="w-4 h-4 text-emerald-400" />
                      <span>Instant Digital Passes & QR Verification</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Real-Time Attendee Roster & Analytics</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3">
                    <Link
                      to="/login"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-md shadow-indigo-600/30"
                    >
                      <span>Register Organization / Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
