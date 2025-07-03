'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Search,
  Check,
  X,
  Save,
  QrCode,
  Download,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface Participant {
  id: string;
  name: string;
  email: string;
  isPresent: boolean;
  timestamp?: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
}

export default function EventAttendancePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    Participant[]
  >([]);
  const [event, setEvent] = useState<Event | null>(null);

  // Mock data event - nantinya akan diambil dari API
  useEffect(() => {
    setEvent({
      id: params.id,
      name: 'Ibadah Minggu',
      date: '2024-05-12',
      location: 'Gedung Gereja',
    });
  }, [params.id]);

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
        p.id === participantId
          ? {
              ...p,
              isPresent: !p.isPresent,
              timestamp: !p.isPresent
                ? new Date().toLocaleString('id-ID')
                : undefined,
            }
          : p
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const presentParticipants = participants.filter((p) => p.isPresent);
    // TODO: Implement API call to save attendance
    console.log('Saving attendance:', {
      eventId: params.id,
      presentParticipants,
    });
    router.push('/dashboard/attendance');
  };

  const downloadQR = () => {
    // TODO: Implement QR code download
    console.log('Downloading QR code for event:', event?.id);
  };

  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title={event?.name || 'Loading...'}
        description={`${event?.date} - ${event?.location}`}
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
              {/* QR Code Event */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-lg font-medium text-gray-900'>
                        QR Code Event
                      </h3>
                      <p className='text-sm text-gray-500'>
                        Tampilkan QR code ini kepada jemaat untuk di-scan
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type='button'
                      onClick={downloadQR}
                      className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
                    >
                      <Download className='h-4 w-4 mr-2' />
                      Download QR
                    </motion.button>
                  </div>

                  <div className='aspect-square bg-white rounded-lg border-2 border-emerald-500 p-4 flex items-center justify-center'>
                    <QRCodeSVG
                      value={JSON.stringify({
                        eventId: event?.id,
                        name: event?.name,
                        date: event?.date,
                      })}
                      size={256}
                      level='H'
                      includeMargin
                      className='text-emerald-500'
                    />
                  </div>
                </div>

                {/* Daftar Peserta */}
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900 mb-4'>
                      Daftar Peserta
                    </h3>
                    <div className='relative'>
                      <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <Search className='h-5 w-5 text-gray-400' />
                      </div>
                      <input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Cari berdasarkan nama atau email...'
                        className='block w-full pl-10 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md'
                      />
                    </div>
                  </div>

                  <div className='space-y-2 max-h-[400px] overflow-y-auto'>
                    {filteredParticipants.map((participant) => (
                      <motion.div
                        key={participant.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg border ${
                          participant.isPresent
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className='flex items-start justify-between'>
                          <div>
                            <h3 className='text-sm font-medium text-gray-900'>
                              {participant.name}
                            </h3>
                            <p className='text-sm text-gray-500'>
                              {participant.email}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type='button'
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
                        </div>
                        {participant.timestamp && (
                          <p className='mt-2 text-xs text-gray-500'>
                            Waktu: {participant.timestamp}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
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
