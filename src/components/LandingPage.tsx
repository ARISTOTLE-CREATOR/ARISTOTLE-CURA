import React, { useState } from 'react';
import { translations } from '../translations';
import { Doctor, Language } from '../types';
import { demoDoctors, faqs } from '../demoData';
import { 
  Flame, CheckCircle2, Star, ShieldAlert, PhoneCall, 
  MapPin, Stethoscope, Award, Heart, HeartPulse, Send, 
  ChevronDown, Search, ArrowRight, Ambulance, Activity, CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  currentLang: Language;
  onNavigateToAmbulanceBooking: () => void;
  onNavigateToDoctorBooking: (doctor: Doctor) => void;
  onNavigateToPatientPortal: () => void;
  onSpecializationSelect?: (spec: string) => void;
}

export default function LandingPage({
  currentLang,
  onNavigateToAmbulanceBooking,
  onNavigateToDoctorBooking,
  onNavigateToPatientPortal
}: LandingPageProps) {
  const t = translations[currentLang];
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [searchDoc, setSearchDoc] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  
  // Contact Form Simulated State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const specialties = ['All', 'Cardiologist', 'Dermatologist', 'Neurologist', 'Orthopedic Specialist'];

  const filteredDoctors = demoDoctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchDoc.toLowerCase()) || 
                          doc.specialization.toLowerCase().includes(searchDoc.toLowerCase()) ||
                          doc.hospital.toLowerCase().includes(searchDoc.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' ? true : doc.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail && contactMessage) {
      setIsSubmitSuccess(true);
      setTimeout(() => {
        setIsSubmitSuccess(false);
        setContactName('');
        setContactEmail('');
        setContactMessage('');
      }, 3500);
    }
  };

  return (
    <div className="w-full bg-slate-50 text-slate-800 grid-pattern min-h-screen">
      
      {/* SECTION 1: HERO CONTAINER */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 -z-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 -z-10 h-80 w-80 rounded-full bg-indigo-400/10 blur-3xl"></div>

        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-6 shadow-sm"
          >
            <Activity className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            <span>ARISTOTLE Smart Healthcare Systems</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6"
            id="hero-main-title"
          >
            Healthcare <span className="bg-gradient-to-r from-emerald-600 to-indigo-700 bg-clip-text text-transparent">{t.tagline}</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
          >
            {t.connecting}
          </motion.p>

          {/* Call-to-actions (Direct Navigation Cards) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
          >
            {/* Primary: Ambulance */}
            <button
              onClick={onNavigateToAmbulanceBooking}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-red-600 text-white font-bold text-base hover:bg-red-700 shadow-xl shadow-red-200 transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-2"
              id="cta-emergency-ambulance"
            >
              <Ambulance className="h-5 w-5 animate-bounce" />
              <span>{t.requestAmbulance}</span>
            </button>

            {/* Secondary: Book Doctor */}
            <button
              onClick={() => {
                const element = document.getElementById('doctor-discovery-system');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-emerald-700 font-bold text-base border-2 border-emerald-100 hover:border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-2"
              id="cta-book-doctor-discovery"
            >
              <Stethoscope className="h-5 w-5 text-emerald-600" />
              <span>{t.bookDoctor}</span>
            </button>

            {/* Third: Patient Portal */}
            <button
              onClick={onNavigateToPatientPortal}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-950 text-white font-bold text-base shadow-lg hover:bg-indigo-900 transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-2"
              id="cta-patient-portal-direct"
            >
              <ArrowRight className="h-5 w-5 text-indigo-400" />
              <span>{t.patientPortal}</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: LIVE STATISTICS SECTION */}
      <section className="py-12 bg-white/60 border-y border-slate-100 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Active Ambulances */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs"
            >
              <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shrink-0">
                <Ambulance className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">42 + Active</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">{t.statActiveAmbulances}</div>
              </div>
            </motion.div>

            {/* Consultations */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs"
            >
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">18,500 +</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">{t.statConsultations}</div>
              </div>
            </motion.div>

            {/* Associated Hospitals */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs"
            >
              <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                <HeartPulse className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">84 facilities</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">{t.statHospitals}</div>
              </div>
            </motion.div>

            {/* Lives Saved */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-xs"
            >
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">3,420 Lives</div>
                <div className="text-xs font-semibold text-slate-500 mt-0.5">{t.statRecovered}</div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SECTION 3: CORE FEATURES OVERVIEW */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-600 text-xs font-extrabold tracking-widest uppercase">Ecosystem Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
            Unified Patient-First Coordination
          </h2>
          <p className="text-slate-600 font-medium">
            Discover a medical pipeline that replaces disjointed charts, hospital delays, and slow dispatches with an integrated responsive platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Patients */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 font-bold text-xl">01</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Intelligent Patient Portals</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Access active medical indices, view certified lab reports (Blood, ECG, MRI, X-Ray) instantly, read clear physician drug guidelines, and trace outstanding logs.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Electronic Health summaries</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Diagnostic PDF distribution</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Seamless billing clearance</li>
            </ul>
          </div>

          {/* Card 2: Doctors */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 font-bold text-xl">02</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Specialist Doctor Consoles</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Equip physicians with state-of-the-art schedule configurators, dynamic booking approve/reject toggles, and rich visual telemetry showing historical patient reports.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> Fast calendar adjustments</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> Interactive patient chart lookups</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> Approved real-time notifications</li>
            </ul>
          </div>

          {/* Card 3: Emergency Ambulances */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 font-bold text-xl">03</div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Flagship Ambulance Dispatch</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Request GPS critical vectors without logging in. View direct telemetry, ambulance ETA countdowns, driver radiophone links, and vehicle license trackers immediately.
            </p>
            <ul className="space-y-2 text-xs font-semibold text-slate-500">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-red-500" /> Direct guest hotline dispatches</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-red-500" /> 5-stage status progress tracking</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-red-500" /> Special clinical cargo options</li>
            </ul>
          </div>

        </div>
      </section>

      {/* SECTION 4: FLAGSHIP EMERGENCY AMBULANCE LAUNCH BANNER */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-rose-700 text-white overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
        <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold uppercase mb-4 tracking-widest">
            <Flame className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
            <span>ARISTOTLE Premium Emergency Link</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Under 8.5 Minute Target Response Speed
          </h2>
          <p className="text-red-100 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-medium">
            Our specialized fleet of Basic Life Support, ICU, and Neonatal carriers are dynamically balanced across urban hubs. Request immediate transport instantly without requiring patient credentials.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onNavigateToAmbulanceBooking}
              className="px-8 py-4 rounded-xl bg-white text-red-700 font-extrabold hover:bg-slate-50 transition-all duration-300 shadow-xl hover:scale-105"
            >
              {t.requestAmbulance}
            </button>
            <div className="flex items-center gap-2 text-red-100 text-sm font-semibold">
              <PhoneCall className="h-4 w-4 text-red-200" />
              <span>Direct Link Line: 108-ARISTOTLE</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: DOCTOR DISCOVERY SYSTEM & PROFILES */}
      <section id="doctor-discovery-system" className="py-20 px-4 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-emerald-600 text-xs font-extrabold tracking-widest uppercase">{t.doctors}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
            Discover Medical Experts
          </h2>
          <p className="text-slate-600 font-medium">
            Narrow down certified specialists, filter by diagnostic hospital or consultation rate, audit patient satisfaction ratings, and map immediate appointment calendars.
          </p>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm max-w-5xl mx-auto mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
            <input
              type="text"
              placeholder="Search by specialty, doctor name, or medical institute..."
              value={searchDoc}
              onChange={(e) => setSearchDoc(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 font-medium text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1 scrollbar-thin">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedSpecialty === spec 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => (
              <div 
                key={doc.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group"
                id={`doc-discovery-card-${doc.id}`}
              >
                {/* Image */}
                <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
                  <img 
                    src={doc.photo} 
                    alt={doc.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-white/90 backdrop-blur-xs text-[10px] font-bold text-slate-800 flex items-center gap-1 shadow-xs">
                    <Star className="h-3 w-3 fill-amber-400 stroke-amber-400" />
                    <span>{doc.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-emerald-600 font-bold text-[10px] text-white tracking-wide uppercase">
                    {doc.specialization}
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{doc.name}</h3>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{doc.qualification}</p>

                  <div className="space-y-2 mt-4 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span>{doc.experience} Years Active Expert</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doc.location}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">Consultation Fee</span>
                      <span className="font-extrabold text-slate-900 text-lg">₹ {doc.fee}</span>
                    </div>
                    <button 
                      onClick={() => onNavigateToDoctorBooking(doc)}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-[11px] font-extrabold text-white transition-all duration-200"
                    >
                      Book Slot
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-500 font-medium">
              No medical experts matched your current search parameters.
            </div>
          )}
        </div>
      </section>

      {/* SECTION 6: PATIENT BENEFITS */}
      <section className="py-20 bg-slate-100/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-emerald-600 text-xs font-extrabold tracking-widest uppercase">Patient Benefits</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-6">
                Why Top Medical Professionals Recommend Aristotle
              </h2>
              <div className="space-y-6">
                
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                    <CheckSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Comprehensive Medical Passport</h3>
                    <p className="text-slate-600 text-sm mt-1">
                      No more physical folders. Your authenticated patient login houses diagnostic history, past imaging sessions (CT/X-ray), active prescriptions, and payments dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-1">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Secured GDPR & HIPAA Compliance</h3>
                    <p className="text-slate-600 text-sm mt-1">
                      All clinical reports are tightly sandboxed. Patient keys ensure laboratory results and active medicine lists are shared with consultants on a need-to-know basis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-1">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Active Emergency Synchronization</h3>
                    <p className="text-slate-600 text-sm mt-1">
                      When dispatches are requested, nearby emergency physicians automatically receive the critical classification list to enable rapid preparations prior to arrival.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-indigo-600 opacity-20 blur-xl"></div>
              <div className="relative bg-white p-6 rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">A</div>
                    <div>
                      <span className="font-bold text-slate-800 text-sm block">Simulated Passport</span>
                      <span className="text-[10px] font-mono text-slate-400">ID: AR-PAT-101</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">Live Node</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                      <span>PRIMARY BLOOD PANEL</span>
                      <span className="text-emerald-600">STABLE</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-emerald-500"></div>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                      <span>ST-ELEVATION VECTOR</span>
                      <span className="text-indigo-600">UNDER MONITORING</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-indigo-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: TESTIMONIALS */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-emerald-600 text-xs font-extrabold tracking-widest uppercase">{t.testimonials}</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2 mb-4">
            Trusted by Patients Across Telangana
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <p className="text-slate-600 text-sm italic leading-relaxed">
              "We initiated an ICU carrier link when my father reported heavy breathing and severe chest pain. The ARISTOTLE team updated the coordinates live, and the dispatch arrived in Madhapur within 7 minutes. Outstanding trust!"
            </p>
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="h-10 w-10 rounded-full bg-emerald-100 font-bold text-emerald-800 flex items-center justify-center text-xs">VR</div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Venkatesh Rao</h4>
                <span className="text-[10px] font-mono text-slate-400">Madhapur, Hyderabad</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <p className="text-slate-600 text-sm italic leading-relaxed">
              "Managing my diabetes prescription and MRI screening reports is seamless. The Telugu toggle is highly intuitive, allowing my grandmother to review daily dosage timings herself. Incredible startup value."
            </p>
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="h-10 w-10 rounded-full bg-indigo-100 font-bold text-indigo-800 flex items-center justify-center text-xs">SN</div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Sree Nidhi</h4>
                <span className="text-[10px] font-mono text-slate-400">Begumpet, Hyderabad</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs flex flex-col justify-between">
            <p className="text-slate-600 text-sm italic leading-relaxed">
              "The Doctor Hub has redesigned our clinical operations entirely. I can customize break timings, approve schedules in under two clicks, and review historical lab telemetry logs prior to the patient walk-in."
            </p>
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="h-10 w-10 rounded-full bg-purple-100 font-bold text-purple-800 flex items-center justify-center text-xs">SK</div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Dr. Siddhartha K.</h4>
                <span className="text-[10px] font-mono text-slate-400">Cardiologist (16 yrs exp)</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 8: FAQ ACCORDIONS */}
      <section className="py-20 bg-white/60 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <span className="text-emerald-600 text-xs font-extrabold tracking-widest uppercase">{t.faqs}</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2 mb-4">{t.faqTitle}</h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">{t.faqSubtitle}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 focus:outline-hidden"
                >
                  <span className="font-bold text-slate-800 text-sm sm:text-base">{item.q}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-300 ${activeFaq === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {activeFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9: CONTACT SYSTEM */}
      <section className="py-20 max-w-5xl mx-auto px-4">
        <div className="bg-indigo-950 text-white rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 sm:p-12 items-center">
            <div>
              <span className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Aristotle HQ</span>
              <h2 className="text-3xl font-extrabold text-white mt-1 mb-4">{t.contactTitle}</h2>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {t.contactSubtitle}
              </p>
              <div className="space-y-3 text-xs font-semibold text-slate-300">
                <p>📍 Tech Hub Node, Phase II, Hitec City, Hyderabad - 500081</p>
                <p>📧 partner@aristotle.health</p>
                <p>📞 +91 40 8891 4230</p>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-xs">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.fullName}</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-400 focus:bg-white/15"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.emailAddr}</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-400 focus:bg-white/15"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.phoneNo}</label>
                  <input
                    type="tel"
                    required
                    placeholder="9xxxxxxxxx"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-400 focus:bg-white/15"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">{t.message}</label>
                <textarea
                  required
                  rows={3}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-hidden focus:border-emerald-400 focus:bg-white/15 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold text-sm text-white transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>{t.sendMessage}</span>
              </button>

              <AnimatePresence>
                {isSubmitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-emerald-400 font-semibold text-center mt-2"
                  >
                    ✓ High-gravity audit message dispatched securely. Representative will respond within 4 hours.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION 10: FOOTER FOOTPRINT */}
      <footer className="py-12 bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-extrabold text-sm tracking-widest">{t.brand}</span>
            <span>| © 2026 ARISTOTLE Digital Health. All intellectual properties preserved.</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-white cursor-pointer transition-colors">GDPR Audit</span>
            <span className="hover:text-white cursor-pointer transition-colors">Clinical Security</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Operations</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
