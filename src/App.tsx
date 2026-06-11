import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import PatientPortal from './components/PatientPortal';
import DoctorPortal from './components/DoctorPortal';
import EmergencyAmbulance from './components/EmergencyAmbulance';
import AdminPortal from './components/AdminPortal';
import AristotleAI from './components/AristotleAI';
import UnifiedAuth from './components/UnifiedAuth';

import { 
  Language, UserRole, Patient, Doctor, Appointment, 
  MedicalReport, MedicalCondition, Prescription, BillingInvoice, 
  AmbulanceRequest, AmbulanceStatus, Notification 
} from './types';

import { 
  demoDoctors, demoPatient, demoReports, demoConditions, 
  demoPrescriptions, demoInvoices, demoNotifications, demoAmbulanceRequests 
} from './demoData';

import { motion, AnimatePresence } from 'motion/react';
import { Bell, HeartPulse, Sparkles, X, Activity, MessageSquare } from 'lucide-react';

export default function App() {
  // --- CORE SYNCHRONIZED HEALTH STATE ENGINE ---
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('ar_lang') as Language) || 'en';
  });

  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    return (localStorage.getItem('ar_role') as UserRole) || 'guest';
  });

  const [currentView, setCurrentView] = useState<'landing' | 'emergency-booking' | 'doctor-booking' | 'ai-helper'>(() => {
    return (localStorage.getItem('ar_current_view') as any) || 'landing';
  });

  // Logged Auth Sessions
  const [loggedPatient, setLoggedPatient] = useState<Patient | null>(() => {
    const saved = localStorage.getItem('ar_logged_patient');
    return saved ? JSON.parse(saved) : null;
  });

  const [loggedDoctor, setLoggedDoctor] = useState<Doctor | null>(() => {
    const saved = localStorage.getItem('ar_logged_doctor');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('ar_is_admin_logged_in');
    return saved === 'true';
  });

  // Database lists with localStorage persistence
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('ar_patients');
    return saved ? JSON.parse(saved) : [demoPatient];
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('ar_doctors');
    return saved ? JSON.parse(saved) : demoDoctors;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('ar_appointments');
    if (saved) return JSON.parse(saved);
    // Presave initial mock booking for Dr. Siddhartha Rao so components are populated instantly!
    return [
      {
        id: 'appt-baseline-1',
        patientId: 'pat-101',
        patientName: 'Kshitij Reddy',
        patientAge: 34,
        patientPhone: '9848022338',
        doctorId: 'doc-1',
        doctorName: 'Dr. Siddhartha Rao',
        specialization: 'Cardiologist',
        hospital: 'ARISTOTLE Cardiac Care Institute',
        date: '2026-06-15',
        timeSlot: '10:30 AM',
        consultationType: 'Video Call',
        reason: 'Slight ST Segment variation follow-up consult.',
        status: 'Approved'
      }
    ];
  });

  const [reports, setReports] = useState<MedicalReport[]>(() => {
    const saved = localStorage.getItem('ar_reports');
    return saved ? JSON.parse(saved) : demoReports;
  });

  const [conditions, setConditions] = useState<MedicalCondition[]>(() => {
    const saved = localStorage.getItem('ar_conditions');
    return saved ? JSON.parse(saved) : demoConditions;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('ar_prescriptions');
    return saved ? JSON.parse(saved) : demoPrescriptions;
  });

  const [invoices, setInvoices] = useState<BillingInvoice[]>(() => {
    const saved = localStorage.getItem('ar_invoices');
    return saved ? JSON.parse(saved) : demoInvoices;
  });

  const [ambulanceRequests, setAmbulanceRequests] = useState<AmbulanceRequest[]>(() => {
    const saved = localStorage.getItem('ar_ambulance_requests');
    return saved ? JSON.parse(saved) : demoAmbulanceRequests;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('ar_notifications');
    return saved ? JSON.parse(saved) : demoNotifications;
  });

  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);

  // Sync state arrays directly to LocalStorage
  useEffect(() => {
    localStorage.setItem('ar_lang', lang);
    localStorage.setItem('ar_role', activeRole);
    localStorage.setItem('ar_current_view', currentView);
    localStorage.setItem('ar_patients', JSON.stringify(patients));
    localStorage.setItem('ar_doctors', JSON.stringify(doctors));
    localStorage.setItem('ar_appointments', JSON.stringify(appointments));
    localStorage.setItem('ar_reports', JSON.stringify(reports));
    localStorage.setItem('ar_conditions', JSON.stringify(conditions));
    localStorage.setItem('ar_prescriptions', JSON.stringify(prescriptions));
    localStorage.setItem('ar_invoices', JSON.stringify(invoices));
    localStorage.setItem('ar_ambulance_requests', JSON.stringify(ambulanceRequests));
    localStorage.setItem('ar_notifications', JSON.stringify(notifications));

    if (loggedPatient) {
      localStorage.setItem('ar_logged_patient', JSON.stringify(loggedPatient));
    } else {
      localStorage.removeItem('ar_logged_patient');
    }

    if (loggedDoctor) {
      localStorage.setItem('ar_logged_doctor', JSON.stringify(loggedDoctor));
    } else {
      localStorage.removeItem('ar_logged_doctor');
    }

    localStorage.setItem('ar_is_admin_logged_in', isAdminLoggedIn ? 'true' : 'false');
  }, [lang, activeRole, currentView, patients, doctors, appointments, reports, conditions, prescriptions, invoices, ambulanceRequests, notifications, loggedPatient, loggedDoctor, isAdminLoggedIn]);

  // Intercept changes to automatically redirect roles to relevant views
  useEffect(() => {
    if (activeRole === 'patient' || activeRole === 'doctor' || activeRole === 'admin') {
      setCurrentView('landing'); // Role specific panels are mounted inline when tab active
    }
  }, [activeRole]);

  // --- STATE HANDLERS (EMITTED DOWNWARD IN INTUITIVE DESIGN TO CHILDREN) ---

  const handleRegisterPatient = (newPatient: Patient) => {
    setPatients(prev => [...prev, newPatient]);
    addNotification({
      userId: newPatient.id,
      type: 'system',
      title: 'Health Core ID Generated',
      message: `Welcome ${newPatient.name}. Your secured clinical ID matches key protocol AR-PAT-101.`,
      time: 'Just now'
    });
  };

  const handleBookAppointment = (apptData: Omit<Appointment, 'id' | 'patientId' | 'patientName' | 'patientAge' | 'patientPhone' | 'status'>) => {
    const primaryPatient = currentPatient;
    const newAppt: Appointment = {
      ...apptData,
      id: 'appt-' + Math.floor(Math.random() * 1000),
      patientId: primaryPatient.id,
      patientName: primaryPatient.name,
      patientAge: primaryPatient.age,
      patientPhone: primaryPatient.phone,
      status: 'Pending'
    };

    setAppointments(prev => [...prev, newAppt]);
    
    // Auto-create alert for Doctor & Admin
    addNotification({
      userId: apptData.doctorId,
      type: 'appointment_update',
      title: 'Consultation Requested',
      message: `${primaryPatient.name} booked a slot representing ${apptData.consultationType} on ${apptData.date}.`,
      time: 'Just now'
    });
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected' as any } : a));
    
    // Add Alert notification
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      addNotification({
        userId: appt.doctorId,
        type: 'appointment_update',
        title: 'Booking Cancelled',
        message: `Patient ${appt.patientName} cancelled their scheduled consultation parameters on ${appt.date}.`,
        time: 'Just now'
      });
    }
  };

  const handleAcceptAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
    
    // Inform Patient
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      addNotification({
        userId: appt.patientId,
        type: 'appointment_update',
        title: 'Physician Booking Approved',
        message: `${appt.doctorName} successfully validated your consultation session on ${appt.timeSlot}.`,
        time: 'Just now'
      });
    }
  };

  const handleRejectAppointment = (id: string, reason?: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Rejected', rejectionReason: reason } : a));
    
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      addNotification({
        userId: appt.patientId,
        type: 'appointment_update',
        title: 'Booking Rescheduled / Declined',
        message: `Dr. ${appt.doctorName} altered the consultation schedule: ${reason || 'Capacity limits reach'}`,
        time: 'Just now'
      });
    }
  };

  const handleRescheduleAppointment = (id: string, date: string, time: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved', date, timeSlot: time } : a));
    
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      addNotification({
        userId: appt.patientId,
        type: 'appointment_update',
        title: 'Clinical Slot Rescheduled',
        message: `${appt.doctorName} reassigned your slot to ${date} at ${time}. Status updated.`,
        time: 'Just now'
      });
    }
  };

  const handleUpdateAvailability = (id: string, days: string[], hours: Doctor['workingHours']) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, availableDays: days, workingHours: hours } : d));
  };

  const handlePayInvoice = (id: string) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'Paid' } : i));
  };

  const handleAddInvoice = (newInv: BillingInvoice) => {
    setInvoices(prev => [newInv, ...prev]);
  };

  const handleDispatchRequested = (reqData: Omit<AmbulanceRequest, 'id' | 'status' | 'eta' | 'createdAt'>) => {
    const newReq: AmbulanceRequest = {
      ...reqData,
      id: 'amb-req-' + Math.floor(Math.random() * 1000),
      status: 'Request Submitted',
      eta: 8,
      createdAt: new Date().toISOString()
    };

    setAmbulanceRequests(prev => [newReq, ...prev]);

    // Dispatch global broadcast notification
    addNotification({
      userId: 'admin',
      type: 'emergency_alert',
      title: '🚨 IMMEDIATE AMBULANCE DISPATCHED',
      message: `Direct guest request initiated at landmark ${reqData.location}. Classification: ${reqData.emergencyType}.`,
      time: 'Just now'
    });
  };

  const handleCompleteDispatch = (id: string) => {
    setAmbulanceRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleUpdateStatusStep = (id: string, nextStatus: AmbulanceStatus) => {
    setAmbulanceRequests(prev => prev.map(r => {
      if (r.id === id) {
        let nextEta = r.eta;
        if (nextStatus === 'Ambulance Assigned') nextEta = 7;
        if (nextStatus === 'Driver En Route') nextEta = 4;
        if (nextStatus === 'Arriving Soon') nextEta = 1;
        if (nextStatus === 'Reached Destination') nextEta = 0;

        return { ...r, status: nextStatus, eta: nextEta };
      }
      return r;
    }));

    // Alert dispatchers and patients
    const req = ambulanceRequests.find(r => r.id === id);
    if (req) {
      addNotification({
        userId: 'admin',
        type: 'emergency_alert',
        title: 'Telemetry Transition Status',
        message: `Dispatch ${req.id} shifted to state: ${nextStatus}. ETA: ${nextStatus === 'Reached Destination' ? '0' : 'reduced'}.`,
        time: 'Just now'
      });
    }
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'read'>) => {
    setNotifications(prev => [
      {
        ...notif,
        id: 'not-' + Math.floor(Math.random() * 1000),
        read: false
      },
      ...prev
    ]);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  const handleDeletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  const handleVerifyDoctor = (id: string) => {
    // Physician verification actions
  };

  const handleLogout = () => {
    setLoggedPatient(null);
    setLoggedDoctor(null);
    setIsAdminLoggedIn(false);
    setActiveRole('guest');
    setCurrentView('landing');
  };

  const handlePasswordUpdated = (role: 'patient' | 'doctor', emailOrPhone: string, newPass: string) => {
    const input = emailOrPhone.trim().toLowerCase();
    if (role === 'patient') {
      setPatients(prev => prev.map(p => {
        if (p.email.toLowerCase() === input || p.phone === emailOrPhone.trim()) {
          return { ...p, password: newPass };
        }
        return p;
      }));
    } else if (role === 'doctor') {
      setDoctors(prev => prev.map(d => {
        const dEmail = (d as any).email || '';
        const dPhone = (d as any).phone || '';
        if (dEmail.toLowerCase() === input || dPhone === emailOrPhone.trim() || d.name.toLowerCase().includes(input)) {
          return { ...d, password: newPass };
        }
        return d;
      }));
    }
  };

  const currentPatient = loggedPatient || patients[0] || demoPatient;

  return (
    <div className="min-h-screen bg-slate-50 grid-pattern flex flex-col font-sans select-none overflow-x-hidden antialiased">
      
      {/* HEADER NAVIGATION */}
      <Header 
        currentLang={lang}
        setLang={setLang}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        isLoggedIn={
          (activeRole === 'patient' && !!loggedPatient) ||
          (activeRole === 'doctor' && !!loggedDoctor) ||
          (activeRole === 'admin' && isAdminLoggedIn)
        }
        onLogout={handleLogout}
        onNavigateToAI={() => setCurrentView('ai-helper')}
        onNavigateToLanding={() => {
          setCurrentView('landing');
          setActiveRole('guest');
        }}
        onNavigateToEmergency={() => setCurrentView('emergency-booking')}
        isPatientAuth={!!loggedPatient}
        isDoctorAuth={!!loggedDoctor}
        isAdminAuth={isAdminLoggedIn}
      />

      {/* FIXED FLOATING NOTIFICATION INDICATOR BOX */}
      <div className="fixed bottom-6 right-6 z-45 flex flex-col gap-2 items-end">
        {/* Simple live notification popup pill */}
        <button 
          onClick={() => setIsNotifDrawerOpen(!isNotifDrawerOpen)}
          className="relative h-12 w-12 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform focus:outline-hidden border border-white/10"
        >
          <Bell className="h-5 w-5" />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-red-500 rounded-full text-[9px] font-bold">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </button>
      </div>

      {/* NOTIFICATION CENTER SIDEBAR */}
      <AnimatePresence>
        {isNotifDrawerOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex justify-end">
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="bg-white max-w-sm w-full h-full shadow-2xl p-6 flex flex-col justify-between border-l border-slate-100"
            >
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                  <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-600" />
                    <span>Clinical Broadcast Center</span>
                  </h3>
                  <button onClick={() => setIsNotifDrawerOpen(false)} className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center font-bold font-mono">×</button>
                </div>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      className={`p-3.5 rounded-xl border leading-relaxed text-xs transition-all ${
                        n.read ? 'bg-slate-50/50 border-slate-100' : 'bg-emerald-50/40 border-emerald-100/60 font-semibold'
                      }`}
                    >
                      <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase mb-1">
                        <span>{n.type === 'emergency_alert' ? '🚨 Emergency Alert' : '✓ Update Notification'}</span>
                        <span>{n.time}</span>
                      </div>
                      <h4 className="font-bold text-slate-850">{n.title}</h4>
                      <p className="text-slate-500 mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => { handleMarkAllNotificationsRead(); setIsNotifDrawerOpen(false); }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all text-center"
              >
                Clear all alerts / Mark as read
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* COMPONENT BODY ROUTERS */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          
          {/* VIEW: EMERGENCY BOOKING HOTLINE */}
          {currentView === 'emergency-booking' && (
            <motion.div
              key="emergency"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <EmergencyAmbulance 
                currentLang={lang}
                onDispatchRequested={handleDispatchRequested}
                activeDispatches={ambulanceRequests}
                onCompleteDispatch={handleCompleteDispatch}
                onUpdateStatusStep={handleUpdateStatusStep}
              />
            </motion.div>
          )}

          {/* VIEW: ARISTOTLE AI COGNITIVE DIAGNOSTICS */}
          {currentView === 'ai-helper' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <AristotleAI 
                currentLang={lang}
                onNavigateToBooking={(doc) => {
                  setActiveRole('patient');
                  // Give slight delay to allow patient portal redirect
                  setTimeout(() => {
                    const el = document.getElementById(`doc-discovery-card-${doc.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              />
            </motion.div>
          )}

          {/* VIEW: ROLED PORTAL PANELS */}
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* PORTAL GATEWAYS BASED ON SYSTEM SWITCHER */}
              {activeRole === 'guest' ? (
                <LandingPage 
                  currentLang={lang}
                  onNavigateToAmbulanceBooking={() => setCurrentView('emergency-booking')}
                  onNavigateToDoctorBooking={(doc) => {
                    setActiveRole('patient');
                  }}
                  onNavigateToPatientPortal={() => setActiveRole('patient')}
                />
              ) : activeRole === 'patient' ? (
                !loggedPatient ? (
                  <UnifiedAuth 
                    currentLang={lang}
                    initialRole="patient"
                    patients={patients}
                    doctors={doctors}
                    onLoginSuccess={(role, user) => {
                      setLoggedPatient(user);
                    }}
                    onRegisterPatient={(np) => {
                      setPatients(prev => [...prev, np]);
                    }}
                    onRegisterDoctor={(nd) => {
                      setDoctors(prev => [...prev, nd]);
                    }}
                    onUpdatePassword={handlePasswordUpdated}
                  />
                ) : (
                  <PatientPortal 
                    currentLang={lang}
                    doctors={doctors}
                    patient={currentPatient}
                    appointments={appointments}
                    reports={reports}
                    conditions={conditions}
                    prescriptions={prescriptions}
                    invoices={invoices}
                    notifications={notifications}
                    onBookAppointment={handleBookAppointment}
                    onCancelAppointment={handleCancelAppointment}
                    onPayInvoice={handlePayInvoice}
                    onRegisterPatient={handleRegisterPatient}
                    onAddInvoice={handleAddInvoice}
                  />
                )
              ) : activeRole === 'doctor' ? (
                !loggedDoctor ? (
                  <UnifiedAuth 
                    currentLang={lang}
                    initialRole="doctor"
                    patients={patients}
                    doctors={doctors}
                    onLoginSuccess={(role, user) => {
                      setLoggedDoctor(user);
                    }}
                    onRegisterPatient={(np) => {
                      setPatients(prev => [...prev, np]);
                    }}
                    onRegisterDoctor={(nd) => {
                      setDoctors(prev => [...prev, nd]);
                    }}
                    onUpdatePassword={handlePasswordUpdated}
                  />
                ) : (
                  <DoctorPortal 
                    currentLang={lang}
                    appointments={appointments}
                    doctors={doctors}
                    onAcceptAppointment={handleAcceptAppointment}
                    onRejectAppointment={handleRejectAppointment}
                    onRescheduleAppointment={handleRescheduleAppointment}
                    onUpdateAvailability={handleUpdateAvailability}
                    loggedDoctor={loggedDoctor}
                  />
                )
              ) : (
                !isAdminLoggedIn ? (
                  <UnifiedAuth 
                    currentLang={lang}
                    initialRole="admin"
                    patients={patients}
                    doctors={doctors}
                    onLoginSuccess={(role, user) => {
                      setIsAdminLoggedIn(true);
                    }}
                    onRegisterPatient={(np) => {
                      setPatients(prev => [...prev, np]);
                    }}
                    onRegisterDoctor={(nd) => {
                      setDoctors(prev => [...prev, nd]);
                    }}
                    onUpdatePassword={handlePasswordUpdated}
                  />
                ) : (
                  <AdminPortal 
                    currentLang={lang}
                    patients={patients}
                    doctors={doctors}
                    appointments={appointments}
                    ambulanceRequests={ambulanceRequests}
                    onDeleteDoctor={handleDeleteDoctor}
                    onDeletePatient={handleDeletePatient}
                    onVerifyDoctor={handleVerifyDoctor}
                  />
                )
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>

    </div>
  );
}
