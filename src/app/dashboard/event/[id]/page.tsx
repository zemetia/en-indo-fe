'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Repeat, User as UserIcon, Search, Check, X, Save, Plus, Minus, Baby, QrCode, Download, UserPlus, CalendarDays, AlertCircle, Loader2, TrendingUp, ListChecks } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { encodeQRData } from '@/lib/utils/qr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import Skeleton from '@/components/Skeleton';
import { getEvent, Event as APIEvent, getEventDepartments, updateEventDepartments, EventDepartment } from '@/lib/api/events';
import { departmentService, Department } from '@/lib/department-service';
import { getToken } from '@/lib/helper';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  EventParticipant,
  getEventParticipants,
  registerParticipant,
  checkInParticipant,
  getAttendanceReport,
  EventParticipantListResponse,
  AttendanceReportResponse
} from '@/lib/api/eventParticipants';
import { Person, getAllPersons } from '@/lib/api/persons';
import { createVisitor, getAllVisitors, Visitor } from '@/lib/api/visitors';


// --- Interfaces ---
interface PIC {
  id: string;
  name: string;
  imageUrl: string;
}

// Use the API types
type Event = APIEvent;


export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const eventId = params.id as string;

  useEffect(() => {
    document.title = 'Detail Acara - Dashboard Every Nation';
  }, []);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [participants, setParticipants] = useState<EventParticipant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<EventParticipant[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<EventParticipantListResponse['stats'] | null>(null);
  const [selectedOccurrenceDate, setSelectedOccurrenceDate] = useState<string>('');
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [simpleAttendance, setSimpleAttendance] = useState({
    dewasa: 0,
    youth: 0,
    kids: 0,
  });

  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorIg, setVisitorIg] = useState('');
  const [registeredJemaatSearch, setRegisteredJemaatSearch] = useState('');
  const [allPersons, setAllPersons] = useState<Person[]>([]);
  const [personsLoading, setPersonsLoading] = useState(false);
  const [registeredVisitorSearch, setRegisteredVisitorSearch] = useState('');
  const [allVisitors, setAllVisitors] = useState<Visitor[]>([]);
  const [visitorsLoading, setVisitorsLoading] = useState(false);

  // Department management state
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [eventDepartments, setEventDepartments] = useState<EventDepartment[]>([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState<Set<string>>(new Set());
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [savingDepartments, setSavingDepartments] = useState(false);

  const filteredRegisteredJemaat = allPersons.filter(person =>
    !participants.some(p => p.participantType === 'person' && p.participantId === person.id) &&
    person.nama.toLowerCase().includes(registeredJemaatSearch.toLowerCase())
  );

  const filteredRegisteredVisitors = allVisitors.filter(visitor =>
    !participants.some(p => p.participantType === 'visitor' && p.participantId === visitor.id) &&
    visitor.name.toLowerCase().includes(registeredVisitorSearch.toLowerCase())
  );

  // Fetch event data from API
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      try {
        setLoading(true);
        setError(null);

        const eventData = await getEvent(eventId);
        setEvent(eventData);

        // Set the default occurrence date (use event start date)
        const occDate = format(parseISO(eventData.startDatetime), 'yyyy-MM-dd');
        setSelectedOccurrenceDate(occDate);

      } catch (err) {
        console.error('Failed to fetch event:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load event';
        setError(errorMessage);
        showToast('Gagal memuat detail event.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Fetch participants when occurrence date changes
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!eventId || !selectedOccurrenceDate || participantsLoading) return;

      const abortController = new AbortController();

      try {
        setParticipantsLoading(true);
        const response = await getEventParticipants(eventId, selectedOccurrenceDate);

        // Check if component is still mounted
        if (!abortController.signal.aborted) {
          setParticipants(response.participants);
          setAttendanceStats(response.stats);
        }
      } catch (err) {
        if (!abortController.signal.aborted) {
          console.error('Failed to fetch participants:', err);
          showToast('Gagal memuat data peserta.', 'error');
        }
      } finally {
        if (!abortController.signal.aborted) {
          setParticipantsLoading(false);
        }
      }

      return () => {
        abortController.abort();
      };
    };

    fetchParticipants();
  }, [eventId, selectedOccurrenceDate]);

  // Fetch all persons when needed
  const fetchPersons = async () => {
    if (allPersons.length > 0) return; // Already loaded

    try {
      setPersonsLoading(true);
      const persons = await getAllPersons();
      setAllPersons(persons);
    } catch (err) {
      console.error('Failed to fetch persons:', err);
      showToast('Gagal memuat data jemaat.', 'error');
    } finally {
      setPersonsLoading(false);
    }
  };

  // Fetch all visitors when needed
  const fetchVisitors = async () => {
    if (allVisitors.length > 0) return; // Already loaded

    try {
      setVisitorsLoading(true);
      const visitors = await getAllVisitors();
      setAllVisitors(visitors);
    } catch (err) {
      console.error('Failed to fetch visitors:', err);
      showToast('Gagal memuat data pengunjung.', 'error');
    } finally {
      setVisitorsLoading(false);
    }
  };

  // Fetch departments when Pelayanan tab is viewed
  const fetchDepartments = async () => {
    if (!eventId) return;

    // Only fetch if not already loaded
    if (allDepartments.length > 0) return;

    // Check if user is authenticated before making API calls
    const token = getToken();
    if (!token) {
      console.error('No token found - user may not be properly authenticated');
      showToast('Sesi Anda telah berakhir. Silakan login kembali.', 'error');
      return;
    }

    try {
      setDepartmentsLoading(true);

      // Fetch all departments and event's departments in parallel
      const [allDepts, eventDepts] = await Promise.all([
        departmentService.getAll(),
        getEventDepartments(eventId),
      ]);

      setAllDepartments(allDepts);
      setEventDepartments(eventDepts);

      // Initialize selected department IDs
      const selectedIds = new Set(eventDepts.map(d => d.id));
      setSelectedDepartmentIds(selectedIds);

    } catch (err) {
      console.error('Failed to fetch departments:', err);
      showToast('Gagal memuat data departemen.', 'error');
    } finally {
      setDepartmentsLoading(false);
    }
  };

  const handleSaveDepartments = async () => {
    if (!eventId) return;

    try {
      setSavingDepartments(true);

      await updateEventDepartments(eventId, Array.from(selectedDepartmentIds));

      showToast('Departemen berhasil diperbarui!', 'success');

      // Refresh event departments
      const updatedDepts = await getEventDepartments(eventId);
      setEventDepartments(updatedDepts);

    } catch (err) {
      console.error('Failed to update departments:', err);
      showToast('Gagal memperbarui departemen.', 'error');
    } finally {
      setSavingDepartments(false);
    }
  };

  const toggleDepartment = (departmentId: string) => {
    setSelectedDepartmentIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = participants.filter(
      (p) => {
        const name = p.participantDetails.type === 'person'
          ? p.participantDetails.person?.nama || ''
          : p.participantDetails.visitor?.name || '';
        const email = p.participantDetails.type === 'person'
          ? p.participantDetails.person?.email || ''
          : '';

        return name.toLowerCase().includes(lowerCaseQuery) ||
          email.toLowerCase().includes(lowerCaseQuery);
      }
    );
    setFilteredParticipants(filtered);
  }, [searchQuery, participants]);

  const toggleAttendance = async (participant: EventParticipant) => {
    try {
      // Check in participant
      await checkInParticipant(participant.id, {
        checkInMethod: 'manual',
        notes: 'Manual check-in from event detail page'
      });

      // Refresh participants
      const response = await getEventParticipants(eventId, selectedOccurrenceDate);
      setParticipants(response.participants);
      setAttendanceStats(response.stats);

      showToast('Berhasil check-in peserta!', 'success');
    } catch (err) {
      console.error('Failed to check in participant:', err);
      showToast('Gagal check-in peserta.', 'error');
    }
  };

  const handleSaveAttendance = () => {
      showToast('Data kehadiran telah tersimpan secara otomatis!', 'success');
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

  const handleAddVisitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) {
      showToast('Nama pengunjung tidak boleh kosong.', 'error');
      return;
    }

    try {
      // Create visitor in backend
      const newVisitor = await createVisitor({
        name: visitorName,
        phone_number: visitorPhone || undefined,
        ig_username: visitorIg || undefined,
      });

      // Register the visitor as a participant
      await registerParticipant({
        eventId,
        occurrenceDate: selectedOccurrenceDate,
        participantType: 'visitor',
        participantId: newVisitor.id,
      });

      // Refresh participants
      const response = await getEventParticipants(eventId, selectedOccurrenceDate);
      setParticipants(response.participants);
      setAttendanceStats(response.stats);

      showToast(`${newVisitor.name} berhasil ditambahkan sebagai peserta.`, 'success');

      // Reset form
      setVisitorName('');
      setVisitorPhone('');
      setVisitorIg('');
      setIsAddParticipantModalOpen(false);
    } catch (err) {
      console.error('Failed to add visitor:', err);
      showToast('Gagal menambahkan pengunjung.', 'error');
    }
  };

  const handleAddRegisteredJemaat = async (person: Person) => {
    try {
      await registerParticipant({
        eventId,
        occurrenceDate: selectedOccurrenceDate,
        participantType: 'person',
        participantId: person.id,
      });

      // Refresh participants
      const response = await getEventParticipants(eventId, selectedOccurrenceDate);
      setParticipants(response.participants);
      setAttendanceStats(response.stats);

      showToast(`${person.nama} berhasil ditambahkan sebagai peserta.`, 'success');
      setIsAddParticipantModalOpen(false);
      setRegisteredJemaatSearch('');
    } catch (err) {
      console.error('Failed to add participant:', err);
      showToast('Gagal menambahkan peserta.', 'error');
    }
  };

  const handleAddRegisteredVisitor = async (visitor: Visitor) => {
    try {
      await registerParticipant({
        eventId,
        occurrenceDate: selectedOccurrenceDate,
        participantType: 'visitor',
        participantId: visitor.id,
      });

      // Refresh participants
      const response = await getEventParticipants(eventId, selectedOccurrenceDate);
      setParticipants(response.participants);
      setAttendanceStats(response.stats);

      showToast(`${visitor.name} berhasil ditambahkan sebagai peserta.`, 'success');
      setIsAddParticipantModalOpen(false);
      setRegisteredVisitorSearch('');
    } catch (err) {
      console.error('Failed to add visitor participant:', err);
      showToast('Gagal menambahkan pengunjung sebagai peserta.', 'error');
    }
  };

  const formatTime = (datetime: string) => format(parseISO(datetime), 'HH:mm', { locale: id });
  const formatFullDate = (datetime: string) => format(parseISO(datetime), 'EEEE, d MMMM yyyy', { locale: id });
  const formatRecurrence = (rule: Event['recurrenceRule']) => {
    if (!rule) return null;

    let text = '';
    const { frequency, interval, byWeekday, byMonthDay, byMonth, bySetPos, count, until } = rule;

    // Base frequency text
    switch (frequency) {
      case 'DAILY':
        text = interval === 1 ? 'Setiap hari' : `Setiap ${interval} hari`;
        break;
      case 'WEEKLY':
        if (byWeekday && byWeekday.length > 0) {
          const dayNames = byWeekday.map(d => {
            const dayMap: {[key: string]: string} = {
              'SU': 'Minggu', 'MO': 'Senin', 'TU': 'Selasa',
              'WE': 'Rabu', 'TH': 'Kamis', 'FR': 'Jumat', 'SA': 'Sabtu'
            };
            return dayMap[d] || d;
          }).join(', ');
          const prefix = interval === 1 ? 'Setiap minggu pada' : `Setiap ${interval} minggu pada`;
          text = `${prefix} ${dayNames}`;
        } else {
          text = interval === 1 ? 'Setiap minggu' : `Setiap ${interval} minggu`;
        }
        break;
      case 'MONTHLY':
        if (byMonthDay && byMonthDay.length > 0) {
          const dayText = byMonthDay.map(d => d === -1 ? 'hari terakhir' : `tanggal ${d}`).join(', ');
          const prefix = interval === 1 ? 'Setiap bulan pada' : `Setiap ${interval} bulan pada`;
          text = `${prefix} ${dayText}`;
        } else if (byWeekday && byWeekday.length > 0 && bySetPos && bySetPos.length > 0) {
          const dayMap: {[key: string]: string} = {
            'SU': 'Minggu', 'MO': 'Senin', 'TU': 'Selasa',
            'WE': 'Rabu', 'TH': 'Kamis', 'FR': 'Jumat', 'SA': 'Sabtu'
          };
          const day = dayMap[byWeekday[0]] || byWeekday[0];
          const ordinalMap: {[key: number]: string} = {
            1: 'pertama',
            2: 'kedua',
            3: 'ketiga',
            4: 'keempat',
            [-1]: 'terakhir'
          };
          const ordinal = ordinalMap[bySetPos[0]] || bySetPos[0].toString();
          const prefix = interval === 1 ? 'Setiap bulan pada' : `Setiap ${interval} bulan pada`;
          text = `${prefix} ${day} ${ordinal}`;
        } else {
          text = interval === 1 ? 'Setiap bulan' : `Setiap ${interval} bulan`;
        }
        break;
      case 'YEARLY':
        if (byMonth && byMonth.length > 0) {
          const monthNames = byMonth.map(m => {
            const monthMap: {[key: number]: string} = {
              1: 'Januari', 2: 'Februari', 3: 'Maret', 4: 'April',
              5: 'Mei', 6: 'Juni', 7: 'Juli', 8: 'Agustus',
              9: 'September', 10: 'Oktober', 11: 'November', 12: 'Desember'
            };
            return monthMap[m] || m.toString();
          }).join(', ');
          const prefix = interval === 1 ? 'Setiap tahun pada bulan' : `Setiap ${interval} tahun pada bulan`;
          text = `${prefix} ${monthNames}`;
        } else {
          text = interval === 1 ? 'Setiap tahun' : `Setiap ${interval} tahun`;
        }
        break;
    }

    // Add end condition
    if (until) {
      text += ` hingga ${format(parseISO(until), 'd MMM yyyy', { locale: id })}`;
    } else if (count) {
      text += ` (${count} kali)`;
    }

    return text;
  };

  if (loading) {
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

  if (error || !event) {
    return (
      <div className="space-y-6">
        <FeaturedCard
          title="Error"
          description="Gagal memuat detail event"
          actionLabel="Kembali"
          gradientFrom="from-red-500"
          gradientTo="to-red-700"
          onAction={() => router.back()}
        />
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Event tidak ditemukan</h3>
          <p className="text-gray-600 mb-4">
            {error || 'Event yang Anda cari tidak ditemukan atau telah dihapus.'}
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              Kembali
            </Button>
            <Button onClick={() => window.location.reload()}>
              <Loader2 className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
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

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => router.push('/dashboard/event/calendar')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <CalendarDays className="h-4 w-4" />
          Lihat Kalender
        </Button>
        {event.recurrenceRule && (
          <Button
            onClick={() => router.push(`/dashboard/event/${event.id}/edit`)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Repeat className="h-4 w-4" />
            Edit Seri Event
          </Button>
        )}
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white border-b">
          <TabsTrigger value="overview" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500">
            Overview
          </TabsTrigger>
          <TabsTrigger value="kehadiran" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500">
            Kehadiran
          </TabsTrigger>
          <TabsTrigger value="pelayanan" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500" onClick={fetchDepartments}>
            Pelayanan
          </TabsTrigger>
          <TabsTrigger value="pic" className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-500">
            PIC
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
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

          {/* Expected Participants */}
          {(event.expectedParticipants > 0 || event.expectedAdults > 0 || event.expectedYouth > 0 || event.expectedKids > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Perkiraan Peserta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{event.expectedParticipants}</div>
                  <p className="text-sm text-gray-500">Total Peserta</p>
                </div>

                {(event.expectedAdults > 0 || event.expectedYouth > 0 || event.expectedKids > 0) && (
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700">Breakdown:</h4>
                    <div className="space-y-2">
                      {event.expectedAdults > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm text-gray-600">Dewasa</span>
                          </div>
                          <div className="text-sm font-medium">
                            {event.expectedAdults}
                            {event.expectedParticipants > 0 && (
                              <span className="text-xs text-gray-400 ml-1">
                                ({Math.round((event.expectedAdults / event.expectedParticipants) * 100)}%)
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {event.expectedYouth > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <span className="text-sm text-gray-600">Youth</span>
                          </div>
                          <div className="text-sm font-medium">
                            {event.expectedYouth}
                            {event.expectedParticipants > 0 && (
                              <span className="text-xs text-gray-400 ml-1">
                                ({Math.round((event.expectedYouth / event.expectedParticipants) * 100)}%)
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {event.expectedKids > 0 && (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Baby className="h-4 w-4 text-orange-600" />
                            <span className="text-sm text-gray-600">Anak-anak</span>
                          </div>
                          <div className="text-sm font-medium">
                            {event.expectedKids}
                            {event.expectedParticipants > 0 && (
                              <span className="text-xs text-gray-400 ml-1">
                                ({Math.round((event.expectedKids / event.expectedParticipants) * 100)}%)
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Kehadiran Tab */}
        <TabsContent value="kehadiran" className="space-y-6 mt-6">
          {/* Occurrence Date Selector for Recurring Events */}
          {event.recurrenceRule && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2" />
                  Pilih Tanggal Kejadian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Label htmlFor="occurrenceDate" className="text-sm font-medium">Tanggal:</Label>
                  <Input
                    id="occurrenceDate"
                    type="date"
                    value={selectedOccurrenceDate}
                    onChange={(e) => setSelectedOccurrenceDate(e.target.value)}
                    className="max-w-xs"
                  />
                  <p className="text-sm text-gray-600">
                    Event ini berulang. Pilih tanggal kejadian untuk melihat kehadiran.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attendance Statistics */}
          {attendanceStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Statistik Kehadiran
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-900">{attendanceStats.totalRegistered}</div>
                    <p className="text-sm text-blue-600">Terdaftar</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-900">{attendanceStats.totalPresent}</div>
                    <p className="text-sm text-green-600">Hadir</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{attendanceStats.totalAbsent}</div>
                    <p className="text-sm text-gray-600">Belum Hadir</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-900">{attendanceStats.attendanceRate.toFixed(1)}%</div>
                    <p className="text-sm text-emerald-600">Tingkat Kehadiran</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                      value={encodeQRData(event.id)}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">QR Code ini unik dan dapat diregenerasi setiap saat</p>
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
                    <Dialog open={isAddParticipantModalOpen} onOpenChange={setIsAddParticipantModalOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => { fetchPersons(); fetchVisitors(); }}><UserPlus className="h-4 w-4 mr-2" />Tambah Peserta</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Tambah Peserta</DialogTitle>
                          <DialogDescription>
                            Tambah pengunjung baru atau tambahkan jemaat yang sudah terdaftar ke dalam acara ini.
                          </DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="registered-jemaat" className="w-full pt-2">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="registered-jemaat">Jemaat Terdaftar</TabsTrigger>
                            <TabsTrigger value="registered-visitor">Pengunjung Terdaftar</TabsTrigger>
                            <TabsTrigger value="new-visitor">Pengunjung Baru</TabsTrigger>
                          </TabsList>
                          <TabsContent value="registered-jemaat">
                            <div className="pt-4 space-y-4">
                              {personsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
                                  <span className="text-sm text-gray-600">Memuat data jemaat...</span>
                                </div>
                              ) : (
                                <>
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      placeholder="Cari nama jemaat..."
                                      className="pl-10"
                                      value={registeredJemaatSearch}
                                      onChange={(e) => setRegisteredJemaatSearch(e.target.value)}
                                    />
                                  </div>
                                  <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-2">
                                    {filteredRegisteredJemaat.length > 0 ? filteredRegisteredJemaat.map(person => (
                                      <div key={person.id} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                                        <div>
                                          <p className="text-sm font-medium">{person.nama}</p>
                                          <p className="text-xs text-gray-500">{person.email}</p>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => handleAddRegisteredJemaat(person)}>
                                          <Plus className="h-4 w-4 mr-1"/> Tambah
                                        </Button>
                                      </div>
                                    )) : (
                                      <p className="text-center text-sm text-gray-500 py-4">Tidak ada jemaat ditemukan atau sudah menjadi peserta.</p>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </TabsContent>
                          <TabsContent value="registered-visitor">
                            <div className="pt-4 space-y-4">
                              {visitorsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                  <Loader2 className="h-6 w-6 animate-spin text-emerald-600 mr-2" />
                                  <span className="text-sm text-gray-600">Memuat data pengunjung...</span>
                                </div>
                              ) : (
                                <>
                                  <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                      placeholder="Cari nama pengunjung..."
                                      className="pl-10"
                                      value={registeredVisitorSearch}
                                      onChange={(e) => setRegisteredVisitorSearch(e.target.value)}
                                    />
                                  </div>
                                  <div className="mt-4 max-h-60 overflow-y-auto space-y-2 pr-2">
                                    {filteredRegisteredVisitors.length > 0 ? filteredRegisteredVisitors.map(visitor => (
                                      <div key={visitor.id} className="flex items-center justify-between p-2 rounded-md bg-gray-50">
                                        <div>
                                          <p className="text-sm font-medium">{visitor.name}</p>
                                          <p className="text-xs text-gray-500">
                                            {visitor.phone_number || visitor.ig_username || 'Tidak ada kontak'}
                                          </p>
                                        </div>
                                        <Button size="sm" variant="ghost" onClick={() => handleAddRegisteredVisitor(visitor)}>
                                          <Plus className="h-4 w-4 mr-1"/> Tambah
                                        </Button>
                                      </div>
                                    )) : (
                                      <p className="text-center text-sm text-gray-500 py-4">Tidak ada pengunjung ditemukan atau sudah menjadi peserta.</p>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </TabsContent>
                          <TabsContent value="new-visitor">
                            <form onSubmit={handleAddVisitor} className="space-y-4 pt-4">
                              <div>
                                <Label htmlFor="visitorName">Nama Pengunjung</Label>
                                <Input id="visitorName" value={visitorName} onChange={(e) => setVisitorName(e.target.value)} placeholder="Nama lengkap" required className="mt-1" />
                              </div>
                              <div>
                                <Label htmlFor="visitorPhone">No. Telepon (Opsional)</Label>
                                <Input id="visitorPhone" value={visitorPhone} onChange={(e) => setVisitorPhone(e.target.value)} placeholder="+62" className="mt-1"/>
                              </div>
                              <div>
                                <Label htmlFor="visitorIg">Instagram Username (Opsional)</Label>
                                <Input id="visitorIg" value={visitorIg} onChange={(e) => setVisitorIg(e.target.value)} placeholder="@username" className="mt-1"/>
                              </div>
                              <DialogFooter>
                                <Button type="submit">Tambah Pengunjung</Button>
                              </DialogFooter>
                            </form>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {filteredParticipants.map((p, index) => {
                      const isPresent = p.attendanceStatus === 'present';
                      const name = p.participantDetails.type === 'person'
                        ? p.participantDetails.person?.nama || 'Unknown'
                        : p.participantDetails.visitor?.name || 'Unknown';
                      const email = p.participantDetails.type === 'person'
                        ? p.participantDetails.person?.email
                        : '';
                      const phone = p.participantDetails.type === 'visitor'
                        ? p.participantDetails.visitor?.phoneNumber
                        : p.participantDetails.person?.nomorTelepon;
                      const label = p.participantDetails.type === 'person' ? 'Jemaat' : 'Pengunjung';
                      const badgeColor = p.participantDetails.type === 'person' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700';

                      return (
                        <motion.div
                          key={p.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`flex items-center justify-between p-3 rounded-lg ${isPresent ? 'bg-green-50' : 'bg-gray-50'}`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-800">{name}</p>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${badgeColor}`}>
                                {label}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{email || phone || 'Tidak ada kontak'}</p>
                            {p.checkInTime && <p className="text-xs text-green-600 mt-1">Hadir: {format(parseISO(p.checkInTime), 'dd/MM/yyyy HH:mm:ss', { locale: id })}</p>}
                          </div>
                          <Button
                            size="sm"
                            variant={isPresent ? 'outline' : 'default'}
                            onClick={() => toggleAttendance(p)}
                            disabled={isPresent}
                            className={isPresent ? 'border-green-300 text-green-600' : 'bg-green-600 hover:bg-green-700'}
                          >
                            {isPresent ? <Check className="h-4 w-4 mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                            {isPresent ? 'Hadir' : 'Check In'}
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSaveAttendance}><Save className="h-4 w-4 mr-2" />Simpan Kehadiran</Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Pelayanan Tab */}
        <TabsContent value="pelayanan" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListChecks className="w-5 h-5 mr-2" />
                Departemen yang Dibutuhkan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {departmentsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  <span className="ml-3 text-gray-600">Memuat departemen...</span>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-600 mb-6">
                    Pilih departemen yang dibutuhkan untuk event ini. Sistem akan membantu Anda mengelola pelayanan yang diperlukan berdasarkan departemen yang dipilih.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allDepartments.map((dept) => (
                      <div
                        key={dept.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedDepartmentIds.has(dept.id)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleDepartment(dept.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={selectedDepartmentIds.has(dept.id)}
                            onCheckedChange={() => toggleDepartment(dept.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{dept.name}</h4>
                            {dept.description && (
                              <p className="text-sm text-gray-500 mt-1">{dept.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {allDepartments.length === 0 && (
                    <div className="text-center py-12">
                      <ListChecks className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">Belum ada departemen yang tersedia</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Hubungi admin untuk menambahkan departemen
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-center pt-6 border-t">
                    <p className="text-sm text-gray-600">
                      {selectedDepartmentIds.size} dari {allDepartments.length} departemen dipilih
                    </p>
                    <Button
                      onClick={handleSaveDepartments}
                      disabled={savingDepartments}
                    >
                      {savingDepartments ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Simpan Perubahan
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PIC Tab */}
        <TabsContent value="pic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="w-5 h-5 mr-2" />
                Penanggung Jawab (PIC)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {event.eventPics && event.eventPics.length > 0 ? (
                event.eventPics.map(pic => (
                  <div key={pic.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">
                          {pic.person?.nama || 'Unknown'}
                        </p>
                        {pic.isPrimary && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{pic.role}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">Belum ada PIC yang ditugaskan</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Tambahkan PIC untuk event ini melalui halaman edit event
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
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
