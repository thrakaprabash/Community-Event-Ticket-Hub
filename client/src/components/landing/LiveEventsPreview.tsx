import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, MapPin, Ticket, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../../config';
import { EventItem } from '../../types';

export const LiveEventsPreview: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentEvents = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/events?limit=3`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setEvents(data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load real events for landing:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentEvents();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Live On The Platform
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-1">
              Happening In Your Community
            </h2>
          </div>
          <Link
            to="/discover"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 group"
          >
            <span>View All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-slate-50 border border-slate-200 rounded-2xl h-80 animate-pulse p-4"
              />
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, idx) => (
              <motion.div
                key={event._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm">
                      {event.category}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-indigo-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>{event.venue}, {event.city}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to="/discover"
                    className="w-full py-2 bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-800 font-semibold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Get Ticket</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-600 text-sm">Discover upcoming concerts, meetups, and conferences.</p>
            <Link
              to="/discover"
              className="mt-3 inline-block text-xs font-bold text-indigo-600 hover:underline"
            >
              Browse Event Directory
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
