
export interface Patient {
  fullName: string;
  dob: string;
  contact: string;
  symptoms: string;
  pastConditions?: string;
  surgeries?: string;
  medications?: string;
}

// Fix: Add User interface for authentication, which was missing and causing import errors.
export interface User {
  name: string;
  email: string;
  picture?: string;
}

export interface Doctor {
  name: string;
  specialty: string;
  clinicName: string;
  address: string;
  rating: number;
  photoUrl?: string;
  bio?: string;
}

export interface Appointment {
  id: string;
  doctor: Doctor;
  date: string; // ISO string format for easier sorting
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Payment Due';
  cost: number;
}

export interface SpecialtyResponse {
    specialty: string;
    analysis: string;
}

export type AppPage = 'home' | 'intake' | 'about' | 'patient' | 'blog';
export type IntakeStep = 'intake' | 'specialty' | 'doctors' | 'confirmation' | 'imageAnalysis';


export interface GroundingSource {
  uri: string;
  title: string;
}
export interface MedicalEvent {
  name: string;
  date: string;
  location: string;
  description: string;
  url: string;
  imageUrl?: string;
}

export interface Comment {
    id: string;
    author: string;
    avatarUrl: string;
    text: string;
    date: string;
}

export interface BlogPost {
    id: string;
    titleKey: string;
    summaryKey: string;
    contentKey: string;
    imageUrl: string;
    author: string;
    date: string;
}