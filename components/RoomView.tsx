

import React, { useState } from 'react';
// Fix: Corrected import path for types
import type { Room } from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { Select } from './ui/Select';
import { PlusIcon } from './icons/PlusIcon';
import { SearchIcon } from './icons/SearchIcon';

interface RoomViewProps {
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoomStatus: (roomId: number, status: Room['status']) => void;
}

const RoomForm: React.FC<{
  onAdd: (room: Omit<Room, 'id'>) => void;
  onClose: () => void;
}> = ({ onAdd, onClose }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newRoom: Omit<Room, 'id'> = {
            type: formData.get('type') as string,
            capacity: parseInt(formData.get('capacity') as string, 10),
            status: formData.get('status') as 'بەردەستە' | 'داگیرکراوە' | 'لەژێر چاککردنەوەدایە',
        };
        onAdd(newRoom);
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="جۆری ژوور" name="type" type="text" placeholder="نموونە: تاکەکەسی, VIP" required />
            <Input label="توانا (کەس)" name="capacity" type="number" required />
            <Select label="بارودۆخ" name="status" required>
                <option value="بەردەستە">بەردەستە</option>
                <option value="داگیرکراوە">داگیرکراوە</option>
                <option value="لەژێر چاککردنەوەدایە">لەژێر چاککردنەوەدایە</option>
            </Select>
            <div className="flex justify-end pt-4">
                <Button type="submit">زیادکردنی ژوور</Button>
            </div>
        </form>
    );
};

export const RoomView: React.FC<RoomViewProps> = ({ rooms, addRoom, updateRoomStatus }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRooms = rooms.filter(room =>
    room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.status.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'بەردەستە': return 'text-green-600 bg-green-100';
      case 'داگیرکراوە': return 'text-red-600 bg-red-100';
      case 'لەژێر چاککردنەوەدایە': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };


  return (
    <div className="p-8 text-right">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">بەڕێوەبردنی ژوورەکان</h2>
            <Button onClick={() => setIsModalOpen(true)}>
                <span className="flex items-center gap-2">
                    <PlusIcon /> زیادکردنی ژووری نوێ
                </span>
            </Button>
        </div>
        
        <div className="mb-6 relative">
            <input
                type="text"
                placeholder="گەڕان بەدوای ژووردا (جۆر، بارودۆخ...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-gray-400" />
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="زیادکردنی ژووری نوێ">
           <RoomForm onAdd={addRoom} onClose={() => setIsModalOpen(false)} />
        </Modal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRooms.map(room => (
                <Card key={room.id}>
                    <div className="p-5">
                         <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-purple-700">ژووری {room.id}</h3>
                             <select
                                value={room.status}
                                onChange={(e) => updateRoomStatus(room.id, e.target.value as Room['status'])}
                                className={`px-3 py-1 text-xs font-semibold rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(room.status)}`}
                            >
                                <option className="bg-white text-black" value="بەردەستە">بەردەستە</option>
                                <option className="bg-white text-black" value="داگیرکراوە">داگیرکراوە</option>
                                <option className="bg-white text-black" value="لەژێر چاککردنەوەدایە">لەژێر چاککردنەوەدایە</option>
                            </select>
                        </div>
                        <div className="mt-4 space-y-2 text-sm text-gray-700">
                           <p><strong>جۆر:</strong> {room.type}</p>
                           <p><strong>توانا:</strong> {room.capacity} کەس</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
};