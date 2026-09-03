import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface FilterPanelProps {
  search: string;
  setSearch: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  dateFilter: string;
  setDateFilter: (val: string) => void;
  maxPrice: string;
  setMaxPrice: (val: string) => void;
  categories: string[];
  cities: string[];
  onReset: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  search,
  setSearch,
  category,
  setCategory,
  city,
  setCity,
  dateFilter,
  setDateFilter,
  maxPrice,
  setMaxPrice,
  categories,
  cities,
  onReset
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search events, university walks, concerts, topics..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            City / Location
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {cities.map((ct) => (
              <option key={ct} value={ct}>
                {ct}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Date
          </label>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">Any Date</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="upcoming">All Upcoming</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Price Filter
          </label>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Any Price</option>
            <option value="0">Free Events Only</option>
            <option value="15">Under $15</option>
            <option value="30">Under $30</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs text-slate-500">
        <span className="flex items-center space-x-1">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Real-time instant filtering</span>
        </span>
        <button
          onClick={onReset}
          className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
