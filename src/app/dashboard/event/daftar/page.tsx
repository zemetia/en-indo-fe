'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'event' | 'ibadah';
  status: 'upcoming' | 'ongoing' | 'completed';
};

export default function DaftarEventPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<
    'all' | 'event' | 'ibadah'
  >('all');
  const [events, setEvents] = React.useState<Event[]>([
    {
      id: '1',
      title: 'Ibadah Minggu',
      date: '2024-03-31',
      time: '09:00',
      location: 'Gedung Utama',
      description: 'Ibadah minggu pagi',
      type: 'ibadah',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'Youth Service',
      date: '2024-03-30',
      time: '17:00',
      location: 'Youth Center',
      description: 'Ibadah pemuda',
      type: 'ibadah',
      status: 'upcoming',
    },
    {
      id: '3',
      title: 'Easter Celebration',
      date: '2024-03-31',
      time: '18:00',
      location: 'Main Hall',
      description: 'Perayaan Paskah',
      type: 'event',
      status: 'upcoming',
    },
  ]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Daftar Event'
        description='Kelola dan lihat semua event yang akan datang'
        actionLabel='Tambah Event Baru'
        gradientFrom='from-amber-500'
        gradientTo='to-amber-700'
      />

      {/* Search and Filter */}
      <div className='bg-white rounded-xl shadow-sm p-6'>
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <input
            type='text'
            placeholder='Cari event...'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className='px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500'
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as 'all' | 'event' | 'ibadah')
            }
          >
            <option value='all'>Semua</option>
            <option value='event'>Event</option>
            <option value='ibadah'>Ibadah</option>
          </select>
        </div>

        {/* Event List */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow'
            >
              <div
                className={`px-4 py-2 ${
                  event.type === 'event' ? 'bg-amber-500' : 'bg-blue-500'
                } text-white`}
              >
                <span className='text-sm font-medium'>
                  {event.type === 'event' ? 'Event' : 'Ibadah'}
                </span>
              </div>
              <div className='p-4'>
                <h3 className='text-lg font-semibold mb-2'>{event.title}</h3>
                <div className='space-y-2 text-sm text-gray-600'>
                  <p>
                    <span className='font-medium'>Tanggal:</span>{' '}
                    {new Date(event.date).toLocaleDateString('id-ID')}
                  </p>
                  <p>
                    <span className='font-medium'>Waktu:</span> {event.time}
                  </p>
                  <p>
                    <span className='font-medium'>Lokasi:</span>{' '}
                    {event.location}
                  </p>
                </div>
                <p className='mt-3 text-sm text-gray-500'>
                  {event.description}
                </p>
                <div className='mt-4 flex justify-end'>
                  <button className='text-amber-600 hover:text-amber-700 text-sm font-medium'>
                    Lihat Detail →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
