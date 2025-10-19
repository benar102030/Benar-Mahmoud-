import React, { useState } from 'react';
// Fix: Corrected import path for types
import type { Visit, Patient, Doctor } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { Select } from './ui/Select';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';

interface VisitViewProps {
  visits: Visit[];
  patients: Patient[];
  doctors: Doctor[];
  addVisit: (visit: Omit<Visit, 'id'>) => void;
}

const VisitForm: React.FC<{
  patients: Patient[];
  doctors: Doctor[];
  onAdd: (visit: Omit<Visit, 'id'>) => void;
  onClose: () => void;
}> = ({ patients, doctors, onAdd, onClose }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newVisit: Omit<Visit, 'id'> = {
            patientId: parseInt(formData.get('patientId') as string, 10),
            doctorId: parseInt(formData.get('doctorId') as string, 10),
            visitDate: formData.get('visitDate') as string,
            diagnosis: formData.get('diagnosis') as string,
            prescription: formData.get('prescription') as string,
        };
        onAdd(newVisit);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Select label="نەخۆش" name="patientId" required>
                <option value="">نەخۆشێک هەڵبژێرە</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
            <Select label="دکتۆر" name="doctorId" required>
                <option value="">دکتۆرێک هەڵبژێرە</option>
                {doctors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </Select>
            <Input label="ڕێکەوتی سەردان" name="visitDate" type="date" required />
            <Input label="دەستنیشانکردن" name="diagnosis" type="text" required />
            <Input label="ڕەچەتەی دەرمان" name="prescription" type="text" required />
            <div className="flex justify-end pt-4">
                <Button type="submit">زیادکردنی سەردان</Button>
            </div>
        </form>
    );
};


export const VisitView: React.FC<VisitViewProps> = ({ visits, patients, doctors, addVisit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const lowercasedQuery = searchQuery.toLowerCase();

  const filteredVisits = visits.filter(visit => {
    const patient = patients.find(p => p.id === visit.patientId);
    const doctor = doctors.find(d => d.id === visit.doctorId);

    return (
      (patient && patient.name.toLowerCase().includes(lowercasedQuery)) ||
      (doctor && doctor.name.toLowerCase().includes(lowercasedQuery)) ||
      visit.diagnosis.toLowerCase().includes(lowercasedQuery) ||
      visit.prescription.toLowerCase().includes(lowercasedQuery)
    );
  });

  return (
    <div className="p-8 text-right">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">بەڕێوەبردنی سەردانەکان</h2>
            <Button onClick={() => setIsModalOpen(true)}>
                <span className="flex items-center gap-2">
                    <PlusIcon /> زیادکردنی سەردانی نوێ
                </span>
            </Button>
        </div>
        
        <div className="mb-6 relative">
            <input
                type="text"
                placeholder="گەڕان (ناوی نەخۆش، ناوی دکتۆر، دەستنیشانکردن...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" />
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="زیادکردنی سەردانی نوێ">
           <VisitForm patients={patients} doctors={doctors} onAdd={addVisit} onClose={() => setIsModalOpen(false)} />
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVisits.map(visit => {
                const patient = patients.find(p => p.id === visit.patientId);
                const doctor = doctors.find(d => d.id === visit.doctorId);
                return (
                <Card key={visit.id}>
                    <div className="p-5">
                        <h3 className="text-xl font-bold text-indigo-700">{patient ? patient.name : 'نەخۆشی نەناسراو'}</h3>
                        <p className="text-sm text-gray-500">سەردان لە {new Date(visit.visitDate).toLocaleDateString()}</p>
                        <div className="mt-4 space-y-2 text-sm text-gray-700">
                           <p><strong>دکتۆر:</strong> {doctor ? doctor.name : 'دکتۆری نەناسراو'}</p>
                           <p><strong>دەستنیشانکردن:</strong> {visit.diagnosis}</p>
                           <p><strong>ڕەچەتە:</strong> {visit.prescription}</p>
                        </div>
                    </div>
                </Card>
                );
            })}
        </div>
    </div>
  );
};