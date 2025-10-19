import React, { useState } from 'react';
// Fix: Corrected import path for types
import type { Patient, Doctor } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { Select } from './ui/Select';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';

interface PatientViewProps {
  patients: Patient[];
  doctors: Doctor[];
  addPatient: (patient: Omit<Patient, 'id' | 'registrationDate'>) => void;
}

const PatientForm: React.FC<{
  doctors: Doctor[];
  onAdd: (patient: Omit<Patient, 'id' | 'registrationDate'>) => void;
  onClose: () => void;
}> = ({ doctors, onAdd, onClose }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newPatient: Omit<Patient, 'id' | 'registrationDate'> = {
            name: formData.get('name') as string,
            gender: formData.get('gender') as 'نێر' | 'مێ',
            age: parseInt(formData.get('age') as string, 10),
            phone: formData.get('phone') as string,
            address: formData.get('address') as string,
            disease: formData.get('disease') as string,
            doctorId: formData.get('doctorId') ? parseInt(formData.get('doctorId') as string, 10) : null,
        };
        onAdd(newPatient);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="ناو" name="name" type="text" required />
            <Select label="ڕەگەز" name="gender" required>
                <option value="نێر">نێر</option>
                <option value="مێ">مێ</option>
            </Select>
            <Input label="تەمەن" name="age" type="number" required />
            <Input label="ژمارەی تەلەفۆن" name="phone" type="tel" required />
            <Input label="ناونیشان" name="address" type="text" required />
            <Input label="نەخۆشی" name="disease" type="text" required />
            <Select label="دکتۆری چارەسەرکەر" name="doctorId">
                <option value="">هیچ</option>
                {doctors.map(doc => <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</option>)}
            </Select>
            <div className="flex justify-end pt-4">
                <Button type="submit">زیادکردنی نەخۆش</Button>
            </div>
        </form>
    );
};


export const PatientView: React.FC<PatientViewProps> = ({ patients, doctors, addPatient }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery) ||
    patient.disease.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 text-right">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">بەڕێوەبردنی نەخۆشان</h2>
            <Button onClick={() => setIsModalOpen(true)}>
                <span className="flex items-center gap-2">
                    <PlusIcon /> زیادکردنی نەخۆشی نوێ
                </span>
            </Button>
        </div>
        
        <div className="mb-6 relative">
            <input
                type="text"
                placeholder="گەڕان بەدوای نەخۆشدا (ناو، تەلەفۆن، نەخۆشی...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" />
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="زیادکردنی نەخۆشی نوێ">
           <PatientForm doctors={doctors} onAdd={addPatient} onClose={() => setIsModalOpen(false)} />
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map(patient => {
                const doctor = doctors.find(d => d.id === patient.doctorId);
                return (
                <Card key={patient.id}>
                    <div className="p-5">
                        <h3 className="text-xl font-bold text-blue-700">{patient.name}</h3>
                        <p className="text-sm text-gray-500">{patient.gender}, {patient.age} ساڵ</p>
                        <div className="mt-4 space-y-2 text-sm text-gray-700">
                           <p><strong>بەرواری تۆمارکردن:</strong> {new Date(patient.registrationDate).toLocaleDateString('ku-IQ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                           <p><strong>نەخۆشی:</strong> {patient.disease}</p>
                           <p><strong>تەلەفۆن:</strong> {patient.phone}</p>
                           <p><strong>ناونیشان:</strong> {patient.address}</p>
                           <p><strong>دکتۆر:</strong> {doctor ? doctor.name : 'دیارینەکراوە'}</p>
                        </div>
                    </div>
                </Card>
                );
            })}
        </div>
    </div>
  );
};