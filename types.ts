
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

export type AppStep = 'intake' | 'specialty' | 'doctors' | 'confirmation';

export interface GroundingSource {
  uri: string;
  title: string;
}