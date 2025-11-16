
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

export interface SpecialtyResponse {
    specialty: string;
    analysis: string;
}

export type AppPage = 'home' | 'intake' | 'about';
export type IntakeStep = 'intake' | 'specialty' | 'doctors' | 'confirmation' | 'imageAnalysis';


export interface GroundingSource {
  uri: string;
  title: string;
}