import { Doctor, Patient, MedicalReport, MedicalCondition, Prescription, BillingInvoice, Notification, AmbulanceRequest } from './types';

export const demoDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Shiva Narayana',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=300&auto=format&fit=crop',
    qualification: 'MD, DM (Cardiology) - AIIMS',
    specialization: 'Cardiologist',
    experience: 13,
    rating: 4.3,
    languages: ['English', 'Telugu',],
    fee: 670,
    hospital: 'AIIMS',
    location: 'Gachibowli, Hyderabad',
    availableDays: ['Monday', 'Tuesday', 'Wednusday', 'Thursday', 'Friday'],
    workingHours: {
      start: '09:00 AM',
      end: '05:00 PM',
      breakStart: '01:00 PM',
      breakEnd: '02:00 PM'
    }
  },
  {
    id: 'doc-2',
    name: 'Dr. Arundhati Devi',
    photo: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?q=80&w=300&auto=format&fit=crop',
    qualification: 'MD, DNB (Dermatology)',
    specialization: 'Dermatologist',
    experience: 11,
    rating: 4.8,
    languages: ['English', 'Telugu'],
    fee: 600,
    hospital: 'ARISTOTLE Clinic & Aesthetics Base',
    location: 'Jubilee Hills, Hyderabad',
    availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
    workingHours: {
      start: '10:00 AM',
      end: '06:00 PM',
      breakStart: '01:30 PM',
      breakEnd: '02:30 PM'
    }
  },
  {
    id: 'doc-3',
    name: 'Dr. Vikram Prasad',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=300&auto=format&fit=crop',
    qualification: 'MCh, MS (Neurology) - NIMHANS',
    specialization: 'Neurologist',
    experience: 18,
    rating: 5.0,
    languages: ['English', 'Telugu', 'Hindi', 'Tamil'],
    fee: 1000,
    hospital: 'ARISTOTLE Neural Sciences Hospital',
    location: 'Banjara Hills, Hyderabad',
    availableDays: ['Tuesday', 'Thursday', 'Friday'],
    workingHours: {
      start: '09:00 AM',
      end: '04:00 PM',
      breakStart: '12:30 PM',
      breakEnd: '01:30 PM'
    }
  },
  {
    id: 'doc-4',
    name: 'Dr. Nithin Varma',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop',
    qualification: 'MS (Orthopedics), Fellowship in Joint Replacement',
    specialization: 'Orthopedic Specialist',
    experience: 13,
    rating: 4.7,
    languages: ['English', 'Telugu', 'Kannada'],
    fee: 700,
    hospital: 'ARISTOTLE Trauma & Joint Care Centre',
    location: 'Secunderabad, Hyderabad',
    availableDays: ['Monday', 'Tuesday', 'Thursday', 'Saturday'],
    workingHours: {
      start: '09:30 AM',
      end: '05:30 PM',
      breakStart: '01:00 PM',
      breakEnd: '02:00 PM'
    }
  }
];

export const demoPatient: Patient = {
  id: 'pat-101',
  name: 'Kshitij Reddy',
  email: 'kshitij.reddy@gmail.com',
  phone: '9848022338',
  age: 34,
  gender: 'Male',
  bloodGroup: 'O+ (Positive)',
  allergies: ['Penicillin', 'Peanuts']
};

