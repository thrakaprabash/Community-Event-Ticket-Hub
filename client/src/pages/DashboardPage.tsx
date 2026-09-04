import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  TrendingUp,
  DollarSign,
  Users,
  PlusCircle,
  Building2,
  Calendar,
  Layers,
  X,
  Image as ImageIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { AnalyticsSummary, EventItem } from '../types';
import { API_BASE_URL } from '../config';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const DashboardPage: React.FC = () => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topEvents, setTopEvents] = useState<EventItem[]>([]);
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal for creating event
  const [createModal, setCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'Tech',
    date: '',
    time: '18:00',
    venue: '',
    city: 'Colombo',
    capacity: 100,
    price: 0,
    imageUrl: ''
  });

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'organizer') {
      navigate('/login');
      return;
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`
    };

    setLoading(true);
    Promise.all([
      fetch(`${API_BASE_URL}/analytics/summary`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/analytics/registrations?range=30d`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/analytics/revenue-by-event`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/analytics/category-distribution`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/analytics/top-events`, { headers }).then((r) => r.json()),
      fetch(`${API_BASE_URL}/tickets/org/attendees`, { headers }).then((r) => r.json())
    ])
      .then(([sRes, tRes, rRes, cRes, topRes, attRes]) => {
        if (sRes.success) setSummary(sRes.data);
        if (tRes.success) setTimeSeries(tRes.data);
        if (rRes.success) setRevenueData(rRes.data);
        if (cRes.success) setCategoryData(cRes.data);
        if (topRes.success) setTopEvents(topRes.data);
        if (attRes.success) setAttendees(attRes.data);
      })
      .catch((err) => console.error('Dashboard data load error:', err))
      .finally(() => setLoading(false));
  }, [user?.orgId, isAuthenticated]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      });
      const data = await res.json();
      if (data.success) {
        setCreateModal(false);
        alert('Event successfully created for this organization tenant!');
        window.location.reload();
      } else {
        alert(data.message || 'Creation failed');
      }
    } catch {
      alert('Error creating event');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* Dashboard Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Isolated Workspace Tenant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {user?.orgName}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Workspace ID: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-mono">{user?.orgId}</code>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCreateModal(true)}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Event</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Events</span>
              <Calendar className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">
              {summary?.totalEvents ?? 0}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Hosted under tenant</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tickets Issued</span>
              <Ticket className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">
              {summary?.totalTicketsSold ?? 0}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              {summary?.occupancyRate ?? 0}% Venue Fill Rate
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="w-4 h-4 text-violet-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">
              ${summary?.totalRevenue ?? 0}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Gross ticket sales volume</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unique Attendees</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">
              {summary?.uniqueAttendees ?? 0}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Verified email attendees</p>
          </div>
        </div>

        {/* Charts Row 1: Line Chart & Donut Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Registrations Time Series */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Registration Volume (Last 30 Days)
                </h3>
                <p className="text-xs text-slate-400">Daily tickets booked across all hosted events</p>
              </div>
              <TrendingUp className="w-4 h-4 text-indigo-500" />
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="registrations"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#6366f1' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Donut Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Event Categories</h3>
                <p className="text-xs text-slate-400">Distribution by genre</p>
              </div>
              <Layers className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.length > 0 ? categoryData : [{ category: 'None', count: 1 }]}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Charts Row 2: Revenue Bar Chart & Top Events Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Event Bar Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Revenue Generated by Event</h3>
                <p className="text-xs text-slate-400">Total gross sales per listing</p>
              </div>
              <DollarSign className="w-4 h-4 text-violet-500" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '10px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Events Overview Table */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Top Event Performances</h3>
                <p className="text-xs text-slate-400">Registration capacity tracking</p>
              </div>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-2">Event Title</th>
                  <th className="pb-2">Sold / Cap</th>
                  <th className="pb-2">Fill %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topEvents.map((ev) => {
                  const fillPct = Math.round((ev.ticketsSold / ev.capacity) * 100);
                  return (
                    <tr key={ev._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 font-semibold text-slate-800 truncate max-w-[180px]">
                        {ev.title}
                      </td>
                      <td className="py-2.5 text-slate-600">
                        {ev.ticketsSold} / {ev.capacity}
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            fillPct > 75
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {fillPct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Registered Attendees Roster Table */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Recent Registered Attendees</h3>
              <p className="text-xs text-slate-400">Real-time attendee roster for gate check-in</p>
            </div>
            <span className="text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-600">
              {attendees.length} Registrations
            </span>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-2">Attendee Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Event</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendees.slice(0, 8).map((att) => (
                <tr key={att._id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 font-semibold text-slate-800">{att.attendeeName}</td>
                  <td className="py-2.5 text-slate-600 font-mono text-[11px]">{att.attendeeEmail}</td>
                  <td className="py-2.5 text-slate-700 truncate max-w-[200px]">
                    {typeof att.eventId === 'object' ? att.eventId.title : 'Event'}
                  </td>
                  <td className="py-2.5 font-bold text-indigo-600">{att.quantity}</td>
                  <td className="py-2.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      Confirmed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal to Create Event */}
      {createModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setCreateModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">Create Event Listing</h3>
            <p className="text-xs text-slate-500 mb-4">
              Will be published under your tenant: <strong>{user?.orgName}</strong>
            </p>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g. AI Hackathon 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Tell attendees what to expect..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none bg-white"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Music">Music</option>
                    <option value="University">University</option>
                    <option value="Sports">Sports</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newEvent.city}
                    onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Venue Name</label>
                  <input
                    type="text"
                    required
                    value={newEvent.venue}
                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                    placeholder="Auditorium / Ground"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price ($0 for Free)</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Event Cover Image</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">URL or upload file</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="url"
                    value={newEvent.imageUrl}
                    onChange={(e) => setNewEvent({ ...newEvent, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/... or paste image link"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none text-xs"
                  />

                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-300 transition-colors">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                      <span>Upload local image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewEvent({ ...newEvent, imageUrl: reader.result as string });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    {newEvent.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setNewEvent({ ...newEvent, imageUrl: '' })}
                        className="text-[11px] text-red-500 hover:underline"
                      >
                        Remove image
                      </button>
                    )}
                  </div>

                  {newEvent.imageUrl && (
                    <div className="relative w-full h-28 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                      <img
                        src={newEvent.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md"
                >
                  Publish Event to Discovery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
