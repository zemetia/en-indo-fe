'use client';

import { useState } from 'react';
import { QrCode, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import QrScanner from 'react-qr-scanner';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { useToast } from '@/context/ToastContext';

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
}

export default function ScanAttendancePage() {
  const { showToast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedEvent, setScannedEvent] = useState<Event | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);

  const handleScan = (data: { text: string } | null) => {
    if (data && data.text) {
      try {
        const event = JSON.parse(data.text);
        if (event && event.id) {
          setScannedEvent(event);
          setScanSuccess(true);
          setIsScanning(false);
          showToast(`Event "${event.name}" berhasil di-scan.`, 'success');
        }
      } catch (error) {
        showToast('QR code event tidak valid.', 'error');
        console.error('Invalid QR code data:', error);
      }
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner error:', error);
    showToast('Gagal mengakses kamera. Mohon izinkan akses kamera.', 'error');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scannedEvent) {
      // TODO: Implement API call to save attendance
      console.log('Saving attendance for event:', scannedEvent);
      showToast(
        `Kehadiran Anda untuk event "${scannedEvent.name}" telah disimpan!`,
        'success'
      );
      setScannedEvent(null);
      setScanSuccess(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title='Scan QR Code Event'
        description='Scan QR code event untuk mencatat kehadiran Anda'
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
              {!scannedEvent ? (
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-lg font-medium text-gray-900'>
                        Scanner QR Code
                      </h3>
                      <p className='text-sm text-gray-500'>
                        Scan QR code event untuk mencatat kehadiran Anda
                      </p>
                    </div>
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
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='max-w-md mx-auto text-center space-y-4'
                >
                  <div className='inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100'>
                    <Check className='h-8 w-8 text-emerald-600' />
                  </div>
                  <div>
                    <h3 className='text-lg font-medium text-gray-900'>
                      {scannedEvent.name}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {scannedEvent.date} - {scannedEvent.location}
                    </p>
                  </div>
                  <p className='text-sm text-emerald-600'>
                    QR code berhasil di-scan! Silakan klik tombol Simpan
                    Kehadiran di bawah.
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {scannedEvent && (
            <div className='flex justify-end'>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='submit'
                className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
              >
                <Check className='h-4 w-4 mr-2' />
                Simpan Kehadiran
              </motion.button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}
