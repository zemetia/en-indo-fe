'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Search, Check, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface Participant {
  id: string;
  name: string;
  email: string;
  isPresent: boolean;
}

export default function ManualAttendancePage() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    Participant[]
  >([]);

  // Mock data events - nantinya akan diambil dari API
  const events = [
    { id: '1', name: 'Ibadah Minggu' },
    { id: '2', name: 'Ibadah Youth' },
    { id: '3', name: 'Ibadah Kids' },
  ];

  // Mock data participants - nantinya akan diambil dari API
  useEffect(() => {
    setParticipants([
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
    ]);
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
    const presentParticipants = participants.filter((p) => p.isPresent);
    // TODO: Implement API call to save attendance
    console.log('Saving attendance:', {
      eventId: selectedEvent,
      presentParticipants,
    });
    router.push('/dashboard/attendance');
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

              <div>
                <label
                  htmlFor='search'
                  className='block text-sm font-medium text-gray-700'
                >
                  Cari Jemaat
                </label>
                <div className='mt-1 relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <Search className='h-5 w-5 text-gray-400' />
                  </div>
                  <input
                    type='text'
                    id='search'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Cari berdasarkan nama atau email...'
                    className='block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md'
                  />
                </div>
              </div>

              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Nama
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Email
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Status
                      </th>
                      <th
                        scope='col'
                        className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {filteredParticipants.map((participant) => (
                      <motion.tr
                        key={participant.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
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
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleAttendance(participant.id)}
                            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white ${
                              participant.isPresent
                                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                            } focus:outline-none focus:ring-2 focus:ring-offset-2`}
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
                          </motion.button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
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
