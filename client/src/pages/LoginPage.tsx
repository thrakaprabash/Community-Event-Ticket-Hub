import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Building2, UserCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { loginAsOrganizer, loginAsAttendee } = useAuth();
  const navigate = useNavigate();

  const [selectedOrg, setSelectedOrg] = useState({
    id: 'org-techconf',
    name: 'TechConf Global Ltd'
  });

  const orgs = [
    {
      id: 'org-techconf',
      name: 'TechConf Global Ltd',
      description: 'Tech meetups, developer summits & software hackathons'
    },
    {
      id: 'org-soundwave',
      name: 'SoundWave Productions',
      description: 'Concerts, beachside acoustic nights & outdoor musical festivals'
    },
    {
      id: 'org-unicouncil',
      name: 'University Student Council',
      description: 'Campus 5K charity walks, collegiate codeathons & club gatherings'
    }
  ];

  const handleOrganizerSignIn = () => {
    loginAsOrganizer(selectedOrg.id, selectedOrg.name);
    navigate('/dashboard');
  };

  const handleAttendeeSignIn = () => {
    loginAsAttendee();
    navigate('/');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-indigo-200">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            WSO2 Asgardeo Identity Gateway
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            B2B Multi-Tenant Organization Workspace Authentication
          </p>
        </div>

        {/* Organizer B2B Tenant Sign In Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Organizer Workspace (B2B Tenant)
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Select the Asgardeo sub-organization to authenticate as that tenant. Data and analytics are strictly isolated.
          </p>

          <div className="space-y-2">
            {orgs.map((org) => (
              <label
                key={org.id}
                className={`block p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                  selectedOrg.id === org.id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{org.name}</span>
                  <input
                    type="radio"
                    name="orgSelect"
                    checked={selectedOrg.id === org.id}
                    onChange={() => setSelectedOrg(org)}
                    className="text-indigo-600"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{org.description}</p>
              </label>
            ))}
          </div>

          <button
            onClick={handleOrganizerSignIn}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
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
            <span>Continue as Attendee (Root Public Org)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
