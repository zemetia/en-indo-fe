'use client';

import { useState, useEffect } from 'react';
import { Calendar, Save, Users, Minus, Plus, Baby, User } from 'lucide-react';
import { motion } from 'framer-motion';
import FeaturedCard from '@/components/dashboard/FeaturedCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';

interface AttendanceCount {
  dewasa: number;
  youth: number;
  kids: number;
}

export default function SimpleAttendancePage() {
  const { showToast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [attendance, setAttendance] = useState<AttendanceCount>({
    dewasa: 0,
    youth: 0,
    kids: 0,
  });

  useEffect(() => {
    document.title = 'Presensi Sederhana - Dashboard Every Nation';
  }, []);

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
      [category]: Math.max(0, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) {
      showToast('Silakan pilih event terlebih dahulu.', 'error');
      return;
    }
    // TODO: Implement API call to save attendance
    console.log('Saving attendance:', { eventId: selectedEvent, attendance });
    showToast('Kehadiran berhasil disimpan!', 'success');
    setAttendance({ dewasa: 0, youth: 0, kids: 0 });
    setSelectedEvent('');
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
          <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
            <div className='space-y-6'>
              <div>
                <label
                  htmlFor='event'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Pilih Event
                </label>
                <div className='mt-1 relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
                  <Select
                    value={selectedEvent}
                    onValueChange={setSelectedEvent}
                  >
                    <SelectTrigger className='w-full md:w-1/2 lg:w-1/3 pl-10'>
                      <SelectValue placeholder='Pilih Event' />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Dewasa */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className='bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-between'
                >
                  <div className='flex items-center space-x-3 mb-4'>
                    <div className='p-3 bg-emerald-100 rounded-lg'>
                      <Users className='h-6 w-6 text-emerald-600' />
                    </div>
                    <h4 className='text-lg font-medium text-emerald-800'>
                      Dewasa
                    </h4>
                  </div>
                  <div className='flex items-center justify-between bg-white rounded-full p-2 shadow-sm'>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      onClick={() =>
                        handleCountChange('dewasa', attendance.dewasa - 1)
                      }
                      className='w-10 h-10 text-emerald-700 rounded-full hover:bg-emerald-100'
                    >
                      <Minus className='h-5 w-5' />
                    </Button>
                    <p className='text-4xl font-bold text-emerald-900 mx-4'>
                      {attendance.dewasa}
                    </p>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      onClick={() =>
                        handleCountChange('dewasa', attendance.dewasa + 1)
                      }
                      className='w-10 h-10 text-emerald-700 rounded-full hover:bg-emerald-100'
                    >
                      <Plus className='h-5 w-5' />
                    </Button>
                  </div>
                </motion.div>

                {/* Youth */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className='bg-sky-50 p-4 rounded-xl border border-sky-100 flex flex-col justify-between'
                >
                  <div className='flex items-center space-x-3 mb-4'>
                    <div className='p-3 bg-sky-100 rounded-lg'>
                      <User className='h-6 w-6 text-sky-600' />
                    </div>
                    <h4 className='text-lg font-medium text-sky-800'>Youth</h4>
                  </div>
                  <div className='flex items-center justify-between bg-white rounded-full p-2 shadow-sm'>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      onClick={() =>
                        handleCountChange('youth', attendance.youth - 1)
                      }
                      className='w-10 h-10 text-sky-700 rounded-full hover:bg-sky-100'
                    >
                      <Minus className='h-5 w-5' />
                    </Button>
                    <p className='text-4xl font-bold text-sky-900 mx-4'>
                      {attendance.youth}
                    </p>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      onClick={() =>
                        handleCountChange('youth', attendance.youth + 1)
                      }
                      className='w-10 h-10 text-sky-700 rounded-full hover:bg-sky-100'
                    >
                      <Plus className='h-5 w-5' />
                    </Button>
                  </div>
                </motion.div>

                {/* Kids */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className='bg-amber-50 p-4 rounded-xl border border-amber-100 flex flex-col justify-between'
                >
                  <div className='flex items-center space-x-3 mb-4'>
                    <div className='p-3 bg-amber-100 rounded-lg'>
                      <Baby className='h-6 w-6 text-amber-600' />
                    </div>
                    <h4 className='text-lg font-medium text-amber-800'>
                      Kids
                    </h4>
                  </div>
                  <div className='flex items-center justify-between bg-white rounded-full p-2 shadow-sm'>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      onClick={() =>
                        handleCountChange('kids', attendance.kids - 1)
                      }
                      className='w-10 h-10 text-amber-700 rounded-full hover:bg-amber-100'
                    >
                      <Minus className='h-5 w-5' />
                    </Button>
                    <p className='text-4xl font-bold text-amber-900 mx-4'>
                      {attendance.kids}
                    </p>
                    <Button
                      type='button'
                      size='icon'
                      variant='ghost'
                      onClick={() =>
                        handleCountChange('kids', attendance.kids + 1)
                      }
                      className='w-10 h-10 text-amber-700 rounded-full hover:bg-amber-100'
                    >
                      <Plus className='h-5 w-5' />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className='flex justify-end'>
            <Button type='submit' size='lg'>
              <Save className='h-4 w-4 mr-2' />
              Simpan Kehadiran
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
