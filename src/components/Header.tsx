import React from 'react';
import { translations } from '../translations';
import { Language, UserRole } from '../types';
import { Shield, Sparkles, AlertCircle, Heart, User, Settings2, Globe, Stethoscope, Lock } from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  setLang: (lang: Language) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
  onNavigateToAI: () => void;
  onNavigateToLanding: () => void;
  onNavigateToEmergency: () => void;
  roleName?: string;
  isPatientAuth: boolean;
  isDoctorAuth: boolean;
  isAdminAuth: boolean;
}

export default function Header({
  currentLang,
  setLang,
  activeRole,
  setActiveRole,
  isLoggedIn,
  onLogout,
  onNavigateToAI,
  onNavigateToLanding,
  onNavigateToEmergency,
  roleName,
  isPatientAuth,
  isDoctorAuth,
  isAdminAuth
}: HeaderProps) {
  const t = translations[currentLang];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-slate-100 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div 
          onClick={onNavigateToLanding}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200 transition-all duration-300 group-hover:scale-110">
            <Stethoscope className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h1 className="font-sans font-extrabold tracking-wider text-xl text-slate-800 leading-none">
              {t.brand}
            </h1>
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-emerald-600">
              {t.tagline}
            </span>
          </div>
        </div>

        {/* Quick Quick Navigation Options */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={onNavigateToLanding}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeRole === 'guest' ? 'bg-slate-100 text-slate-900 border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.features}
          </button>

          <button
            onClick={onNavigateToEmergency}
            className="relative px-3 py-1.5 rounded-lg text-sm font-semibold bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 hover:text-red-700 transition-all duration-200 flex items-center gap-1.5"
          >
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            {t.requestAmbulance}
          </button>

          <button
            onClick={onNavigateToAI}
            className="px-3 py-1.5 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-all duration-200 flex items-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {t.aiAssistant}
          </button>
        </div>

        {/* Role switching options (to test the ecosystem) */}
        <div className="flex flex-wrap items-center justify-end gap-3 w-full md:w-auto">
          {/* Environment Role Switcher Controls */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 animate-fade-in">
            <button
              onClick={() => setActiveRole('guest')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeRole === 'guest' 
                  ? 'bg-white text-slate-800 shadow-xs border border-slate-200' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Portal (Guest)
            </button>
            <button
              onClick={() => setActiveRole('patient')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 ${
                activeRole === 'patient' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Patient</span>
              {!isPatientAuth && <Lock className="h-3 w-3 opacity-60 text-current" />}
            </button>
            <button
              onClick={() => setActiveRole('doctor')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 ${
                activeRole === 'doctor' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Doctor</span>
              {!isDoctorAuth && <Lock className="h-3 w-3 opacity-60 text-current" />}
            </button>
            <button
              onClick={() => setActiveRole('admin')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all duration-200 ${
                activeRole === 'admin' 
                  ? 'bg-indigo-950 text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Admin</span>
              {!isAdminAuth && <Lock className="h-3 w-3 opacity-60 text-current" />}
            </button>
          </div>

          {/* Language selection */}
          <button
            onClick={() => setLang(currentLang === 'en' ? 'te' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-semibold transition-all duration-200 shadow-2xs"
          >
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            <span>{currentLang === 'en' ? 'తెలుగు' : 'English'}</span>
          </button>

          {/* User Sign out indicator */}
          {isLoggedIn && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg border border-red-200/60 bg-red-50/20 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-semibold transition-all duration-200"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
