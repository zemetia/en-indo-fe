'use client';

import { useState, useEffect } from 'react';
import { Calendar, Search, Check, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';

interface Participant {
  id: string;
  name: string;
  email: string;
  isPresent: boolean;
}

export default function ManualAttendancePage() {
  const { showToast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    Participant[]
  >([]);

  useEffect(() => {
    document.title = 'Presensi Manual - Dashboard Every Nation';
  }, []);

  const initialParticipants = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      isPresent: false,
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      isPresent: false,
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      isPresent: false,
    },
  ];

  // Mock data events - nantinya akan diambil dari API
  const events = [
    { id: '1', name: 'Ibadah Minggu' },
    { id: '2', name: 'Ibadah Youth' },
    { id: '3', name: 'Ibadah Kids' },
  ];

  // Mock data participants - nantinya akan diambil dari API
  useEffect(() => {
    setParticipants(initialParticipants);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const filtered = participants.filter(
      (participant) =>
        participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredParticipants(filtered);
  }, [searchQuery, participants]);

  const toggleAttendance = (participantId: string) => {
    setParticipants((prev) =>
      prev.map((p) =>
        p.id === participantId ? { ...p, isPresent: !p.isPresent } : p
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) {
      showToast('Silakan pilih event terlebih dahulu.', 'error');
      return;
    }
    const presentParticipants = participants.filter((p) => p.isPresent);
    // TODO: Implement API call to save attendance
    console.log('Saving attendance:', {
      eventId: selectedEvent,
      presentParticipants,
    });
    showToast('Kehadiran berhasil disimpan!', 'success');
    setSelectedEvent('');
    setSearchQuery('');
    setParticipants(initialParticipants); // Reset to initial state
  };

  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title='Pencatatan Kehadiran Manual'
        description='Catat kehadiran jemaat secara manual dengan memilih dari daftar yang tersedia'
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
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label
                  htmlFor='event'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Pilih Event
                </label>
                <div className='mt-1 relative'>
                  <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger className='w-full pl-10'>
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

              <div>
                <label
                  htmlFor='search'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Cari Jemaat
                </label>
                <div className='mt-1 relative'>
                  <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none' />
                  <Input
                    type='text'
                    id='search'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Cari berdasarkan nama atau email...'
                    className='pl-10'
                  />
                </div>
              </div>
            </div>

            <div className='mt-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm text-left text-gray-500'>
                  <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
                    <tr>
                      <th scope='col' className='px-6 py-3 font-medium'>
                        Nama
                      </th>
                      <th scope='col' className='px-6 py-3 font-medium'>
                        Email
                      </th>
                      <th scope='col' className='px-6 py-3 font-medium'>
                        Status
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 font-medium text-center'
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipants.map((participant, index) => (
                      <motion.tr
                        key={participant.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className='bg-white border-b last:border-b-0 even:bg-slate-50 hover:bg-slate-100 transition-colors'
                      >
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {participant.name}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          {participant.email}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              participant.isPresent
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {participant.isPresent ? 'Hadir' : 'Belum Hadir'}
                          </span>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
                          <Button
                            type='button'
                            size='sm'
                            variant={
                              participant.isPresent ? 'destructive' : 'default'
                            }
                            onClick={() => toggleAttendance(participant.id)}
                            className={`transition-all ${
                              participant.isPresent
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            }`}
                          >
                            {participant.isPresent ? (
                              <>
                                <X className='h-4 w-4 mr-1' />
                                Batalkan
                              </>
                            ) : (
                              <>
                                <Check className='h-4 w-4 mr-1' />
                                Hadir
                              </>
                            )}
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
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
