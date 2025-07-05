'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import QrScanner from 'react-qr-scanner';
import { useToast } from '@/context/ToastContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CameraOff, QrCode, ClipboardCopy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedCard from '@/components/dashboard/FeaturedCard';

export default function AttendancePage() {
  const { showToast } = useToast();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const scannerRef = useRef<QrScanner>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // Stop the stream immediately, as QrScanner will request it again.
        // This is just to check for permission.
        stream.getTracks().forEach(track => track.stop());
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };
    getCameraPermission();
  }, []);

  const handleScan = (data: { text: string } | null) => {
    if (data && data.text) {
      let content = data.text;
      try {
        // Attempt to parse the data as JSON and prettify it
        const parsedJson = JSON.parse(data.text);
        content = JSON.stringify(parsedJson, null, 2);
        showToast('QR Code JSON berhasil dipindai!', 'success');
      } catch (e) {
        // If it's not valid JSON, just show the raw text
        showToast('QR Code berhasil dipindai!', 'info');
      }
      setScannedData(content);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    setHasCameraPermission(false);
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
                {hasCameraPermission === true && (
                    <QrScanner
                        ref={scannerRef}
                        delay={300}
                        onError={handleError}
                        onScan={handleScan}
                        style={{ width: '100%', height: '100%' }}
                        constraints={{ video: { facingMode: 'environment' } }}
                    />
                )}
                {hasCameraPermission === false && (
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
                 {hasCameraPermission === null && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white">
                    <Camera className="w-10 h-10 animate-pulse mb-2" />
                    <p>Meminta izin kamera...</p>
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
