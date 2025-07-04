'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Repeat, User as UserIcon, Search, Check, X, Save, Plus, Minus, Baby, QrCode, Download, UserPlus } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import Skeleton from '@/components/Skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


// --- Interfaces ---
interface PIC {
  id: string;
  name: string;
  imageUrl: string;
}

interface Event {
  id: string;
  title: string;
  bannerImage?: string;
  description: string;
  capacity: number;
  type: 'event' | 'ibadah' | 'spiritual_journey';
  eventDate: string;
  eventLocation: string;
  startDatetime: string;
  endDatetime: string;
  allDay: boolean;
  timezone: string;
  recurrenceRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    endDate?: string;
    byWeekday?: string[];
  };
  isPublic: boolean;
  pics?: PIC[];
}

interface Participant {
  id: string;
  name: string;
  email?: string;
  isPresent: boolean;
  timestamp?: string;
}

const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'p1', name: 'Andi Suryo', email: 'andi@example.com', isPresent: false },
  { id: 'p2', name: 'Budi Santoso', email: 'budi@example.com', isPresent: true, timestamp: '12/05/2024 08:05:12' },
  { id: 'p3', name: 'Citra Lestari', email: 'citra@example.com', isPresent: false },
  { id: 'p4', name: 'Dewi Anggraini', email: 'dewi@example.com', isPresent: false },
  { id: 'p5', name: 'Eko Prasetyo', email: 'eko@example.com', isPresent: false },
  { id: 'p6', name: 'Fitri Handayani', email: 'fitri@example.com', isPresent: false },
];

