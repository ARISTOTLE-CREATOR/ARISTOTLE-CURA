import React, { useState } from 'react';
import { translations } from '../translations';
import { Doctor, Patient, Appointment, AmbulanceRequest, Language } from '../types';
import { 
  Users, Stethoscope, Ambulance, CalendarRange, 
  ChevronRight, Trash2, CheckCircle, Plus, Activity,
  LineChart, TrendingUp, TrendingDown, DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminPortalProps {
  currentLang: Language;
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  ambulanceRequests: AmbulanceRequest[];
  onDeleteDoctor: (id: string) => void;
  onDeletePatient: (id: string) => void;
  onVerifyDoctor: (id: string) => void;
}

export default function AdminPortal({
  currentLang,
  patients,
  doctors,
  appointments,
  ambulanceRequests,
  onDeleteDoctor,
  onDeletePatient,
  onVerifyDoctor
}: AdminPortalProps) {
  const t = translations[currentLang];
  
  // Active module tab
  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'patients' | 'ambulances'>('overview');
  
  // Doctors state extensions
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpec, setNewDocSpec] = useState('Cardiologist');
  const [isDocSuccess, setIsDocSuccess] = useState(false);

  const totalPatientsCount = patients.length + 432; // adding simulated base index
  const totalDoctorsCount = doctors.length;
  const activeEmergencies = ambulanceRequests.filter(r => r.status !== 'Reached Destination').length;
  const totalConsultationsRecorded = appointments.length + 1850;

  const handleCreateDoctorMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDocName) {
      setIsDocSuccess(true);
      setTimeout(() => {
        setIsDocSuccess(false);
        setNewDocName('');
      }, 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:grid-cols-12 gap-8">
      
      {/* Admin Title section */}
      <div className="mb-8">
        <span className="text-emerald-500 font-extrabold text-xs uppercase tracking-widest block">Executive Headquarters</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{t.adminPlatform}</h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">{t.adminSubtitle}</p>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Metric Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block">Network Patients</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1">{totalPatientsCount}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">▲ 12% Month-over-Month</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Metric Specialists */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block">Physicians On-Duty</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1">{totalDoctorsCount}</span>
            <span className="text-[10px] text-emerald-600 font-bold block mt-1">▲ 4 new onboard requests</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Stethoscope className="h-5 w-5" />
          </div>
        </div>

        {/* Metric Ambulance dispatches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block">Active Dispatches</span>
            <span className="text-2xl font-mono font-extrabold text-red-650 text-red-600 mt-1">{activeEmergencies} active</span>
            <span className="text-[10px] text-slate-500 font-medium block mt-1">Under 8.5 min Response Rate</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <Ambulance className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Metric Financial Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold block">Network Consolidated Revenue</span>
            <span className="text-2xl font-mono font-extrabold text-slate-900 mt-1">₹ 2,42,800</span>
            <span className="text-[10px] text-indigo-600 font-semibold block mt-1">● Clear insurance channels</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Admin sub-menu navigations */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-8 overflow-x-auto scrollbar-none border-slate-300">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-indigo-950 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          📈 Consolidated Ledger Overview
        </button>
        <button 
          onClick={() => setActiveTab('doctors')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${activeTab === 'doctors' ? 'bg-indigo-950 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          🥼 Registered Specialists ({doctors.length})
        </button>
        <button 
          onClick={() => setActiveTab('patients')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${activeTab === 'patients' ? 'bg-indigo-950 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          👤 Patient Registry ({patients.length})
        </button>
        <button 
          onClick={() => setActiveTab('ambulances')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap ${activeTab === 'ambulances' ? 'bg-indigo-950 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          🚨 active Queue dispatches ({activeEmergencies})
        </button>
      </div>

      {/* ADMIN WORKSPACE PANELS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Revenue and system load charts */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Automated Analytics Ledger</h3>
              <span className="text-[10px] font-mono font-bold text-indigo-600 block">REAL-TIME TELEMETRY</span>
            </div>

            {/* Custom SVG line-chart represent the platform activity */}
            <div className="h-56 bg-slate-50 rounded-2xl border border-slate-100 p-4 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase">
                <span>Active load (Visits in scale)</span>
                <span>June 2026 Target metrics</span>
              </div>

              {/* Simplified high-end visual path charting */}
              <svg className="absolute inset-0 h-full w-full p-2" viewBox="0 0 400 100" preserveAspectRatio="none">
                <path 
                  d="M0,80 Q50,40 100,50 T200,30 T300,70 T400,20" 
                  fill="none" 
                  stroke="rgba(16, 185, 129, 0.7)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
                <circle cx="100" cy="50" r="4" fill="#10b981" />
                <circle cx="200" cy="30" r="4" fill="#10b981" />
                <circle cx="400" cy="20" r="4" fill="#10b981" />
              </svg>

              <div className="flex justify-between font-mono text-[9px] text-slate-400 border-t border-slate-100 pt-1.5 mt-auto">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400">Average response dispatch speed</h4>
                <div className="text-lg font-mono font-extrabold text-slate-800 mt-1">7.42 minutes</div>
                <span className="text-[10px] text-emerald-600 mt-1 block">✓ 1.28m under urban targets</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <h4 className="text-xs font-bold text-slate-400">Total clinical appointments completed</h4>
                <div className="text-lg font-mono font-extrabold text-slate-800 mt-1">{totalConsultationsRecorded} consultations</div>
                <span className="text-[10px] text-emerald-600 mt-1 block">✓ Stable specialist availability</span>
              </div>
            </div>
          </div>

          {/* Incident classification pipeline panel */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs space-y-6">
            <h3 className="font-extrabold text-slate-900 text-sm">Dispatched Emergency Triage</h3>
            
            <div className="space-y-4">
              {ambulanceRequests.slice(0, 3).map((item, index) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 leading-relaxed text-sm">
                  <div className="flex justify-between items-start mb-1.5 ">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{item.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      item.status === 'Reached Destination' ? 'bg-slate-200 text-slate-600' : 'bg-red-100 text-red-800'
                    }`}>{item.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{item.patientName}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Location: {item.location}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SPECIALIST DIRECTORY (DELETE OR BOARD VALIDATION OVERRIDE) */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-150">
            <h3 className="font-extrabold text-slate-900 text-base">Active Registered Physicians</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">Doctor Name</th>
                  <th className="py-3 px-4">Specialty</th>
                  <th className="py-3 px-4">Affiliation Hospital</th>
                  <th className="py-3 px-4">Consultation Fee</th>
                  <th className="py-3 px-4 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <img src={doc.photo} alt={doc.name} className="h-6 w-6 rounded-lg object-cover" />
                      <span>{doc.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{doc.specialization}</td>
                    <td className="py-3.5 px-4 text-slate-500">{doc.hospital}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">₹ {doc.fee}</td>
                    <td className="py-3.5 px-4 text-right">
                      {doc.id !== 'doc-1' && doc.id !== 'doc-2' && (
                        <button 
                          onClick={() => onDeleteDoctor(doc.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-rose-50 transition-all cursor-pointer inline-block"
                          title="Revoke License"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PATIENT REGISTRY (AUDIT DELETE FLOWS) */}
      {activeTab === 'patients' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900 text-base">Consolidated Health Registry index</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">User Card ID</th>
                  <th className="py-3 px-4">Patient Legal Name</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Email ID Address</th>
                  <th className="py-3 px-4 text-right">Operations Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((pat) => (
                  <tr key={pat.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[10px]">{pat.id}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-850">{pat.name}</td>
                    <td className="py-3.5 px-4 text-slate-600">{pat.phone}</td>
                    <td className="py-3.5 px-4 text-slate-500">{pat.email}</td>
                    <td className="py-3.5 px-4 text-right">
                      {pat.id !== 'pat-101' && (
                        <button 
                          onClick={() => onDeletePatient(pat.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-rose-50 transition-all cursor-pointer"
                          title="Delete Account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVE QUEUE DISPATCH PIPELINE MONITORING */}
      {activeTab === 'ambulances' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
          <h3 className="font-extrabold text-slate-900 text-base">Active Emergencies dispatch Queue</h3>

          <div className="space-y-4">
            {ambulanceRequests.map((req) => (
              <div 
                key={req.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-100/60 leading-relaxed text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">{req.id}</span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{req.patientName}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Location landmark: {req.location} | Driver: {req.driverName}</p>
                  <span className="text-[9px] text-indigo-700 font-bold block mt-1.5 uppercase">{req.ambulanceType}</span>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  req.status === 'Reached Destination' ? 'bg-slate-200 text-slate-650' : 'bg-red-100 text-red-800 animate-pulse'
                }`}>{req.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
