'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Save, Users } from 'lucide-react';
import { motion } from 'framer-motion';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface AttendanceCount {
  dewasa: number;
  youth: number;
  kids: number;
}

export default function SimpleAttendancePage() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendance, setAttendance] = useState<AttendanceCount>({
    dewasa: 0,
    youth: 0,
    kids: 0,
  });

  // Mock data events - nantinya akan diambil dari API
  const events = [
    { id: '1', name: 'Ibadah Minggu' },
    { id: '2', name: 'Ibadah Youth' },
    { id: '3', name: 'Ibadah Kids' },
  ];

  const handleCountChange = (
    category: keyof AttendanceCount,
    value: number
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save attendance
    console.log('Saving attendance:', { eventId: selectedEvent, attendance });
    router.push('/dashboard/attendance');
  };

  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title='Pencatatan Kehadiran Sederhana'
        description='Catat jumlah kehadiran berdasarkan kategori untuk event yang dipilih'
        actionLabel='Simpan Kehadiran'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='bg-white p-6 rounded-xl shadow-sm'>
            <div className='space-y-6'>
              <div>
                <label
                  htmlFor='event'
                  className='block text-sm font-medium text-gray-700'
                >
                  Pilih Event
                </label>
                <div className='mt-1 relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Calendar className='h-5 w-5 text-gray-400' />
                  </div>
                  <select
                    id='event'
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className='block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md'
                    required
                  >
                    <option value=''>Pilih Event</option>
                    {events.map((event) => (
                      <option key={event.id} value={event.id}>
                        {event.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className='bg-emerald-50 p-4 rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-emerald-100 rounded-lg'>
                      <Users className='h-5 w-5 text-emerald-600' />
                    </div>
                    <div className='flex-1'>
                      <label
                        htmlFor='dewasa'
                        className='block text-sm font-medium text-emerald-700'
                      >
                        Dewasa
                      </label>
                      <input
                        type='number'
                        id='dewasa'
                        min='0'
                        value={attendance.dewasa}
                        onChange={(e) =>
                          handleCountChange(
                            'dewasa',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className='mt-1 block w-full border-emerald-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className='bg-emerald-50 p-4 rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-emerald-100 rounded-lg'>
                      <Users className='h-5 w-5 text-emerald-600' />
                    </div>
                    <div className='flex-1'>
                      <label
                        htmlFor='youth'
                        className='block text-sm font-medium text-emerald-700'
                      >
                        Youth
                      </label>
                      <input
                        type='number'
                        id='youth'
                        min='0'
                        value={attendance.youth}
                        onChange={(e) =>
                          handleCountChange(
                            'youth',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className='mt-1 block w-full border-emerald-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className='bg-emerald-50 p-4 rounded-lg'
                >
                  <div className='flex items-center space-x-3'>
                    <div className='p-2 bg-emerald-100 rounded-lg'>
                      <Users className='h-5 w-5 text-emerald-600' />
                    </div>
                    <div className='flex-1'>
                      <label
                        htmlFor='kids'
                        className='block text-sm font-medium text-emerald-700'
                      >
                        Kids
                      </label>
                      <input
                        type='number'
                        id='kids'
                        min='0'
                        value={attendance.kids}
                        onChange={(e) =>
                          handleCountChange(
                            'kids',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className='mt-1 block w-full border-emerald-300 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm'
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className='flex justify-end'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
            >
              <Save className='h-4 w-4 mr-2' />
              Simpan Kehadiran
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
