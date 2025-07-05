'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useToast } from '@/context/ToastContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CameraOff, QrCode, ClipboardCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedCard from '@/components/dashboard/FeaturedCard';

const QrScanner = dynamic(() => import('react-qr-scanner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-800">
      <p className="text-white animate-pulse">Memuat kamera...</p>
    </div>
  ),
});

export default function AttendancePage() {
  const { showToast } = useToast();
  const [cameraError, setCameraError] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  const handleScan = (data: { text: string } | null) => {
    if (data && data.text) {
      // Prevent spamming the toast and re-rendering for the same scan
      if (data.text === lastScannedRef.current) {
        return;
      }
      lastScannedRef.current = data.text;

      let content = data.text;
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

  const handleError = (err: any) => {
    console.error("QR Scanner Error:", err);
    setCameraError(true);
    showToast('Kamera tidak dapat diakses. Mohon izinkan akses kamera di browser Anda.', 'error');
  };
  
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
                {!cameraError ? (
                    <QrScanner
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%', height: '100%' }}
                        constraints={{ video: { facingMode: 'environment' } }}
                    />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                     <Alert variant="destructive" className="max-w-md">
                        <CameraOff className="h-4 w-4" />
                        <AlertTitle>Akses Kamera Ditolak</AlertTitle>
                        <AlertDescription>
                            Aplikasi ini memerlukan izin untuk menggunakan kamera. Mohon aktifkan izin kamera pada pengaturan browser Anda dan segarkan halaman ini.
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
