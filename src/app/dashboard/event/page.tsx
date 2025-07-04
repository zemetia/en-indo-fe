'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Plus, Clock, MapPin, Users, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

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
    interval: number;
    byWeekday?: string[];
    byMonthDay?: number[];
    byMonth?: number[];
    count?: number;
    until?: string;
  };
  isPublic: boolean;
  discipleshipJourneyId?: string;
  lagu?: { id: string; title: string }[];
}

export default function EventPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  // Mock data events - nantinya akan diambil dari API
  const events: Event[] = [
    {
      id: '1',
      title: 'Ibadah Minggu',
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
        interval: 1,
        byWeekday: ['SU'],
      },
      isPublic: true,
      lagu: [
        { id: '1', title: 'Great is Thy Faithfulness' },
        { id: '2', title: 'Amazing Grace' },
      ],
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
      recurrenceRule: {
        frequency: 'MONTHLY',
        interval: 1,
        byMonthDay: [15],
      },
      isPublic: false,
    },
  ];

  const handleCreateEvent = () => {
    router.push('/dashboard/event/create');
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/dashboard/event/${eventId}`);
  };

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'ibadah':
        return 'bg-blue-100 text-blue-800';
      case 'spiritual_journey':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-emerald-100 text-emerald-800';
    }
  };

  const formatTime = (datetime: string) => {
    return format(parseISO(datetime), 'HH:mm', { locale: id });
  };

  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title='Kalender Event'
        description='Kelola event dan jadwal kegiatan gereja'
        actionLabel='Buat Event'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
        onAction={handleCreateEvent}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className='bg-white p-6 rounded-xl shadow-sm border border-gray-200'>
          <div className='space-y-6'>
            {/* Calendar View Controls */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <button
                  onClick={() => setView('month')}
                  className={`px-4 py-2 rounded-md ${
                    view === 'month'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Bulan
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-4 py-2 rounded-md ${
                    view === 'week'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Minggu
                </button>
                <button
                  onClick={() => setView('day')}
                  className={`px-4 py-2 rounded-md ${
                    view === 'day'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Hari
                </button>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreateEvent}
                className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
              >
                <Plus className='h-4 w-4 mr-2' />
                Buat Event
              </motion.button>
            </div>

            {/* Calendar Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {events.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleEventClick(event.id)}
                  className='p-4 bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-500 hover:-translate-y-1 cursor-pointer'
                >
                  <div className='space-y-3'>
                    <div className='flex items-start justify-between'>
                      <h3 className='text-lg font-medium text-gray-900'>
                        {event.title}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEventTypeColor(
                          event.type
                        )}`}
                      >
                        {event.type === 'ibadah'
                          ? 'Ibadah'
                          : event.type === 'spiritual_journey'
                          ? 'Spiritual Journey'
                          : 'Event'}
                      </span>
                    </div>

                    <div className='space-y-2'>
                      <div className='flex items-center text-sm text-gray-500'>
                        <Calendar className='h-4 w-4 mr-2' />
                        {format(
                          parseISO(event.eventDate),
                          'EEEE, d MMMM yyyy',
                          {
                            locale: id,
                          }
                        )}
                      </div>
                      <div className='flex items-center text-sm text-gray-500'>
                        <Clock className='h-4 w-4 mr-2' />
                        {formatTime(event.startDatetime)} -{' '}
                        {formatTime(event.endDatetime)}
                      </div>
                      <div className='flex items-center text-sm text-gray-500'>
                        <MapPin className='h-4 w-4 mr-2' />
                        {event.eventLocation}
                      </div>
                      <div className='flex items-center text-sm text-gray-500'>
                        <Users className='h-4 w-4 mr-2' />
                        Kapasitas: {event.capacity} orang
                      </div>
                      {event.lagu && event.lagu.length > 0 && (
                        <div className='flex items-center text-sm text-gray-500'>
                          <Music className='h-4 w-4 mr-2' />
                          {event.lagu.length} lagu
                        </div>
                      )}
                    </div>

                    {event.recurrenceRule && (
                      <div className='mt-2 pt-2 border-t border-gray-100'>
                        <p className='text-xs text-gray-500'>
                          Event berulang:{' '}
                          {event.recurrenceRule.frequency === 'DAILY'
                            ? 'Setiap hari'
                            : event.recurrenceRule.frequency === 'WEEKLY'
                            ? 'Setiap minggu'
                            : event.recurrenceRule.frequency === 'MONTHLY'
                            ? 'Setiap bulan'
                            : 'Setiap tahun'}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
