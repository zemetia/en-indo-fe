'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar, QrCode, Save, X, CameraOff } from 'lucide-react';
import { motion } from 'framer-motion';
import QrScanner from 'qr-scanner';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/context/ToastContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ScannedParticipant {
  id: string;
  name: string;
  email: string;
  timestamp: string;
}

export default function QrAttendancePage() {
  const { showToast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedParticipants, setScannedParticipants] = useState<
    ScannedParticipant[]
  >([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Mock data events - nantinya akan diambil dari API
  const events = [
    { id: '1', name: 'Ibadah Minggu' },
    { id: '2', name: 'Ibadah Youth' },
    { id: '3', name: 'Ibadah Kids' },
  ];

  const handleScan = (result: QrScanner.ScanResult) => {
    if (result && result.data) {
      try {
        const participant = JSON.parse(result.data);
        if (participant && participant.id) {
          const timestamp = new Date().toLocaleString('id-ID');

          // Check if participant already scanned
          const isAlreadyScanned = scannedParticipants.some(
            (p) => p.id === participant.id
          );
          if (!isAlreadyScanned) {
            setScannedParticipants((prev) => [
              { ...participant, timestamp },
              ...prev,
            ]);
            showToast(`${participant.name} berhasil di-scan.`, 'success');
          } else {
            showToast(
              `${participant.name} sudah di-scan sebelumnya.`,
              'warning'
            );
          }
        }
      } catch (error) {
        showToast('QR code tidak valid.', 'error');
        console.error('Invalid QR code data:', error);
      }
    }
  };

  const startScanner = () => {
    if (videoRef.current && !scannerRef.current) {
        const scanner = new QrScanner(
            videoRef.current,
            handleScan,
            { highlightScanRegion: true, highlightCodeOutline: true }
        );
        scanner.start().then(() => {
            scannerRef.current = scanner;
            setIsScanning(true);
            setCameraError(null);
        }).catch(err => {
            console.error(err);
            setCameraError(err.message || 'Gagal mengakses kamera. Mohon izinkan akses kamera.');
            setIsScanning(false);
        });
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
        setIsScanning(false);
    }
  };

  useEffect(() => {
    if (isScanning) {
        startScanner();
    } else {
        stopScanner();
    }

    return () => {
        stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning]);


  const removeParticipant = (participantId: string) => {
    setScannedParticipants((prev) =>
      prev.filter((p) => p.id !== participantId)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) {
      showToast('Silakan pilih event terlebih dahulu.', 'error');
      return;
    }
    // TODO: Implement API call to save attendance
    console.log('Saving attendance:', {
      eventId: selectedEvent,
      scannedParticipants,
    });
    showToast('Kehadiran berhasil disimpan!', 'success');
    setScannedParticipants([]);
    setSelectedEvent('');
    setIsScanning(false);
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
        <form
          onSubmit={handleSubmit}
          className='space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200'
        >
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
                  required
                >
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

            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Scanner QR Code
                </h3>
                <Button
                  type='button'
                  onClick={() => setIsScanning(!isScanning)}
                  variant={isScanning ? 'destructive' : 'default'}
                >
                  <QrCode className='h-4 w-4 mr-2' />
                  {isScanning ? 'Stop Scanning' : 'Start Scanning'}
                </Button>
              </div>

              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className='relative aspect-square max-w-md mx-auto overflow-hidden rounded-lg border-2 border-emerald-500 bg-gray-900'
                >
                  <video ref={videoRef} className="w-full h-full object-cover" />
                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50">
                       <Alert variant="destructive" className="max-w-md">
                          <CameraOff className="h-4 w-4" />
                          <AlertTitle>Gagal Mengakses Kamera</AlertTitle>
                          <AlertDescription>
                              {cameraError}
                          </AlertDescription>
                      </Alert>
                    </div>
                  )}
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
                      <th
                        scope='col'
                        className='px-6 py-3 font-medium text-center'
                      >
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
                        className='bg-white border-b last:border-b-0 even:bg-slate-50 hover:bg-slate-100 transition-colors'
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
                          <Button
                            size='sm'
                            variant='destructive'
                            type='button'
                            onClick={() => removeParticipant(participant.id)}
                            className='bg-red-100 text-red-700 hover:bg-red-200'
                          >
                            <X className='h-4 w-4 mr-1' />
                            Hapus
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
