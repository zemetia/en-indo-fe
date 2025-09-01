'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Filter, Download, RefreshCw, Calendar, Grid3x3, Wifi, WifiOff, AlertCircle } from 'lucide-react';

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
import { 
  getOccurrencesInRange, 
  updateRecurringEvent, 
  deleteOccurrence,
  EventOccurrence,
  healthCheck,
  APIError
} from '@/lib/api/events';
import RecurrenceModal, { RecurrenceUpdateType } from '@/components/events/RecurrenceModal';
import { ErrorBoundary } from '@/components/ui/error-boundary';

function EventCalendarPageContent() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [allEvents, setAllEvents] = useState<EventOccurrence[]>([]);  // Raw events from API
  const [events, setEvents] = useState<EventOccurrence[]>([]);       // Filtered events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; isNetworkError: boolean } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'disconnected'>('unknown');
  const [filters, setFilters] = useState({
    type: 'all',
    visibility: 'all'
  });
  
  const [calendarView, setCalendarView] = useState<'light' | 'full'>('light');
  
  // State for current date range being viewed
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date()
  });

  // Check backend connection status
  const checkConnection = useCallback(async () => {
    try {
      const result = await healthCheck();
      setConnectionStatus(result.status === 'ok' ? 'connected' : 'disconnected');
    } catch (err) {
      setConnectionStatus('disconnected');
    }
  }, []);

  // Load events for the current date range (no filtering here)
  const loadEvents = useCallback(async (startDate: Date, endDate: Date, isRetry = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      console.log('Loading events for range:', startDateStr, 'to', endDateStr);
      
      const occurrences = await getOccurrencesInRange(
        startDateStr, 
        endDateStr, 
        'Asia/Jakarta'
      );
      
      setAllEvents(occurrences);
      setDateRange({ start: startDate, end: endDate });
      setConnectionStatus('connected');
      
    } catch (err) {
      console.error('Error loading events:', err);
      const apiError = err as APIError;
      const isNetworkError = apiError?.isNetworkError || err instanceof TypeError;
      
      setError({
        message: apiError?.message || 'Gagal memuat event dari server',
        isNetworkError
      });
      setConnectionStatus('disconnected');
      
      if (!isRetry) { // Only show toast for initial failures, not retries
        showToast(
          isNetworkError ? 'Backend server tidak dapat diakses' : 'Gagal memuat event', 
          'error'
        );
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Separate effect to apply filters to already loaded events
  useEffect(() => {
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
    
    setEvents(filteredOccurrences);
  }, [allEvents, filters]);

  // Check connection and initial load with current month
  useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    // Check connection first, then load events
    checkConnection();
    loadEvents(startOfMonth, endOfMonth);
  }, [loadEvents, checkConnection]);

  // Handle calendar date range changes
  const handleDateRangeChange = useCallback((start: Date, end: Date) => {
    loadEvents(start, end);
  }, [loadEvents]);

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
      loadEvents(dateRange.start, dateRange.end);
      
    } catch (err) {
      console.error('Error deleting event:', err);
      showToast('Gagal menghapus event', 'error');
    }
  }, [loadEvents, dateRange, showToast]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  // Handle manual refresh
  const handleRefresh = useCallback(() => {
    loadEvents(dateRange.start, dateRange.end, true); // true indicates it's a retry
  }, [loadEvents, dateRange]);

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

            {/* Connection Status Indicator */}
            <div className="flex items-center gap-2 text-sm">
              {connectionStatus === 'connected' && (
                <div className="flex items-center gap-1 text-green-600">
                  <Wifi className="h-4 w-4" />
                  <span>Terhubung</span>
                </div>
              )}
              {connectionStatus === 'disconnected' && (
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
        <div className={`rounded-lg border p-6 ${
          error.isNetworkError 
            ? 'bg-orange-50 border-orange-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start gap-3">
            <AlertCircle className={`h-5 w-5 mt-0.5 ${
              error.isNetworkError ? 'text-orange-600' : 'text-red-600'
            }`} />
            <div className="flex-1">
              <div className={`font-semibold mb-2 ${
                error.isNetworkError ? 'text-orange-800' : 'text-red-800'
              }`}>
                {error.isNetworkError ? 'Backend Server Tidak Terhubung' : 'Gagal Memuat Kalender'}
              </div>
              <div className={`text-sm mb-4 ${
                error.isNetworkError ? 'text-orange-700' : 'text-red-700'
              }`}>
                {error.isNetworkError 
                  ? 'Server backend tidak dapat diakses. Pastikan server backend berjalan di http://localhost:8888 dan coba lagi.'
                  : error.message
                }
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  disabled={loading}
                  className={
                    error.isNetworkError 
                      ? 'border-orange-300 text-orange-700 hover:bg-orange-100'
                      : 'border-red-300 text-red-700 hover:bg-red-100'
                  }
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Coba Lagi
                </Button>
                {error.isNetworkError && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={checkConnection}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    Test Koneksi
                  </Button>
                )}
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
            />
          ) : (
            <DynamicEventCalendar
              events={events}
              onEventEdit={handleEventEdit}
              onEventDelete={handleEventDelete}
              onDateRangeChange={handleDateRangeChange}
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