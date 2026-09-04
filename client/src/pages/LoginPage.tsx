import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Building2, UserCircle, ArrowRight, PlusCircle, X, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { OrganizationItem } from '../types';
import { API_BASE_URL } from '../config';

export const LoginPage: React.FC = () => {
  const { loginAsOrganizer, loginAsAttendee } = useAuth();
  const navigate = useNavigate();

  const [orgs, setOrgs] = useState<OrganizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<{ id: string; name: string }>({
    id: 'org-techconf',
    name: 'TechConf Global Ltd',
  });

  // State for creating a new custom organization
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgDescription, setNewOrgDescription] = useState('');
  const [newOrgCategory, setNewOrgCategory] = useState('Tech');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/organizations`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setOrgs(data.data);
        // Default select the first org if none selected or not matching
        setSelectedOrg({
          id: data.data[0].orgId,
          name: data.data[0].name,
        });
      } else {
        // Fallback default set if database is not yet seeded
        const fallbackOrgs: OrganizationItem[] = [
          {
            orgId: 'org-techconf',
            name: 'TechConf Global Ltd',
            description: 'Tech meetups, developer summits & software hackathons',
            category: 'Tech',
          },
          {
            orgId: 'org-soundwave',
            name: 'SoundWave Productions',
            description: 'Concerts, beachside acoustic nights & outdoor musical festivals',
            category: 'Music',
          },
          {
            orgId: 'org-unicouncil',
            name: 'University Student Council',
            description: 'Campus 5K charity walks, collegiate codeathons & club gatherings',
            category: 'University',
          },
        ];
        setOrgs(fallbackOrgs);
        setSelectedOrg({ id: fallbackOrgs[0].orgId, name: fallbackOrgs[0].name });
      }
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) return;

    setCreating(true);
    setCreateError('');
    try {
      const res = await fetch(`${API_BASE_URL}/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newOrgName.trim(),
          description: newOrgDescription.trim(),
          category: newOrgCategory,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setOrgs((prev) => [data.data, ...prev]);
        setSelectedOrg({ id: data.data.orgId, name: data.data.name });
        setShowCreateModal(false);
        setNewOrgName('');
        setNewOrgDescription('');
      } else {
        setCreateError(data.message || 'Failed to create organization');
      }
    } catch (err: any) {
      setCreateError(err.message || 'Failed to connect to server');
    } finally {
      setCreating(false);
    }
  };

  const handleOrganizerSignIn = () => {
    loginAsOrganizer(selectedOrg.id, selectedOrg.name);
    navigate('/dashboard');
  };

  const handleAttendeeSignIn = () => {
    loginAsAttendee();
    navigate('/discover');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Event Management Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic Multi-Tenant Organizer & Host Workspace
          </p>
        </div>

        {/* Organizer Tenant Sign In Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Workspace
              </span>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Register New</span>
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Select a tenant organization from the database or register a new one to access isolated events, ticketing, and analytics.
          </p>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center space-y-2 text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
              <span className="text-xs">Loading registered organizations...</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {orgs.map((org) => (
                <label
                  key={org.orgId}
                  className={`block p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                    selectedOrg.id === org.orgId
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{org.name}</span>
                    <input
                      type="radio"
                      name="orgSelect"
                      checked={selectedOrg.id === org.orgId}
                      onChange={() => setSelectedOrg({ id: org.orgId, name: org.name })}
                      className="text-indigo-600"
                    />
                  </div>
                  {org.description && (
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{org.description}</p>
                  )}
                  <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                    {org.category || 'General'}
                  </span>
                </label>
              ))}
            </div>
          )}

          <button
            onClick={handleOrganizerSignIn}
            disabled={!selectedOrg.id || loading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
          >
            <span>Authenticate into {selectedOrg.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Attendee Quick Demo Login */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <button
            onClick={handleAttendeeSignIn}
            className="text-xs text-slate-600 hover:text-indigo-600 font-semibold inline-flex items-center space-x-1"
          >
            <UserCircle className="w-4 h-4 text-slate-400" />
            <span>Continue as Attendee (Public Events)</span>
          </button>
        </div>
      </div>

      {/* Modal: Register New Organization */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">Register New Organization</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateOrg} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Organization / Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Music Collective, City Tech Club"
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={newOrgCategory}
                  onChange={(e) => setNewOrgCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Tech">Tech & Engineering</option>
                  <option value="Music">Music & Concerts</option>
                  <option value="Sports">Sports & Fitness</option>
                  <option value="University">University & Student Body</option>
                  <option value="Community">Community & Social</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Briefly describe the types of events your organization hosts..."
                  value={newOrgDescription}
                  onChange={(e) => setNewOrgDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all disabled:opacity-50"
                >
                  {creating ? 'Registering...' : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
