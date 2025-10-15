'use client';

import { useState, useCallback, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  Repeat,
  Edit,
  Trash2,
  Plus,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RecurrenceModal, { RecurrenceUpdateType } from './RecurrenceModal';
import { useToast } from '@/context/ToastContext';

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

type AvailabilityStatus = 'available' | 'unavailable' | 'tentative' | 'unselected';

interface LightEventCalendarProps {
  events: EventOccurrence[];
  onEventClick?: (event: EventOccurrence) => void;
  onEventEdit?: (eventId: string, occurrenceDate: string, updateType: RecurrenceUpdateType) => void;
  onEventDelete?: (eventId: string, occurrenceDate: string, updateType: RecurrenceUpdateType) => void;
  onDateRangeChange?: (start: Date, end: Date) => void;
  availability?: Record<string, AvailabilityStatus>;
  onToggleAvailability?: (event: EventOccurrence) => void;
}

export default function LightEventCalendar({
  events,
  onEventClick,
  onEventEdit,
  onEventDelete,
  onDateRangeChange,
  availability = {},
  onToggleAvailability
}: LightEventCalendarProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventOccurrence | null>(null);
  const [recurrenceModal, setRecurrenceModal] = useState<{
    isOpen: boolean;
    action: 'edit' | 'delete';
    event: EventOccurrence | null;
  }>({
    isOpen: false,
    action: 'edit',
    event: null
  });
  const { showToast } = useToast();

  // Generate calendar dates for the current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, EventOccurrence[]> = {};
    
    events.forEach(event => {
      const dateKey = format(parseISO(event.occurrenceDate), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    return grouped;
  }, [events]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    if (onDateRangeChange) {
      // Fetch from start of week to end of week to match calendar display
      const monthStart = startOfMonth(newDate);
      const monthEnd = endOfMonth(newDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
      onDateRangeChange(calendarStart, calendarEnd);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    if (onDateRangeChange) {
      // Fetch from start of week to end of week to match calendar display
      const monthStart = startOfMonth(newDate);
      const monthEnd = endOfMonth(newDate);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
      onDateRangeChange(calendarStart, calendarEnd);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    if (onDateRangeChange) {
      // Fetch from start of week to end of week to match calendar display
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
      const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
      onDateRangeChange(calendarStart, calendarEnd);
    }
  };

  const handleEventEdit = (event: EventOccurrence) => {
    if (event.originalEvent.recurrenceRule) {
      setRecurrenceModal({
        isOpen: true,
        action: 'edit',
        event
      });
    } else {
      onEventEdit?.(event.eventId, event.occurrenceDate, 'single');
    }
  };

  const handleEventDelete = (event: EventOccurrence) => {
    if (event.originalEvent.recurrenceRule) {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ibadah':
        return 'bg-blue-500 text-white';
      case 'spiritual_journey':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  const weekDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleToday}>
              Hari Ini
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <h2 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy', { locale: id })}
          </h2>
          
          <div className="text-sm text-gray-600">
            {events.length} event
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Week Headers */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, dayIdx) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayEvents = eventsByDate[dateKey] || [];
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={dayIdx}
                  className={`
                    min-h-[100px] p-2 border rounded-lg 
                    ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'} 
                    ${isToday ? 'ring-2 ring-blue-500' : ''}
                    hover:bg-gray-50 transition-colors
                  `}
                >
                  <div className={`
                    text-sm font-medium mb-1
                    ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                    ${isToday ? 'text-blue-600 font-bold' : ''}
                  `}>
                    {format(day, 'd')}
                  </div>
                  
                  {/* Events for this day */}
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, idx) => {
                      const occurrenceDate = event.occurrenceDate.split('T')[0];
                      const key = `${event.eventId}_${occurrenceDate}`;
                      const status = availability[key] || 'unselected';

                      const statusColors = {
                        available: 'bg-green-500',
                        tentative: 'bg-yellow-500',
                        unavailable: 'bg-red-500',
                        unselected: ''
                      };

                      return (
                        <div
                          key={`${event.eventId}-${idx}`}
                          className={`
                            text-xs px-2 py-1 rounded cursor-pointer
                            ${getTypeColor(event.originalEvent.type)}
                            hover:opacity-80 transition-opacity
                          `}
                          onClick={(e) => {
                            // Check if Ctrl/Cmd key is pressed for availability toggle
                            if (e.ctrlKey || e.metaKey) {
                              onToggleAvailability?.(event);
                            } else {
                              setSelectedEvent(event);
                              onEventClick?.(event);
                            }
                          }}
                        >
                          <div className="flex items-center gap-1 truncate">
                            {status !== 'unselected' && (
                              <div className={`w-2 h-2 rounded-full ${statusColors[status]} flex-shrink-0`}></div>
                            )}
                            {event.originalEvent.recurrenceRule && (
                              <Repeat className="h-2 w-2 flex-shrink-0" />
                            )}
                            {event.isException && (
                              <span className="text-yellow-200">*</span>
                            )}
                            <span className="truncate">{event.originalEvent.title}</span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 3} lainnya
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Event Detail Sidebar */}
      {selectedEvent && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {selectedEvent.originalEvent.title}
                  {selectedEvent.originalEvent.recurrenceRule && (
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
                    {format(parseISO(selectedEvent.startDatetime), 'HH:mm')} - {format(parseISO(selectedEvent.endDatetime), 'HH:mm')}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedEvent.originalEvent.eventLocation}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {selectedEvent.originalEvent.capacity === 99999 ? 'Tidak terbatas' : `${selectedEvent.originalEvent.capacity} orang`}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => router.push(`/dashboard/event/${selectedEvent.eventId}`)}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Detail
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEventEdit(selectedEvent)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEventDelete(selectedEvent)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Hapus
                </Button>
                {onToggleAvailability && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleAvailability(selectedEvent)}
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
                <p className="text-sm text-gray-600">{selectedEvent.originalEvent.description || 'Tidak ada deskripsi'}</p>
              </div>

              <div className="flex items-center gap-4 text-sm flex-wrap">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedEvent.originalEvent.type === 'ibadah' ? 'bg-blue-100 text-blue-700' :
                  selectedEvent.originalEvent.type === 'spiritual_journey' ? 'bg-purple-100 text-purple-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedEvent.originalEvent.type === 'ibadah' ? 'Ibadah' :
                   selectedEvent.originalEvent.type === 'spiritual_journey' ? 'Spiritual Journey' :
                   'Event'}
                </span>

                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  selectedEvent.originalEvent.isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {selectedEvent.originalEvent.isPublic ? 'Publik' : 'Privat'}
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

              {selectedEvent.exceptionNotes && (
                <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
                  <strong>Catatan:</strong> {selectedEvent.exceptionNotes}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recurrence Modal */}
      <RecurrenceModal
        isOpen={recurrenceModal.isOpen}
        onClose={() => setRecurrenceModal({ isOpen: false, action: 'edit', event: null })}
        onConfirm={handleRecurrenceConfirm}
        eventTitle={recurrenceModal.event?.originalEvent.title || ''}
        occurrenceDate={recurrenceModal.event?.occurrenceDate}
        action={recurrenceModal.action}
      />
    </div>
  );
}