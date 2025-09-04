'use client';

import { useState, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, View, Event as CalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPin, Clock, Users, Repeat, Edit, Trash2, Eye } from 'lucide-react';
import RecurrenceModal, { RecurrenceUpdateType } from './RecurrenceModal';
import { useToast } from '@/context/ToastContext';

// Configure moment localizer for Bahasa Indonesia
moment.locale('id');
const localizer = momentLocalizer(moment);

// Event interfaces matching our backend DTOs
interface EventOccurrence {
  eventId: string;
  occurrenceDate: string;
  startDatetime: string;
  endDatetime: string;
  isException: boolean;
  isSkipped: boolean;
  exceptionNotes?: string;
  originalEvent: {
    id: string;
    title: string;
    description: string;
    type: 'event' | 'ibadah' | 'spiritual_journey';
    eventLocation: string;
    capacity: number;
    isPublic: boolean;
    recurrenceRule?: {
      frequency: string;
      interval: number;
      byWeekday: string[];
    };
  };
}

interface CalendarEventExtended extends CalendarEvent {
  id: string;
  eventId: string;
  type: 'event' | 'ibadah' | 'spiritual_journey';
  location: string;
  capacity: number;
  isPublic: boolean;
  isRecurring: boolean;
  isException: boolean;
  description: string;
  occurrenceDate: string;
}

interface EventCalendarProps {
  events: EventOccurrence[];
  onEventClick?: (event: CalendarEventExtended) => void;
  onEventEdit?: (eventId: string, occurrenceDate: string, updateType: RecurrenceUpdateType) => void;
  onEventDelete?: (eventId: string, occurrenceDate: string, updateType: RecurrenceUpdateType) => void;
  onDateRangeChange?: (start: Date, end: Date) => void;
}

