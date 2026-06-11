import React, { useState } from 'react';
import { translations } from '../translations';
import { Language, UserRole, Patient, Doctor } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Phone, Lock, Calendar, Heart, ShieldAlert, 
  Activity, Star, CheckSquare, Sparkles, Building2, 
  Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Stethoscope 
} from 'lucide-react';

interface UnifiedAuthProps {
  currentLang: Language;
  initialRole: UserRole;
  patients: Patient[];
  doctors: Doctor[];
  onLoginSuccess: (role: UserRole, user: any) => void;
  onRegisterPatient: (newPatient: Patient) => void;
  onRegisterDoctor: (newDoctor: Doctor) => void;
  onClose?: () => void;
  onUpdatePassword?: (role: 'patient' | 'doctor', emailOrPhone: string, newPass: string) => void;
}

export default function UnifiedAuth({
  currentLang,
  initialRole,
  patients,
  doctors,
  onLoginSuccess,
  onRegisterPatient,
  onRegisterDoctor,
  onClose,
  onUpdatePassword
}: UnifiedAuthProps) {
  const t = translations[currentLang];
  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, 'guest'>>(
    initialRole === 'guest' ? 'patient' : (initialRole as Exclude<UserRole, 'guest'>)
  );
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showCheatSheet, setShowCheatSheet] = useState(true);

  // --- FORGOT PASSWORD STATES ---
  const [isForgotView, setIsForgotView] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: input, 2: verify, 3: reset, 4: success
  const [forgotEmailOrPhone, setForgotEmailOrPhone] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [userTokenInput, setUserTokenInput] = useState('');
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [recoveryAccount, setRecoveryAccount] = useState<any>(null);

  // --- LOGIN FORM STATES ---
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');

  // --- PATIENT REGISTER STATES ---
  const [patName, setPatName] = useState('');
  const [patEmail, setPatEmail] = useState('');
  const [patPhone, setPatPhone] = useState('');
  const [patAge, setPatAge] = useState<number>(30);
  const [patGender, setPatGender] = useState('Male');
  const [patBlood, setPatBlood] = useState('A+ (Positive)');
  const [patAllergies, setPatAllergies] = useState('');

  // --- DOCTOR REGISTER STATES ---
  const [docName, setDocName] = useState('');
  const [docEmail, setDocEmail] = useState('');
  const [docPhone, setDocPhone] = useState('');
  const [docQual, setDocQual] = useState('');
  const [docSpec, setDocSpec] = useState('Cardiologist');
  const [docExp, setDocExp] = useState<number>(5);
  const [docFee, setDocFee] = useState<number>(600);
  const [docHosp, setDocHosp] = useState('');
  const [docLoc, setDocLoc] = useState('');

  // Auto-fill credential triggers for seamless sandbox testing
  const fillCredentials = (email: string, pass: string) => {
    setIdentifier(email);
    setPassword(pass);
    setErrorMsg('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanId = identifier.trim().toLowerCase();
      const cleanPass = password;

      if (selectedRole === 'admin') {
        if (
          (cleanId === 'admin@aristotle.com' || cleanId === 'admin') && 
          cleanPass === 'admin123'
        ) {
          onLoginSuccess('admin', { name: 'Administrator Node', email: 'admin@aristotle.com' });
        } else {
          setErrorMsg('Invalid administrative credentials keypass.');
        }
      } else if (selectedRole === 'patient') {
        // Find match in our patient records list
        const found = patients.find(
          p => p.email.toLowerCase() === cleanId || p.phone === identifier.trim()
        );
        if (found) {
          // If profile has password check it, otherwise fallback to standard default 'password'
          const expectedPass = found.password || 'password';
          if (cleanPass === expectedPass) {
            onLoginSuccess('patient', found);
          } else {
            setErrorMsg('Authentication mismatch. Checked invalid password for patient.');
          }
        } else {
          setErrorMsg('No Patient account registered under that phone number or email.');
        }
      } else if (selectedRole === 'doctor') {
        // Find match in our doctor list
        const found = doctors.find(
          d => d.name.toLowerCase().includes(cleanId.replace('dr.', '').trim()) || 
               d.hospital.toLowerCase().includes(cleanId) ||
               (d as any).email?.toLowerCase() === cleanId ||
               foundDoctorFallbackMatch(d, cleanId)
        );
        if (found) {
          const expectedPass = found.password || 'password';
          if (cleanPass === expectedPass) {
            onLoginSuccess('doctor', found);
          } else {
            setErrorMsg('Physician validation mismatch. Security keypass incorrect.');
          }
        } else {
          setErrorMsg('No registered medical practitioner matched that ID, Email, or Name.');
        }
      }
    }, 1000);
  };

  const foundDoctorFallbackMatch = (d: Doctor, id: string) => {
    // If username is "siddhartha" or "arundhati" or "vikram" or "nithin"
    if (id.includes('siddhartha') && d.id === 'doc-1') return true;
    if (id.includes('arundhati') && d.id === 'doc-2') return true;
    if (id.includes('vikram') && d.id === 'doc-3') return true;
    if (id.includes('nithin') && d.id === 'doc-4') return true;
    return false;
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const input = forgotEmailOrPhone.trim().toLowerCase();

      if (forgotStep === 1) {
        // Find existing record
        if (selectedRole === 'patient') {
          const found = patients.find(
            p => p.email.toLowerCase() === input || p.phone === forgotEmailOrPhone.trim()
          );
          if (found) {
            const token = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedToken(token);
            setRecoveryAccount(found);
            setForgotStep(2);
          } else {
            setErrorMsg('No Patient account registered under that phone number or email.');
          }
        } else if (selectedRole === 'doctor') {
          const found = doctors.find(
            d => (d as any).email?.toLowerCase() === input || 
                 (d as any).phone === forgotEmailOrPhone.trim() || 
                 d.name.toLowerCase().includes(input)
          );
          if (found) {
            const token = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedToken(token);
            setRecoveryAccount(found);
            setForgotStep(2);
          } else {
            setErrorMsg('No registered medical practitioner matched that ID, Email, or Name.');
          }
        }
      } else if (forgotStep === 2) {
        if (userTokenInput.trim() === generatedToken) {
          setForgotStep(3);
        } else {
          setErrorMsg('Token verification failed. Checked invalid token.');
        }
      } else if (forgotStep === 3) {
        if (newPasswordVal.trim().length < 4) {
          setErrorMsg('Please specify a secure password of at least 4 characters.');
          return;
        }
        // Update password locally
        if (recoveryAccount) {
          recoveryAccount.password = newPasswordVal;
        }
        // Propagate to parent state
        if (onUpdatePassword) {
          onUpdatePassword(selectedRole as any, forgotEmailOrPhone, newPasswordVal);
        }
        setForgotStep(4);
      }
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (selectedRole === 'patient') {
        if (!patName || !patEmail || !patPhone || !password) {
          setErrorMsg('Please populate all compulsory clinical data fields.');
          return;
        }

        const newPatient: Patient = {
          id: 'pat-' + Math.floor(100 + Math.random() * 900),
          name: patName,
          email: patEmail,
          phone: patPhone,
          age: Number(patAge),
          gender: patGender,
          bloodGroup: patBlood,
          allergies: patAllergies ? patAllergies.split(',').map(a => a.trim()) : [],
          password: password
        };

        onRegisterPatient(newPatient);
        // Set success response
        onLoginSuccess('patient', newPatient);
      } else if (selectedRole === 'doctor') {
        if (!docName || !docEmail || !docPhone || !docQual || !password) {
          setErrorMsg('Please populate certified physician registration details.');
          return;
        }

        const newDoctor: Doctor = {
          id: 'doc-' + Math.floor(10 + Math.random() * 90),
          name: 'Dr. ' + docName.replace('Dr.', '').trim(),
          photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&auto=format&fit=crop',
          qualification: docQual,
          specialization: docSpec,
          experience: Number(docExp),
          rating: 5.0,
          languages: ['English', 'Telugu'],
          fee: Number(docFee),
          hospital: docHosp || 'ARISTOTLE Premium Health Base',
          location: docLoc || 'Hyderabad',
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          workingHours: {
            start: '09:00 AM',
            end: '05:00 PM',
            breakStart: '01:00 PM',
            breakEnd: '02:00 PM'
          },
          password: password
        };

        // Attach optional email and phone mock to the doctor object secretly for login lookup
        (newDoctor as any).email = docEmail;
        (newDoctor as any).phone = docPhone;

        onRegisterDoctor(newDoctor);
        onLoginSuccess('doctor', newDoctor);
      }
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16">
      
      {/* Container Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Visual Brand & Live Credentials Assist */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 to-emerald-950 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-8 w-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <Stethoscope className="h-4 w-4" />
              </div>
              <span className="font-sans font-extrabold tracking-wider text-lg uppercase">ARISTOTLE</span>
            </div>
            
            <h3 className="text-2xl font-extrabold tracking-tight mb-3">
              Secured Health Ecosystem Access
            </h3>
            <p className="text-slate-300 text-xs leading-relaxed mb-6">
              ARISTOTLE enforces premium level credential checks to manage critical diagnostics, scheduling pipelines, and emergency dispatches safely under HIPAA security frameworks.
            </p>

            <div className="space-y-3.5 mb-8">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-300 font-medium">Verified end-to-end multi-role isolation gates</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Activity className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-300 font-medium">Dynamic demographic storage attached permanently to health pass keys</span>
              </div>
            </div>
          </div>

          {/* Sandbox Cheat Sheet Panel */}
          {showCheatSheet && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 bg-white/10 p-4 rounded-2xl border border-white/10 mt-6 backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-[10px] uppercase tracking-widest font-extrabold">Sandbox Credentials</span>
                </div>
                <button 
                  onClick={() => setShowCheatSheet(false)}
                  className="text-[9px] font-bold text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Hide
                </button>
              </div>

              <div className="space-y-2.5 text-[11px] font-mono text-slate-300">
                <div 
                  onClick={() => fillCredentials('kshitij.reddy@gmail.com', 'password')}
                  className="p-1 px-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors flex justify-between items-center group"
                >
                  <div>
                    <span className="text-emerald-300 font-bold block">Patient Role</span>
                    <span>kshitij.reddy@gmail.com</span>
                  </div>
                  <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">AutoFill</span>
                </div>

                <div 
                  onClick={() => fillCredentials('dr.siddhartha@aristotle.com', 'password')}
                  className="p-1 px-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors flex justify-between items-center group border-t border-white/5 pt-2"
                >
                  <div>
                    <span className="text-indigo-300 font-bold block">Doctor Role</span>
                    <span>dr.siddhartha@aristotle.com</span>
                  </div>
                  <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">AutoFill</span>
                </div>

                <div 
                  onClick={() => fillCredentials('admin@aristotle.com', 'admin123')}
                  className="p-1 px-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors flex justify-between items-center group border-t border-white/5 pt-2"
                >
                  <div>
                    <span className="text-purple-300 font-bold block">Admin Role</span>
                    <span>admin@aristotle.com</span>
                  </div>
                  <span className="text-[9px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">AutoFill</span>
                </div>
              </div>
              <div className="text-[8px] font-sans font-semibold text-slate-400 text-center mt-2.5">
                * Click on any card above to fill authentication forms instantly!
              </div>
            </motion.div>
          )}

          {!showCheatSheet && (
            <button 
              onClick={() => setShowCheatSheet(true)}
              className="text-[10px] font-bold text-slate-400 hover:text-white underline mt-4 text-left cursor-pointer"
            >
              Show sandbox login keys
            </button>
          )}
        </div>

        {/* RIGHT COLUMN: Authentication Interface Panels */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Header Title */}
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isLoginView ? 'Verify Identification' : 'Register Clinical Profile'}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              {isLoginView 
                ? 'Authorized access is mandatory. Sign in using registered records.' 
                : 'Configure a clean health-node credentials file with your contact.'}
            </p>
          </div>

          {/* Secure Gate Selector */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl mb-6 relative">
            <button
              onClick={() => {
                setSelectedRole('patient');
                setErrorMsg('');
              }}
              className={`py-2 text-center rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'patient' 
                  ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Patient Tab
            </button>
            <button
              onClick={() => {
                setSelectedRole('doctor');
                setErrorMsg('');
              }}
              className={`py-2 text-center rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'doctor' 
                  ? 'bg-white text-indigo-800 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Doctor Tab
            </button>
            <button
              onClick={() => {
                setSelectedRole('admin');
                setErrorMsg('');
                setIsLoginView(true); // Admin cannot register
              }}
              className={`py-2 text-center rounded-lg text-xs font-bold transition-all ${
                selectedRole === 'admin' 
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Admin Tab
            </button>
          </div>

          {/* Error Message Board */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-xl p-3.5 mb-4 flex items-center gap-2"
              >
                <ShieldAlert className="h-4.5 w-4.5 text-red-500 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VIEW ROUTING */}
          {isForgotView ? (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50 mb-2">
                <span className="text-[10px] text-emerald-800 uppercase tracking-wider font-extrabold flex items-center gap-1.5 font-mono">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                  Account Recovery Pipeline: {selectedRole.toUpperCase()}
                </span>
                <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                  {forgotStep === 1 && "Specify your validated phone number or email below to request a secure 6-digit recovery token."}
                  {forgotStep === 2 && "Enter the simulated 6-digit credential token that was dispatched to your system log."}
                  {forgotStep === 3 && "Configure a premium level security credential below to restore network entrance."}
                  {forgotStep === 4 && "Security Credentials Rectified! Your security passport is updated."}
                </p>
              </div>

              {forgotStep === 1 && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Registered Email Address or Phone
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                    <input
                      type="text"
                      required
                      value={forgotEmailOrPhone}
                      onChange={(e) => setForgotEmailOrPhone(e.target.value)}
                      placeholder="e.g. kshitij.reddy@gmail.com"
                      className="w-full text-slate-800 font-medium text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 transition-all font-mono"
                    />
                  </div>
                </div>
              )}

              {forgotStep === 2 && (
                <div className="space-y-4">
                  {/* Badge Token Sandbox */}
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="text-amber-800 font-semibold font-mono text-[11px]">
                      🔑 Simulated Security Token: {generatedToken}
                    </div>
                    <button
                      type="button"
                      onClick={() => setUserTokenInput(generatedToken)}
                      className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Autofill
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Enter Security Token (6-digit)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={userTokenInput}
                        onChange={(e) => setUserTokenInput(e.target.value)}
                        placeholder="e.g. 123456"
                        className="w-full text-slate-800 font-mono tracking-widest font-bold text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {forgotStep === 3 && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Assign New Security Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={newPasswordVal}
                      onChange={(e) => setNewPasswordVal(e.target.value)}
                      placeholder="minimum 4 characters"
                      className="w-full text-slate-800 font-medium text-sm pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-slate-50/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}

              {forgotStep === 4 && (
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-2">
                  <div className="text-emerald-800 font-extrabold text-sm">
                    ✓ Account Restored Successfully!
                  </div>
                  <p className="text-slate-600 text-xs font-medium">Your credentials have been updated securely in the state ledger database.</p>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                {forgotStep !== 4 && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotView(false);
                      setForgotStep(1);
                      setErrorMsg('');
                    }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:text-slate-800 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer text-center"
                  >
                    Cancel Recovery
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  onClick={() => {
                    if (forgotStep === 4) {
                      setIsForgotView(false);
                      setForgotStep(1);
                      setIsLoginView(true);
                      setIdentifier(forgotEmailOrPhone);
                      setPassword(newPasswordVal);
                    }
                  }}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-emerald-600 transition-all cursor-pointer shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {forgotStep === 1 && "Send Recovery Code"}
                        {forgotStep === 2 && "Validate Code"}
                        {forgotStep === 3 && "Reset Password"}
                        {forgotStep === 4 && "Proceed to Sign In"}
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : isLoginView ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {selectedRole === 'admin' 
                    ? 'Superuser Access Name / Email' 
                    : `${selectedRole === 'patient' ? 'Patient' : 'Practitioner'} Registered Email / Phone`}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'admin' 
                        ? 'admin@aristotle.com' 
                        : selectedRole === 'patient' 
                          ? 'kshitij.reddy@gmail.com or 9848022338' 
                          : 'dr.siddhartha@aristotle.com or dr.siddhartha'
                    }
                    className="w-full text-slate-800 font-medium text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-slate-50/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 block">Security Keypass</label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedRole === 'admin') {
                        setErrorMsg('Administrative passwords are pre-locked. Please use the sandbox credentials.');
                        return;
                      }
                      setIsForgotView(true);
                      setForgotStep(1);
                      setForgotEmailOrPhone(identifier || '');
                      setErrorMsg('');
                    }}
                    className="text-[10px] text-emerald-600 font-bold hover:underline cursor-pointer"
                  >
                    Reset Keypass?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4.5 w-4.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-slate-800 font-medium text-sm pl-10 pr-11 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 focus:bg-slate-50/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 bg-slate-900 hover:bg-emerald-600 disabled:opacity-50 transition-all cursor-pointer shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Verifying ID Node...</span>
                    </>
                  ) : (
                    <>
                      <span>Unshackle Role Access Gate</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {selectedRole !== 'admin' && (
                <div className="text-center font-semibold text-xs text-slate-500 pt-3">
                  New {selectedRole}?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoginView(false);
                      setErrorMsg('');
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    Register Clinical Passport here
                  </button>
                </div>
              )}
            </form>
          ) : (
            // --- SIGNUP VIEW (PATIENT / DOCTOR INJECTION BLOCKS) ---
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {selectedRole === 'patient' ? (
                <>
                  {/* --- PATIENT SIGNUP FIELDS --- */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Full Legal Name</label>
                      <input
                        type="text"
                        required
                        value={patName}
                        onChange={(e) => setPatName(e.target.value)}
                        placeholder="e.g. Sridhar Raju"
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Hotline Phone</label>
                      <input
                        type="tel"
                        required
                        value={patPhone}
                        onChange={(e) => setPatPhone(e.target.value)}
                        placeholder="e.g. 9848055443"
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email Node</label>
                      <input
                        type="email"
                        required
                        value={patEmail}
                        onChange={(e) => setPatEmail(e.target.value)}
                        placeholder="sridhar@gmail.com"
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Patient Age</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={120}
                        value={patAge}
                        onChange={(e) => setPatAge(Number(e.target.value))}
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Gender</label>
                      <select
                        value={patGender}
                        onChange={(e) => setPatGender(e.target.value)}
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Blood Classification (Optional)</label>
                      <input
                        type="text"
                        value={patBlood}
                        onChange={(e) => setPatBlood(e.target.value)}
                        placeholder="B+ (Positive)"
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Clinical Allergies List (Optional)</label>
                      <input
                        type="text"
                        value={patAllergies}
                        onChange={(e) => setPatAllergies(e.target.value)}
                        placeholder="Penicillin, Dust"
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* --- DOCTOR SIGNUP FIELDS --- */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Qualified Physician Title</label>
                      <input
                        type="text"
                        required
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        placeholder="e.g. Dr. Haritha Reddy"
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={docPhone}
                        onChange={(e) => setDocPhone(e.target.value)}
                        placeholder="e.g. +91 9901234567"
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Email Node Address</label>
                      <input
                        type="email"
                        required
                        value={docEmail}
                        onChange={(e) => setDocEmail(e.target.value)}
                        placeholder="dr.haritha@aristotle.com"
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Specialization Section</label>
                      <select
                        value={docSpec}
                        onChange={(e) => setDocSpec(e.target.value)}
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden"
                      >
                        <option>Cardiologist</option>
                        <option>Dermatologist</option>
                        <option>Neurologist</option>
                        <option>Orthopedic Specialist</option>
                        <option>General Physician</option>
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Professional Qualification</label>
                      <input
                        type="text"
                        required
                        value={docQual}
                        onChange={(e) => setDocQual(e.target.value)}
                        placeholder="MBBS, DNB, MD"
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Practice Exp (Years)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={docExp}
                        onChange={(e) => setDocExp(Number(e.target.value))}
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Consultation Fee (₹)</label>
                      <input
                        type="number"
                        required
                        min={100}
                        value={docFee}
                        onChange={(e) => setDocFee(Number(e.target.value))}
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-bold text-slate-700 block mb-1">Clinical Location City</label>
                      <input
                        type="text"
                        required
                        value={docLoc}
                        onChange={(e) => setDocLoc(e.target.value)}
                        placeholder="Hitec City, Hyderabad"
                        className="w-full text-slate-800 text-sm px-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Hospital / Institute Affiliation</label>
                    <input
                      type="text"
                      required
                      value={docHosp}
                      onChange={(e) => setDocHosp(e.target.value)}
                      placeholder="ARISTOTLE Premium Health Base"
                      className="w-full text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                    />
                  </div>
                </>
              )}

              {/* Password for Signup */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Assign Secure Network Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="minimum 8 characters"
                  className="w-full text-slate-800 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition-all cursor-pointer shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4.5 w-4.5 animate-spin" />
                      <span>Creating Health Passport...</span>
                    </>
                  ) : (
                    <>
                      <span>Secure Register & Access Dashboard</span>
                      <ArrowRight className="h-4.5 w-4.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center font-semibold text-xs text-slate-500 pt-3">
                Already registered with ARISTOTLE?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLoginView(true);
                    setErrorMsg('');
                  }}
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  Sign In verification here
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
