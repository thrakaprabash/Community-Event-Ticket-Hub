import React from 'react';
import { motion } from 'motion/react';
import { Zap, QrCode, BarChart3, ShieldCheck, Users, Globe2 } from 'lucide-react';

const features = [
  {
    icon: Zap,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    title: 'Real-Time Seat Booking',
    description:
      'Zero double-booking guarantee. Live capacity tracking updates instantly when attendees reserve passes.',
  },
  {
    icon: QrCode,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    title: 'Instant QR Code Passes',
    description:
      'Seamless digital tickets generated immediately upon booking. Quick scans at the entrance for frictionless admission.',
  },
  {
    icon: BarChart3,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    title: 'Live Organizer Telemetry',
    description:
      'Real-time revenue metrics, attendance graphs, occupancy breakdown, and exportable attendee rosters.',
  },
  {
    icon: ShieldCheck,
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    title: 'Multi-Tenant Isolation',
    description:
      'Enterprise workspace isolation. Manage distinct clubs, tech chapters, and production labels under separate tenancies.',
  },
  {
    icon: Users,
    color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    title: 'Community First',
    description:
      'Built specifically for campus clubs, developer groups, meetup hosts, and independent musical performers.',
  },
  {
    icon: Globe2,
    color: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    title: 'City-Wide Discovery',
    description:
      'Comprehensive search with category filters, price sorting, date ranges, and immediate responsive map locations.',
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-600"
          >
            Engineered For Scale
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
          >
            Everything You Need To Run Incredible Events
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base leading-relaxed"
          >
            Whether you are hosting a 50-person design meetup or a 1,000-person music festival, EventHub gives you end-to-end tooling.
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${feature.color} group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
