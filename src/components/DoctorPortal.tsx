import React, { useState } from 'react';
import { translations } from '../translations';
import { Doctor, Appointment, Patient, Language } from '../types';
import { demoDoctors, demoPatient, demoReports, demoConditions, demoPrescriptions } from '../demoData';
import { 
  Building2, GraduationCap, Clock, Check, X, Calendar, 
  User, RefreshCw, Smartphone, Heart, Users, 
  FolderPlus, Wallet, Stethoscope, Settings, Bell, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DoctorPortalProps {
  currentLang: Language;
  appointments: Appointment[];
  doctors: Doctor[];
  onAcceptAppointment: (id: string) => void;
  onRejectAppointment: (id: string, reason?: string) => void;
  onRescheduleAppointment: (id: string, date: string, time: string) => void;
  onUpdateAvailability: (id: string, days: string[], hours: Doctor['workingHours']) => void;
  onUpdatePatientRecord?: (id: string, details: any) => void;
  loggedDoctor?: Doctor;
}

export default function DoctorPortal({
  currentLang,
  appointments,
  doctors,
  onAcceptAppointment,
  onRejectAppointment,
  onRescheduleAppointment,
  onUpdateAvailability,
  loggedDoctor
}: DoctorPortalProps) {
  const t = translations[currentLang];

  // Auth States
  const [authView, setAuthView] = useState<'login' | 'register' | 'workspace'>('workspace');
  
  // Registration Form State
  const [docName, setDocName] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docQual, setDocQual] = useState('');
  const [docSpec, setDocSpec] = useState('Cardiologist');
  const [docFee, setDocFee] = useState<number>(800);
  const [docHosp, setDocHosp] = useState('');
  const [isRegDone, setIsRegDone] = useState(false);

  // Active Selected Doctor in session (Default from loggedDoctor or fallback)
  const [activeDoctor, setActiveDoctor] = useState<Doctor>(() => {
    return loggedDoctor || doctors[0] || demoDoctors[0];
  });

  // Keep activeDoctor state synchronized if loggedDoctor prop updates
  React.useEffect(() => {
    if (loggedDoctor) {
      setActiveDoctor(loggedDoctor);
    }
  }, [loggedDoctor]);
  
  // Active Workspace tab
  const [activeTab, setActiveTab] = useState<'appointments' | 'schedule' | 'records' | 'analytics'>('appointments');

  // Working Hours Config states
  const [workingDays, setWorkingDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [practiceStart, setPracticeStart] = useState('09:00 AM');
  const [practiceEnd, setPracticeEnd] = useState('05:00 PM');
  const [recessStart, setRecessStart] = useState('01:00 PM');
  const [recessEnd, setRecessEnd] = useState('02:00 PM');
  const [slotsGenerated, setSlotsGenerated] = useState<string[]>(['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '03:30 PM']);
  const [isSlotMessage, setIsSlotMessage] = useState('');

  // Selected Patients Medical Passport inspected by Doctor
  const [inspectPatient, setInspectPatient] = useState<Patient | null>(null);

  // Reject / Reason variables
  const [rejectId, setRejectId] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  // Reschedule variables
  const [reschId, setReschId] = useState('');
  const [reschDate, setReschDate] = useState('2026-06-18');
  const [reschTime, setReschTime] = useState('11:30 AM');

  const docAppointments = appointments.filter(appt => appt.doctorId === activeDoctor.id);

  const handleDocLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthView('workspace');
  };

  const handleDocRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (docName && docEmail && docPhone && docQual) {
      setIsRegDone(true);
      setTimeout(() => {
        setIsRegDone(false);
        setAuthView('login');
      }, 2500);
    }
  };

  const handleSaveAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAvailability(activeDoctor.id, workingDays, {
      start: practiceStart,
      end: practiceEnd,
      breakStart: recessStart,
      breakEnd: recessEnd
    });

    // Auto-generate some slot tags
    const newSlots = [
      `${practiceStart.split(':')[0]}:30 AM`,
      `10:30 AM`,
      `11:30 AM`,
      `${(Number(recessEnd.split(':')[0]))}:30 PM`,
      `${(Number(recessEnd.split(':')[0]) + 1)}:30 PM`
    ];
    setSlotsGenerated(newSlots);
    setIsSlotMessage('Clinical schedulers rebuilt. Appointment booking tags refreshed.');
    setTimeout(() => setIsSlotMessage(''), 3500);
  };

  const executeReject = () => {
    if (rejectId && rejectReason) {
      onRejectAppointment(rejectId, rejectReason);
      setRejectId('');
      setRejectReason('');
    }
  };

  const executeResch = () => {
    if (reschId && reschDate && reschTime) {
      onRescheduleAppointment(reschId, reschDate, reschTime);
      setReschId('');
    }
  };

  const toggleDay = (day: string) => {
    setWorkingDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  if (authView === 'login') {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1">Verify Physician Passport</h2>
        <p className="text-xs text-slate-500 text-center mb-6">Gain access to designated HIPAA clinical schedule controllers and triage approvals.</p>

        <form onSubmit={handleDocLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">National Practitioner ID / Email</label>
            <input 
              type="text" required placeholder="dr.siddhartha@aristotle.com"
              className="w-full text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Security Keypass</label>
            <input 
              type="password" required placeholder="••••••••"
              className="w-full text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
            />
          </div>

          <button type="submit" className="w-full py-3 bg-indigo-950 text-white font-bold text-sm rounded-xl hover:bg-indigo-900 transition-all cursor-pointer">
            Decrypt Clinical Node
          </button>
        </form>
        <div className="text-center mt-6 pt-6 border-t border-slate-100">
          <button onClick={() => setAuthView('register')} className="text-xs text-slate-500 font-semibold hover:text-slate-800">
            Apply for Physician Onboarding Credentials
          </button>
        </div>
      </div>
    );
  }

  if (authView === 'register') {
    return (
      <div className="max-w-lg mx-auto my-12 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1">Physician Onboarding Node</h2>
        <p className="text-xs text-slate-500 text-center mb-6">Register authorized hospital affiliation, consultation rate, and certification keys.</p>

        {isRegDone && (
          <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-xl border border-emerald-100 mb-4 text-center">
            ✓ Application dispatched to ARISTOTLE board of medical registry directors.
          </div>
        )}

        <form onSubmit={handleDocRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name (with title)</label>
              <input 
                type="text" required placeholder="Dr. Siddhartha Rao"
                value={docName} onChange={(e) => setDocName(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Clinical Coordinates (Email)</label>
              <input 
                type="email" required placeholder="siddhartha@aristotle.com"
                value={docEmail} onChange={(e) => setDocEmail(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Hotline</label>
              <input 
                type="tel" required placeholder="9xxxxxxxxx"
                value={docPhone} onChange={(e) => setDocPhone(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Qualifying Degrees</label>
              <input 
                type="text" required placeholder="MD, DM (Cardiology)"
                value={docQual} onChange={(e) => setDocQual(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Primary Specialty Option</label>
              <select 
                value={docSpec} onChange={(e) => setDocSpec(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden bg-white"
              >
                <option>Cardiologist</option>
                <option>Dermatologist</option>
                <option>Neurologist</option>
                <option>Orthopedic Specialist</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Consultation Fee (INR)</label>
              <input 
                type="number" required
                value={docFee} onChange={(e) => setDocFee(Number(e.target.value))}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Hospital Affiliation Node</label>
              <input 
                type="text" required placeholder="ARISTOTLE Cardiac Care Institute"
                value={docHosp} onChange={(e) => setDocHosp(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-500 transition-all cursor-pointer">
            Authorize Registry Approval Request
          </button>
        </form>
        <div className="text-center mt-6 pt-6 border-t border-slate-100">
          <button onClick={() => setAuthView('login')} className="text-xs text-slate-500 font-semibold hover:text-slate-800">
            Already verified? Decrypt portal instead
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      
      {/* Active Consultant Node Selector (Let users swap active doctors to see bookings updating) */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-indigo-700 font-extrabold block">Testing Environment Mode: Swapping Active Physician:</span>
          <select 
            value={activeDoctor.id}
            onChange={(e) => {
              const doc = doctors.find(d => d.id === e.target.value);
              if (doc) setActiveDoctor(doc);
            }}
            className="px-3 py-1 bg-white text-xs font-bold text-slate-800 rounded-xl border border-indigo-200 focus:outline-hidden"
          >
            {doctors.map(d => (
              <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>
            ))}
          </select>
        </div>
        <span className="text-[10px] uppercase font-mono font-bold text-indigo-500">Live Doctor Session Synchronized</span>
      </div>

      {/* Doctor Header Banner Card */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl overflow-hidden mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="flex items-center gap-4">
          <img src={activeDoctor.photo} alt={activeDoctor.name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500" />
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Sparkles className="h-3 w-3" />
              <span>Certified Chief Consul</span>
            </div>
            <h2 className="text-2xl font-extrabold leading-none mb-1">{activeDoctor.name}</h2>
            <p className="text-indigo-300 text-xs font-semibold">{activeDoctor.specialization} • {activeDoctor.hospital}</p>
          </div>
        </div>

        {/* Dynamic analytics panel */}
        <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-white/5 rounded-2xl border border-white/5 text-center">
          <div>
            <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">{t.todaysDuty}</span>
            <span className="text-lg font-mono font-extrabold text-indigo-400 mt-1">
              {docAppointments.filter(a => a.status === 'Approved').length} active
            </span>
          </div>
          <div className="border-x border-white/5">
            <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Rating index</span>
            <span className="text-lg font-mono font-extrabold text-indigo-400 mt-1">★ {activeDoctor.rating}</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Charge index</span>
            <span className="text-lg font-mono font-extrabold text-emerald-400 mt-1">₹ {activeDoctor.fee}</span>
          </div>
        </div>
      </div>

      {/* Workspace Menu Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-8 overflow-x-auto scrollbar-none shrink-0 border-slate-300">
        <button 
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'appointments' ? 'bg-indigo-950 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          📅 Appointments Queue ({docAppointments.length})
        </button>
        <button 
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'schedule' ? 'bg-indigo-950 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          ⚙️ {t.hoursDef}
        </button>
        <button 
          onClick={() => { setActiveTab('records'); setInspectPatient(demoPatient); }}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'records' ? 'bg-indigo-950 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
        >
          👤 Consult Patient Records
        </button>
      </div>

      {/* Tabs panels */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: APPOINTMENTS QUEUE (APPROVE/REJECT/RESCHEDULE FLUID WORKSPACE) */}
        {activeTab === 'appointments' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Modal-like sections for reject reasons */}
            {rejectId && (
              <div className="bg-rose-50 text-rose-900 border border-rose-200 p-5 rounded-2xl mb-4 space-y-3">
                <h4 className="text-xs uppercase font-extrabold text-rose-700">Decline Protocols Request</h4>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Provide reason for appointment cancellation..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="flex-1 px-4 py-2 bg-white border border-rose-200 text-slate-800 text-xs font-semibold rounded-xl focus:outline-hidden"
                  />
                  <button onClick={executeReject} className="px-4 py-2 rounded-xl bg-red-650 hover:bg-red-700 bg-red-600 text-white font-bold text-xs cursor-pointer">Submit cancellation</button>
                  <button onClick={() => setRejectId('')} className="px-3 py-2 rounded-xl border border-slate-350 text-slate-600 font-bold text-xs cursor-pointer">Back</button>
                </div>
              </div>
            )}

            {/* Reschedule forms */}
            {reschId && (
              <div className="bg-indigo-50 text-indigo-900 border border-indigo-250 p-5 rounded-2xl mb-4 space-y-3 border-indigo-100">
                <h4 className="text-xs uppercase font-extrabold text-indigo-700">Propose Clinical Rescheduling</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <input 
                    type="date"
                    value={reschDate}
                    onChange={(e) => setReschDate(e.target.value)}
                    className="px-4 py-2 bg-white text-xs font-bold rounded-xl border border-indigo-200"
                  />
                  <select 
                    value={reschTime}
                    onChange={(e) => setReschTime(e.target.value)}
                    className="px-4 py-2 bg-white text-xs font-bold rounded-xl border border-indigo-200"
                  >
                    <option>09:30 AM</option>
                    <option>10:30 AM</option>
                    <option>02:30 PM</option>
                    <option>04:30 PM</option>
                  </select>
                  <div className="flex gap-2 justify-end">
                    <button onClick={executeResch} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer">Assign Slot</button>
                    <button onClick={() => setReschId('')} className="px-3 py-2 rounded-xl border border-slate-350 text-slate-600 font-bold text-xs cursor-pointer">Back</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-base mb-6">Patient Appointment Registrations ({docAppointments.length})</h3>

              <div className="space-y-4">
                {docAppointments.length > 0 ? (
                  docAppointments.map((appt) => (
                    <div 
                      key={appt.id}
                      className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      id={`doc-appt-item-${appt.id}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-base">{appt.patientName}</h4>
                          <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase">{appt.consultationType}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold mt-1">Age {appt.patientAge} • Reason: <strong className="text-slate-700 font-semibold">{appt.reason}</strong></p>
                        <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold mt-3">
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> Planned: {appt.date} • {appt.timeSlot}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          appt.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          appt.status === 'Pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                          appt.status === 'Rejected' ? 'bg-red-100 text-red-800 font-semibold' : 'bg-slate-100 text-slate-800'
                        }`}>
                          {appt.status}
                        </span>

                        {appt.status === 'Pending' && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => onAcceptAppointment(appt.id)}
                              className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-2xs"
                              title="Accept Appointment"
                              id={`approve-appt-${appt.id}`}
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => { setReschId(appt.id); setReschDate(appt.date); setReschTime(appt.timeSlot); }}
                              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-[10px] font-bold text-indigo-700 rounded-lg transition-all"
                              title="Reschedule Appointment"
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => { setRejectId(appt.id); setRejectReason('Doctor unavailable due to emergency surgeries'); }}
                              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-2xs"
                              title="Reject Appointment"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-500 text-xs font-medium">
                    No matching patient sessions found for your clinical schedule node.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: DEFINE SCHEDULE & BREAK HOURS */}
        {activeTab === 'schedule' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm"
          >
            <h3 className="font-extrabold text-slate-900 text-base mb-6">{t.hoursDef}</h3>

            {isSlotMessage && (
              <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-xl border border-emerald-100 mb-6">
                ✓ {isSlotMessage}
              </div>
            )}

            <form onSubmit={handleSaveAvailability} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-3">Active Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => {
                    const isSelected = workingDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                          isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">{t.workingHrsRange}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" required placeholder="09:00 AM"
                      value={practiceStart} onChange={(e) => setPracticeStart(e.target.value)}
                      className="w-full text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200"
                    />
                    <span className="text-slate-400 self-center">to</span>
                    <input 
                      type="text" required placeholder="05:00 PM"
                      value={practiceEnd} onChange={(e) => setPracticeEnd(e.target.value)}
                      className="w-full text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">{t.breakHrsRange}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" required placeholder="01:00 PM"
                      value={recessStart} onChange={(e) => setRecessStart(e.target.value)}
                      className="w-full text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200"
                    />
                    <span className="text-slate-400 self-center">to</span>
                    <input 
                      type="text" required placeholder="02:00 PM"
                      value={recessEnd} onChange={(e) => setRecessEnd(e.target.value)}
                      className="w-full text-slate-800 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-400 font-bold block uppercase mb-2">Automated Dynamic Booking Tags Generated:</span>
                <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
                  {slotsGenerated.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded bg-slate-100 text-indigo-700 border border-slate-200">{s}</span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-indigo-950 hover:bg-indigo-900 text-white font-extrabold text-sm transition-all"
              >
                {t.saveConfig}
              </button>
            </form>
          </motion.div>
        )}

        {/* TAB 3: CONSULT HEALTH RECORDS (HIPAA EHR VIEW BY RECRUITED PHYSICIAN) */}
        {activeTab === 'records' && inspectPatient && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column EHR Summary Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm">Patient Clinical Profile</h3>
              <div className="flex justify-between items-center pb-3 border-b border-rose-50">
                <span className="text-xs text-slate-400 font-semibold">Legal Full Name</span>
                <span className="text-xs font-bold text-slate-850">{inspectPatient.name}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-rose-50">
                <span className="text-xs text-slate-400 font-semibold">Gender & Age metrics</span>
                <span className="text-xs font-bold text-slate-850">{inspectPatient.gender} • {inspectPatient.age} years</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-rose-50">
                <span className="text-xs text-slate-400 font-semibold">Identified Blood Matrix</span>
                <span className="text-xs font-bold text-slate-850">{inspectPatient.bloodGroup}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-semibold">Active Allergies Registry</span>
                <div className="text-right flex flex-wrap gap-1 justify-end">
                  {inspectPatient.allergies?.map(a => (
                    <span key={a} className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-[9px] font-bold uppercase">{a}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column Grid logs */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Diagnosed Clinical Conditions */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-extrabold text-slate-900 text-sm mb-4">Historical Clinical Diagnosis List</h3>
                <div className="space-y-3">
                  {demoConditions.map(item => (
                    <div key={item.id} className="flex justify-between items-start p-3 bg-slate-50 border border-slate-100/50 rounded-xl">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">{item.notes}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 text-[10px] font-extrabold">{item.severity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab reports and previous prescriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="bg-white p-5 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest text-slate-400 mb-3">Electronic Diagnostics PDF</h3>
                  <div className="space-y-2">
                    {demoReports.map(rep => (
                      <div key={rep.id} className="p-2 border-b border-slate-50 text-xs font-medium flex justify-between last:border-0 pb-1.5">
                        <span className="text-slate-600 truncate max-w-[150px]">{rep.title}</span>
                        <span className="text-slate-400">{rep.date}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest text-slate-400 mb-3">Previous Active Drugs</h3>
                  <div className="space-y-2">
                    {demoPrescriptions.map(pres => (
                      <div key={pres.id} className="p-2 border-b border-slate-50 text-xs font-medium flex justify-between last:border-0 pb-1.5">
                        <span className="text-slate-600 truncate max-w-[150px]">{pres.medicineName}</span>
                        <span className="text-emerald-600">{pres.dosage}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
