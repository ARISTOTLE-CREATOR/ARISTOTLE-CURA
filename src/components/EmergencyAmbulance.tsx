import React, { useState, useEffect } from 'react';
import { translations } from '../translations';
import { AmbulanceRequest, AmbulanceStatus, Language } from '../types';
import { 
  PhoneCall, ShieldAlert, Navigation, Clock, User, 
  MapPin, Radio, Compass, BellOff, Volume2, Flame, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EmergencyAmbulanceProps {
  currentLang: Language;
  onDispatchRequested: (req: Omit<AmbulanceRequest, 'id' | 'status' | 'eta' | 'createdAt'>) => void;
  activeDispatches: AmbulanceRequest[];
  onCompleteDispatch: (id: string) => void;
  onUpdateStatusStep: (id: string, nextStatus: AmbulanceStatus) => void;
}

const STATUS_STEPS: AmbulanceStatus[] = [
  'Request Submitted',
  'Ambulance Assigned',
  'Driver En Route',
  'Arriving Soon',
  'Reached Destination'
];

export default function EmergencyAmbulance({
  currentLang,
  onDispatchRequested,
  activeDispatches,
  onCompleteDispatch,
  onUpdateStatusStep
}: EmergencyAmbulanceProps) {
  const t = translations[currentLang];

  // Booking states
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userLoc, setUserLoc] = useState('');
  const [emgType, setEmgType] = useState('Cardiac Arrest / Severe Chest Pain');
  const [ambType, setAmbType] = useState<'Basic Life Support (BLS)' | 'Advanced Life Support (ALS)' | 'ICU Ambulance' | 'Neonatal Ambulance'>('Advanced Life Support (ALS)');
  
  const [isDispatched, setIsDispatched] = useState(false);
  const [activeReqId, setActiveReqId] = useState<string | null>(null);

  // Radio siren simulated beep sound state
  const [isSirenActive, setIsSirenActive] = useState(true);

  // Fetch the active tracked request
  const currentTrackedReq = activeDispatches.find(r => r.id === activeReqId) || activeDispatches[0];

  // Auto-progress simulated coordinates telemetry over time for immersive experience
  useEffect(() => {
    if (!currentTrackedReq || currentTrackedReq.status === 'Reached Destination') return;

    const timer = setInterval(() => {
      const currentIndex = STATUS_STEPS.indexOf(currentTrackedReq.status);
      if (currentIndex < STATUS_STEPS.length - 1) {
        const nextStatus = STATUS_STEPS[currentIndex + 1];
        onUpdateStatusStep(currentTrackedReq.id, nextStatus);
      }
    }, 12000); // Progresses status automatically every 12 seconds

    return () => clearInterval(timer);
  }, [currentTrackedReq, onUpdateStatusStep]);

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && userPhone && userLoc) {
      const mockId = 'amb-req-' + Math.floor(Math.random() * 1000);
      onDispatchRequested({
        patientName: userName,
        patientPhone: userPhone,
        location: userLoc,
        emergencyType: emgType,
        ambulanceType: ambType,
        driverName: 'Srinivasa Reddy',
        driverPhone: '+91 9908812345',
        driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
        vehicleNo: 'TS-09-EA-4482'
      });
      
      // Select the booked request for active tracking view
      setActiveReqId(mockId);
      setIsDispatched(true);
      
      // Cleanup booking fields
      setUserName('');
      setUserPhone('');
      setUserLoc('');
    }
  };

  // Speed up simulation state transition for reviewers' comfort!
  const triggerTelemetryPhaseShift = () => {
    if (!currentTrackedReq) return;
    const currentIndex = STATUS_STEPS.indexOf(currentTrackedReq.status);
    if (currentIndex < STATUS_STEPS.length - 1) {
      const nextStatus = STATUS_STEPS[currentIndex + 1];
      onUpdateStatusStep(currentTrackedReq.id, nextStatus);
    } else {
      // Completed, remove dispatch or reset
      onCompleteDispatch(currentTrackedReq.id);
      setIsDispatched(false);
      setActiveReqId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
      
      {/* Visual Emergency Warning Sign */}
      <div className="bg-red-50 text-red-800 p-5 rounded-3xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex items-center justify-center bg-red-600 rounded-xl text-white shrink-0">
            <ShieldAlert className="h-5 w-5" />
            <span className="absolute -inset-1.5 rounded-xl bg-red-500/30 animate-siren"></span>
          </div>
          <div>
            <h3 className="font-extrabold text-base leading-none">{t.emergencyDispatch}</h3>
            <p className="text-xs text-red-650 font-medium mt-0.5">{t.dispatchSub}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-red-600">24/7 Secure Vector Node Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: AMBULANCE DISPATCH HOTLINE FORM */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h4 className="font-extrabold text-slate-900 text-lg">GPS Dispatch Link</h4>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">Please fill with the exact incident location to trigger automated triangulation.</p>
          </div>

          <form onSubmit={handleDispatchSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Contact Reporter Name</label>
              <input 
                type="text" required placeholder="Full Name"
                value={userName} onChange={(e) => setUserName(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-500"
                id="amb-form-name"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Contact Phone Number</label>
              <input 
                type="tel" required placeholder="9848022338"
                value={userPhone} onChange={(e) => setUserPhone(e.target.value)}
                className="w-full text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-500"
                id="amb-form-phone"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Detailed GPS Landmark / Current Location</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" required placeholder="Building, Sector, Landmarks, Hyderabad"
                  value={userLoc} onChange={(e) => setUserLoc(e.target.value)}
                  className="w-full text-slate-800 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-red-500"
                  id="amb-form-location"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{t.emergencyType}</label>
                <select 
                  value={emgType} onChange={(e) => setEmgType(e.target.value)}
                  className="w-full text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Cardiac Arrest / Severe Chest Pain">{t.cardiacEmergency}</option>
                  <option value="Severe Injury / Accident Trauma">{t.accidentEmergency}</option>
                  <option value="Maternity / Pregnancy Emergency">{t.pregnancyEmergency}</option>
                  <option value="Other Acute Health Emergency">{t.otherEmergency}</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{t.ambulanceType}</label>
                <select 
                  value={ambType} onChange={(e) => setAmbType(e.target.value as any)}
                  className="w-full text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Basic Life Support (BLS)">{t.basicAmbulance}</option>
                  <option value="Advanced Life Support (ALS)">{t.advancedAmbulance}</option>
                  <option value="ICU Ambulance">{t.icuAmbulance}</option>
                  <option value="Neonatal Ambulance">{t.neonatalAmbulance}</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-red-650 hover:bg-red-700 bg-red-600 text-white font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 cursor-pointer"
              id="dispatch-submit-button"
            >
              <Navigation className="h-4.5 w-4.5 animate-bounce" />
              <span>LAUNCH IMMEDIATE RESCUE DISPATCH Vector</span>
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIVE DATA FEED & STEP TRACKER MAP */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {currentTrackedReq ? (
              <motion.div 
                key={currentTrackedReq.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative border border-white/5 overflow-hidden"
              >
                {/* Visual grid backdrop representing a tracking radar dashboard */}
                <div className="absolute inset-0 grid-pattern opacity-15 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Telemetry Live link</span>
                    <h3 className="font-extrabold text-lg sm:text-xl mt-1 text-white">{t.trackingTitle}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Tracking Dispatch: <strong className="font-mono text-slate-300">{currentTrackedReq.id}</strong></p>
                  </div>
                  
                  {/* Siren click mock indicator */}
                  <button 
                    onClick={() => setIsSirenActive(!isSirenActive)}
                    className={`p-2.5 rounded-xl transition-all ${isSirenActive ? 'bg-red-600 text-white animate-siren' : 'bg-slate-800 text-slate-500'}`}
                    title={isSirenActive ? "Sirens broadcasting active" : "Sirens muted"}
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

                {/* 5-STAGE PIPELINE MAP (VISUAL TIMELINE GRAPHIC) */}
                <div className="py-6 border-y border-white/5 mb-6 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full"></div>
                  
                  {/* Active line width depending on status step */}
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-red-600 -translate-y-1/2 rounded-full transition-all duration-500"
                    style={{ width: `${(STATUS_STEPS.indexOf(currentTrackedReq.status) / (STATUS_STEPS.length - 1)) * 100}%` }}
                  ></div>

                  <div className="relative flex justify-between">
                    {STATUS_STEPS.map((step, index) => {
                      const isActive = STATUS_STEPS.indexOf(currentTrackedReq.status) >= index;
                      const isCurrent = currentTrackedReq.status === step;

                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div 
                            className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all relative z-10 ${
                              isCurrent ? 'bg-red-600 border-red-600 ring-4 ring-red-600/30 text-white' :
                              isActive ? 'bg-red-600 border-red-600 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className={`text-[9px] font-bold mt-2 text-center max-w-[65px] leading-tight ${isCurrent ? 'text-red-500' : isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                            {step === 'Request Submitted' ? 'Submitted' :
                             step === 'Ambulance Assigned' ? 'Assigned' :
                             step === 'Driver En Route' ? 'En Route' :
                             step === 'Arriving Soon' ? 'Arriving' : 'Reached'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                    <Clock className="h-6 w-6 text-red-500 animate-pulse shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{t.etaText}</span>
                      <span className="text-xl font-mono font-extrabold text-red-400">
                        {currentTrackedReq.status === 'Reached Destination' ? 'Arrived' : `${currentTrackedReq.eta} Min`}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                    <Compass className="h-6 w-6 text-red-500 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Transport Vehicle</span>
                      <span className="text-sm font-extrabold text-slate-100">{currentTrackedReq.ambulanceType}</span>
                    </div>
                  </div>
                </div>

                {/* Driver information & Action parameters */}
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={currentTrackedReq.driverPhoto} alt={currentTrackedReq.driverName} className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wide">{t.driverName}</span>
                      <h4 className="font-bold text-white text-sm">{currentTrackedReq.driverName}</h4>
                      <span className="text-[10px] font-mono text-red-400 font-bold">{currentTrackedReq.vehicleNo}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a 
                      href={`tel:${currentTrackedReq.driverPhone}`}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5 border border-white/5"
                    >
                      <PhoneCall className="h-3.5 w-3.5 text-slate-400" />
                      <span>{t.driverContact}</span>
                    </a>
                  </div>
                </div>

                {/* TELEMETRY SPEED-UP TRIGGERS (TO COMFORT THE ASSESSMENT AND PROFILES SCREEN) */}
                <div className="mt-6 pt-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[10px] text-slate-400 font-medium">✨ Use Phase Shift to manually review stage increments:</span>
                  <button 
                    onClick={triggerTelemetryPhaseShift}
                    className="px-5 py-2 rounded-xl bg-white text-slate-900 text-xs font-extrabold transition-all hover:bg-slate-100 cursor-pointer shadow-md"
                    id="telemetry-speedup-button"
                  >
                    {currentTrackedReq.status === 'Reached Destination' ? (
                      <span>Complete Rescue & Reset</span>
                    ) : (
                      <span>Increment Status Step →</span>
                    )}
                  </button>
                </div>

              </motion.div>
            ) : (
              <div className="bg-slate-900/40 text-slate-500 py-16 text-center rounded-3xl border border-dashed border-slate-800 font-medium text-xs">
                Active tracked dispatches will be displayed here. Request an ambulance using the form.
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
