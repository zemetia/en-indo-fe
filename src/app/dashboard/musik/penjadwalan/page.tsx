'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { FiCalendar, FiClock, FiMapPin, FiMusic, FiPlus } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

// Dummy data untuk contoh
const dummyEvents = [
  {
    id: '1',
    tanggal: '2024-03-30',
    waktu: '09:00 - 12:00',
    event: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    status: 'upcoming',
  },
  {
    id: '2',
    tanggal: '2024-04-06',
    waktu: '09:00 - 12:00',
    event: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    status: 'upcoming',
  },
  // Tambahkan data dummy lainnya sesuai kebutuhan
];

export default function PenjadwalanPage() {
  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Penjadwalan Pelayanan'
        description='Jadwalkan dan kelola pelayanan musik'
        actionLabel='Kembali ke Dashboard Musik'
        gradientFrom='from-amber-500'
        gradientTo='to-amber-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-amber-50'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Daftar Jadwal Pelayanan
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Kelola jadwal pelayanan musik yang akan datang
            </p>
          </div>
          <Link
            href='/dashboard/musik/penjadwalan/tambah'
            className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 whitespace-nowrap'
          >
            <FiPlus className='w-5 h-5' />
            <span>Buat Jadwal Baru</span>
          </Link>
        </div>

        {dummyEvents.length === 0 ? (
          <div className='bg-gray-50 rounded-xl p-8 text-center'>
            <FiCalendar className='w-10 h-10 text-gray-400 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Tidak ada jadwal pelayanan
            </h3>
            <p className='text-gray-600 max-w-md mx-auto mb-6'>
              Belum ada jadwal pelayanan yang tersedia. Silakan buat jadwal
              baru.
            </p>
            <Link
              href='/dashboard/musik/penjadwalan/tambah'
              className='px-4 py-2 bg-amber-600 rounded-lg text-white hover:bg-amber-700 transition-colors'
            >
              Buat Jadwal Baru
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {dummyEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className='bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-amber-50 cursor-pointer group'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex-1'>
                      <div className='flex items-center space-x-4'>
                        <div className='flex-shrink-0'>
                          <div className='w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300'>
                            <FiCalendar className='w-6 h-6 text-amber-600' />
                          </div>
                        </div>
                        <div>
                          <h3 className='text-lg font-medium text-gray-900 group-hover:text-amber-600 transition-colors'>
                            {event.event}
                          </h3>
                          <div className='mt-1 flex items-center space-x-4 text-sm text-gray-500'>
                            <div className='flex items-center'>
                              <FiClock className='w-4 h-4 mr-1 text-amber-500' />
                              {event.waktu}
                            </div>
                            <div className='flex items-center'>
                              <FiMapPin className='w-4 h-4 mr-1 text-amber-500' />
                              {event.lokasi}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center space-x-3'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          event.status === 'upcoming'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.status === 'upcoming'
                          ? 'Akan Datang'
                          : 'Selesai'}
                      </span>
                      <div className='flex space-x-2'>
                        <Link
                          href={`/dashboard/musik/penjadwalan/${event.id}/edit`}
                          className='px-3 py-1 text-sm font-medium text-amber-600 hover:text-amber-900'
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/dashboard/musik/penjadwalan/${event.id}/team`}
                          className='px-3 py-1 text-sm font-medium text-amber-600 hover:text-amber-900'
                        >
                          Atur Tim
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className='mt-4 pt-4 border-t border-amber-50'>
                    <div className='flex flex-wrap gap-2'>
                      <button className='px-3 py-1 text-sm font-medium text-amber-700 bg-amber-50 rounded-full hover:bg-amber-100 flex items-center'>
                        <FiMusic className='w-4 h-4 mr-1' />
                        Atur Lagu
                      </button>
                      <button className='px-3 py-1 text-sm font-medium text-amber-700 bg-amber-50 rounded-full hover:bg-amber-100 flex items-center'>
                        <FiClock className='w-4 h-4 mr-1' />
                        Atur Waktu
                      </button>
                      <button className='px-3 py-1 text-sm font-medium text-amber-700 bg-amber-50 rounded-full hover:bg-amber-100 flex items-center'>
                        <FiMapPin className='w-4 h-4 mr-1' />
                        Atur Lokasi
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
