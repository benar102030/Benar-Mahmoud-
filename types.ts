// Defining the data types for the application.
export interface Patient {
  id: number;
  name: string;
  gender: 'نێر' | 'مێ';
  age: number;
  phone: string;
  address: string;
  disease: string;
  registrationDate: string; // ISO date string
  doctorId: number | null;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  phone: string;
  schedule: string;
}

export interface Visit {
  id: number;
  patientId: number;
  doctorId: number;
  visitDate: string; // YYYY-MM-DD
  diagnosis: string;
  prescription: string;
}

export interface Medicine {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
}

export interface Room {
    id: number;
    type: string;
    capacity: number;
    status: 'بەردەستە' | 'داگیرکراوە' | 'لەژێر چاککردنەوەدایە';
}
