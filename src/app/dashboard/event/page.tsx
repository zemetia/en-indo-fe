'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Plus, Clock, MapPin, Users, Music, Repeat, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from 'next/image';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

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
  discipleshipJourneyId?: string;
  lagu?: { id:string; title: string }[];
  pics?: PIC[];
}

export default function EventPage() {
  const router = useRouter();
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mock data events - nantinya akan diambil dari API
  const events: Event[] = [
    {
      id: '1',
      title: 'Ibadah Minggu',
      bannerImage: 'https://placehold.co/800x400.png',
      description: 'Ibadah Minggu bersama jemaat',
      capacity: 500,
      type: 'ibadah',
      eventDate: '2024-05-12',
      eventLocation: 'Gedung Gereja',
      startDatetime: '2024-05-12T08:00:00+07:00',
      endDatetime: '2024-05-12T10:00:00+07:00',
      allDay: false,
      timezone: 'Asia/Jakarta',
      recurrenceRule: {
        frequency: 'WEEKLY',
        byWeekday: ['SU'],
        endDate: '2024-12-31'
      },
      isPublic: true,
      lagu: [
        { id: '1', title: 'Great is Thy Faithfulness' },
        { id: '2', title: 'Amazing Grace' },
      ],
      pics: [
        { id: 'user1', name: 'Pdt. Budi', imageUrl: 'https://placehold.co/100x100.png' },
        { id: 'user2', name: 'Ev. Rina', imageUrl: 'https://placehold.co/100x100.png' },
      ]
    },
    {
      id: '2',
      title: 'Life Group Leaders Meeting',
      description: 'Pertemuan rutin para pemimpin Life Group',
      capacity: 50,
      type: 'event',
      eventDate: '2024-05-15',
      eventLocation: 'Ruang Meeting',
      startDatetime: '2024-05-15T19:00:00+07:00',
      endDatetime: '2024-05-15T21:00:00+07:00',
      allDay: false,
      timezone: 'Asia/Jakarta',
      isPublic: false,
      pics: [
        { id: 'user3', name: 'Michael Tan', imageUrl: 'https://placehold.co/100x100.png' },
      ]
    },
  ];

  const handleCreateEvent = () => {
    router.push('/dashboard/event/create');
  };

  const handleEventClick = (eventId: string) => {
    console.log(`Navigating to event detail page for ID: ${eventId}`);
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'ibadah': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'spiritual_journey': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const formatTime = (datetime: string) => {
    return format(parseISO(datetime), 'HH:mm', { locale: id });
  };

  const formatRecurrence = (rule: Event['recurrenceRule']) => {
    if (!rule) return '';
    let text = '';
    switch (rule.frequency) {
        case 'DAILY': text = 'Setiap hari'; break;
        case 'WEEKLY': text = 'Setiap minggu'; break;
        case 'MONTHLY': text = 'Setiap bulan'; break;
        case 'YEARLY': text = 'Setiap tahun'; break;
    }
    if (rule.endDate) {
        text += ` hingga ${format(parseISO(rule.endDate), 'd MMM yyyy', { locale: id })}`;
    }
    return text;
  };

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Kalender Event'
        description='Kelola event dan jadwal kegiatan gereja'
        actionLabel='Buat Event'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
        onAction={handleCreateEvent}
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className="text-xl font-semibold">Daftar Event</h2>
            <Button onClick={handleCreateEvent}><Plus className='h-4 w-4 mr-2' />Buat Event</Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {events.map((event) => (
              <motion.div key={event.id} whileHover={{ scale: 1.02 }} onClick={() => handleEventClick(event.id)} className='bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-500 cursor-pointer flex flex-col overflow-hidden'>
                {event.bannerImage && (
                  <div className="relative h-40 w-full">
                    <Image src={event.bannerImage} alt={event.title} layout="fill" objectFit="cover" data-ai-hint="event banner" />
                  </div>
                )}
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className='text-lg font-bold text-gray-900'>{event.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getEventTypeColor(event.type)}`}>
                      {event.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className='flex items-center'><Calendar className='h-4 w-4 mr-2 text-gray-400' />{format(parseISO(event.eventDate), 'EEEE, d MMMM yyyy', { locale: id })}</div>
                    <div className='flex items-center'><Clock className='h-4 w-4 mr-2 text-gray-400' />{isClient ? <>{formatTime(event.startDatetime)} - {formatTime(event.endDatetime)}</> : <span className="w-20 h-4 bg-gray-200 rounded animate-pulse inline-block" />}</div>
                    <div className='flex items-center'><MapPin className='h-4 w-4 mr-2 text-gray-400' />{event.eventLocation}</div>
                  </div>

                  {event.recurrenceRule && (
                    <div className="flex items-center text-xs text-emerald-600 font-medium bg-emerald-50 rounded-md p-2 mb-4">
                      <Repeat className='h-4 w-4 mr-1.5'/>
                      <span>{formatRecurrence(event.recurrenceRule)}</span>
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <div className="flex items-center -space-x-2">
                      {event.pics?.map(pic => (
                        <Image key={pic.id} src={pic.imageUrl} alt={pic.name} width={28} height={28} className="rounded-full border-2 border-white" data-ai-hint="person portrait" />
                      ))}
                      {event.pics && event.pics.length > 0 && <span className="text-xs text-gray-500 pl-3">({event.pics.length} PIC)</span>}
                    </div>
                    <div className='flex items-center text-sm text-gray-500'>
                      <Users className='h-4 w-4 mr-2' />
                      {event.capacity}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
