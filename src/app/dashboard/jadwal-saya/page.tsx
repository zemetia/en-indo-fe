'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FiCalendar, FiClock, FiMapPin, FiAward, FiUsers, FiMusic, FiCamera, FiHelpCircle } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface Schedule {
  id: string;
  tanggal: string;
  waktu: string;
  event: string;
  lokasi: string;
  peran: string;
  pelayanan: string;
  status: 'confirmed' | 'pending';
}

// Function to get an icon based on the 'pelayanan' type
const getPelayananIcon = (pelayanan: string) => {
    const p = pelayanan.toLowerCase();
    if (p.includes('musik') || p.includes('worship') || p.includes('singer')) return <FiMusic className="w-4 h-4 mr-1.5 text-gray-500" />;
    if (p.includes('media') || p.includes('kamera')) return <FiCamera className="w-4 h-4 mr-1.5 text-gray-500" />;
    if (p.includes('usher') || p.includes('welcome')) return <FiUsers className="w-4 h-4 mr-1.5 text-gray-500" />;
    return <FiHelpCircle className="w-4 h-4 mr-1.5 text-gray-500" />;
}

export default function JadwalSayaPage() {
  const router = useRouter();
  const [schedules, setSchedules] = React.useState<Schedule[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchSchedules = () => {
      setLoading(true);
      setError(null);
      
      const mockSchedules: Schedule[] = [
        {
          id: '1',
          tanggal: '2025-05-12',
          waktu: '09:00',
          event: 'Ibadah Minggu Pagi',
          lokasi: 'Gedung Utama',
          peran: 'Pianist',
          pelayanan: 'Musik',
          status: 'confirmed',
        },
        {
          id: '2',
          tanggal: '2025-05-17',
          waktu: '18:30',
          event: 'Youth Service',
          lokasi: 'Youth Hall',
          peran: 'Gitaris & Singer',
          pelayanan: 'Musik',
          status: 'confirmed',
        },
        {
          id: '3',
          tanggal: '2025-05-19',
          waktu: '09:00',
          event: 'Ibadah Minggu Pagi',
          lokasi: 'Gedung Utama',
          peran: 'Usher',
          pelayanan: 'Welcome Ministry',
          status: 'pending',
        },
        {
          id: '4',
          tanggal: '2025-05-25',
          waktu: '10:00',
          event: 'Konferensi Nasional',
          lokasi: 'JCC',
          peran: 'Kameramen',
          pelayanan: 'Media',
          status: 'confirmed',
        },
      ];

      setTimeout(() => {
        setSchedules(mockSchedules);
        setLoading(false);
      }, 1000);
    };
    fetchSchedules();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className='space-y-4'>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      );
    }

    if (error) {
      return <p className='text-center text-red-500'>{error}</p>;
    }

    if (schedules.length === 0) {
      return (
        <div className='bg-gray-50 rounded-xl p-8 text-center'>
          <FiCalendar className='w-10 h-10 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Tidak ada jadwal pelayanan
          </h3>
          <p className='text-gray-600 max-w-md mx-auto mb-6'>
            Anda belum memiliki jadwal pelayanan yang akan datang.
          </p>
          <Link
            href='/dashboard/ketersediaan'
            className='px-4 py-2 bg-teal-200 rounded-lg text-teal-800 hover:bg-teal-300 transition-colors'
          >
            Tandai Ketersediaan Anda
          </Link>
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        {schedules.map((schedule, index) => (
          <motion.div
            key={schedule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Link href={`/dashboard/jadwal-saya/${schedule.id}`} className='block group'>
              <div className='bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-gray-100 cursor-pointer group'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-4'>
                      <div className='flex-shrink-0'>
                        <div className='w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300'>
                          <FiCalendar className='w-6 h-6 text-teal-600' />
                        </div>
                      </div>
                      <div>
                        <h3 className='text-lg font-medium text-gray-900 group-hover:text-teal-600 transition-colors'>
                          {schedule.event}
                        </h3>
                        <div className='mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500'>
                           <div className='flex items-center'>
                            <FiAward className='w-4 h-4 mr-1.5 text-teal-500' />
                            <span className='font-medium text-gray-700'>{schedule.peran}</span>
                          </div>
                          <div className='flex items-center'>
                            {getPelayananIcon(schedule.pelayanan)}
                            {schedule.pelayanan}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        schedule.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {schedule.status === 'confirmed'
                        ? 'Dikonfirmasi'
                        : 'Menunggu'}
                    </span>
                    <span className='text-teal-600 hover:text-teal-900 font-medium hidden md:block'>
                      Detail
                    </span>
                  </div>
                </div>

                <div className='mt-4 pt-4 border-t border-gray-100'>
                  <div className='flex items-center space-x-6 text-sm text-gray-600'>
                      <div className='flex items-center'>
                          <FiCalendar className='w-4 h-4 mr-2 text-gray-400' />
                          {new Date(schedule.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>
                      <div className='flex items-center'>
                          <FiClock className='w-4 h-4 mr-2 text-gray-400' />
                          {schedule.waktu}
                      </div>
                      <div className='flex items-center'>
                          <FiMapPin className='w-4 h-4 mr-2 text-gray-400' />
                          {schedule.lokasi}
                      </div>
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
        title='Jadwal Pelayanan Saya'
        description='Lihat dan kelola semua jadwal pelayanan Anda di berbagai bidang.'
        actionLabel='Tandai Ketersediaan'
        onAction={() => router.push('/dashboard/ketersediaan')}
        gradientFrom='from-teal-500'
        gradientTo='to-cyan-500'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Jadwal Pelayanan Akan Datang
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Berikut adalah daftar semua peran pelayanan Anda yang akan datang.
            </p>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
