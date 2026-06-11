import React, { useState } from 'react';
import { translations } from '../translations';
import { 
  Patient, Doctor, Appointment, MedicalReport, 
  MedicalCondition, Prescription, BillingInvoice, Language 
} from '../types';
import { 
  User, Mail, Phone, Calendar, Heart, ShieldAlert, 
  Activity, Star, Clock, CheckCircle2, AlertCircle, FileText, 
  Download, Share2, PlusCircle, CreditCard, ChevronRight, CheckSquare, Sparkles, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PatientPortalProps {
  currentLang: Language;
  doctors: Doctor[];
  patient: Patient;
  appointments: Appointment[];
  reports: MedicalReport[];
  conditions: MedicalCondition[];
  prescriptions: Prescription[];
  invoices: BillingInvoice[];
  notifications: any[];
  onBookAppointment: (appt: Omit<Appointment, 'id' | 'patientId' | 'patientName' | 'patientAge' | 'patientPhone' | 'status'>) => void;
  onCancelAppointment: (id: string) => void;
  onPayInvoice: (id: string) => void;
  onRegisterPatient: (newPatient: Patient & { password?: string }) => void;
  onAddInvoice?: (newInvoice: BillingInvoice) => void;
}

export default function PatientPortal({
  currentLang,
  doctors,
  patient,
  appointments,
  reports,
  conditions,
  prescriptions,
  invoices,
  onBookAppointment,
  onCancelAppointment,
  onPayInvoice,
  onRegisterPatient,
  onAddInvoice
}: PatientPortalProps) {
  const t = translations[currentLang];
  
  // Auth state transitions
  const [authScreen, setAuthScreen] = useState<'login' | 'register' | 'forgot' | 'dashboard'>('dashboard');
  
  // Registration Form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAge, setRegAge] = useState<number>(30);
  const [regGender, setRegGender] = useState('Female');
  const [regPassword, setRegPassword] = useState('');
  const [regBlood, setRegBlood] = useState('B+');
  const [isRegSuccess, setIsRegSuccess] = useState(false);
  
  // Login Form simulated state
  const [loginEmail, setLoginEmail] = useState('kshitij.reddy@gmail.com');
  const [loginPass, setLoginPass] = useState('password');
  const [loginErr, setLoginErr] = useState('');

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<'home' | 'reports' | 'conditions' | 'book' | 'billing'>('home');

  // Selected diagnostics report for full detail modal view
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  
  // Outstanding Bill Mock Payment Simulation
  const [payingInvoice, setPayingInvoice] = useState<BillingInvoice | null>(null);
  const [isPayingActiveStr, setIsPayingActiveStr] = useState<'idle' | 'processing' | 'done'>('idle');

  // Appointment states
  const [selectedDocId, setSelectedDocId] = useState('');
  const [apptDate, setApptDate] = useState('2026-06-15');
  const [apptTime, setApptTime] = useState('10:00 AM');
  const [apptType, setApptType] = useState<'Video Call' | 'In-Clinic' | 'Chat'>('In-Clinic');
  const [apptReason, setApptReason] = useState('');
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);

  // Appointment payment states
  const [bookingPayState, setBookingPayState] = useState<'editing' | 'paying' | 'confirmed'>('editing');
  const [bookingCardNumber, setBookingCardNumber] = useState('');
  const [bookingCardExpiry, setBookingCardExpiry] = useState('');
  const [bookingCardCVV, setBookingCardCVV] = useState('');
  const [isProcessingBookingPayment, setIsProcessingBookingPayment] = useState(false);
  const [generatedApptReceipt, setGeneratedApptReceipt] = useState<any>(null);
  const [checkoutDetail, setCheckoutDetail] = useState<any>(null);

  // Simulated PDF Downloader
  const [downloadMsg, setDownloadMsg] = useState('');
  const [shareMsg, setShareMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail === patient.email && loginPass === 'password') {
      setAuthScreen('dashboard');
      setLoginErr('');
    } else {
      setLoginErr(t.loginError);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (regName && regEmail && regPhone && regPassword) {
      onRegisterPatient({
        id: 'pat-' + Math.floor(Math.random() * 1000),
        name: regName,
        email: regEmail,
        phone: regPhone,
        age: regAge,
        gender: regGender,
        bloodGroup: regBlood,
        allergies: []
      });
      setIsRegSuccess(true);
      setTimeout(() => {
        setIsRegSuccess(false);
        setAuthScreen('login');
      }, 2500);
    }
  };

  const calcBookingBreakdown = (docFeeInput: number, consType: 'Video Call' | 'In-Clinic' | 'Chat') => {
    const docFee = docFeeInput;
    const portalFee = 100;
    const otherCharges = consType === 'In-Clinic' ? 150 : 0;
    const isGstApplicable = consType === 'In-Clinic';
    const gstRate = isGstApplicable ? 0.18 : 0;
    const gstAmount = Math.round((docFee + portalFee + otherCharges) * gstRate);
    const totalAmount = docFee + portalFee + otherCharges + gstAmount;

    return {
      docFee,
      portalFee,
      otherCharges,
      gstAmount,
      totalAmount
    };
  };

  const handleBookAppt = (e: React.FormEvent) => {
    e.preventDefault();
    const doc = doctors.find(d => d.id === selectedDocId);
    if (!doc) return;

    const breakdown = calcBookingBreakdown(doc.fee, apptType);
    setCheckoutDetail({
      doctorName: doc.name,
      specialization: doc.specialization,
      date: apptDate,
      timeSlot: apptTime,
      type: apptType,
      ...breakdown
    });

    setBookingPayState('paying');
  };

  const handleConfirmPayAppt = () => {
    if (!selectedDocId || !checkoutDetail) return;
    setIsProcessingBookingPayment(true);

    setTimeout(() => {
      setIsProcessingBookingPayment(false);
      setBookingPayState('confirmed');

      const doc = doctors.find(d => d.id === selectedDocId);
      if (!doc) return;

      onBookAppointment({
        doctorId: doc.id,
        doctorName: doc.name,
        specialization: doc.specialization,
        hospital: doc.hospital,
        date: apptDate,
        timeSlot: apptTime,
        consultationType: apptType,
        reason: apptReason || 'Physician Consultation Authorization'
      });

      const invoiceNum = 'INV-' + Math.floor(10000 + Math.random() * 90000);
      const newPaidInvoice: BillingInvoice = {
        id: 'inv-' + Math.floor(100 + Math.random() * 900),
        patientId: patient.id,
        serviceName: `${apptType} Consultation Booking (Dr. ${doc.name.replace('Dr. ', '')})`,
        provider: doc.hospital,
        amount: checkoutDetail.totalAmount,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Paid',
        invoiceNo: invoiceNum
      };

      if (onAddInvoice) {
        onAddInvoice(newPaidInvoice);
      }

      setGeneratedApptReceipt({
        invoiceNo: invoiceNum,
        doctorName: doc.name,
        specialization: doc.specialization,
        hospital: doc.hospital,
        date: apptDate,
        timeSlot: apptTime,
        type: apptType,
        totalAmount: checkoutDetail.totalAmount
      });
    }, 1500);
  };

  const handleResetAfterConfirmation = () => {
    setBookingPayState('editing');
    setCheckoutDetail(null);
    setGeneratedApptReceipt(null);
    setSelectedDocId('');
    setApptReason('');
    setBookingCardNumber('');
    setBookingCardExpiry('');
    setBookingCardCVV('');
    setActiveTab('home');
  };

  const triggerPDFDownload = (report: MedicalReport) => {
    setDownloadMsg(`Signed Medical Report PDF Generated for ${report.title}. Secure clinical transmission finalized.`);
    setTimeout(() => setDownloadMsg(''), 4500);
  };

  const triggerShare = (report: MedicalReport) => {
    setShareMsg(`Encrypted report payload securely dispatched to Specialist consultant - Dr. Siddhartha Rao's node.`);
    setTimeout(() => setShareMsg(''), 4500);
  };

  const executeMockPayment = () => {
    setIsPayingActiveStr('processing');
    setTimeout(() => {
      setIsPayingActiveStr('done');
      if (payingInvoice) {
        onPayInvoice(payingInvoice.id);
      }
      setTimeout(() => {
        setIsPayingActiveStr('idle');
        setPayingInvoice(null);
      }, 1500);
    }, 2000);
  };

  // Auth screen routers
  if (authScreen === 'login') {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1">{t.loginTitle}</h2>
        <p className="text-xs text-slate-500 text-center mb-6">{t.loginSubtitle}</p>
        
        {loginErr && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold py-2 px-3 rounded-xl border border-red-100 mb-4 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{loginErr}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email Node Address</label>
            <input 
              type="email" 
              required
              placeholder="kshitij.reddy@gmail.com"
              value={loginEmail} 
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">Security Password</label>
              <button type="button" onClick={() => setAuthScreen('forgot')} className="text-xs text-emerald-600 hover:underline font-bold">{t.forgotPass}</button>
            </div>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              value={loginPass} 
              onChange={(e) => setLoginPass(e.target.value)}
              className="w-full text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
            Validate Credentials
          </button>
        </form>
        <div className="text-center mt-6 pt-6 border-t border-slate-100">
          <button onClick={() => setAuthScreen('register')} className="text-xs text-slate-500 font-semibold hover:text-slate-800">
            {t.noAccount}
          </button>
        </div>
      </div>
    );
  }

  if (authScreen === 'register') {
    return (
      <div className="max-w-lg mx-auto my-12 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1">{t.registerTitle}</h2>
        <p className="text-xs text-slate-500 text-center mb-6">{t.registerSubtitle}</p>

        {isRegSuccess && (
          <div className="bg-emerald-50 text-emerald-700 text-xs font-semibold py-2 px-3 rounded-xl border border-emerald-100 mb-4">
            ✓ Smart Registry Authorized. Redirecting to login...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
              <input 
                type="text" required placeholder="Kshitij Reddy"
                value={regName} onChange={(e) => setRegName(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email ID</label>
              <input 
                type="email" required placeholder="kshitij@example.com"
                value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t.phoneNo}</label>
              <input 
                type="tel" required placeholder="9848022338"
                value={regPhone} onChange={(e) => setRegPhone(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t.age}</label>
              <input 
                type="number" required min="1" max="120"
                value={regAge} onChange={(e) => setRegAge(Number(e.target.value))}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">{t.gender}</label>
              <select 
                value={regGender} onChange={(e) => setRegGender(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 bg-white"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Blood Group</label>
              <input 
                type="text" required placeholder="O+"
                value={regBlood} onChange={(e) => setRegBlood(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Create Access Password</label>
              <input 
                type="password" required placeholder="••••••••"
                value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold text-sm rounded-xl hover:bg-emerald-500 transition-all cursor-pointer">
            Authorize & Create ID
          </button>
        </form>
        <div className="text-center mt-6 pt-6 border-t border-slate-100">
          <button onClick={() => setAuthScreen('login')} className="text-xs text-slate-500 font-semibold hover:text-slate-800">
            {t.haveAccount}
          </button>
        </div>
      </div>
    );
  }

  if (authScreen === 'forgot') {
    return (
      <div className="max-w-md mx-auto my-16 bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center mb-1">Reset Health Pass</h2>
        <p className="text-xs text-slate-500 text-center mb-6">Enter registered clinical email address and we will dispatch a secure token link.</p>
        
        <form onSubmit={(e) => { e.preventDefault(); setAuthScreen('login'); }} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Email ID</label>
            <input 
              type="email" required placeholder="kshitij.reddy@gmail.com"
              className="w-full text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-slate-950 text-white font-bold text-sm rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
            {t.resetPassBtn}
          </button>
        </form>
        <div className="text-center mt-6 pt-6 border-t border-slate-100">
          <button onClick={() => setAuthScreen('login')} className="text-xs text-slate-500 font-medium hover:text-slate-800">
            {t.backToLogin}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      
      {/* Patient Welcome Dashboard Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl overflow-hidden mb-8 relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Active Clinical Session</span>
          </div>
          <h2 className="text-3xl font-extrabold leading-none mb-2">{t.welcomeBack}, {patient.name}!</h2>
          <p className="text-slate-400 text-xs font-medium">Secondary Health Id Card Node: <strong className="font-mono text-white">AR-PAT-101</strong></p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold text-slate-300">
            <span>🩸 Blood: <strong className="text-white">{patient.bloodGroup}</strong></span>
            <span>🎂 {patient.age} Yrs ({patient.gender})</span>
            <span>🔋 Connection: Secured</span>
          </div>
        </div>
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 grid grid-cols-2 gap-4 text-center shrink-0">
          <div className="border-r border-white/5 pr-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Systolic Baseline</span>
            <div className="text-lg font-mono font-extrabold text-emerald-400 mt-1">118 / 76 mmHg</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Heartbeat Cycle</span>
            <div className="text-lg font-mono font-extrabold text-emerald-400 mt-1 flex items-center justify-center gap-1">
              <span className="animate-ping h-2.5 w-2.5 rounded-full bg-red-500 inline-block"></span>
              <span>72 BPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Dashboard widgets */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 mb-8 overflow-x-auto scrollbar-none shrink-0">
        <button 
          onClick={() => setActiveTab('home')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'home' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-955'}`}
        >
          {t.healthSummary}
        </button>
        <button 
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'reports' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-955'}`}
        >
          {t.labReports}
        </button>
        <button 
          onClick={() => setActiveTab('conditions')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'conditions' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-955'}`}
        >
          {t.diagnosedConditions}
        </button>
        <button 
          onClick={() => setActiveTab('book')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'book' ? 'bg-slate-900 text-white shadow-xs bg-emerald-500' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-955'}`}
        >
          🩺 {t.bookDoctor}
        </button>
        <button 
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'billing' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-955'}`}
        >
          💳 Billing & Claims
        </button>
      </div>

      {/* TAB CONTENT SPACES */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: SUMMARY / DASHBOARD WIDGETS */}
        {activeTab === 'home' && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Column Left (Lab items & appointments) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Widget: Upcoming Appointments */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-indigo-500" />
                    <span>{t.upcomingApps}</span>
                  </h3>
                  <button onClick={() => setActiveTab('book')} className="text-xs font-bold text-emerald-600 hover:underline">Book New Slot</button>
                </div>

                <div className="space-y-4">
                  {appointments.length > 0 ? (
                    appointments.map((appt) => (
                      <div 
                        key={appt.id}
                        className="bg-slate-50 hover:bg-slate-100/70 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-sm">{appt.doctorName}</h4>
                            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase">{appt.consultationType}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{appt.specialization} | {appt.hospital}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-600 font-semibold mt-3">
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> {appt.date} • {appt.timeSlot}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            appt.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                            appt.status === 'Pending' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                            appt.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {appt.status}
                          </span>
                          {appt.status !== 'Rejected' && appt.status !== 'Completed' && (
                            <button 
                              onClick={() => onCancelAppointment(appt.id)}
                              className="px-2.5 py-1 rounded-lg border border-red-200 hover:bg-red-50 text-[10px] font-bold text-red-600 transition-all"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-slate-500 text-xs font-semibold">
                      No clinical appointments scheduled. Book specialists below.
                    </div>
                  )}
                </div>
              </div>

              {/* Widget: Active Prescriptions */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
                <h3 className="font-extrabold text-slate-900 text-base mb-5 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-500" />
                  <span>{t.activePrescriptions}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {prescriptions.map((rx) => (
                    <div key={rx.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:scale-[1.01] transition-transform">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-slate-900 text-sm truncate max-w-[70%]">{rx.medicineName}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                          rx.refillStatus === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                          rx.refillStatus === 'Refilled' ? 'bg-teal-100 text-teal-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {rx.refillStatus}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 space-y-1">
                        <p>{t.dosage}: {rx.dosage}</p>
                        <p>{t.frequency}: {rx.frequency}</p>
                        <p>{t.duration}: {rx.duration}</p>
                        <p className="border-t border-slate-200/60 pt-1.5 mt-1.5 text-[10px] uppercase block font-mono text-slate-400">Prescribed: {rx.doctorName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Column Right (Vitals checklist / notifications) */}
            <div className="space-y-8">
              
              {/* Widget: Allergies and Health notes */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
                <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                  <span>Allergies & Sensitivities</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {patient.allergies?.map((alg) => (
                    <span key={alg} className="px-3 py-1 rounded-lg bg-red-50 text-red-600 border border-red-100 text-xs font-extrabold">{alg}</span>
                  ))}
                  <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">Sulfonamide (Clear)</span>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                  <strong>Advice Notice:</strong> Ensure penicillin allergy tags are disclosed prior to any minor surgical parameters or ICU dispatches.
                </div>
              </div>

              {/* Widget: Outstanding Bills Summary */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-extrabold text-slate-900 text-base">Invoices Summary</h3>
                  <button onClick={() => setActiveTab('billing')} className="text-xs font-bold text-emerald-600 hover:underline">Pay/View</button>
                </div>
                <div className="space-y-3">
                  {invoices.filter(i => i.status !== 'Paid').map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{inv.serviceName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono block">₹ {inv.amount}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold ${
                        inv.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                        inv.status === 'Insurance Claim' ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: ELECTRONIC LAB REPORTS */}
        {activeTab === 'reports' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {downloadMsg && (
              <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-xl border border-emerald-100">
                ✓ {downloadMsg}
              </div>
            )}
            {shareMsg && (
              <div className="bg-indigo-50 text-indigo-700 text-xs font-bold p-3 rounded-xl border border-indigo-100">
                ✓ {shareMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report) => (
                <div 
                  key={report.id}
                  className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">{report.type}</span>
                        <h3 className="font-extrabold text-slate-900 text-base mt-1">{report.title}</h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-extrabold ${
                        report.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100/60 mb-4">
                      {report.summary}
                    </p>

                    {/* Quick values preview */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">Key Biomarkers Baseline</div>
                      {report.metrics.slice(0, 3).map((metric, mi) => (
                        <div key={mi} className="flex justify-between text-xs font-medium border-b border-slate-50 pb-1.5 last:border-0">
                          <span className="text-slate-500">{metric.name}</span>
                          <span className={metric.status === 'high' ? 'text-rose-600 font-extrabold' : 'text-slate-800 font-semibold'}>
                            {metric.value} <span className="text-[10px] text-slate-400">({metric.reference})</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-5 mt-6 flex flex-wrap gap-2 justify-between">
                    <button 
                      onClick={() => setSelectedReport(report)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-extrabold text-white transition-all cursor-pointer"
                    >
                      Audit Details
                    </button>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => triggerPDFDownload(report)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all flex items-center gap-1.5 text-xs font-bold"
                        title={t.downloadReport}
                      >
                        <Download className="h-4 w-4" />
                        <span>PDF</span>
                      </button>
                      <button 
                        onClick={() => triggerShare(report)}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all flex items-center gap-1.5 text-xs font-bold"
                        title={t.shareReport}
                      >
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 3: DIAGNOSED CLINICAL CONDITIONS */}
        {activeTab === 'conditions' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs"
          >
            <h3 className="font-extrabold text-slate-900 text-base mb-6">{t.diagnosedConditions}</h3>
            
            <div className="space-y-6">
              {conditions.map((cond) => (
                <div 
                  key={cond.id}
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 text-base">{cond.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase ${
                        cond.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                        cond.severity === 'Moderate' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {t.severity}: {cond.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-2">{cond.notes}</p>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mt-3">
                      {t.lastUpdated}: {cond.lastUpdated}
                    </span>
                  </div>

                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 ${
                    cond.status === 'Active' ? 'bg-red-50 text-red-700 border border-red-100 animate-pulse' :
                    cond.status === 'Monitored' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cond.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: APPOINTMENT SCHEDULER */}
        {activeTab === 'book' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Quick list of specialists */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Select Specialist Consultant</h3>
              {doctors.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`bg-white p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedDocId === doc.id ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/30' : 'border-slate-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={doc.photo} alt={doc.name} className="h-10 w-10 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-950 text-xs sm:text-sm">{doc.name}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold">{doc.specialization}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-3 font-semibold">
                    <span>★ {doc.rating}</span>
                    <span>Fee: ₹ {doc.fee}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Form Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-6">Confirm Appointment Protocol</h3>

              {isBookedSuccess && (
                <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-xl border border-emerald-100 mb-6 font-mono">
                  ✓ Booking successfully completed! Request sent for physician authorization update.
                </div>
              )}

              {bookingPayState === 'editing' && (
                <form onSubmit={handleBookAppt} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Date selection</label>
                      <input 
                        type="date"
                        required
                        value={apptDate}
                        onChange={(e) => setApptDate(e.target.value)}
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Time Slot selection</label>
                      <select
                        value={apptTime}
                        onChange={(e) => setApptTime(e.target.value)}
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden bg-white"
                      >
                        <option>09:30 AM</option>
                        <option>10:30 AM</option>
                        <option>11:30 AM</option>
                        <option>02:30 PM</option>
                        <option>03:30 PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Consultation Class</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['In-Clinic', 'Video Call', 'Chat'].map((cls) => (
                        <button
                          key={cls}
                          type="button"
                          onClick={() => setApptType(cls as any)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            apptType === cls ? 'bg-slate-900 text-white border-slate-950' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {cls}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Reason for consultation</label>
                    <textarea
                      required
                      placeholder="Describe current diagnostic discomfort details..."
                      rows={3}
                      value={apptReason}
                      onChange={(e) => setApptReason(e.target.value)}
                      className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden resize-none"
                    ></textarea>
                  </div>

                  {selectedDocId && (() => {
                    const doc = doctors.find(d => d.id === selectedDocId);
                    if (!doc) return null;
                    const breakdown = calcBookingBreakdown(doc.fee, apptType);
                    return (
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs font-semibold">
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold flex items-center gap-1">
                          <CreditCard className="h-4 w-4 text-emerald-600" />
                          Live Consultation Cost Projection
                        </div>
                        <div className="h-px bg-slate-200/50 my-2"></div>
                        
                        <div className="flex justify-between text-slate-600">
                          <span>Consultation Doctor Fee (Dr. {doc.name.replace('Dr. ', '')})</span>
                          <span className="text-slate-900 font-bold">₹ {breakdown.docFee}</span>
                        </div>

                        <div className="flex justify-between text-slate-600">
                          <span>Aristotle Care Portal Fee</span>
                          <span className="text-slate-900 font-bold">₹ {breakdown.portalFee}</span>
                        </div>

                        {apptType === 'In-Clinic' && (
                          <div className="flex justify-between text-slate-600">
                            <span>Clinic Hygiene & Sanitation Charges</span>
                            <span className="text-slate-900 font-bold">₹ {breakdown.otherCharges}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-slate-600">
                          <span>HIPAA Compliance Tax / GST {apptType === 'In-Clinic' ? '(18%)' : '(0% Exempt)'}</span>
                          <span className="text-slate-900 font-bold">
                            {breakdown.gstAmount > 0 ? `₹ ${breakdown.gstAmount}` : '₹ 0 (No GST)'}
                          </span>
                        </div>

                        <div className="h-px bg-slate-200/50 my-2"></div>

                        <div className="flex justify-between text-slate-900 text-xs sm:text-sm font-extrabold">
                          <span>Total Due Balance</span>
                          <span className="text-emerald-600">₹ {breakdown.totalAmount}</span>
                        </div>
                      </div>
                    );
                  })()}

                  <button
                    type="submit"
                    disabled={!selectedDocId}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Secured Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}

              {bookingPayState === 'paying' && checkoutDetail && (
                <div className="space-y-4">
                  <div className="bg-slate-900 text-white rounded-2xl p-5 border border-white/5 space-y-4 shadow-xl">
                    <div className="flex items-center gap-1.5 pb-2 border-b border-white/10 overflow-hidden">
                      <CreditCard className="h-5 w-5 text-emerald-400" />
                      <h4 className="font-extrabold text-xs sm:text-sm text-white tracking-tight uppercase">Aristotle Exchange Secure Gateway</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">Physician Link</span>
                        <span className="text-white font-bold">{checkoutDetail.doctorName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-mono">Authorized Slot</span>
                        <span className="text-white font-bold">{checkoutDetail.date} @ {checkoutDetail.timeSlot}</span>
                      </div>
                    </div>

                    <div className="bg-white/[0.03] p-4 rounded-xl space-y-2 text-xs font-semibold">
                      <div className="flex justify-between text-slate-400">
                        <span>Base Consultation Billing</span>
                        <span className="text-slate-200">₹ {checkoutDetail.docFee}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Platform Administration Fee</span>
                        <span className="text-slate-200">₹ {checkoutDetail.portalFee}</span>
                      </div>
                      {checkoutDetail.otherCharges > 0 && (
                        <div className="flex justify-between text-slate-400">
                          <span>Clinic Sanitation</span>
                          <span className="text-slate-200">₹ {checkoutDetail.otherCharges}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-slate-400">
                        <span>GST Tax Ledger</span>
                        <span className="text-slate-200">{checkoutDetail.gstAmount > 0 ? `₹ ${checkoutDetail.gstAmount}` : '₹ 0 (No GST)'}</span>
                      </div>
                      <div className="h-px bg-white/10 my-2"></div>
                      <div className="flex justify-between text-sm font-extrabold text-white">
                        <span>Sum Total Secured Balance</span>
                        <span className="text-emerald-400">₹ {checkoutDetail.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Sandbox credentials visualizer */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    <h4 className="font-extrabold text-xs text-slate-900 uppercase">Input Authorization Card</h4>

                    <div className="bg-slate-200/50 rounded-xl p-3 flex justify-between items-center text-xs text-slate-600 font-semibold gap-3">
                      <div>
                        <span className="text-[9px] text-slate-500 block">Simulated Sandbox Card</span>
                        <span className="font-mono">4111 2222 3333 4444 • CVV 123</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingCardNumber('4111222233334444');
                          setBookingCardExpiry('12/29');
                          setBookingCardCVV('123');
                        }}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all shrink-0 font-sans"
                      >
                        Autofill
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Card Number</label>
                        <input
                          type="text"
                          required
                          maxLength={19}
                          placeholder="4111 2222 3333 4444"
                          value={bookingCardNumber}
                          onChange={(e) => setBookingCardNumber(e.target.value)}
                          className="w-full text-zinc-900 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">Expiry Date</label>
                          <input
                            type="text"
                            required
                            placeholder="MM/YY"
                            maxLength={5}
                            value={bookingCardExpiry}
                            onChange={(e) => setBookingCardExpiry(e.target.value)}
                            className="w-full text-zinc-900 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-600 block mb-1">CVC Code</label>
                          <input
                            type="password"
                            required
                            placeholder="•••"
                            maxLength={3}
                            value={bookingCardCVV}
                            onChange={(e) => setBookingCardCVV(e.target.value)}
                            className="w-full text-zinc-900 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setBookingPayState('editing')}
                      className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl font-extrabold text-xs transition-colors cursor-pointer text-center"
                    >
                      Return to Form
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingBookingPayment || !bookingCardNumber}
                      onClick={handleConfirmPayAppt}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-extrabold text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      {isProcessingBookingPayment ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Validating Gateway...</span>
                        </>
                      ) : (
                        <span>Verify & Pay ₹{checkoutDetail.totalAmount}</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {bookingPayState === 'confirmed' && generatedApptReceipt && (
                <div className="text-center p-6 space-y-6 bg-emerald-50/55 rounded-3xl border border-emerald-100/60 transition-all font-sans">
                  <div className="inline-flex items-center justify-center h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full shadow-xs">
                    <CheckCircle2 className="h-10 w-10 animate-[bounce_1s]" />
                  </div>
                  <div>
                    <h3 className="font-black text-emerald-900 text-xl tracking-tight animate-fade-in">Booking Payment Cleared!</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">✓ Secured clearance completed. Receipt successfully dispatched to billing history.</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 text-left space-y-3 shadow-2xs divide-y divide-slate-100/60">
                    <div className="pb-3 flex justify-between items-center">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-mono">Invoice Reference</span>
                        <span className="text-xs font-bold text-slate-800 font-mono uppercase">{generatedApptReceipt.invoiceNo}</span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[9px] uppercase font-mono font-black rounded-full">Cleared Paid</span>
                    </div>

                    <div className="py-3 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Physician Link</span>
                        <span className="font-bold text-slate-800">{generatedApptReceipt.doctorName}</span>
                        <p className="text-[10px] text-slate-500 font-semibold">{generatedApptReceipt.specialization}</p>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Schedule Token</span>
                        <span className="font-bold text-slate-800">{generatedApptReceipt.date}</span>
                        <p className="text-[10px] text-slate-500 font-semibold font-mono">{generatedApptReceipt.timeSlot}</p>
                      </div>
                    </div>

                    <div className="pt-3 flex justify-between text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Consultation Class</span>
                        <span className="font-bold text-slate-800">{generatedApptReceipt.type}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-bold">Total Settled</span>
                        <span className="font-black text-emerald-600 text-base font-mono">₹ {generatedApptReceipt.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetAfterConfirmation}
                    className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md"
                  >
                    Finish & Retrack Dashboard
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* TAB 5: BILLING AND PAYMENTS HISTORY */}
        {activeTab === 'billing' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Invoice payment popup simulation */}
            {payingInvoice && (
              <div className="bg-slate-900 text-white p-6 rounded-3xl border border-white/5 shadow-xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">Invoice Protocol: {payingInvoice.invoiceNo}</span>
                    <h4 className="font-bold text-white text-base mt-0.5">{payingInvoice.serviceName}</h4>
                  </div>
                  <span className="font-extrabold text-emerald-400 text-lg">₹ {payingInvoice.amount}</span>
                </div>
                
                {isPayingActiveStr === 'processing' ? (
                  <div className="space-y-2 py-4">
                    <div className="text-xs text-slate-400 text-center animate-pulse">Establishing secured payment vault bridge...</div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 animate-[pulse_1s_infinite] w-3/4"></div>
                    </div>
                  </div>
                ) : isPayingActiveStr === 'done' ? (
                  <div className="text-center py-4 text-emerald-400 text-xs font-bold">
                    ✓ Secured Clearance Confirmed! Revenue ledger updated successfully.
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={executeMockPayment}
                      className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white transition-all cursor-pointer"
                    >
                      Process Payment (₹ {payingInvoice.amount})
                    </button>
                    <button 
                      onClick={() => setPayingInvoice(null)}
                      className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 font-bold text-xs text-slate-400 transition-all cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs">
              <h3 className="font-extrabold text-slate-900 text-base mb-6">Financial Ledger & Insurance Claims</h3>

              <div className="space-y-4">
                {invoices.map((inv) => (
                  <div 
                    key={inv.id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-100/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{inv.invoiceNo}</span>
                        <h4 className="font-bold text-slate-950 text-sm mt-0.5">{inv.serviceName}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold">{inv.provider} | Date: {inv.date}</p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 text-base block">₹ {inv.amount}</span>
                        <span className="text-[9px] text-slate-400 font-semibold block">Due: {inv.dueDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' :
                          inv.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          inv.status === 'Insurance Claim' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inv.status}
                        </span>
                        {inv.status !== 'Paid' && inv.status !== 'Insurance Claim' && (
                          <button 
                            onClick={() => setPayingInvoice(inv)}
                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold text-white rounded-lg transition-all"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* FULL REPORT DETAIL MODAL VIEW */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-slate-100"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                <div>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase">{selectedReport.type}</span>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-1">{selectedReport.title}</h3>
                  <span className="text-xs text-slate-400 font-semibold mt-0.5 block">Physician: {selectedReport.doctorName} • Created {selectedReport.date}</span>
                </div>
                <button onClick={() => setSelectedReport(null)} className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400 flex items-center justify-center font-bold font-mono">×</button>
              </div>

              <div className="space-y-5">
                <div>
                  <h4 className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-1">Clinical Laboratory Summary</h4>
                  <p className="text-slate-600 text-sm leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                    {selectedReport.summary}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-mono font-bold uppercase text-slate-400 mb-2">Metrics Analysis Ledger</h4>
                  <div className="space-y-2">
                    {selectedReport.metrics.map((met, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100/55">
                        <span className="text-xs font-semibold text-slate-600">{met.name}</span>
                        <div className="text-right">
                          <span className={`text-xs font-extrabold ${met.status === 'high' ? 'text-red-600' : 'text-slate-800'}`}>
                            {met.value}
                          </span>
                          <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Ref: {met.reference}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100/80 flex items-center gap-3">
                  <button 
                    onClick={() => { triggerPDFDownload(selectedReport); setSelectedReport(null); }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 font-extrabold text-xs sm:text-sm text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Signed Authenticated PDF Document</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