export const demoReports: MedicalReport[] = [
  {
    id: 'rep-1',
    patientId: 'pat-101',
    title: 'Comprehensive Hematology Analytics',
    type: 'Blood Test',
    date: '2026-05-15',
    doctorName: 'Dr. Siddhartha Rao',
    status: 'Normal',
    summary: 'All basic parameters are within therapeutic reference limits. Moderate lipid variance reported.',
    metrics: [
      { name: 'Hemoglobin', value: '14.8 g/dL', reference: '13.0 - 17.0 g/dL', status: 'normal' },
      { name: 'Total Cholesterol', value: '195 mg/dL', reference: '< 200 mg/dL', status: 'normal' },
      { name: 'Fasting Blood Glucose', value: '94 mg/dL', reference: '70 - 100 mg/dL', status: 'normal' },
      { name: 'HDL Cholesterol', value: '42 mg/dL', reference: '> 40 mg/dL', status: 'normal' },
      { name: 'Thyroid Stimulating Hormone (TSH)', value: '2.1 mIU/L', reference: '0.4 - 4.5 mIU/L', status: 'normal' }
    ]
  },
  {
    id: 'rep-2',
    patientId: 'pat-101',
    title: '12-Lead Electrocardiogram Baseline',
    type: 'ECG',
    date: '2026-05-20',
    doctorName: 'Dr. Siddhartha Rao',
    status: 'Needs Review',
    summary: 'Sinus rhythm recorded at 76 BPM. Minor ST segment elevation noted in anterior leads. Correlate clinically.',
    metrics: [
      { name: 'Heart Rate', value: '76 BPM', reference: '60 - 100 BPM', status: 'normal' },
      { name: 'PR Interval', value: '158 ms', reference: '120 - 200 ms', status: 'normal' },
      { name: 'QRS Duration', value: '92 ms', reference: '80 - 120 ms', status: 'normal' },
      { name: 'QTc Interval', value: '445 ms', reference: '< 450 ms', status: 'normal' },
      { name: 'ST-Segment Elevation', value: '0.12 mV', reference: '< 0.1 mV', status: 'high' }
    ]
  },
  {
    id: 'rep-3',
    patientId: 'pat-101',
    title: 'Chest Radiograph Posterior-Anterior View',
    type: 'X-Ray',
    date: '2026-04-10',
    doctorName: 'Dr. Nithin Varma',
    status: 'Normal',
    summary: 'No focal consolidation, pleural effusion, or notable cardiomegaly. Lung fields are clear and diaphragm contours are normal.',
    metrics: [
      { name: 'Lung Expansion', value: 'Optimal', reference: 'Optimal', status: 'normal' },
      { name: 'Cardiothoracic Ratio', value: '0.47', reference: '< 0.50', status: 'normal' },
      { name: 'Costo-phrenic Angles', value: 'Sharp', reference: 'Sharp', status: 'normal' }
    ]
  },
  {
    id: 'rep-4',
    patientId: 'pat-101',
    title: 'Lumbar Spine MRI Scan',
    type: 'MRI',
    date: '2026-03-05',
    doctorName: 'Dr. Vikram Prasad',
    status: 'Needs Review',
    summary: 'L4-L5 minor disc protrusion causing mild indent on the anterior aspect of the thecal sac. Left exits neural foraminal narrowing.',
    metrics: [
      { name: 'L3-L4 Disc Space', value: 'Preserved', reference: 'Preserved', status: 'normal' },
      { name: 'L4-L5 Disc Herniation', value: 'Protrusion (2.3mm)', reference: 'None', status: 'high' },
      { name: 'Canal Stenosis', value: 'None', reference: 'None', status: 'normal' }
    ]
  }
];

export const demoConditions: MedicalCondition[] = [
  {
    id: 'cond-1',
    patientId: 'pat-101',
    name: 'Mild Hypertension',
    severity: 'Mild',
    status: 'Active',
    lastUpdated: '2026-05-20',
    notes: 'Awaiting ECG progression assessment. Advised low sodium dashboard diet and daily cardio walks.'
  },
  {
    id: 'cond-2',
    patientId: 'pat-101',
    name: 'L4-L5 Disc Bulge',
    severity: 'Moderate',
    status: 'Monitored',
    lastUpdated: '2026-03-12',
    notes: 'Prescribed spinal strengthening yoga. Surgical intervention not indicated.'
  },
  {
    id: 'cond-3',
    patientId: 'pat-101',
    name: 'Seasonal Bronchial Asthma',
    severity: 'Mild',
    status: 'Resolved',
    lastUpdated: '2026-01-15',
    notes: 'Resolved post allergen avoidance strategy and standard prophylactic inhaler regimen.'
  }
];

export const demoPrescriptions: Prescription[] = [
  {
    id: 'rx-1',
    patientId: 'pat-101',
    doctorName: 'Dr. Siddhartha Rao',
    date: '2026-05-20',
    medicineName: 'Telmisartan 40mg',
    dosage: '40mg',
    frequency: 'Once Daily (Post-Breakfast)',
    duration: '90 Days',
    refillStatus: 'Available'
  },
  {
    id: 'rx-2',
    patientId: 'pat-101',
    doctorName: 'Dr. Siddhartha Rao',
    date: '2026-05-20',
    medicineName: 'Atorvastatin 10mg',
    dosage: '10mg',
    frequency: 'Once Daily (At Bedtime)',
    duration: '30 Days',
    refillStatus: 'Refilled'
  },
  {
    id: 'rx-3',
    patientId: 'pat-101',
    doctorName: 'Dr. Vikram Prasad',
    date: '2026-03-12',
    medicineName: 'Pregabalin 75mg',
    dosage: '75mg',
    frequency: 'Twice Daily (Morning/Night)',
    duration: '14 Days',
    refillStatus: 'Expired'
  },
  {
    id: 'rx-4',
    patientId: 'pat-101',
    doctorName: 'Dr. Nithin Varma',
    date: '2026-04-10',
    medicineName: 'Methylcobalamin & Vitamin D3 Support',
    dosage: '1 Capsule',
    frequency: 'Once Daily (Post-Lunch)',
    duration: '30 Days',
    refillStatus: 'Available'
  }
];

