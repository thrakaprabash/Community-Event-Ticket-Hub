import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  sub: string;
  name: string;
  email: string;
  orgId: string;
  orgName: string;
  role: 'attendee' | 'organizer';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loginAsOrganizer: (orgId: string, orgName: string) => void;
  loginAsAttendee: () => void;
  logout: () => void;
  switchOrganization: (orgId: string, orgName: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('eventhub_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('eventhub_auth_token');
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('eventhub_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('eventhub_auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('eventhub_auth_token', token);
    } else {
      localStorage.removeItem('eventhub_auth_token');
    }
  }, [token]);

  const loginAsOrganizer = (orgId: string, orgName: string) => {
    const slug = orgId.toLowerCase().replace(/[^a-z0-9]/g, '');
    const orgUser: AuthUser = {
      sub: `usr-${orgId}`,
      name: `${orgName} Admin`,
      email: `admin@${slug || 'org'}.com`,
      orgId,
      orgName,
      role: 'organizer'
    };
    setUser(orgUser);
    setToken(`mock_org_${orgId}`);
  };

  const loginAsAttendee = () => {
    const attendeeUser: AuthUser = {
      sub: 'usr-attendee',
      name: 'Community Attendee',
      email: 'attendee@community.hub',
      orgId: 'public-attendees',
      orgName: 'Community Attendee',
      role: 'attendee'
    };
    setUser(attendeeUser);
    setToken('mock_attendee_token');
  };

  const switchOrganization = (orgId: string, orgName: string) => {
    if (user && user.role === 'organizer') {
      setUser({ ...user, orgId, orgName });
      setToken(`mock_org_${orgId}`);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        token,
        loginAsOrganizer,
        loginAsAttendee,
        logout,
        switchOrganization
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
