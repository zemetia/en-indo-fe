'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Plus, Clock, MapPin, Users, Music, Repeat, User, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { listEvents, Event as APIEvent, EventListResponse } from '@/lib/api/events';

// Use the API types but create local aliases for backward compatibility
type Event = APIEvent;

interface PIC {
  id: string;
  name: string;
  imageUrl: string;
}

export default function EventPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isClient, setIsClient] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Manajemen Acara - Dashboard Every Nation';
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await listEvents({ 
          page: 1, 
          limit: 20,
          // You can add more filters as needed
        });
        
        setEvents(response.events);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
        setError(errorMessage);
        showToast('Gagal memuat daftar event. Silakan coba lagi.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [showToast]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await listEvents({ 
        page: 1, 
        limit: 20,
      });
      
      setEvents(response.events);
      showToast('Daftar event berhasil dimuat ulang.', 'success');
    } catch (err) {
      console.error('Failed to refresh events:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh events';
      setError(errorMessage);
      showToast('Gagal memuat ulang daftar event.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    router.push('/dashboard/event/create');
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
    const { frequency, interval = 1, byWeekday, until, count } = rule;
    
    switch (frequency) {
      case 'DAILY':
        text = interval === 1 ? 'Setiap hari' : `Setiap ${interval} hari`;
        break;
      case 'WEEKLY':
        if (byWeekday && byWeekday.length > 0) {
          const dayNames = byWeekday.map(d => {
            const dayMap: { [key: string]: string } = {
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
        text = interval === 1 ? 'Setiap bulan' : `Setiap ${interval} bulan`;
        break;
      case 'YEARLY':
        text = interval === 1 ? 'Setiap tahun' : `Setiap ${interval} tahun`;
        break;
    }
    
    if (until) {
      text += ` hingga ${format(parseISO(until), 'd MMM yyyy', { locale: id })}`;
    } else if (count) {
      text += ` (${count} kali)`;
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
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={handleCreateEvent}>
                <Plus className='h-4 w-4 mr-2' />Buat Event
              </Button>
            </div>
          </div>

          {/* Error state */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">Gagal memuat event</p>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
                Coba Lagi
              </Button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-64"></div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada event</h3>
              <p className="text-gray-500 mb-4">Buat event pertama untuk memulai mengelola acara gereja.</p>
              <Button onClick={handleCreateEvent}>
                <Plus className='h-4 w-4 mr-2' />Buat Event Baru
              </Button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {events.map((event) => (
              <Link key={event.id} href={`/dashboard/event/${event.id}`} passHref>
                <motion.div whileHover={{ scale: 1.02 }} className='bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-500 cursor-pointer flex flex-col overflow-hidden h-full'>
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
                      <div className='flex items-center'>
                        <Calendar className='h-4 w-4 mr-2 text-gray-400' />
                        {format(parseISO(event.eventDate), 'EEEE, d MMMM yyyy', { locale: id })}
                      </div>
                      <div className='flex items-center'>
                        <Clock className='h-4 w-4 mr-2 text-gray-400' />
                        {isClient ? (
                          <>{formatTime(event.startDatetime)} - {formatTime(event.endDatetime)}</>
                        ) : (
                          <span className="w-20 h-4 bg-gray-200 rounded animate-pulse inline-block" />
                        )}
                      </div>
                      <div className='flex items-center'>
                        <MapPin className='h-4 w-4 mr-2 text-gray-400' />
                        {event.eventLocation}
                      </div>
                    </div>

                    {event.recurrenceRule && (
                      <div className="flex items-center text-xs text-emerald-600 font-medium bg-emerald-50 rounded-md p-2 mb-4">
                        <Repeat className='h-4 w-4 mr-1.5'/>
                        <span>{formatRecurrence(event.recurrenceRule)}</span>
                      </div>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center -space-x-2">
                        {/* Display Event PICs from API if available */}
                        {event.eventPics?.slice(0, 3).map(pic => (
                          <div key={pic.id} className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center border-2 border-white">
                            <User className="h-3 w-3 text-blue-600" />
                          </div>
                        ))}
                        {event.eventPics && event.eventPics.length > 0 && (
                          <span className="text-xs text-gray-500 pl-3">({event.eventPics.length} PIC)</span>
                        )}
                      </div>
                      <div className='flex items-center text-sm text-gray-500'>
                        <Users className='h-4 w-4 mr-2' />
                        {event.expectedParticipants > 0 ? (
                          <span title={`Expected: ${event.expectedParticipants} | Capacity: ${event.capacity}`}>
                            {event.expectedParticipants}/{event.capacity}
                          </span>
                        ) : (
                          `${event.capacity} capacity`
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}