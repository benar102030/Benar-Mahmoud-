import React, { useState } from 'react';
// Fix: Corrected import path for types
import type { Doctor } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';

interface DoctorViewProps {
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
}

const DoctorForm: React.FC<{
  onAdd: (doctor: Omit<Doctor, 'id'>) => void;
  onClose: () => void;
}> = ({ onAdd, onClose }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newDoctor: Omit<Doctor, 'id'> = {
            name: formData.get('name') as string,
            specialty: formData.get('specialty') as string,
            phone: formData.get('phone') as string,
            schedule: formData.get('schedule') as string,
        };
        onAdd(newDoctor);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="ناو" name="name" type="text" required />
            <Input label="پسپۆڕی" name="specialty" type="text" required />
            <Input label="ژمارەی تەلەفۆن" name="phone" type="tel" required />
            <Input label="خشتەی کار" name="schedule" type="text" placeholder="نموونە: شەممە-پێنجشەممە, ٩بەیانی-٥ئێوارە" required />
            <div className="flex justify-end pt-4">
                <Button type="submit">زیادکردنی دکتۆر</Button>
            </div>
        </form>
    );
};


export const DoctorView: React.FC<DoctorViewProps> = ({ doctors, addDoctor }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 text-right">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">بەڕێوەبردنی دکتۆران</h2>
            <Button onClick={() => setIsModalOpen(true)}>
                <span className="flex items-center gap-2">
                    <PlusIcon /> زیادکردنی دکتۆری نوێ
                </span>
            </Button>
        </div>
        
        <div className="mb-6 relative">
            <input
                type="text"
                placeholder="گەڕان بەدوای دکتۆردا (ناو، پسپۆڕی...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" />
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="زیادکردنی دکتۆری نوێ">
           <DoctorForm onAdd={addDoctor} onClose={() => setIsModalOpen(false)} />
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map(doctor => (
                <Card key={doctor.id}>
                    <div className="p-5">
                        <h3 className="text-xl font-bold text-teal-700">{doctor.name}</h3>
                        <p className="text-md font-semibold text-teal-600">{doctor.specialty}</p>
                        <div className="mt-4 space-y-2 text-sm text-gray-700">
                           <p><strong>تەلەفۆن:</strong> {doctor.phone}</p>
                           <p><strong>خشتەی کار:</strong> {doctor.schedule}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
};