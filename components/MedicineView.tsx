import React, { useState } from 'react';
// Fix: Corrected import path for types
import type { Medicine } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';

interface MedicineViewProps {
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
}

const MedicineForm: React.FC<{
  onAdd: (medicine: Omit<Medicine, 'id'>) => void;
  onClose: () => void;
}> = ({ onAdd, onClose }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newMedicine: Omit<Medicine, 'id'> = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string),
            stock: parseInt(formData.get('stock') as string, 10),
        };
        onAdd(newMedicine);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="ناو" name="name" type="text" required />
            <Input label="وەسف" name="description" type="text" required />
            <Input label="نرخ" name="price" type="number" step="0.01" required />
            <Input label="کۆگا" name="stock" type="number" required />
            <div className="flex justify-end pt-4">
                <Button type="submit">زیادکردنی دەرمان</Button>
            </div>
        </form>
    );
};


export const MedicineView: React.FC<MedicineViewProps> = ({ medicines, addMedicine }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-8 text-right">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">بەڕێوەبردنی دەرمانەکان</h2>
            <Button onClick={() => setIsModalOpen(true)}>
                <span className="flex items-center gap-2">
                    <PlusIcon /> زیادکردنی دەرمانی نوێ
                </span>
            </Button>
        </div>
        
        <div className="mb-6 relative">
            <input
                type="text"
                placeholder="گەڕان بەدوای دەرماندا (ناو، وەسف...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" />
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="زیادکردنی دەرمانی نوێ">
           <MedicineForm onAdd={addMedicine} onClose={() => setIsModalOpen(false)} />
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map(med => (
                <Card key={med.id}>
                    <div className="p-5">
                        <div className="flex justify-between items-start">
                           <div>
                             <h3 className="text-xl font-bold text-green-700">{med.name}</h3>
                             <p className="text-sm text-gray-500">{med.description}</p>
                           </div>
                           <span className="text-lg font-bold text-green-800">{med.price.toFixed(2)}</span>
                        </div>
                        <div className="mt-4">
                           <p className="text-sm text-gray-700"><strong>کۆگا:</strong> {med.stock} دانە</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
};