'use client';

import { useState, useEffect, useRef } from 'react';
import { QrCode, CameraOff } from 'lucide-react';
import { motion } from 'framer-motion';
import QrScanner from 'qr-scanner';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import ScanResult from '@/components/attendance/ScanResult';
import {
  scanQRCheckIn,
  QRScanCheckInResponse,
} from '@/lib/api/eventParticipants';
import { decodeQRData } from '@/lib/utils/qr';

export default function QrAttendancePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<QRScanCheckInResponse | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'QR Code Presensi - Dashboard Every Nation';
  }, []);

  const handleScan = async (result: QrScanner.ScanResult) => {
    if (result && result.data && !isProcessing) {
      try {
        setIsProcessing(true);

        // Decode QR data to get eventId and timestamp
        const qrData = decodeQRData(result.data);

        // Convert timestamp to occurrence date (YYYY-MM-DD)
        const occurrenceDate = new Date(qrData.timestamp)
          .toISOString()
          .split('T')[0];

        // Call API to check in
        const response = await scanQRCheckIn(qrData.eventId, occurrenceDate);

        // Show result
        setScanResult(response);

        // Stop scanning temporarily
        stopScanner();
      } catch (error) {
        console.error('QR scan error:', error);
        setScanResult({
          status: 'not_participant',
          message:
            error instanceof Error
              ? error.message
              : 'QR code tidak valid atau terjadi kesalahan',
        });
        stopScanner();
      } finally {
        setIsProcessing(false);
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

  const handleDismissResult = () => {
    setScanResult(null);
    // Restart scanning
    setIsScanning(true);
  };

  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title='Scan QR Code Kehadiran'
        description='Scan QR code event untuk presensi kehadiran secara otomatis'
        actionLabel='Scan QR'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='space-y-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-medium text-gray-900'>
                Scanner QR Code
              </h3>
              <Button
                type='button'
                onClick={() => setIsScanning(!isScanning)}
                variant={isScanning ? 'destructive' : 'default'}
                disabled={isProcessing}
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
                <video ref={videoRef} className='w-full h-full object-cover' />
                {cameraError && (
                  <div className='absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/50'>
                    <Alert variant='destructive' className='max-w-md'>
                      <CameraOff className='h-4 w-4' />
                      <AlertTitle>Gagal Mengakses Kamera</AlertTitle>
                      <AlertDescription>{cameraError}</AlertDescription>
                    </Alert>
                  </div>
                )}
                {isProcessing && (
                  <div className='absolute inset-0 flex items-center justify-center bg-black/50'>
                    <div className='text-white text-center'>
                      <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4'></div>
                      <p className='text-lg font-semibold'>Memproses...</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {!isScanning && !cameraError && (
              <div className='text-center p-8 text-gray-500'>
                <QrCode className='h-16 w-16 mx-auto mb-4 text-gray-300' />
                <p>Klik tombol &quot;Start Scanning&quot; untuk memulai scan QR code</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Scan Result Modal */}
      <ScanResult
        result={scanResult}
        onDismiss={handleDismissResult}
        autoDismissDelay={5000}
      />
    </div>
  );
}
