'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

type IbadahSchedule = {
  id: string;
  name: string;
  day: string;
  time: string;
  location: string;
  capacity: number;
  description: string;
};

const daysOfWeek = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

export default function JadwalIbadahPage() {
  const [schedules] = React.useState<IbadahSchedule[]>([
    {
      id: '1',
      name: 'Ibadah Minggu Pagi',
      day: 'Minggu',
      time: '09:00',
      location: 'Gedung Utama',
      capacity: 500,
      description: 'Ibadah minggu pagi untuk seluruh jemaat',
    },
    {
      id: '2',
      name: 'Ibadah Pemuda',
      day: 'Sabtu',
      time: '17:00',
      location: 'Youth Center',
      capacity: 200,
      description: 'Ibadah khusus pemuda',
    },
    {
      id: '3',
      name: 'Doa Pagi',
      day: 'Rabu',
      time: '06:00',
      location: 'Ruang Doa',
      capacity: 50,
      description: 'Ibadah doa pagi',
    },
  ]);

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Jadwal Ibadah'
        description='Kelola jadwal ibadah mingguan'
        actionLabel='Tambah Jadwal Ibadah'
        gradientFrom='from-amber-600'
        gradientTo='to-amber-800'
      />

      {/* Weekly Schedule */}
      <div className='bg-white rounded-xl shadow-sm p-6'>
        <h2 className='text-xl font-semibold mb-6'>Jadwal Mingguan</h2>
        <div className='grid grid-cols-7 gap-4 mb-8'>
          {daysOfWeek.map((day, index) => {
            const daySchedules = schedules.filter(
              (schedule) => schedule.day === day
            );
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg ${
                  daySchedules.length > 0
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-gray-50'
                } border`}
              >
                <h3 className='text-sm font-medium text-gray-900 mb-2'>
                  {day}
                </h3>
                {daySchedules.length > 0 ? (
                  <div className='space-y-2'>
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className='text-xs p-2 bg-white rounded border border-amber-200'
                      >
                        <p className='font-medium text-amber-700'>
                          {schedule.name}
                        </p>
                        <p className='text-gray-600'>{schedule.time}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-xs text-gray-500'>Tidak ada ibadah</p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Schedule List */}
        <div className='mt-8'>
          <h2 className='text-xl font-semibold mb-6'>Daftar Jadwal Ibadah</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {schedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className='bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow'
              >
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='font-semibold text-lg'>{schedule.name}</h3>
                    <p className='text-amber-600 text-sm'>
                      {schedule.day}, {schedule.time}
                    </p>
                  </div>
                  <button className='text-gray-400 hover:text-gray-600'>
                    <svg
                      className='w-5 h-5'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z'
                      />
                    </svg>
                  </button>
                </div>
                <div className='space-y-2 text-sm text-gray-600'>
                  <p>
                    <span className='font-medium'>Lokasi:</span>{' '}
                    {schedule.location}
                  </p>
                  <p>
                    <span className='font-medium'>Kapasitas:</span>{' '}
                    {schedule.capacity} orang
                  </p>
                  <p className='text-gray-500'>{schedule.description}</p>
                </div>
                <div className='mt-4 flex justify-end'>
                  <button className='text-amber-600 hover:text-amber-700 text-sm font-medium'>
                    Edit Jadwal →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
