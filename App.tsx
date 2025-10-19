// Implementing the main App component, which manages state and renders different views.
import React, { useState } from 'react';
import { Header } from './components/Header';
import { PatientView } from './components/PatientView';
import { DoctorView } from './components/DoctorView';
import { VisitView } from './components/VisitView';
import { MedicineView } from './components/MedicineView';
import { RoomView } from './components/RoomView';
import { StatisticsView } from './components/StatisticsView';
import type { Patient, Doctor, Visit, Medicine, Room } from './types';

// --- Data Generation ---
const generateRandomDate = (start: Date, end: Date): string => {
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString();
};

const names = ['ئارام', 'سۆزان', 'هێمن', 'ژاڵە', 'کاروان', 'دڵنیا', 'بەختیار', 'نەرمین', 'ڕێبوار', 'شیلان', 'ئاسۆ', 'سارا', 'کەمال', 'ئەحمەد', 'عەلی', 'قادر', 'جەمال', 'محەمەد', 'عوسمان', 'کەریم'];
const cities = ['سلێمانی', 'هەولێر', 'کەرکوک', 'دهۆک', 'هەڵەبجە', 'ڕانیە', 'کۆیە', 'زاخۆ', 'چەمچەماڵ'];
const diseases = ['هەڵامەت', 'سەرئێشە', 'ئەنفلۆنزا', 'نەخۆشیی شەکرە', 'بەرزی فشاری خوێن', 'ئازاری پشت', 'هەستیاری', 'کۆکە', 'ئازاری گەدە', 'کلۆربوونی ددان'];
const specialties = ['گشتی', 'ددان', 'منداڵان', 'هەناو', 'دڵ و خوێنبەرەکان', 'پێست', 'قورگ و لووت و گوێ', 'ئێسک و جومگە', 'ژنان و منداڵبوون'];
const medicineNames = ['ئامۆکسیلین', 'پانادۆڵ', 'ئەسپرین', 'ڤۆڵتارین', 'پرۆفین', 'ڤیتامین سی', 'ئۆمیپرازۆڵ', 'لۆسارتان', 'ئەملۆدیپین', 'سابوتامۆل'];

const generateInitialData = () => {
    const doctors: Doctor[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `د. ${names[Math.floor(Math.random() * names.length)]} ${names[Math.floor(Math.random() * names.length)]}`,
        specialty: specialties[Math.floor(Math.random() * specialties.length)],
        phone: `07${['70','50','51','71'][Math.floor(Math.random()*4)]}${Math.floor(1000000 + Math.random() * 9000000)}`,
        schedule: 'شەممە-پێنجشەممە, ٩بەیانی-٥ئێوارە',
    }));

    const patients: Patient[] = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `${names[Math.floor(Math.random() * names.length)]} ${names[Math.floor(Math.random() * names.length)]}`,
        gender: Math.random() > 0.5 ? 'نێر' : 'مێ',
        age: Math.floor(18 + Math.random() * 60),
        phone: `07${['70','50','51','71'][Math.floor(Math.random()*4)]}${Math.floor(1000000 + Math.random() * 9000000)}`,
        address: `${cities[Math.floor(Math.random() * cities.length)]}, گەڕەکی ${i+1}`,
        disease: diseases[Math.floor(Math.random() * diseases.length)],
        registrationDate: generateRandomDate(new Date(2022, 0, 1), new Date()),
        doctorId: Math.floor(1 + Math.random() * doctors.length),
    }));

    const visits: Visit[] = Array.from({ length: 2000 }, (_, i) => ({
        id: i + 1,
        patientId: Math.floor(1 + Math.random() * patients.length),
        doctorId: Math.floor(1 + Math.random() * doctors.length),
        visitDate: generateRandomDate(new Date(2022, 0, 1), new Date()).split('T')[0],
        diagnosis: diseases[Math.floor(Math.random() * diseases.length)],
        prescription: medicineNames[Math.floor(Math.random() * medicineNames.length)],
    }));

    const medicines: Medicine[] = Array.from({ length: 200 }, (_, i) => ({
        id: i + 1,
        name: `${medicineNames[Math.floor(Math.random() * medicineNames.length)]} ${['500mg', '250mg', '100mg'][Math.floor(Math.random()*3)]}`,
        description: `بۆ چارەسەری ${diseases[Math.floor(Math.random() * diseases.length)]}`,
        price: parseFloat((5 + Math.random() * 95).toFixed(2)),
        stock: Math.floor(50 + Math.random() * 450),
    }));

    const rooms: Room[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        type: ['تاکەکەسی', 'دووکەسی', 'VIP', 'سویت'][Math.floor(Math.random() * 4)],
        capacity: Math.floor(1 + Math.random() * 4),
        status: ['بەردەستە', 'داگیرکراوە', 'لەژێر چاککردنەوەدایە'][Math.floor(Math.random() * 3)] as 'بەردەستە' | 'داگیرکراوە' | 'لەژێر چاککردنەوەدایە',
    }));

    return { patients, doctors, visits, medicines, rooms };
};

const {
    patients: initialPatients,
    doctors: initialDoctors,
    visits: initialVisits,
    medicines: initialMedicines,
    rooms: initialRooms,
} = generateInitialData();


function App() {
  const [activeView, setActiveView] = useState('statistics');
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [visits, setVisits] = useState<Visit[]>(initialVisits);
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  
  const addPatient = (patient: Omit<Patient, 'id' | 'registrationDate'>) => {
    const newPatient: Patient = {
      ...patient,
      id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
      registrationDate: new Date().toISOString(),
    };
    setPatients(prev => [...prev, newPatient]);
  };

  const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
    const newDoctor: Doctor = {
      ...doctor,
      id: doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1,
    };
    setDoctors(prev => [...prev, newDoctor]);
  };
  
  const addVisit = (visit: Omit<Visit, 'id'>) => {
    const newVisit: Visit = {
        ...visit,
        id: visits.length > 0 ? Math.max(...visits.map(v => v.id)) + 1 : 1,
    };
    setVisits(prev => [...prev, newVisit]);
  };
  
  const addMedicine = (medicine: Omit<Medicine, 'id'>) => {
    const newMedicine: Medicine = {
        ...medicine,
        id: medicines.length > 0 ? Math.max(...medicines.map(m => m.id)) + 1 : 1,
    };
    setMedicines(prev => [...prev, newMedicine]);
  };
  
  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom: Room = {
        ...room,
        id: rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1,
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoomStatus = (roomId: number, status: Room['status']) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId ? { ...room, status } : room
      )
    );
  };

  const renderView = () => {
    switch (activeView) {
      case 'patients':
        return <PatientView patients={patients} doctors={doctors} addPatient={addPatient} />;
      case 'doctors':
        return <DoctorView doctors={doctors} addDoctor={addDoctor} />;
      case 'visits':
        return <VisitView visits={visits} patients={patients} doctors={doctors} addVisit={addVisit} />;
      case 'medicines':
        return <MedicineView medicines={medicines} addMedicine={addMedicine} />;
      case 'rooms':
        return <RoomView rooms={rooms} addRoom={addRoom} updateRoomStatus={updateRoomStatus} />;
      case 'statistics':
      default:
        return <StatisticsView patients={patients} doctors={doctors} visits={visits} rooms={rooms} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100" dir="rtl">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="container mx-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default App;