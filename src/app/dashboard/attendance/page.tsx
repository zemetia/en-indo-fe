'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import QrScanner from 'qr-scanner';
import { useToast } from '@/context/ToastContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, CameraOff, CheckCircle, Calendar, MapPin, Clock, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { decodeQRData, QRCodeData, formatQRTimestamp } from '@/lib/utils/qr';
import { getEvent, Event as APIEvent } from '@/lib/api/events';
import { getEventParticipants, checkInParticipant } from '@/lib/api/eventParticipants';
import { getCurrentUserPersonId } from '@/lib/helper';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

type Event = APIEvent;

export default function AttendancePage() {
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const lastScannedRef = useRef<string | null>(null);
  const scanCooldownRef = useRef<boolean>(false);
  const handleAutoCheckInRef = useRef<((qrCodeData: QRCodeData) => Promise<void>) | null>(null);

  // QR and Event State
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [event, setEvent] = useState<Event | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    document.title = 'Presensi - Dashboard Every Nation';
  }, []);

  // Store handleAutoCheckIn in ref to avoid it being a dependency in useEffect
  handleAutoCheckInRef.current = async (qrCodeData: QRCodeData) => {
    console.log('🔄 Starting auto check-in for event:', qrCodeData.eventId);

    const personId = getCurrentUserPersonId();
    console.log('👤 Current user person ID:', personId);

    if (!personId) {
      showToast('Tidak dapat menemukan data pengguna. Silakan login kembali.', 'error');
      return;
    }

    try {
      setCheckingIn(true);
      console.log('⏳ Setting checkingIn to true');

      // Fetch event details
      console.log('📥 Fetching event details...');
      const eventData = await getEvent(qrCodeData.eventId);
      console.log('✅ Event data fetched:', eventData.title);
      setEvent(eventData);

      // Get occurrence date
      const occDate = format(parseISO(eventData.startDatetime), 'yyyy-MM-dd');
      console.log('📅 Occurrence date:', occDate);

      // Find current user's participant record
      console.log('🔍 Looking for user participant record...');
      const participantsResponse = await getEventParticipants(eventData.id, occDate);
      console.log('📋 Total participants:', participantsResponse.participants.length);

      const userParticipant = participantsResponse.participants.find(
        p => p.participantType === 'person' && p.participantId === personId
      );

      if (!userParticipant) {
        console.error('❌ User not found in participant list');
        showToast('Anda tidak terdaftar sebagai peserta event ini.', 'error');
        setQrData(null);
        setEvent(null);
        return;
      }

      console.log('✅ Found user participant:', userParticipant.id);

      // Check if already checked in
      if (userParticipant.attendanceStatus === 'present') {
        console.log('ℹ️ User already checked in');
        setCheckedIn(true);
        showToast('Anda sudah tercatat hadir di event ini!', 'info');
        return;
      }

      // Check in the participant
      console.log('📝 Checking in participant...');
      await checkInParticipant(userParticipant.id, {
        checkInMethod: 'qr_scan',
        notes: 'Self check-in via QR scan',
        qrScanTimestamp: new Date(qrCodeData.timestamp).toISOString(),
      });

      console.log('✅ Check-in successful!');
      setCheckedIn(true);
      showToast('Berhasil Presensi!', 'success');

    } catch (err) {
      console.error('❌ Failed to check in:', err);
      showToast('Gagal melakukan presensi. Silakan coba lagi.', 'error');
      setQrData(null);
      setEvent(null);
    } finally {
      setCheckingIn(false);
      console.log('🏁 Setting checkingIn to false');
    }
  };

  // Auto check-in when QR is scanned
  useEffect(() => {
    console.log('🔔 useEffect triggered - qrData:', qrData?.eventId, 'checkedIn:', checkedIn, 'checkingIn:', checkingIn);

    if (qrData?.eventId && !checkedIn && !checkingIn && handleAutoCheckInRef.current) {
      console.log('▶️ Calling handleAutoCheckIn');
      handleAutoCheckInRef.current(qrData);
    }
  }, [qrData, checkedIn, checkingIn]);

  const handleScan = (result: QrScanner.ScanResult) => {
    const data = result.data;
    if (data) {
      // Check if we're in cooldown period
      if (scanCooldownRef.current) {
        console.log('⏸️ Scan cooldown active, ignoring scan');
        return;
      }

      // Prevent spamming for the same QR code
      if (data === lastScannedRef.current) {
        return;
      }
      lastScannedRef.current = data;

      try {
        // Decode the base64 QR code
        const decoded = decodeQRData(data);
        console.log('📱 QR Code decoded:', decoded);
        setQrData(decoded);

        // Set cooldown period for 1 second
        scanCooldownRef.current = true;
        console.log('⏱️ Starting 1-second scan cooldown');

        setTimeout(() => {
          scanCooldownRef.current = false;
          lastScannedRef.current = null;
          console.log('✅ Scan cooldown ended, ready for next scan');
        }, 1000);
      } catch (error) {
        console.error('Failed to decode QR code:', error);
        showToast('QR Code tidak valid. Pastikan QR dari sistem.', 'error');
      }
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

  const handleReset = () => {
    console.log('🔄 Resetting state for new scan');
    setQrData(null);
    setEvent(null);
    setCheckedIn(false);
    setCheckingIn(false);
    lastScannedRef.current = null;
    scanCooldownRef.current = false;
  };

  const formatTime = (datetime: string) => format(parseISO(datetime), 'HH:mm', { locale: id });
  const formatFullDate = (datetime: string) => format(parseISO(datetime), 'EEEE, d MMMM yyyy', { locale: id });

  console.log('🎨 Rendering - event:', !!event, 'checkedIn:', checkedIn, 'checkingIn:', checkingIn);

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Presensi Mandiri'
        description='Scan QR Code event untuk mencatat kehadiran Anda secara otomatis.'
        actionLabel='Scan QR'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      {!event ? (
        // Scanner View
        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-3 text-emerald-600" />
                  Pemindai QR Code
                </CardTitle>
                <CardDescription>
                  Posisikan QR code event di dalam area kamera untuk melakukan presensi otomatis.
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
                  {checkingIn && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                      <Loader2 className="h-12 w-12 animate-spin text-emerald-500 mb-4" />
                      <p className="text-white text-lg font-medium">Memproses presensi...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      ) : (
        // Success View with Event Details
        <div className="space-y-6">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">
                      Berhasil Presensi!
                    </h2>
                    <p className="text-green-700">
                      Kehadiran Anda telah tercatat untuk event ini
                    </p>
                  </div>
                  {qrData && (
                    <div className="text-sm text-green-600 bg-green-100 px-4 py-2 rounded-lg">
                      Waktu scan: {formatQRTimestamp(qrData.timestamp)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Event Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Tanggal</p>
                      <p className="font-medium text-gray-900">{formatFullDate(event.startDatetime)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Waktu</p>
                      <p className="font-medium text-gray-900">
                        {formatTime(event.startDatetime)} - {formatTime(event.endDatetime)} WIB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Lokasi</p>
                      <p className="font-medium text-gray-900">{event.eventLocation}</p>
                    </div>
                  </div>

                  {event.capacity > 0 && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-500">Kapasitas</p>
                        <p className="font-medium text-gray-900">{event.capacity} orang</p>
                      </div>
                    </div>
                  )}
                </div>

                {event.description && (
                  <div className="pt-4 border-t">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-2">Deskripsi</p>
                        <p className="text-gray-700 leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center"
          >
            <Button
              onClick={handleReset}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8"
            >
              <Camera className="w-5 h-5 mr-2" />
              Scan QR Lain
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
