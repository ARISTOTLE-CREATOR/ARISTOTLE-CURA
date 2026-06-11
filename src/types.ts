export type Language = 'en' | 'te';

export type UserRole = 'guest' | 'patient' | 'doctor' | 'admin';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  bloodGroup?: string;
  allergies?: string[];
  password?: string;
}

export interface Doctor {
  id: string;
  name: string;
  photo: string;
  qualification: string;
  specialization: string;
  experience: number; // in years
  rating: number;
  languages: string[];
  fee: number;
  hospital: string;
  location: string;
  availableDays: string[]; // ['Monday', 'Tuesday', ...]
  workingHours: {
    start: string; // '09:00 AM'
    end: string; // '05:00 PM'
    breakStart: string; // '01:00 PM'
    breakEnd: string; // '02:00 PM'
  };
  password?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  hospital: string;
  date: string;
  timeSlot: string;
  consultationType: 'Video Call' | 'In-Clinic' | 'Chat';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Rescheduled' | 'Completed';
  rejectionReason?: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  type: 'Blood Test' | 'ECG' | 'X-Ray' | 'MRI' | 'CT Scan';
  date: string;
  doctorName: string;
  status: 'Normal' | 'Needs Review' | 'Critical';
  summary: string;
  metrics: { name: string; value: string; reference: string; status: 'normal' | 'high' | 'low' }[];
}

export interface MedicalCondition {
  id: string;
  patientId: string;
  name: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  status: 'Active' | 'Monitored' | 'Resolved';
  lastUpdated: string;
  notes: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorName: string;
  date: string;
  medicineName: string;
  dosage: string; // '500mg'
  frequency: string; // 'Once daily' / 'Twice daily'
  duration: string; // '7 Days'
  refillStatus: 'Available' | 'Refilled' | 'Expired';
}

export interface BillingInvoice {
  id: string;
  patientId: string;
  serviceName: string;
  provider: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Insurance Claim' | 'Overdue';
  invoiceNo: string;
}

export type AmbulanceStatus = 'Request Submitted' | 'Ambulance Assigned' | 'Driver En Route' | 'Arriving Soon' | 'Reached Destination';

export interface AmbulanceRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  location: string;
  emergencyType: string; // 'Cardiac' | 'Accident' | 'Pregnancy' | 'Other'
  ambulanceType: 'Basic Life Support (BLS)' | 'Advanced Life Support (ALS)' | 'ICU Ambulance' | 'Neonatal Ambulance';
  status: AmbulanceStatus;
  eta: number; // in minutes
  driverName?: string;
  driverPhone?: string;
  driverPhoto?: string;
  vehicleNo?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string; // patientId or doctorId or 'admin'
  type: 'appointment_update' | 'emergency_alert' | 'billing_alert' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}
