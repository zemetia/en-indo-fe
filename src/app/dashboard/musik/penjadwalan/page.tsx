'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { FiCalendar, FiClock, FiMapPin, FiPlus, FiUsers, FiMusic } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface MusicEvent {
  id: string;
  tanggal: string;
  waktu: string;
  event: string;
  lokasi: string;
  status: 'upcoming' | 'past';
  teamSize: number;
  songCount: number;
}

const MOCK_EVENTS: MusicEvent[] = [
    { id: '1', tanggal: '2025-07-20', waktu: '09:00', event: 'Ibadah Minggu Pagi', lokasi: 'Gedung Utama', status: 'upcoming', teamSize: 5, songCount: 4 },
    { id: '2', tanggal: '2025-07-25', waktu: '18:30', event: 'Youth Service', lokasi: 'Youth Hall', status: 'upcoming', teamSize: 4, songCount: 5 },
    { id: '3', tanggal: '2025-08-01', waktu: '19:00', event: 'Malam Doa & Pujian', lokasi: 'Kapel Doa', status: 'upcoming', teamSize: 3, songCount: 6 },
    { id: '4', tanggal: '2025-06-30', waktu: '10:00', event: 'Ibadah Minggu (Selesai)', lokasi: 'Gedung Utama', status: 'past', teamSize: 5, songCount: 4 },
]

export default function PenjadwalanPage() {
  const [events, setEvents] = React.useState<MusicEvent[]>(MOCK_EVENTS);
  const [loading, setLoading] = React.useState(false); // Changed to false as we use mock data
  const [error, setError] = React.useState<string | null>(null);

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex justify-center items-center py-10'>
          <div className='w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      );
    }

    if (error) {
      return <p className='text-center text-red-500'>{error}</p>;
    }

    if (events.length === 0) {
      return (
        <div className='bg-gray-50 rounded-xl p-8 text-center'>
          <FiCalendar className='w-10 h-10 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Tidak ada jadwal pelayanan
          </h3>
          <p className='text-gray-600 max-w-md mx-auto mb-6'>
            Belum ada jadwal pelayanan yang tersedia. Silakan buat jadwal baru.
          </p>
          <Link
            href='/dashboard/event/create'
            className='px-4 py-2 bg-amber-600 rounded-lg text-white hover:bg-amber-700 transition-colors'
          >
            Buat Jadwal Baru
          </Link>
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Link href={`/dashboard/musik/penjadwalan/${event.id}`} className='block group'>
              <div className='bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-gray-100 cursor-pointer group'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-shrink-0'>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 ${event.status === 'upcoming' ? 'bg-amber-100' : 'bg-gray-100'}`}>
                          <FiCalendar className={`w-6 h-6 ${event.status === 'upcoming' ? 'text-amber-600' : 'text-gray-500'}`} />
                        </div>
                      </div>
                      <div>
                        <h3 className='text-lg font-medium text-gray-900 group-hover:text-amber-600 transition-colors'>
                          {event.event}
                        </h3>
                        <div className='mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500'>
                          <div className='flex items-center'>
                            <FiCalendar className='w-4 h-4 mr-1.5 text-gray-400' />
                            {new Date(event.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric'})}
                          </div>
                          <div className='flex items-center'>
                            <FiClock className='w-4 h-4 mr-1.5 text-gray-400' />
                            {event.waktu}
                          </div>
                          <div className='flex items-center'>
                            <FiMapPin className='w-4 h-4 mr-1.5 text-gray-400' />
                            {event.lokasi}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.status === 'upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {event.status === 'upcoming'
                        ? 'Akan Datang'
                        : 'Selesai'}
                    </span>
                  </div>
                </div>

                <div className='mt-4 pt-4 border-t border-gray-100 flex items-center gap-6 text-sm text-gray-600'>
                    <div className='flex items-center'>
                        <FiUsers className='w-4 h-4 mr-2 text-gray-400' />
                        <span>{event.teamSize} Pelayan</span>
                    </div>
                    <div className='flex items-center'>
                        <FiMusic className='w-4 h-4 mr-2 text-gray-400' />
                        <span>{event.songCount} Lagu</span>
                    </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Penjadwalan Pelayanan Musik'
        description='Lihat acara yang membutuhkan pelayanan musik dan atur tim serta daftar lagu.'
        actionLabel='Kembali ke Dashboard Musik'
        gradientFrom='from-amber-500'
        gradientTo='to-amber-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Daftar Jadwal Pelayanan
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Pilih acara untuk mulai mengatur tim musik dan daftar lagu.
            </p>
          </div>
          <Link
            href='/dashboard/event/create'
            className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 whitespace-nowrap'
          >
            <FiPlus className='w-5 h-5' />
            <span>Buat Event Baru</span>
          </Link>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