export default function EventCalendar({ 
  events, 
  onEventClick, 
  onEventEdit, 
  onEventDelete,
  onDateRangeChange 
}: EventCalendarProps) {
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventExtended | null>(null);
  const [recurrenceModal, setRecurrenceModal] = useState<{
    isOpen: boolean;
    action: 'edit' | 'delete';
    event: CalendarEventExtended | null;
  }>({
    isOpen: false,
    action: 'edit',
    event: null
  });
  const { showToast } = useToast();

  // Convert event occurrences to calendar events
  const calendarEvents = useMemo(() => {
    return events.map((occurrence): CalendarEventExtended => {
      const start = new Date(occurrence.startDatetime);
      const end = new Date(occurrence.endDatetime);
      
      return {
        id: `${occurrence.eventId}-${occurrence.occurrenceDate}`,
        eventId: occurrence.eventId,
        title: occurrence.originalEvent.title,
        start,
        end,
        type: occurrence.originalEvent.type,
        location: occurrence.originalEvent.eventLocation,
        capacity: occurrence.originalEvent.capacity,
        isPublic: occurrence.originalEvent.isPublic,
        isRecurring: !!occurrence.originalEvent.recurrenceRule,
        isException: occurrence.isException,
        description: occurrence.originalEvent.description,
        occurrenceDate: occurrence.occurrenceDate,
        resource: occurrence // Store full occurrence data
      };
    });
  }, [events]);

  // Handle date range changes for fetching events
  const handleNavigate = useCallback((newDate: Date, view: View) => {
    setDate(newDate);
    
    if (onDateRangeChange) {
      let start: Date, end: Date;
      
      switch (view) {
        case 'month':
          start = moment(newDate).startOf('month').startOf('week').toDate();
          end = moment(newDate).endOf('month').endOf('week').toDate();
          break;
        case 'week':
          start = moment(newDate).startOf('week').toDate();
          end = moment(newDate).endOf('week').toDate();
          break;
        case 'day':
          start = moment(newDate).startOf('day').toDate();
          end = moment(newDate).endOf('day').toDate();
          break;
        default:
          start = moment(newDate).startOf('month').toDate();
          end = moment(newDate).endOf('month').toDate();
      }
      
      onDateRangeChange(start, end);
    }
  }, [onDateRangeChange]);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
    handleNavigate(date, newView);
  }, [date, handleNavigate]);

  const handleSelectEvent = useCallback((event: CalendarEventExtended) => {
    setSelectedEvent(event);
    if (onEventClick) {
      onEventClick(event);
    }
  }, [onEventClick]);

  const handleEditEvent = (event: CalendarEventExtended) => {
    if (event.isRecurring) {
      setRecurrenceModal({
        isOpen: true,
        action: 'edit',
        event
      });
    } else {
      onEventEdit?.(event.eventId, event.occurrenceDate, 'this');
    }
  };

  const handleDeleteEvent = (event: CalendarEventExtended) => {
    if (event.isRecurring) {
      setRecurrenceModal({
        isOpen: true,
        action: 'delete',
        event
      });
    } else {
      onEventDelete?.(event.eventId, event.occurrenceDate, 'this');
    }
  };

  const handleRecurrenceConfirm = (updateType: RecurrenceUpdateType) => {
    if (!recurrenceModal.event) return;
    
    const { event } = recurrenceModal;
    
    if (recurrenceModal.action === 'edit') {
      onEventEdit?.(event.eventId, event.occurrenceDate, updateType);
    } else {
      onEventDelete?.(event.eventId, event.occurrenceDate, updateType);
    }
    
    setRecurrenceModal({ isOpen: false, action: 'edit', event: null });
  };

  // Custom event component
  const EventComponent = ({ event }: { event: CalendarEventExtended }) => {
    const getTypeColor = (type: string) => {
      switch (type) {
        case 'ibadah':
          return 'bg-blue-500 border-blue-600';
        case 'spiritual_journey':
          return 'bg-purple-500 border-purple-600';
        default:
          return 'bg-green-500 border-green-600';
      }
    };

    const getTypeLabel = (type: string) => {
      switch (type) {
        case 'ibadah':
          return 'Ibadah';
        case 'spiritual_journey':
          return 'Spiritual Journey';
        default:
          return 'Event';
      }
    };

    return (
      <div className={`text-white p-1 rounded text-xs ${getTypeColor(event.type)} ${event.isException ? 'border-2 border-dashed' : ''}`}>
        <div className="flex items-center gap-1 mb-1">
          {event.isRecurring && <Repeat className="h-3 w-3" />}
          {event.isException && <span className="text-yellow-200">*</span>}
          <span className="font-medium truncate">{event.title}</span>
        </div>
        <div className="flex items-center gap-1 text-xs opacity-90">
          <MapPin className="h-2 w-2" />
          <span className="truncate">{event.location}</span>
        </div>
      </div>
    );
  };

  // Custom toolbar
  const CustomToolbar = ({ date, view, onNavigate, onView }: any) => {
    const goToBack = () => onNavigate('PREV');
    const goToNext = () => onNavigate('NEXT');
    const goToCurrent = () => onNavigate('TODAY');
    
    const viewLabels: Record<View, string> = {
      month: 'Bulan',
      week: 'Minggu',
      day: 'Hari',
      work_week: 'Minggu Kerja',
      agenda: 'Agenda'
    };

    return (
      <div className="flex items-center justify-between mb-4 p-4 bg-white rounded-lg border">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToBack}>
            ←
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrent}>
            Hari Ini
          </Button>
          <Button variant="outline" size="sm" onClick={goToNext}>
            →
          </Button>
        </div>
        
        <h2 className="text-lg font-semibold">
          {moment(date).format('MMMM YYYY')}
        </h2>
        
        <div className="flex gap-1">
          {(['month', 'week', 'day'] as View[]).map((v) => (
            <Button
              key={v}
              variant={view === v ? 'default' : 'outline'}
              size="sm"
              onClick={() => onView(v)}
            >
              {viewLabels[v]}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="h-[600px] bg-white rounded-lg border">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          date={date}
          onNavigate={handleNavigate}
          onView={handleViewChange}
          onSelectEvent={handleSelectEvent}
          components={{
            toolbar: CustomToolbar,
            event: EventComponent
          }}
          eventPropGetter={(event: CalendarEventExtended) => ({
            className: event.isException ? 'exception-event' : '',
            style: {
              backgroundColor: 'transparent',
              border: 'none'
            }
          })}
          messages={{
            allDay: 'Sepanjang Hari',
            previous: 'Sebelumnya',
            next: 'Selanjutnya',
            today: 'Hari Ini',
            month: 'Bulan',
            week: 'Minggu',
            day: 'Hari',
            agenda: 'Agenda',
            date: 'Tanggal',
            time: 'Waktu',
            event: 'Event',
            noEventsInRange: 'Tidak ada event pada periode ini. Klik tombol "Buat Event" untuk menambahkan event baru.',
            showMore: (total) => `+${total} lainnya`
          }}
          formats={{
            monthHeaderFormat: 'MMMM YYYY',
            dayHeaderFormat: 'dddd, DD MMMM',
            dayRangeHeaderFormat: ({ start, end }) => 
              `${moment(start).format('DD MMM')} - ${moment(end).format('DD MMM YYYY')}`,
            timeGutterFormat: 'HH:mm'
          }}
        />
      </div>

      {/* Event Detail Sidebar */}
      {selectedEvent && (
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {selectedEvent.title}
                  {selectedEvent.isRecurring && (
                    <Badge variant="secondary" className="ml-2">
                      <Repeat className="h-3 w-3 mr-1" />
                      Berulang
                    </Badge>
                  )}
                  {selectedEvent.isException && (
                    <Badge variant="outline" className="ml-1">
                      Pengecualian
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {moment(selectedEvent.start).format('HH:mm')} - {moment(selectedEvent.end).format('HH:mm')}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedEvent.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedEvent.capacity === 99999 ? 'Tidak terbatas' : `${selectedEvent.capacity} orang`}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditEvent(selectedEvent)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(selectedEvent)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Deskripsi</h4>
                <p className="text-sm text-gray-600">{selectedEvent.description || 'Tidak ada deskripsi'}</p>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedEvent.type === 'ibadah' ? 'bg-blue-100 text-blue-700' :
                  selectedEvent.type === 'spiritual_journey' ? 'bg-purple-100 text-purple-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedEvent.type === 'ibadah' ? 'Ibadah' :
                   selectedEvent.type === 'spiritual_journey' ? 'Spiritual Journey' :
                   'Event'}
                </span>
                
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedEvent.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedEvent.isPublic ? 'Publik' : 'Privat'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recurrence Modal */}
      <RecurrenceModal
        isOpen={recurrenceModal.isOpen}
        onClose={() => setRecurrenceModal({ isOpen: false, action: 'edit', event: null })}
        onConfirm={handleRecurrenceConfirm}
        eventTitle={recurrenceModal.event?.title || ''}
        occurrenceDate={recurrenceModal.event?.occurrenceDate}
        action={recurrenceModal.action}
      />
    </div>
  );
}