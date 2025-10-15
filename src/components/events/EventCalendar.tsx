'use client';

import { useState, useCallback, useMemo, useRef } from 'react';
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
  title: string;
  start: Date;
  end: Date;
  type: 'event' | 'ibadah' | 'spiritual_journey';
  location: string;
  capacity: number;
  isPublic: boolean;
  isRecurring: boolean;
  isException: boolean;
  description: string;
  occurrenceDate: string;
}

type AvailabilityStatus = 'available' | 'unavailable' | 'tentative' | 'unselected';

interface EventCalendarProps {
  events: EventOccurrence[];
  onEventClick?: (event: CalendarEventExtended) => void;
  onEventEdit?: (eventId: string, occurrenceDate: string, updateType: RecurrenceUpdateType) => void;
  onEventDelete?: (eventId: string, occurrenceDate: string, updateType: RecurrenceUpdateType) => void;
  onDateRangeChange?: (start: Date, end: Date) => void;
  availability?: Record<string, AvailabilityStatus>;
  onToggleAvailability?: (event: EventOccurrence) => void;
}

export default function EventCalendar({
  events,
  onEventClick,
  onEventEdit,
  onEventDelete,
  onDateRangeChange,
  availability = {},
  onToggleAvailability
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

  // Track last date range to prevent duplicate API calls
  const lastDateRange = useRef<{ start: string; end: string } | null>(null);

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

      // Check if date range has changed to prevent duplicate API calls
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      const currentRange = `${startStr}_${endStr}`;
      const lastRange = lastDateRange.current ? `${lastDateRange.current.start}_${lastDateRange.current.end}` : null;

      if (currentRange !== lastRange) {
        lastDateRange.current = { start: startStr, end: endStr };
        onDateRangeChange(start, end);
      }
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
      onEventEdit?.(event.eventId, event.occurrenceDate, 'single');
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
      onEventDelete?.(event.eventId, event.occurrenceDate, 'single');
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

    // Get availability status
    const occurrenceDate = event.occurrenceDate.split('T')[0];
    const key = `${event.eventId}_${occurrenceDate}`;
    const status = availability[key] || 'unselected';

    const statusColors = {
      available: 'bg-green-300',
      tentative: 'bg-yellow-300',
      unavailable: 'bg-red-300',
      unselected: ''
    };

    return (
      <div className={`text-white p-1 rounded text-xs ${getTypeColor(event.type)} ${event.isException ? 'border-2 border-dashed' : ''}`}>
        <div className="flex items-center gap-1 mb-1">
          {status !== 'unselected' && (
            <div className={`w-2 h-2 rounded-full ${statusColors[status]} flex-shrink-0`}></div>
          )}
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
            showMore: (total: number) => `+${total} lainnya`
          }}
          formats={{
            monthHeaderFormat: 'MMMM YYYY',
            dayHeaderFormat: 'dddd, DD MMMM',
            dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) => 
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
                {onToggleAvailability && selectedEvent.resource && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleAvailability(selectedEvent.resource)}
                    className="ml-2"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    Toggle Ketersediaan
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium mb-1">Deskripsi</h4>
                <p className="text-sm text-gray-600">{selectedEvent.description || 'Tidak ada deskripsi'}</p>
              </div>
              
              <div className="flex items-center gap-4 text-sm flex-wrap">
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

                {/* Availability Status Badge */}
                {(() => {
                  const occurrenceDate = selectedEvent.occurrenceDate.split('T')[0];
                  const key = `${selectedEvent.eventId}_${occurrenceDate}`;
                  const status = availability[key] || 'unselected';

                  const statusBadges = {
                    available: { bg: 'bg-green-100', text: 'text-green-700', label: 'Bisa Hadir' },
                    tentative: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Mungkin' },
                    unavailable: { bg: 'bg-red-100', text: 'text-red-700', label: 'Tidak Bisa' },
                    unselected: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Belum Diisi' }
                  };

                  const badge = statusBadges[status];

                  return (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                      Ketersediaan: {badge.label}
                    </span>
                  );
                })()}
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