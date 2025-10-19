// Implementing the StatisticsView component to display key metrics.
import React, { useState } from 'react';
import type { Patient, Doctor, Visit, Room } from '../types';
import { Card } from './ui/Card';

interface StatisticsViewProps {
  patients: Patient[];
  doctors: Doctor[];
  visits: Visit[];
  rooms: Room[];
}

const StatCard: React.FC<{ title: string; value: string | number; description: React.ReactNode }> = ({ title, value, description }) => (
    <Card className="p-6 flex flex-col">
        <div>
            <h3 className="text-lg font-medium text-gray-500">{title}</h3>
            <p className="mt-2 text-4xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="mt-auto pt-2 text-sm text-gray-600">{description}</div>
    </Card>
);


export const StatisticsView: React.FC<StatisticsViewProps> = ({ patients, doctors, visits, rooms }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const availableRooms = rooms.filter(r => r.status === 'بەردەستە').length;
    const visitsForSelectedDate = visits.filter(v => v.visitDate === selectedDate).length;

    return (
        <div className="p-8 text-right">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">ئامارە گشتییەکان</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="کۆی نەخۆشەکان" value={patients.length} description="سەرجەم نەخۆشە تۆمارکراوەکان" />
                <StatCard title="کۆی دکتۆرەکان" value={doctors.length} description="سەرجەم دکتۆرە بەردەستەکان" />
                <StatCard 
                    title="سەردانەکان" 
                    value={visitsForSelectedDate} 
                    description={
                        <div className="flex flex-col items-start gap-2">
                            <span>ژمارەی سەردانەکان بۆ بەرواری دیاریکراو:</span>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="p-1 w-full border border-gray-300 rounded-md bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                            />
                        </div>
                    } 
                />
                <StatCard title="ژوورە بەردەستەکان" value={`${availableRooms} / ${rooms.length}`} description="ژوورە بەتاڵەکان بۆ بەکارهێنان" />
            </div>
        </div>
    );
};
