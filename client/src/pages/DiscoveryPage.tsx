import React, { useEffect, useState } from 'react';
import { Sparkles, CalendarDays } from 'lucide-react';
import { EventCard } from '../components/discovery/EventCard';
import { FilterPanel } from '../components/discovery/FilterPanel';
import { EventItem } from '../types';
import { API_BASE_URL } from '../config';

export const DiscoveryPage: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [city, setCity] = useState('All');
  const [dateFilter, setDateFilter] = useState('upcoming');
  const [maxPrice, setMaxPrice] = useState('');

  const [categories, setCategories] = useState<string[]>(['All']);
  const [cities, setCities] = useState<string[]>(['All']);

  // Fetch filter metadata
  useEffect(() => {
    fetch(`${API_BASE_URL}/events/meta/filters`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data.categories);
          setCities(data.data.cities);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch events with active filters
  const fetchEvents = async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (city !== 'All') params.append('city', city);
      if (dateFilter) params.append('dateFilter', dateFilter);
      if (maxPrice) params.append('maxPrice', maxPrice);

      const res = await fetch(`${API_BASE_URL}/events?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEvents();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, category, city, dateFilter, maxPrice]);

  const handleReset = () => {
    setSearch('');
    setCategory('All');
    setCity('All');
    setDateFilter('upcoming');
    setMaxPrice('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-indigo-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Discover Local Experiences • Live Booking & Instant Pass</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Discover Community Events, Tech Talks & Live Shows
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            From university walkathons to premier developer meetups and beachfront musical fests. Real-time ticket reservations with instant QR admissions.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6">
        <FilterPanel
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          city={city}
          setCity={setCity}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          categories={categories}
          cities={cities}
          onReset={handleReset}
        />

        {/* Results Stats */}
        <div className="flex items-center justify-between mt-8 mb-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="flex items-center space-x-1.5">
            <CalendarDays className="w-4 h-4 text-indigo-500" />
            <span>
              {loading ? 'Finding events...' : `${events.length} Events Available`}
            </span>
          </div>
        </div>

        {/* Event Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200 p-4 space-y-3"
              >
                <div className="h-44 bg-slate-200 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} onBookSuccess={() => fetchEvents(true)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500 font-medium">No events match your current filter criteria.</p>
            <button
              onClick={handleReset}
              className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
            >
              Clear filters and view all
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
