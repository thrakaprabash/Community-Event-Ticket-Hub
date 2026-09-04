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
  Image as ImageIcon,
  Edit,
  Trash2,
  AlertTriangle,
  Search,
  MapPin,
  Clock,
  Tag,
  QrCode,
  Download,
  CheckCircle2
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
import { EditEventModal } from '../components/dashboard/EditEventModal';

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
  const [orgEvents, setOrgEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventSearch, setEventSearch] = useState('');

  // Modals for editing and deleting events
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Modal for viewing attendee QR pass
  const [selectedAttendeePass, setSelectedAttendeePass] = useState<any | null>(null);

  // Modal for creating event
  const [createModal, setCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'Tech',
    date: '',
    time: '18:00',
    venue: '',
    city: '',
    capacity: 100,
    price: 0,
    imageUrl: ''
  });

  const loadDashboardData = async () => {
    if (!token) return;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`
    };

    setLoading(true);
    try {
      const [sRes, tRes, rRes, cRes, topRes, attRes, evRes] = await Promise.all([
        fetch(`${API_BASE_URL}/analytics/summary`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE_URL}/analytics/registrations?range=30d`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE_URL}/analytics/revenue-by-event`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE_URL}/analytics/category-distribution`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE_URL}/analytics/top-events`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE_URL}/tickets/org/attendees`, { headers }).then((r) => r.json()),
        fetch(`${API_BASE_URL}/events/org/my-events`, { headers }).then((r) => r.json())
      ]);

      if (sRes.success) setSummary(sRes.data);
      if (tRes.success) setTimeSeries(tRes.data);
      if (rRes.success) setRevenueData(rRes.data);
      if (cRes.success) setCategoryData(cRes.data);
      if (topRes.success) setTopEvents(topRes.data);
      if (attRes.success) setAttendees(attRes.data);
      if (evRes.success) setOrgEvents(evRes.data);
    } catch (err) {
      console.error('Dashboard data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'organizer') {
      navigate('/login');
      return;
    }

    loadDashboardData();
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
        setNewEvent({
          title: '',
          description: '',
          category: 'Tech',
          date: '',
          time: '18:00',
          venue: '',
          city: '',
          capacity: 100,
          price: 0,
          imageUrl: ''
        });
        alert('Event successfully created for this organization tenant!');
        loadDashboardData();
      } else {
        alert(data.message || 'Creation failed');
      }
    } catch {
      alert('Error creating event');
    }
  };

  const handleEditSuccess = (updatedEvent: EventItem) => {
    setOrgEvents((prev) =>
      prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
    );
    setTopEvents((prev) =>
      prev.map((e) => (e._id === updatedEvent._id ? updatedEvent : e))
    );
    loadDashboardData();
  };

  const handleDeleteEvent = async (cancelOnly: boolean = false) => {
    if (!deletingEvent) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/events/${deletingEvent._id}${cancelOnly ? '?cancel=true' : ''}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      if (data.success) {
        if (cancelOnly) {
          setOrgEvents((prev) =>
            prev.map((e) => (e._id === deletingEvent._id ? { ...e, status: 'cancelled' } : e))
          );
        } else {
          setOrgEvents((prev) => prev.filter((e) => e._id !== deletingEvent._id));
          setTopEvents((prev) => prev.filter((e) => e._id !== deletingEvent._id));
        }
        setDeleteModalOpen(false);
        setDeletingEvent(null);
        loadDashboardData();
      } else {
        setDeleteError(data.message || 'Failed to delete event');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      setDeleteError('An unexpected error occurred while deleting the event.');
    } finally {
      setDeleteLoading(false);
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
                  <th className="pb-2 text-right">Actions</th>
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
                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => {
                              setEditingEvent(ev);
                              setEditModalOpen(true);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Event"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingEvent(ev);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {topEvents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-slate-400">
                      No event performance data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Manage Hosted Events Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Manage Hosted Events</h3>
                <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                  {orgEvents.length} Events
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Update schedules, capacities, pricing, or remove event listings
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter events..."
                  value={eventSearch}
                  onChange={(e) => setEventSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 w-44 sm:w-56"
                />
              </div>
              <button
                onClick={() => setCreateModal(true)}
                className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-sm transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Event</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Event Details</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Schedule</th>
                  <th className="pb-3">Sales / Capacity</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orgEvents
                  .filter((ev) => {
                    if (!eventSearch.trim()) return true;
                    const q = eventSearch.toLowerCase();
                    return (
                      ev.title.toLowerCase().includes(q) ||
                      ev.category.toLowerCase().includes(q) ||
                      ev.venue.toLowerCase().includes(q) ||
                      ev.city.toLowerCase().includes(q) ||
                      (ev.status && ev.status.toLowerCase().includes(q))
                    );
                  })
                  .map((ev) => {
                    const fillPct = Math.round((ev.ticketsSold / ev.capacity) * 100);
                    return (
                      <tr key={ev._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                              <img
                                src={ev.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120'}
                                alt={ev.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=120';
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[240px]">
                                {ev.title}
                              </p>
                              <p className="text-[11px] text-slate-400 flex items-center space-x-1 truncate mt-0.5">
                                <MapPin className="w-3 h-3 text-rose-500 flex-shrink-0" />
                                <span className="truncate">{ev.venue}, {ev.city}</span>
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                            {ev.category}
                          </span>
                        </td>

                        <td className="py-3 text-slate-600">
                          <div>
                            <p className="font-medium text-slate-800">
                              {new Date(ev.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                            <p className="text-[11px] text-slate-400">{ev.time}</p>
                          </div>
                        </td>

                        <td className="py-3">
                          <div className="w-32">
                            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                              <span>{ev.ticketsSold} / {ev.capacity}</span>
                              <span className="font-bold text-indigo-600">{fillPct}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  fillPct >= 100
                                    ? 'bg-rose-500'
                                    : fillPct > 70
                                    ? 'bg-emerald-500'
                                    : 'bg-indigo-600'
                                }`}
                                style={{ width: `${Math.min(100, fillPct)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3">
                          <span className="font-bold text-slate-800">
                            {ev.price === 0 ? 'FREE' : `$${ev.price}`}
                          </span>
                        </td>

                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ev.status === 'upcoming'
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                : ev.status === 'ongoing'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : ev.status === 'completed'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}
                          >
                            {ev.status || 'upcoming'}
                          </span>
                        </td>

                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={() => {
                                setEditingEvent(ev);
                                setEditModalOpen(true);
                              }}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-transparent hover:border-indigo-200 transition-all"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => {
                                setDeletingEvent(ev);
                                setDeleteModalOpen(true);
                              }}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {orgEvents.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400">
                      No events hosted yet under this tenant. Click <strong>New Event</strong> to create your first listing!
                    </td>
                  </tr>
                )}
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
                <th className="pb-2 text-right">Pass / QR Code</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendees.slice(0, 10).map((att) => (
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
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => setSelectedAttendeePass(att)}
                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] rounded-lg border border-indigo-200 transition-colors shadow-sm"
                      title="Inspect Admission QR Pass"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>View Pass</span>
                    </button>
                  </td>
                </tr>
              ))}
              {attendees.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-400">
                    No attendee registrations recorded yet.
                  </td>
                </tr>
              )}
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

      {/* Modal to Edit Event */}
      <EditEventModal
        isOpen={editModalOpen}
        event={editingEvent}
        onClose={() => {
          setEditModalOpen(false);
          setEditingEvent(null);
        }}
        onSuccess={handleEditSuccess}
      />

      {/* Modal to Confirm Delete Event */}
      {deleteModalOpen && deletingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => {
                setDeleteModalOpen(false);
                setDeletingEvent(null);
                setDeleteError(null);
              }}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Event Listing</h3>
                <p className="text-xs text-slate-500">Manage event removal</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-4 text-xs space-y-1">
              <p className="font-bold text-slate-800">{deletingEvent.title}</p>
              <p className="text-slate-500">
                Scheduled for {new Date(deletingEvent.date).toLocaleDateString()} at {deletingEvent.time}
              </p>
              <p className="text-slate-500">
                Tickets Sold: <strong className="text-indigo-600">{deletingEvent.ticketsSold}</strong> / {deletingEvent.capacity}
              </p>
            </div>

            {deleteError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {deleteError}
              </div>
            )}

            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Choose whether to completely remove this event or mark it as cancelled to retain attendee records.
            </p>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => handleDeleteEvent(false)}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => handleDeleteEvent(true)}
                className="w-full py-2 px-4 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs rounded-xl border border-amber-200 transition-colors disabled:opacity-50"
              >
                Mark as Cancelled Only
              </button>

              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDeletingEvent(null);
                  setDeleteError(null);
                }}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors mt-1"
              >
                Keep Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal to View Attendee QR Pass */}
      {selectedAttendeePass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100 text-center">
            <button
              onClick={() => setSelectedAttendeePass(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-slate-900">
              Admission Pass & QR Code
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {typeof selectedAttendeePass.eventId === 'object'
                ? selectedAttendeePass.eventId.title
                : 'Event Admission'}
            </p>

            {/* QR Code Display */}
            <div className="my-4 p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-inner inline-block">
              {selectedAttendeePass.qrCode ? (
                <img
                  src={selectedAttendeePass.qrCode}
                  alt="Attendee QR Code"
                  className="w-44 h-44 mx-auto rounded-xl shadow-sm border border-slate-100"
                />
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                  No QR Code Available
                </div>
              )}
              <p className="text-[10px] font-mono text-slate-500 mt-2 uppercase tracking-wider">
                Scan for Venue Gate Check-In
              </p>
            </div>

            {/* Attendee Details */}
            <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left mb-4">
              <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                <span className="text-slate-500">Attendee:</span>
                <span className="font-bold text-slate-800">{selectedAttendeePass.attendeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="font-mono text-[11px] text-slate-700">{selectedAttendeePass.attendeeEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-bold text-indigo-600">{selectedAttendeePass.quantity} Ticket(s)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-semibold text-slate-800">${selectedAttendeePass.totalAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Admission Status:</span>
                <span className="font-bold text-emerald-600">Verified & Confirmed</span>
              </div>
            </div>

            <div className="flex gap-2">
              {selectedAttendeePass.qrCode && (
                <a
                  href={selectedAttendeePass.qrCode}
                  download={`${selectedAttendeePass.attendeeName.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Pass.png`}
                  className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Pass</span>
                </a>
              )}
              <button
                onClick={() => setSelectedAttendeePass(null)}
                className="py-2 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