export default function EventDetailPage() {
  const params = useParams();
  const { showToast } = useToast();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [simpleAttendance, setSimpleAttendance] = useState({
    dewasa: 0,
    youth: 0,
    kids: 0,
  });
  
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorEmail, setVisitorEmail] = useState('');

  useEffect(() => {
    // --- Mock API Call ---
    const fetchEvent = () => {
      setLoading(true);
      let mockEventData: Event;

      if (eventId === '1') {
        mockEventData = {
          id: '1',
          title: 'Ibadah Minggu Pagi',
          bannerImage: 'https://placehold.co/1200x400.png',
          description: 'Ibadah rutin mingguan untuk seluruh jemaat Every Nation Jakarta. Mari datang dan bersekutu bersama dalam hadirat Tuhan.',
          capacity: 500,
          type: 'ibadah',
          eventDate: '2025-07-20',
          eventLocation: 'Gedung Gereja Utama',
          startDatetime: '2025-07-20T08:00:00+07:00',
          endDatetime: '2025-07-20T10:00:00+07:00',
          allDay: false,
          timezone: 'Asia/Jakarta',
          recurrenceRule: { frequency: 'WEEKLY', byWeekday: ['SU'] },
          isPublic: true,
          pics: [
            { id: 'user1', name: 'Pdt. Budi Santoso', imageUrl: 'https://placehold.co/100x100.png' },
            { id: 'user2', name: 'Ev. Rina Wijaya', imageUrl: 'https://placehold.co/100x100.png' },
          ],
        };
      } else if (eventId === '2') {
        mockEventData = {
          id: '2',
          title: 'Rapat Panitia Natal 2025',
          bannerImage: 'https://placehold.co/1200x400.png',
          description: 'Rapat koordinasi untuk persiapan acara Natal tahun ini. Kehadiran semua panitia diwajibkan.',
          capacity: 50,
          type: 'event',
          eventDate: '2025-07-22',
          eventLocation: 'Ruang Meeting 3, Lt. 2',
          startDatetime: '2025-07-22T19:00:00+07:00',
          endDatetime: '2025-07-22T21:00:00+07:00',
          allDay: false,
          timezone: 'Asia/Jakarta',
          isPublic: false,
          pics: [
            { id: 'user3', name: 'Michael Tan', imageUrl: 'https://placehold.co/100x100.png' },
          ],
        };
      } else {
        // Default fallback for other IDs
        mockEventData = {
          id: eventId,
          title: 'Event Lainnya',
          bannerImage: 'https://placehold.co/1200x400.png',
          description: 'Detail untuk event ini.',
          capacity: 100,
          type: 'event',
          eventDate: '2025-07-25',
          eventLocation: 'Aula',
          startDatetime: '2025-07-25T10:00:00+07:00',
          endDatetime: '2025-07-25T12:00:00+07:00',
          allDay: false,
          timezone: 'Asia/Jakarta',
          isPublic: true,
          pics: [],
        };
      }

      setTimeout(() => {
        setEvent(mockEventData);
        setParticipants(MOCK_PARTICIPANTS);
        setLoading(false);
      }, 1000);
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = participants.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerCaseQuery) ||
        (p.email && p.email.toLowerCase().includes(lowerCaseQuery))
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
              timestamp: !p.isPresent ? new Date().toLocaleString('id-ID') : undefined,
            }
          : p
      )
    );
  };
  
  const handleSaveAttendance = () => {
      // TODO: Implement API call to save attendance data
      console.log("Saving attendance:", participants.filter(p => p.isPresent));
      showToast('Data kehadiran berhasil disimpan!', 'success');
  };
  
  const handleSimpleCountChange = (
    category: keyof typeof simpleAttendance,
    value: number
  ) => {
    setSimpleAttendance((prev) => ({
      ...prev,
      [category]: Math.max(0, value),
    }));
  };

  const handleSaveSimpleAttendance = () => {
    console.log("Saving simple attendance:", { eventId: event?.id, attendance: simpleAttendance });
    showToast('Data kehadiran (jumlah) berhasil disimpan!', 'success');
  };

  const handleAddVisitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      showToast('Nama pengunjung tidak boleh kosong.', 'error');
      return;
    }

    const newVisitor: Participant = {
      id: `visitor-${Date.now()}`,
      name: visitorName.trim(),
      email: visitorEmail.trim() || undefined,
      isPresent: true,
      timestamp: new Date().toLocaleString('id-ID'),
    };

    setParticipants(prev => [newVisitor, ...prev]);
    showToast(`${visitorName.trim()} berhasil ditambahkan sebagai pengunjung.`, 'success');
    
    setVisitorName('');
    setVisitorEmail('');
    setIsVisitorModalOpen(false);
  };

  const formatTime = (datetime: string) => format(parseISO(datetime), 'HH:mm', { locale: id });
  const formatFullDate = (datetime: string) => format(parseISO(datetime), 'EEEE, d MMMM yyyy', { locale: id });
  const formatRecurrence = (rule: Event['recurrenceRule']) => {
    if (!rule) return null;
    let text = '';
    switch (rule.frequency) {
        case 'DAILY': text = 'Setiap hari'; break;
        case 'WEEKLY': text = 'Setiap minggu'; break;
        case 'MONTHLY': text = 'Setiap bulan'; break;
        case 'YEARLY': text = 'Setiap tahun'; break;
    }
    if (rule.endDate) text += ` hingga ${format(parseISO(rule.endDate), 'd MMM yyyy', { locale: id })}`;
    return text;
  };

  if (loading || !event) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title={event.title}
        description={formatFullDate(event.startDatetime)}
        actionLabel='Edit Event'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
            {event.bannerImage && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg">
                    <Image src={event.bannerImage} alt={event.title} layout="fill" objectFit="cover" data-ai-hint="event banner" />
                </motion.div>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Detail Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem icon={Calendar} label="Tanggal" value={formatFullDate(event.startDatetime)} />
                        <InfoItem icon={Clock} label="Waktu" value={`${formatTime(event.startDatetime)} - ${formatTime(event.endDatetime)} WIB`} />
                        <InfoItem icon={MapPin} label="Lokasi" value={event.eventLocation} />
                        <InfoItem icon={Users} label="Kapasitas" value={`${event.capacity} orang`} />
                    </div>
                    {event.recurrenceRule && (
                        <InfoItem icon={Repeat} label="Pengulangan" value={formatRecurrence(event.recurrenceRule)} />
                    )}
                    <p className="text-gray-600 pt-2 border-t mt-4">{event.description}</p>
                </CardContent>
            </Card>

            {event.type === 'ibadah' ? (
              <Card>
                <CardHeader>
                  <CardTitle>Pencatatan Kehadiran (Jumlah)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Dewasa */}
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex flex-col justify-between">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-emerald-100 rounded-lg">
                          <Users className="h-6 w-6 text-emerald-600" />
                        </div>
                        <h4 className="text-lg font-medium text-emerald-800">Dewasa</h4>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-full p-2 shadow-sm">
                        <Button type="button" size="icon" variant="ghost" onClick={() => handleSimpleCountChange('dewasa', simpleAttendance.dewasa - 1)} className="w-10 h-10 text-emerald-700 rounded-full hover:bg-emerald-100">
                          <Minus className="h-5 w-5" />
                        </Button>
                        <p className="text-4xl font-bold text-emerald-900 mx-4">{simpleAttendance.dewasa}</p>
                        <Button type="button" size="icon" variant="ghost" onClick={() => handleSimpleCountChange('dewasa', simpleAttendance.dewasa + 1)} className="w-10 h-10 text-emerald-700 rounded-full hover:bg-emerald-100">
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    {/* Youth */}
                    <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 flex flex-col justify-between">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-sky-100 rounded-lg">
                          <UserIcon className="h-6 w-6 text-sky-600" />
                        </div>
                        <h4 className="text-lg font-medium text-sky-800">Youth</h4>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-full p-2 shadow-sm">
                        <Button type="button" size="icon" variant="ghost" onClick={() => handleSimpleCountChange('youth', simpleAttendance.youth - 1)} className="w-10 h-10 text-sky-700 rounded-full hover:bg-sky-100">
                          <Minus className="h-5 w-5" />
                        </Button>
                        <p className="text-4xl font-bold text-sky-900 mx-4">{simpleAttendance.youth}</p>
                        <Button type="button" size="icon" variant="ghost" onClick={() => handleSimpleCountChange('youth', simpleAttendance.youth + 1)} className="w-10 h-10 text-sky-700 rounded-full hover:bg-sky-100">
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                    {/* Kids */}
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex flex-col justify-between">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-3 bg-amber-100 rounded-lg">
                          <Baby className="h-6 w-6 text-amber-600" />
                        </div>
                        <h4 className="text-lg font-medium text-amber-800">Kids</h4>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded-full p-2 shadow-sm">
                        <Button type="button" size="icon" variant="ghost" onClick={() => handleSimpleCountChange('kids', simpleAttendance.kids - 1)} className="w-10 h-10 text-amber-700 rounded-full hover:bg-amber-100">
                          <Minus className="h-5 w-5" />
                        </Button>
                        <p className="text-4xl font-bold text-amber-900 mx-4">{simpleAttendance.kids}</p>
                        <Button type="button" size="icon" variant="ghost" onClick={() => handleSimpleCountChange('kids', simpleAttendance.kids + 1)} className="w-10 h-10 text-amber-700 rounded-full hover:bg-amber-100">
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSaveSimpleAttendance}>
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Kehadiran
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <QrCode className="w-5 h-5 mr-3 text-emerald-600" />
                                QR Code Absensi Mandiri
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4 text-center">
                            <p className="text-sm text-gray-600 max-w-md">
                                Jemaat dapat melakukan absensi mandiri dengan memindai QR Code ini menggunakan aplikasi atau kamera HP.
                            </p>
                            <div className="p-4 bg-white border-2 border-emerald-500 rounded-lg inline-block">
                                <QRCodeSVG 
                                    value={JSON.stringify({ eventId: event.id, title: event.title, date: event.eventDate, generatedAt: new Date().toISOString() })} 
                                    size={200}
                                    level="H"
                                    includeMargin
                                />
                            </div>
                            <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Unduh QR Code</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Pencatatan Kehadiran</CardTitle></CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input 
                                        placeholder="Cari nama atau email peserta..." 
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Dialog open={isVisitorModalOpen} onOpenChange={setIsVisitorModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline"><UserPlus className="h-4 w-4 mr-2" />Tambah Pengunjung</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Tambah Pengunjung Baru</DialogTitle>
                                            <DialogDescription>
                                                Masukkan detail pengunjung baru. Hanya nama yang wajib diisi. Pengunjung yang ditambahkan akan otomatis ditandai hadir.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleAddVisitor} className="space-y-4 pt-4">
                                            <div>
                                                <Label htmlFor="visitorName">Nama Pengunjung</Label>
                                                <Input id="visitorName" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="Nama lengkap" required className="mt-1" />
                                            </div>
                                            <div>
                                                <Label htmlFor="visitorEmail">Email (Opsional)</Label>
                                                <Input id="visitorEmail" type="email" value={visitorEmail} onChange={(e) => setVisitorEmail(e.target.value)} placeholder="email@contoh.com" className="mt-1"/>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Tambah Pengunjung</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                                {filteredParticipants.map((p, index) => (
                                <motion.div 
                                    key={p.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`flex items-center justify-between p-3 rounded-lg ${p.isPresent ? 'bg-green-50' : 'bg-gray-50'}`}
                                >
                                    <div>
                                        <p className="font-medium text-gray-800">{p.name}</p>
                                        <p className="text-xs text-gray-500">{p.email || 'Pengunjung'}</p>
                                        {p.timestamp && <p className="text-xs text-green-600 mt-1">Hadir: {p.timestamp}</p>}
                                    </div>
                                    <Button 
                                    size="sm" 
                                    variant={p.isPresent ? 'outline' : 'default'}
                                    onClick={() => toggleAttendance(p.id)}
                                    className={p.isPresent ? 'border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700' : 'bg-green-600 hover:bg-green-700'}
                                    >
                                        {p.isPresent ? <X className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                                        {p.isPresent ? 'Batalkan' : 'Hadir'}
                                    </Button>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <Button onClick={handleSaveAttendance}><Save className="h-4 w-4 mr-2" />Simpan Kehadiran</Button>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <UserIcon className="w-5 h-5 mr-2" />
                        Penanggung Jawab
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {event.pics?.map(pic => (
                        <div key={pic.id} className="flex items-center space-x-3">
                            <Image src={pic.imageUrl} alt={pic.name} width={40} height={40} className="rounded-full" data-ai-hint="person portrait" />
                            <div>
                                <p className="font-semibold text-gray-800">{pic.name}</p>
                                <p className="text-xs text-gray-500">PIC</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null }) => (
    <div>
        <div className="flex items-center text-xs text-gray-500 mb-1">
            <Icon className="w-3.5 h-3.5 mr-1.5" />
            {label}
        </div>
        <p className="font-medium text-gray-800">{value}</p>
    </div>
);