export const demoInvoices: BillingInvoice[] = [
  {
    id: 'inv-1',
    patientId: 'pat-101',
    serviceName: 'Cardiovascular Assessment & Consulting Suite',
    provider: 'ARISTOTLE Cardiac Care Institute',
    amount: 800,
    date: '2026-05-20',
    dueDate: '2026-05-20',
    status: 'Paid',
    invoiceNo: 'ART-2026-8841'
  },
  {
    id: 'inv-2',
    patientId: 'pat-101',
    serviceName: 'High-Resolution 12-Lead ECG Analysis',
    provider: 'ARISTOTLE Laboratory division',
    amount: 450,
    date: '2026-05-20',
    dueDate: '2026-06-15',
    status: 'Pending',
    invoiceNo: 'ART-2026-8802'
  },
  {
    id: 'inv-3',
    patientId: 'pat-101',
    serviceName: 'Lumbar Spine MRI Diagnostics & Reporting',
    provider: 'ARISTOTLE Radiology Group',
    amount: 5500,
    date: '2026-03-05',
    dueDate: '2026-03-20',
    status: 'Insurance Claim',
    invoiceNo: 'ART-2026-4239'
  },
  {
    id: 'inv-4',
    patientId: 'pat-101',
    serviceName: 'Premium ALS Rescue Transport Base Fee',
    provider: 'ARISTOTLE Rapid Logistics',
    amount: 1500,
    date: '2026-06-01',
    dueDate: '2026-06-12',
    status: 'Overdue',
    invoiceNo: 'ART-2026-9011'
  }
];

export const demoNotifications: Notification[] = [
  {
    id: 'not-1',
    userId: 'pat-101',
    type: 'appointment_update',
    title: 'Consultation Approved',
    message: 'Dr. Siddhartha Rao approved your booking for June 15 at 10:30 AM.',
    time: '2 hours ago',
    read: false
  },
  {
    id: 'not-2',
    userId: 'pat-101',
    type: 'billing_alert',
    title: 'Pending Laboratory Invoice',
    message: 'Invoice ART-2026-8802 (₹450) is generated. Pay prior to June 15.',
    time: 'Yesterday',
    read: true
  },
  {
    id: 'not-3',
    userId: 'doc-1',
    type: 'emergency_alert',
    title: 'Ambulance Call Dispatch Node',
    message: 'ALS Ambulance #04 requested nearby. Cardiac critical priority.',
    time: '5 mins ago',
    read: false
  },
  {
    id: 'not-4',
    userId: 'admin',
    type: 'system',
    title: 'Dispatch Center Update',
    message: 'Neonatal Incubator Carrier registered with Gachibowli emergency depot.',
    time: '1 hour ago',
    read: false
  }
];

export const demoAmbulanceRequests: AmbulanceRequest[] = [
  {
    id: 'amb-req-101',
    patientName: 'Kamesh Murthy',
    patientPhone: '9848033104',
    location: 'Plot 44, Madhapur, Hyderabad',
    emergencyType: 'Cardiac Arrest / Severe Chest Pain',
    ambulanceType: 'Advanced Life Support (ALS)',
    status: 'Driver En Route',
    eta: 3,
    driverName: 'Srinivasa Reddy',
    driverPhone: '+91 9908812345',
    driverPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    vehicleNo: 'TS-09-EA-4482',
    createdAt: '2026-06-08T05:20:00Z'
  },
  {
    id: 'amb-req-102',
    patientName: 'Anitha Varma',
    patientPhone: '9440122394',
    location: 'Kukatpally Metro Station Complex',
    emergencyType: 'Severe Injury / Accident Trauma',
    ambulanceType: 'Basic Life Support (BLS)',
    status: 'Reached Destination',
    eta: 0,
    driverName: 'Mohammad Ali',
    driverPhone: '+91 9100223344',
    driverPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    vehicleNo: 'TS-07-EA-9910',
    createdAt: '2026-06-08T04:45:00Z'
  }
];

export const faqs = [
  {
    q: "How fast is research-grade telemetry ambulance dispatch?",
    a: "Under the ARISTOTLE emergency umbrella, critical cases trigger automatic multi-layered GPS routing. Dispatch response is triggered in under 90 seconds, and the average arrival time across major metropolitan sectors is strictly capped at 8.5 minutes."
  },
  {
    q: "Can I manage family health records under one medical portal?",
    a: "Yes. The ARISTOTLE core architecture lets primary users construct family sub-nodes, link unique ID cards, view electronic prescriptions, and coordinate dynamic specialist appointments for dependents in one safe interface."
  },
  {
    q: "Is Telugu translation available across clinical operations?",
    a: "Absolutely. As part of our healthcare accessibility mission, the platform integrates seamless English ('ఇంగ్లీష్') and Telugu ('తెలుగు') language toggle infrastructure across diagnostic report views, prescription dosages, emergency dispatches, and appointment flows."
  },
  {
    q: "Is emergency ambulance booking free?",
    a: "Ambulance requests initiated in real emergency trauma are instantly triaged and dispatched. Compensation and billing are managed directly via our premium network of integrated insurance claims without requiring upfront payment gateways."
  }
];
