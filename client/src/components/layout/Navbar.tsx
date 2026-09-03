import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Calendar, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, switchOrganization } = useAuth();
  const navigate = useNavigate();

  const orgList = [
    { id: 'org-techconf', name: 'TechConf Global Ltd' },
    { id: 'org-soundwave', name: 'SoundWave Productions' },
    { id: 'org-unicouncil', name: 'University Student Council' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              EventHub
            </span>
            <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200/60">
              Multi-Tenant Portal
            </span>
          </div>
        </Link>

        <nav className="flex items-center space-x-3 sm:space-x-5">
          <Link
            to="/discover"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 flex items-center space-x-1"
          >
            <Calendar className="w-4 h-4" />
            <span>Discover</span>
          </Link>

          {isAuthenticated && user?.role === 'organizer' && (
            <Link
              to="/dashboard"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Organizer Dashboard
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              {user?.role === 'organizer' && (
                <div className="relative group">
                  <button className="text-xs font-medium bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
                    <span className="truncate max-w-[130px]">{user.orgName}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                  <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-lg hidden group-hover:block p-1 z-50">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                        Switch Organization Workspace
                      </p>
                    </div>
                    {orgList.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => switchOrganization(org.id, org.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          user.orgId === org.id
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {org.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Organizer Sign In</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
