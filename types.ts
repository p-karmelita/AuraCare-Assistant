
export interface Patient {
  fullName: string;
  dob: string;
  contact: string;
  symptoms: string;
  pastConditions?: string;
  surgeries?: string;
  medications?: string;
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
export type IntakeStep = 'intake' | 'specialty' | 'doctors' | 'confirmation';


export interface GroundingSource {
  uri: string;
  title: string;
}

export interface User {
    name: string;
    email: string;
    picture: string;
}

// FIX: Add a global declaration for the `google` object on the `window` to resolve TypeScript errors.
declare global {
  interface Window {
    google: any;
  }
}
