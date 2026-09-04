import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Calendar, Ticket, Building2, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface LiveStats {
  eventsCount: number;
  ticketsCount: number;
  orgsCount: number;
}

export const StatsBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [stats, setStats] = useState<LiveStats>({
    eventsCount: 0,
    ticketsCount: 0,
    orgsCount: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch real telemetry data from server
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, orgsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/events`),
          fetch(`${API_BASE_URL}/organizations`),
        ]);
        const eventsData = await eventsRes.json();
        const orgsData = await orgsRes.json();

        let totalTickets = 0;
        let totalEvts = 0;
        if (eventsData.success && Array.isArray(eventsData.data)) {
          totalEvts = eventsData.pagination?.total ?? eventsData.data.length;
          totalTickets = eventsData.data.reduce(
            (acc: number, curr: any) => acc + (curr.ticketsSold || 0),
            0
          );
        }

        const orgs = (orgsData.success && Array.isArray(orgsData.data)) ? orgsData.data.length : 0;

        setStats({
          eventsCount: totalEvts,
          ticketsCount: totalTickets,
          orgsCount: orgs,
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchStats();
  }, []);

  return (
    <section ref={ref} className="relative z-20 -mt-10 max-w-6xl mx-auto px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-900/5 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100"
      >
        {/* Stat 1 */}
        <div className="flex items-center space-x-4 pt-4 sm:pt-0 sm:pl-4 first:pl-0">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoaded ? `${stats.eventsCount}+` : '...'}
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Live & Scheduled Events
            </p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="flex items-center space-x-4 pt-4 sm:pt-0 sm:pl-8">
          <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoaded ? `${stats.ticketsCount}+` : '...'}
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Tickets Reserved
            </p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="flex items-center space-x-4 pt-4 sm:pt-0 sm:pl-8">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {isLoaded ? `${stats.orgsCount}` : '...'}
            </div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Host Organizations
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
