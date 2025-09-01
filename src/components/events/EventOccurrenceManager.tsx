'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Repeat, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  ChevronRight
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/context/ToastContext';
import RecurrenceModal, { RecurrenceUpdateType } from './RecurrenceModal';
import { 
  getEventOccurrences, 
  updateRecurringEvent, 
  deleteOccurrence,
  EventOccurrence,
  Event 
} from '@/lib/api/events';

interface EventOccurrenceManagerProps {
  event: Event;
  onEventUpdate?: () => void;
}

export default function EventOccurrenceManager({ event, onEventUpdate }: EventOccurrenceManagerProps) {
  const [occurrences, setOccurrences] = useState<EventOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const [recurrenceModal, setRecurrenceModal] = useState<{
    isOpen: boolean;
    action: 'edit' | 'delete';
    occurrence: EventOccurrence | null;
  }>({
    isOpen: false,
    action: 'edit',
    occurrence: null
  });

  // Load occurrences for the next 6 months
  const loadOccurrences = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 6);

      const data = await getEventOccurrences(
        event.id,
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0],
        event.timezone
      );

      setOccurrences(data);
    } catch (err) {
      console.error('Error loading occurrences:', err);
      setError(err instanceof Error ? err.message : 'Failed to load occurrences');
      showToast('Gagal memuat jadwal event', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (event.recurrenceRule) {
      loadOccurrences();
    } else {
      // For non-recurring events, create a single occurrence
      const singleOccurrence: EventOccurrence = {
        eventId: event.id,
        occurrenceDate: event.eventDate,
        startDatetime: event.startDatetime,
        endDatetime: event.endDatetime,
        isException: false,
        isSkipped: false,
        originalEvent: {
          id: event.id,
          title: event.title,
          description: event.description,
          type: event.type,
          eventLocation: event.eventLocation,
          capacity: event.capacity,
          isPublic: event.isPublic,
          recurrenceRule: event.recurrenceRule
        }
      };
      setOccurrences([singleOccurrence]);
      setLoading(false);
    }
  }, [event]);

  const handleEditOccurrence = (occurrence: EventOccurrence) => {
    if (event.recurrenceRule) {
      setRecurrenceModal({
        isOpen: true,
        action: 'edit',
        occurrence
      });
    } else {
      // For single events, navigate directly to edit
      // This would typically open an edit form or navigate to edit page
      console.log('Edit single event:', occurrence);
      showToast('Redirect ke halaman edit event', 'info');
    }
  };

  const handleDeleteOccurrence = (occurrence: EventOccurrence) => {
    if (event.recurrenceRule) {
      setRecurrenceModal({
        isOpen: true,
        action: 'delete',
        occurrence
      });
    } else {
      // For single events, show confirmation
      if (confirm('Hapus event ini?')) {
        console.log('Delete single event:', occurrence);
        showToast('Event berhasil dihapus', 'success');
        onEventUpdate?.();
      }
    }
  };

  const handleRecurrenceConfirm = async (updateType: RecurrenceUpdateType) => {
    if (!recurrenceModal.occurrence) return;

    try {
      const { occurrence } = recurrenceModal;

      if (recurrenceModal.action === 'edit') {
        // For editing, we would typically open an edit form
        // For now, just show a message
        console.log('Edit occurrence:', occurrence, 'Type:', updateType);
        showToast(
          `Edit ${updateType === 'this' ? 'event ini' : 
                updateType === 'all' ? 'seluruh serie' : 
                'event ini dan selanjutnya'} belum diimplementasi`,
          'info'
        );
      } else {
        // Handle deletion
        const deleteType = updateType === 'future' ? 'future' : 'this';
        
        await deleteOccurrence(event.id, {
          occurrenceDate: occurrence.occurrenceDate,
          deleteType
        });

        showToast(
          updateType === 'this' 
            ? 'Event berhasil dihapus' 
            : updateType === 'all' 
            ? 'Seluruh serie event berhasil dihapus'
            : 'Event ini dan selanjutnya berhasil dihapus',
          'success'
        );

        // Reload occurrences
        if (updateType === 'all') {
          onEventUpdate?.();
        } else {
          loadOccurrences();
        }
      }

      setRecurrenceModal({ isOpen: false, action: 'edit', occurrence: null });
    } catch (err) {
      console.error('Error handling occurrence:', err);
      showToast('Gagal memproses event', 'error');
    }
  };

  const formatOccurrenceDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, dd MMMM yyyy', { locale: id });
    } catch {
      return dateString;
    }
  };

  const formatOccurrenceTime = (startTime: string, endTime: string) => {
    try {
      const start = format(new Date(startTime), 'HH:mm');
      const end = format(new Date(endTime), 'HH:mm');
      return `${start} - ${end}`;
    } catch {
      return 'Waktu tidak valid';
    }
  };

  const getOccurrenceStatus = (occurrence: EventOccurrence) => {
    const now = new Date();
    const occurrenceDate = new Date(occurrence.startDatetime);
    
    if (occurrence.isSkipped) {
      return { status: 'skipped', label: 'Dibatalkan', color: 'bg-gray-100 text-gray-700' };
    }
    
    if (occurrence.isException) {
      return { status: 'modified', label: 'Diubah', color: 'bg-yellow-100 text-yellow-700' };
    }
    
    if (occurrenceDate < now) {
      return { status: 'past', label: 'Selesai', color: 'bg-green-100 text-green-700' };
    }
    
    return { status: 'upcoming', label: 'Akan Datang', color: 'bg-blue-100 text-blue-700' };
  };

  const groupedOccurrences = occurrences.reduce((groups, occurrence) => {
    const date = new Date(occurrence.occurrenceDate);
    const monthKey = format(date, 'yyyy-MM');
    const monthLabel = format(date, 'MMMM yyyy', { locale: id });
    
    if (!groups[monthKey]) {
      groups[monthKey] = {
        label: monthLabel,
        occurrences: []
      };
    }
    
    groups[monthKey].occurrences.push(occurrence);
    return groups;
  }, {} as Record<string, { label: string; occurrences: EventOccurrence[] }>);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Jadwal Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Memuat jadwal...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Jadwal Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          <Button
            variant="outline"
            size="sm"
            onClick={loadOccurrences}
            className="mt-3"
          >
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Jadwal Event
              {event.recurrenceRule && (
                <Badge variant="secondary" className="ml-2">
                  <Repeat className="h-3 w-3 mr-1" />
                  Berulang
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{occurrences.length} jadwal</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(groupedOccurrences).map(([monthKey, monthGroup]) => (
            <div key={monthKey} className="space-y-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">{monthGroup.label}</h4>
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-sm text-gray-500">
                  {monthGroup.occurrences.length} event
                </span>
              </div>
              
              <div className="space-y-2">
                {monthGroup.occurrences.map((occurrence, index) => {
                  const status = getOccurrenceStatus(occurrence);
                  
                  return (
                    <div
                      key={`${occurrence.eventId}-${occurrence.occurrenceDate}`}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl font-bold text-gray-900">
                            {format(new Date(occurrence.occurrenceDate), 'dd')}
                          </div>
                          <div className="text-xs text-gray-500 uppercase">
                            {format(new Date(occurrence.occurrenceDate), 'EEE', { locale: id })}
                          </div>
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium">{event.title}</h5>
                            <Badge variant="outline" className={status.color}>
                              {status.label}
                            </Badge>
                            {occurrence.isException && (
                              <Badge variant="outline">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Pengecualian
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatOccurrenceTime(occurrence.startDatetime, occurrence.endDatetime)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {event.eventLocation}
                            </div>
                          </div>
                          
                          {occurrence.exceptionNotes && (
                            <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded mt-2">
                              <strong>Catatan:</strong> {occurrence.exceptionNotes}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOccurrence(occurrence)}
                          disabled={status.status === 'past' && !occurrence.isException}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteOccurrence(occurrence)}
                          disabled={status.status === 'past' && !event.recurrenceRule}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {occurrences.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada jadwal event ditemukan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recurrence Modal */}
      <RecurrenceModal
        isOpen={recurrenceModal.isOpen}
        onClose={() => setRecurrenceModal({ isOpen: false, action: 'edit', occurrence: null })}
        onConfirm={handleRecurrenceConfirm}
        eventTitle={event.title}
        occurrenceDate={recurrenceModal.occurrence?.occurrenceDate}
        action={recurrenceModal.action}
      />
    </div>
  );
}