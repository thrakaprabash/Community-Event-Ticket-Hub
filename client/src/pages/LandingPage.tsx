import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { HeroSection } from '../components/landing/HeroSection';
import { StatsBar } from '../components/landing/StatsBar';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { LiveEventsPreview } from '../components/landing/LiveEventsPreview';
import { CTASection } from '../components/landing/CTASection';

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, redirect to /discover as agreed in question 1
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/discover', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Dynamic Scrolled Navbar */}
      <LandingNavbar />

      {/* Hero section with floating card & headline reveal */}
      <HeroSection />

      {/* Real-time telemetry counter bar */}
      <StatsBar />

      {/* Actual live events from database */}
      <LiveEventsPreview />

      {/* Core features staggered animation grid */}
      <FeaturesSection />

      {/* Call to action */}
      <CTASection />
    </div>
  );
};
