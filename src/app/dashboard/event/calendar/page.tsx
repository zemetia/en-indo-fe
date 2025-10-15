'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Download, RefreshCw, Calendar, Grid3x3, Wifi, WifiOff, AlertCircle, Save } from 'lucide-react';
import { FiSave } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import DynamicEventCalendar from '@/components/events/DynamicEventCalendar';
import LightEventCalendar from '@/components/events/LightEventCalendar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/context/ToastContext';
import { useEventOccurrences } from '@/lib/hooks/useEventOccurrences';
import type { EventOccurrence } from '@/lib/api/events';
import {
  deleteOccurrence
} from '@/lib/api/events';
import {
  getPersonAvailability,
  upsertKetersediaan
} from '@/lib/api/availability';
import RecurrenceModal, { RecurrenceUpdateType } from '@/components/events/RecurrenceModal';
import { ErrorBoundary } from '@/components/ui/error-boundary';

function EventCalendarPageContent() {
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Kalender Acara - Dashboard Every Nation';
  }, []);

  const [filters, setFilters] = useState({
    type: 'all',
    visibility: 'all'
  });

  const [calendarView, setCalendarView] = useState<'light' | 'full'>('light');

  // State for current date range being viewed
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Calculate date range for current month
  const dateRange = useMemo(() => {
    const start = new Date(currentYear, currentMonth, 1);
    const end = new Date(currentYear, currentMonth + 1, 0);
    return { start, end };
  }, [currentMonth, currentYear]);

  // Fetch events using the hook (same as ketersediaan page)
  const { events: allEvents, loading, error, refetch } = useEventOccurrences({
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  // Availability state
  type AvailabilityStatus = 'available' | 'unavailable' | 'tentative' | 'unselected';
  const [availability, setAvailability] = useState<Record<string, AvailabilityStatus>>({});
  const [savingAvailability, setSavingAvailability] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Load user's availability when events change
  useEffect(() => {
    const loadAvailability = async () => {
      if (!allEvents || allEvents.length === 0) return;

      setLoadingAvailability(true);
      try {
        // TODO: Replace with actual user ID from auth context
        const userId = localStorage.getItem('userId') || 'temp-user-id';

        const result = await getPersonAvailability({
          personId: userId,
          startDate: dateRange.start.toISOString().split('T')[0],
          endDate: dateRange.end.toISOString().split('T')[0],
        });

        const availabilityMap: Record<string, AvailabilityStatus> = {};
        result.availabilities.forEach((a) => {
          const key = `${a.eventId}_${a.occurrenceDate}`;
          availabilityMap[key] = a.status as AvailabilityStatus;
        });
        setAvailability(availabilityMap);
      } catch (err) {
        console.error('Error loading availability:', err);
        // Don't show error toast for empty data
      } finally {
        setLoadingAvailability(false);
      }
    };

    loadAvailability();
  }, [dateRange, allEvents]);

  // Apply filters to loaded events
  const events = useMemo(() => {
    if (!allEvents) return [];

    let filteredOccurrences = allEvents;

    if (filters.type !== 'all') {
      filteredOccurrences = filteredOccurrences.filter(
        occ => occ.originalEvent.type === filters.type
      );
    }

    if (filters.visibility !== 'all') {
      const isPublic = filters.visibility === 'public';
      filteredOccurrences = filteredOccurrences.filter(
        occ => occ.originalEvent.isPublic === isPublic
      );
    }

    return filteredOccurrences;
  }, [allEvents, filters]);

  // Handle calendar date range changes
  const handleDateRangeChange = useCallback((start: Date, end: Date) => {
    // Update month/year when calendar navigation occurs
    setCurrentMonth(start.getMonth());
    setCurrentYear(start.getFullYear());
  }, []);

  // Handle event editing
  const handleEventEdit = useCallback(async (
    eventId: string, 
    occurrenceDate: string, 
    updateType: RecurrenceUpdateType
  ) => {
    try {
      // For now, just navigate to edit page with query params
      // In a full implementation, you'd open an edit modal or form
      router.push(`/dashboard/event/edit/${eventId}?occurrence=${occurrenceDate}&type=${updateType}`);
    } catch (err) {
      console.error('Error editing event:', err);
      showToast('Gagal mengedit event', 'error');
    }
  }, [router, showToast]);

  // Handle event deletion
  const handleEventDelete = useCallback(async (
    eventId: string,
    occurrenceDate: string,
    updateType: RecurrenceUpdateType
  ) => {
    try {
      const deleteType = updateType === 'future' ? 'future' : 'single';

      await deleteOccurrence(eventId, {
        occurrenceDate,
        deleteType
      });

      showToast(
        updateType === 'single'
          ? 'Event berhasil dihapus'
          : 'Event dan yang berikutnya berhasil dihapus',
        'success'
      );

      // Reload events
      refetch();

    } catch (err) {
      console.error('Error deleting event:', err);
      showToast('Gagal menghapus event', 'error');
    }
  }, [refetch, showToast]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // Toggle availability for an event
  const handleToggleAvailability = useCallback((event: EventOccurrence) => {
    const occurrenceDate = event.occurrenceDate.split('T')[0];
    const key = `${event.eventId}_${occurrenceDate}`;
    const currentStatus = availability[key];

    let newStatus: AvailabilityStatus;
    if (currentStatus === 'available') newStatus = 'tentative';
    else if (currentStatus === 'tentative') newStatus = 'unavailable';
    else if (currentStatus === 'unavailable') newStatus = 'unselected';
    else newStatus = 'available';

    setAvailability((prev) => ({ ...prev, [key]: newStatus }));
  }, [availability]);

  // Save availability
  const handleSaveAvailability = useCallback(async () => {
    setSavingAvailability(true);
    try {
      // TODO: Replace with actual user ID from auth context
      const userId = localStorage.getItem('userId') || 'temp-user-id';

      // Filter out unselected items and save
      const promises = Object.entries(availability)
        .filter(([_, status]) => status !== 'unselected')
        .map(async ([key, status]) => {
          const [eventId, occurrenceDate] = key.split('_');

          await upsertKetersediaan({
            personId: userId,
            eventId,
            occurrenceDate,
            status: status as 'available' | 'unavailable' | 'tentative',
          });
        });

      await Promise.all(promises);
      showToast('Ketersediaan berhasil disimpan!', 'success');
    } catch (err) {
      console.error('Error saving availability:', err);
      showToast('Gagal menyimpan ketersediaan', 'error');
    } finally {
      setSavingAvailability(false);
    }
  }, [availability, showToast]);

  // Get filter statistics
  const eventStats = {
    total: events.length,
    ibadah: events.filter(e => e.originalEvent.type === 'ibadah').length,
    events: events.filter(e => e.originalEvent.type === 'event').length,
    spiritual_journey: events.filter(e => e.originalEvent.type === 'spiritual_journey').length,
    recurring: events.filter(e => e.originalEvent.recurrenceRule).length,
    exceptions: events.filter(e => e.isException).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <FeaturedCard
        title="Kalender Event"
        description="Lihat semua event dan jadwal dalam tampilan kalender interaktif"
        actionLabel="Lihat Detail"
        gradientFrom="from-blue-500"
        gradientTo="to-blue-700"
      />

      {/* Controls and Filters */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              onClick={() => router.push('/dashboard/event/create')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Event
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={handleSaveAvailability}
              disabled={savingAvailability || loadingAvailability}
              className="bg-green-600 hover:bg-green-700"
            >
              <FiSave className="h-4 w-4 mr-2" />
              {savingAvailability ? 'Menyimpan...' : 'Simpan Ketersediaan'}
            </Button>

            {/* Connection Status Indicator */}
            <div className="flex items-center gap-2 text-sm">
              {!loading && !error && (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="h-4 w-4" />
                  <span>Terhubung</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-1 text-red-600">
                  <WifiOff className="h-4 w-4" />
                  <span>Terputus</span>
                </div>
              )}
            </div>
            
            <div className="flex rounded-lg border overflow-hidden">
              <Button
                variant={calendarView === 'light' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCalendarView('light')}
                className="rounded-none"
              >
                <Grid3x3 className="h-4 w-4 mr-2" />
                Ringan
              </Button>
              <Button
                variant={calendarView === 'full' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCalendarView('full')}
                className="rounded-none"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Lengkap
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="ibadah">Ibadah</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="spiritual_journey">Spiritual Journey</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Select value={filters.visibility} onValueChange={(value) => handleFilterChange('visibility', value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="public">Publik</SelectItem>
                <SelectItem value="private">Privat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Statistics */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Total:</span> {eventStats.total} event
          </div>
          <Badge variant="secondary">
            Ibadah: {eventStats.ibadah}
          </Badge>
          <Badge variant="secondary">
            Event: {eventStats.events}
          </Badge>
          <Badge variant="secondary">
            Spiritual: {eventStats.spiritual_journey}
          </Badge>
          {eventStats.recurring > 0 && (
            <Badge variant="outline">
              Berulang: {eventStats.recurring}
            </Badge>
          )}
          {eventStats.exceptions > 0 && (
            <Badge variant="outline">
              Pengecualian: {eventStats.exceptions}
            </Badge>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border p-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 text-red-600" />
            <div className="flex-1">
              <div className="font-semibold mb-2 text-red-800">
                Gagal Memuat Kalender
              </div>
              <div className="text-sm mb-4 text-red-700">
                {error.message || 'Terjadi kesalahan saat memuat event. Pastikan server backend berjalan.'}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="border-red-300 text-red-700 hover:bg-red-100"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Coba Lagi
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Component */}
      {!error && (
        <>
          {calendarView === 'light' ? (
            <LightEventCalendar
              events={events}
              onEventEdit={handleEventEdit}
              onEventDelete={handleEventDelete}
              onDateRangeChange={handleDateRangeChange}
              availability={availability}
              onToggleAvailability={handleToggleAvailability}
            />
          ) : (
            <DynamicEventCalendar
              events={events}
              onEventEdit={handleEventEdit}
              onEventDelete={handleEventDelete}
              onDateRangeChange={handleDateRangeChange}
              availability={availability}
              onToggleAvailability={handleToggleAvailability}
            />
          )}
        </>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center gap-3">
            <RefreshCw className="h-5 w-5 animate-spin text-blue-600" />
            <span>Memuat event...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EventCalendarPage() {
  return (
    <ErrorBoundary>
      <EventCalendarPageContent />
    </ErrorBoundary>
  );
}