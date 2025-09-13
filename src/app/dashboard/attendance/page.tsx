'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import QrScanner from 'qr-scanner';
import { useToast } from '@/context/ToastContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CameraOff, QrCode, ClipboardCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedCard from '@/components/dashboard/FeaturedCard';

export default function AttendancePage() {
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  useEffect(() => {
    document.title = 'Presensi - Dashboard Every Nation';
  }, []);

  const handleScan = (result: QrScanner.ScanResult) => {
    const data = result.data;
    if (data) {
      // Prevent spamming the toast and re-rendering for the same scan
      if (data === lastScannedRef.current) {
        return;
      }
      lastScannedRef.current = data;

      let content = data;
      try {
        // Try to parse it as JSON for pretty printing
        const parsedJson = JSON.parse(content);
        content = JSON.stringify(parsedJson, null, 2);
        showToast('QR Code JSON berhasil dipindai!', 'success');
      } catch (e) {
        // If it's not JSON, just show the raw text
        showToast('QR Code berhasil dipindai!', 'info');
      }
      setScannedData(content);
    }
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const qrScanner = new QrScanner(
        videoRef.current,
        handleScan,
        {
            highlightScanRegion: true,
            highlightCodeOutline: true,
        },
    );

    qrScanner.start().catch(err => {
        console.error("QR Scanner start error:", err);
        setCameraError(err.message || 'Tidak dapat mengakses kamera. Mohon izinkan akses kamera di browser Anda.');
    });

    return () => {
        qrScanner.stop();
        qrScanner.destroy();
    };
  }, []);
  
  const copyToClipboard = () => {
    if (scannedData) {
      navigator.clipboard.writeText(scannedData);
      showToast('Hasil pindai disalin ke clipboard!', 'info');
    }
  };


  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Pindai Kode QR Kehadiran'
        description='Arahkan kamera ke kode QR event untuk mencatat kehadiran jemaat secara otomatis.'
        actionLabel='Lihat Riwayat'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-5 h-5 mr-3 text-emerald-600" />
                Pemindai QR Code
              </CardTitle>
              <CardDescription>
                Posisikan QR code di dalam kotak kamera. Pemindaian akan terjadi secara otomatis.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video w-full max-w-2xl mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-inner relative">
                <video ref={videoRef} className="w-full h-full object-cover"></video>
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
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                  <QrCode className="w-5 h-5 mr-3 text-blue-600" />
                  Hasil Pindai
              </CardTitle>
              <CardDescription>
                  Data dari QR Code yang dipindai akan muncul di sini.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 min-h-[150px] flex flex-col justify-between break-words">
                  {scannedData ? (
                    <>
                      <p className="text-gray-800 text-sm font-mono flex-grow whitespace-pre-wrap">{scannedData}</p>
                      <Button onClick={copyToClipboard} variant="outline" size="sm" className="mt-4 w-full">
                        <ClipboardCopy className="w-4 h-4 mr-2" />
                        Salin Hasil
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-gray-500 flex-grow flex flex-col justify-center items-center">
                        <QrCode className="w-8 h-8 mb-2 opacity-50"/>
                        <p>Menunggu hasil pindai...</p>
                    </div>
                  )}
                </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
