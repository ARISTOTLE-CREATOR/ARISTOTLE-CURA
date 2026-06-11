import React, { useState } from 'react';
import { translations } from '../translations';
import { Language, Doctor } from '../types';
import { demoDoctors } from '../demoData';
import { 
  Sparkles, HeartPulse, Activity, AlertCircle, Send, CheckSquare, 
  HelpCircle, Clock, PlusCircle, CheckCircle2, ChevronRight, Stethoscope
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AristotleAIProps {
  currentLang: Language;
  onNavigateToBooking: (doctor: Doctor) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  triageDetails?: {
    possibleDiagnosis: string;
    criticality: 'Immediate Rescue' | 'Doctor Consult Recommended' | 'Safe Monitoring';
    healthTips: string[];
    reminders: string;
    doctorRec: Doctor;
  };
}

export default function AristotleAI({
  currentLang,
  onNavigateToBooking
}: AristotleAIProps) {
  const t = translations[currentLang];
  
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Dynamic Medicine Alarm State
  const [reminders, setReminders] = useState<{ id: string; name: string; time: string; status: boolean }[]>([
    { id: '1', name: 'Telmisartan 40mg', time: '08:30 AM', status: true },
    { id: '2', name: 'Atorvastatin 10mg', time: '09:00 PM', status: true }
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('08:00 AM');

  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: 'welcome-message',
      sender: 'ai',
      text: "Greetings! I am ARISTOTLE AI, your personal clinical symptom triage coordinator. Enter your current health parameters, acute conditions, or select from active clinical queries below.",
      timestamp: '05:35 AM'
    }
  ]);

  const testSymptoms = [
    { label: "Chest pressure or radiating arm stiffness 🚨", query: "I am feeling minor chest tightness and slight radiating ache in my shoulder." },
    { label: "Severe head throbbing & vertigo symptoms 🧠", query: "Intense migraine pain since morning, blurry vision and sensory vertigo." },
    { label: "Fever and bronchial dry wheezing 🫁", query: "Persistent high temperature for 2 days with shallow bronchial wheezing." }
  ];

  // Medical heuristics database for top-tier client symptom analysis
  const analyzeMedicalTriage = (query: string): Message['triageDetails'] => {
    const q = query.toLowerCase();
    
    if (q.includes('chest') || q.includes('heart') || q.includes('cardiac') || q.includes('arm')) {
      return {
        possibleDiagnosis: "Acute Myocardial Baseline Strain (ST Segment Variance Suspect)",
        criticality: "Immediate Rescue",
        healthTips: [
          "Avoid physical strain immediately. Maintain absolute sitting repose.",
          "Keep an aspirin pill nearby if recommended in medical profiles.",
          "Coordinate the ARISTOTLE Rapid ALS Ambulance dispatch without login delay."
        ],
        reminders: "Siren dispatch authorized. Contact hospital emergency console immediately.",
        doctorRec: demoDoctors[0] // Dr. Siddhartha Rao (Cardiologist)
      };
    } else if (q.includes('head') || q.includes('migraine') || q.includes('brain') || q.includes('vertigo')) {
      return {
        possibleDiagnosis: "Vascular Migraine Cluster with Aura Progression (Trigeminal Baseline Sensitivity)",
        criticality: "Doctor Consult Recommended",
        healthTips: [
          "Retire into high-contrast dark room. Avoid digital light emissions.",
          "Hydrate slowly with lukewarm electrolyte blends.",
          "Avoid sensory noise stress triggers."
        ],
        reminders: "Checkup schedule proposal sent to neurology coordinator.",
        doctorRec: demoDoctors[2] // Dr. Vikram Prasad (Neurologist)
      };
    } else if (q.includes('fever') || q.includes('wheezing') || q.includes('cough') || q.includes('breath') || q.includes('asthma')) {
      return {
        possibleDiagnosis: "Seasonal Reactive Airway Bronchitis (Asthmatic Biomarker Suspect)",
        criticality: "Doctor Consult Recommended",
        healthTips: [
          "Administer standard prophylactic inhaler doses if previously prescribed.",
          "Aerate room using sterile HEPA air-scrubbing elements.",
          "Perform steam inhalations to clear bronchial passages."
        ],
        reminders: "Monitor blood peripheral oxygen metrics hourly.",
        doctorRec: demoDoctors[3] // Dr. Nithin Varma (Orthopedic/General Traumas)
      };
    } else {
      return {
        possibleDiagnosis: "General Somatic Inflammatory Reactivity",
        criticality: "Safe Monitoring",
        healthTips: [
          "Ensure 8 hours of restorative resting cycle.",
          "Track body temperature values using verified digital sensors.",
          "Consumate clean organic liquid broth diets."
        ],
        reminders: "Review health summary parameters in patient portals.",
        doctorRec: demoDoctors[1] // Dr. Arundhati Devi (Dermatology/General)
      };
    }
  };

  const handleSendMessage = (inputText: string) => {
    if (!inputText) return;

    const userMsg: Message = {
      id: 'msg-' + Math.floor(Math.random() * 1000),
      sender: 'user',
      text: inputText,
      timestamp: 'Just now'
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const details = analyzeMedicalTriage(inputText);
      
      const aiResponseText = details.criticality === 'Immediate Rescue' 
        ? "ALERT: Your clinical symptom inputs indicate acute chest vectors. Do not exert yourself. Review triage tips and consider launching the ARISTOTLE ALS emergency transport coordinates."
        : `Diagnostic triage completed. Possible clinical classification: ${details.possibleDiagnosis}. Let's coordinate a consultation session with our verified staff.`;

      const aiMsg: Message = {
        id: 'msg-' + Math.floor(Math.random() * 1000),
        sender: 'ai',
        text: aiResponseText,
        timestamp: 'Just now',
        triageDetails: details
      };

      setChatHistory(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const addReminderMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMedName) {
      setReminders(prev => [
        ...prev,
        { id: Math.random().toString(), name: newMedName, time: newMedTime, status: true }
      ]);
      setNewMedName('');
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(r => r.id === id ? { ...r, status: !r.status } : r)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:grid-cols-12 gap-8">
      
      {/* Title section */}
      <div className="mb-8">
        <span className="text-emerald-500 font-extrabold text-xs uppercase tracking-widest block">Cognitive Triage</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{t.aiAssistantTitle}</h2>
        <p className="text-xs text-slate-500 font-semibold mt-1">{t.aiAssistantSubtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONVERSATIONAL ASSISTANT */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span className="text-xs font-bold uppercase tracking-wider">Secure Medical Decryption Node Active</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400">HIPAA APPROVED DATASET</span>
          </div>

          {/* Messages list */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin">
            {chatHistory.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                id={`ai-chat-bubble-${msg.id}`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  msg.sender === 'ai' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-800'
                }`}>
                  {msg.sender === 'ai' ? 'A' : 'P'}
                </div>

                <div className="space-y-3">
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed shadow-3xs ${
                    msg.sender === 'ai' ? 'bg-slate-50 border border-slate-100 text-slate-800' : 'bg-indigo-950 text-white'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Diagnostic triage box inside bubbles */}
                  {msg.triageDetails && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900 text-white p-5 rounded-2xl border border-white/5 shadow-xl space-y-4"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Possible Pathological Classification</span>
                          <h4 className="font-bold text-white text-sm mt-0.5">{msg.triageDetails.possibleDiagnosis}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                          msg.triageDetails.criticality === 'Immediate Rescue' ? 'bg-red-650 bg-red-600 font-extrabold animate-pulse' :
                          msg.triageDetails.criticality === 'Doctor Consult Recommended' ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}>{msg.triageDetails.criticality}</span>
                      </div>

                      {/* Health triage list warnings */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Triage Advice protocol</span>
                        {msg.triageDetails.healthTips.map((tip, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-200">
                            <CheckSquare className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>

                      {/* Recommend Doctor Booking CTA */}
                      <div className="border-t border-white/5 pt-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <img src={msg.triageDetails.doctorRec.photo} alt={msg.triageDetails.doctorRec.name} className="h-8 w-8 rounded-xl object-cover ring-1 ring-white/10" />
                          <div>
                            <span className="text-[9px] text-slate-400 font-medium block">Recommended Specialist</span>
                            <span className="font-bold text-white text-xs">{msg.triageDetails.doctorRec.name}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => onNavigateToBooking(msg.triageDetails!.doctorRec)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
                        >
                          Book Direct Specialist Slot
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium pl-10">
                <span className="animate-[pulse_1s_infinite] h-2 w-2 rounded-full bg-slate-400"></span>
                <span className="animate-[pulse_1s_infinite_0.2s] h-2 w-2 rounded-full bg-slate-400"></span>
                <span>Aristotle AI analyzing clinical symptoms...</span>
              </div>
            )}
          </div>

          {/* Quick-click selector list */}
          <div className="px-6 py-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 bg-slate-50 bg-slate-50/50">
            {testSymptoms.map((sym, si) => (
              <button 
                key={si}
                onClick={() => handleSendMessage(sym.query)}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-350 text-[10px] font-bold text-slate-600 transition-all whitespace-nowrap shadow-2xs"
              >
                {sym.label}
              </button>
            ))}
          </div>

          {/* Chat input form */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(chatInput); }}
            className="p-4 border-t border-slate-100 flex gap-2 shrink-0 bg-white"
          >
            <input 
              type="text"
              placeholder="Describe acute clinical pressures, symptoms, fever history..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 focus:bg-white text-slate-800 text-sm font-semibold rounded-xl border border-slate-250 border-slate-200 focus:outline-hidden focus:border-emerald-500"
              id="ai-prompt-input"
            />
            <button 
              type="submit"
              className="p-3 bg-slate-900 border border-slate-950 text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-md shadow-slate-100"
              id="ai-send-button"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>

        </div>

        {/* RIGHT COLUMN: DIRECT MEDICINE REMINDERS ALARM CONFIG */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-slate-950 text-base">Timeline Medicine Reminders</h4>
            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Define medicine clock tickers to optimize your medical scheduler.</p>
          </div>

          <div className="space-y-3">
            {reminders.map((item) => (
              <div 
                key={item.id}
                onClick={() => toggleReminder(item.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                  item.status ? 'bg-slate-50 border-slate-150' : 'opacity-40 bg-zinc-50 border-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`h-2.5 w-2.5 rounded-full ${item.status ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{item.name}</h5>
                    <span className="text-[10px] font-mono text-slate-400 font-bold block mt-0.5">{item.time}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${item.status ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                  {item.status ? 'ACTIVE ALARM' : 'MUTED'}
                </span>
              </div>
            ))}
          </div>

          <form onSubmit={addReminderMock} className="space-y-3 pt-4 border-t border-slate-100">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Medication Name</label>
              <input 
                type="text" required placeholder="Telmisartan / Vitamin D3"
                value={newMedName} onChange={(e) => setNewMedName(e.target.value)}
                className="w-full text-slate-800 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">Trigger Clock Time</label>
              <select 
                value={newMedTime} onChange={(e) => setNewMedTime(e.target.value)}
                className="w-full text-slate-800 text-xs font-semibold px-3 py-2 bg-white rounded-xl border border-slate-200 focus:outline-hidden"
              >
                <option>08:00 AM</option>
                <option>01:30 PM</option>
                <option>08:00 PM</option>
                <option>10:00 PM</option>
              </select>
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 bg-slate-900 text-white font-extrabold text-xs rounded-xl hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add custom medical alarm</span>
            </button>
          </form>

          {/* AI Disclaimer warns */}
          <div className="p-4 bg-amber-50 text-amber-900 text-[11px] font-medium rounded-2xl border border-amber-100 leading-relaxed flex gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <span>{t.aiDisclaimer}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
