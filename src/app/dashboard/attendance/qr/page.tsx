'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, QrCode, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import QrScanner from 'react-qr-scanner';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

interface ScannedParticipant {
  id: string;
  name: string;
  email: string;
  timestamp: string;
}

export default function QrAttendancePage() {
  const router = useRouter();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedParticipants, setScannedParticipants] = useState<
    ScannedParticipant[]
  >([]);

  // Mock data events - nantinya akan diambil dari API
  const events = [
    { id: '1', name: 'Ibadah Minggu' },
    { id: '2', name: 'Ibadah Youth' },
    { id: '3', name: 'Ibadah Kids' },
  ];

  const handleScan = (data: any) => {
    if (data) {
      try {
        const participant = JSON.parse(data.text);
        const timestamp = new Date().toLocaleString('id-ID');

        // Check if participant already scanned
        const isAlreadyScanned = scannedParticipants.some(
          (p) => p.id === participant.id
        );
        if (!isAlreadyScanned) {
          setScannedParticipants((prev) => [
            ...prev,
            { ...participant, timestamp },
          ]);
        }
      } catch (error) {
        console.error('Invalid QR code data:', error);
      }
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner error:', error);
  };

  const removeParticipant = (participantId: string) => {
    setScannedParticipants((prev) =>
      prev.filter((p) => p.id !== participantId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to save attendance
    console.log('Saving attendance:', {
      eventId: selectedEvent,
      scannedParticipants,
    });
    router.push('/dashboard/attendance');
  };

  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title='Scan QR Code Kehadiran'
        description='Scan QR code untuk mencatat kehadiran jemaat secara otomatis'
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

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-medium text-gray-900'>
                    Scanner QR Code
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type='button'
                    onClick={() => setIsScanning(!isScanning)}
                    className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      isScanning
                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                        : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                  >
                    <QrCode className='h-4 w-4 mr-2' />
                    {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                  </motion.button>
                </div>

                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className='relative aspect-square max-w-md mx-auto overflow-hidden rounded-lg border-2 border-emerald-500'
                  >
                    <QrScanner
                      delay={300}
                      onError={handleError}
                      onScan={handleScan}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </motion.div>
                )}
              </div>

              <div>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>
                  Daftar Peserta yang Di-scan
                </h3>
                <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
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
                          Waktu Scan
                        </th>
                        <th scope='col' className='px-6 py-3 font-medium text-center'>
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scannedParticipants.map((participant) => (
                        <motion.tr
                          key={participant.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className='bg-white border-b last:border-b-0 hover:bg-gray-50'
                        >
                          <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                            {participant.name}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {participant.email}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                            {participant.timestamp}
                          </td>
                          <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => removeParticipant(participant.id)}
                              className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                            >
                              <X className='h-4 w-4 mr-1' />
                              Hapus
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
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
