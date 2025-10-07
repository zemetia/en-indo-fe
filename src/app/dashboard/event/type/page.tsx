'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { FiPlus, FiSearch, FiRefreshCw, FiEdit3, FiTrash2, FiTag } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/context/ToastContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { eventTypeService, EventType } from '@/lib/event-type-service';
import Skeleton from '@/components/Skeleton';
import EventTypeFormDialog from '@/components/dashboard/EventTypeFormDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

export default function EventTypePage() {
  const { showToast } = useToast();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState<EventType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await eventTypeService.getAll();
      // Sort by sort_order
      const sortedData = data.sort((a, b) => a.sort_order - b.sort_order);
      setEventTypes(sortedData);
    } catch (error) {
      console.error('Failed to fetch event types:', error);
      setError('Gagal memuat data event type. Silakan coba lagi.');
      showToast('Gagal memuat data event type.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEventType = () => {
    setSelectedEventType(null);
    setShowFormDialog(true);
  };

  const handleEditEventType = (eventType: EventType) => {
    setSelectedEventType(eventType);
    setShowFormDialog(true);
  };

  const handleDeleteEventType = (eventType: EventType) => {
    setSelectedEventType(eventType);
    setConfirmationText('');
    setShowDeleteDialog(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);

      if (selectedEventType) {
        await eventTypeService.update(selectedEventType.id, data);
        showToast('Event type berhasil diperbarui.', 'success');
      } else {
        await eventTypeService.create(data);
        showToast('Event type berhasil dibuat.', 'success');
      }

      setShowFormDialog(false);
      await fetchEventTypes();
    } catch (error) {
      console.error('Failed to save event type:', error);
      showToast('Gagal menyimpan event type.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEventType) return;

    const expectedText = `hapus ${selectedEventType.name}`;
    if (confirmationText !== expectedText) {
      showToast(`Silakan ketik "${expectedText}" untuk mengonfirmasi penghapusan.`, 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await eventTypeService.delete(selectedEventType.id);
      showToast(`Event type "${selectedEventType.display_name}" berhasil dihapus.`, 'success');
      setShowDeleteDialog(false);
      setSelectedEventType(null);
      setConfirmationText('');
      await fetchEventTypes();
    } catch (error) {
      console.error('Failed to delete event type:', error);
      showToast('Gagal menghapus event type.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    fetchEventTypes();
  };

  const filteredEventTypes = React.useMemo(() => {
    if (!searchTerm) return eventTypes;

    const lowercasedFilter = searchTerm.toLowerCase();
    return eventTypes.filter(
      (type) =>
        type.name.toLowerCase().includes(lowercasedFilter) ||
        type.display_name.toLowerCase().includes(lowercasedFilter) ||
        type.description.toLowerCase().includes(lowercasedFilter)
    );
  }, [eventTypes, searchTerm]);

  if (error) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Manajemen Event Type'
          description='Kelola kategori event dalam sistem.'
          actionLabel='Tambah Event Type'
          onAction={handleAddEventType}
          gradientFrom='from-blue-500'
          gradientTo='to-cyan-500'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
          <div className='text-center py-16 text-red-500 bg-red-50 rounded-lg border border-red-200'>
            <FiTag className='mx-auto h-12 w-12 text-red-400 mb-4' />
            <h3 className="text-lg font-semibold text-red-800">Terjadi Kesalahan</h3>
            <p>{error}</p>
            <Button onClick={handleRefresh} className="mt-4">
              <FiRefreshCw className="mr-2 h-4 w-4" />
              Muat Ulang
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Manajemen Event Type'
        description='Kelola kategori event dalam sistem.'
        actionLabel='Tambah Event Type'
        onAction={handleAddEventType}
        gradientFrom='from-blue-500'
        gradientTo='to-cyan-500'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>Daftar Event Type</h2>
            <p className='text-sm text-gray-500 mt-1'>
              {isLoading ? 'Memuat data...' : `Total ${filteredEventTypes.length} event type ditemukan.`}
            </p>
          </div>
          <div className='flex w-full md:w-auto space-x-4'>
            <div className='relative flex-grow'>
              <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Cari nama atau deskripsi...'
                className='pl-10'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
              <FiRefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
              Refresh
            </Button>
            <Button onClick={handleAddEventType}>
              <FiPlus className='mr-2 h-4 w-4'/>
              Tambah
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEventTypes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEventTypes.map((eventType, index) => (
              <motion.div
                key={eventType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 border-l-4"
                  style={{ borderLeftColor: eventType.color || '#3B82F6' }}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div
                          className="p-2 rounded-lg flex-shrink-0"
                          style={{
                            backgroundColor: `${eventType.color || '#3B82F6'}20`,
                          }}
                        >
                          <FiTag
                            className="h-5 w-5"
                            style={{ color: eventType.color || '#3B82F6' }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{eventType.display_name}</CardTitle>
                          <CardDescription className="text-xs font-mono truncate">
                            {eventType.name}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-4">
                    <div className="space-y-3">
                      {eventType.description && (
                        <p className="text-gray-600 text-sm line-clamp-3">{eventType.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant={eventType.is_active ? 'default' : 'secondary'}
                          className={eventType.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {eventType.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Order: {eventType.sort_order}
                        </Badge>
                      </div>

                      <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Color:</span>
                          <div
                            className="w-6 h-6 rounded border border-gray-300"
                            style={{ backgroundColor: eventType.color || '#3B82F6' }}
                          />
                          <code className="bg-gray-100 px-1.5 py-0.5 rounded">
                            {eventType.color || '#3B82F6'}
                          </code>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditEventType(eventType)}
                        className="flex-1"
                      >
                        <FiEdit3 className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEventType(eventType)}
                        className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <FiTrash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className='text-center py-16 text-gray-500 bg-gray-50 rounded-lg'>
            <FiTag className='mx-auto h-12 w-12 text-gray-400 mb-4' />
            <h3 className="text-lg font-semibold text-gray-800">Tidak Ada Event Type</h3>
            <p>Belum ada event type yang terdaftar. Tambahkan event type pertama Anda.</p>
            <Button onClick={handleAddEventType} className="mt-4">
              <FiPlus className="mr-2 h-4 w-4" />
              Tambah Event Type
            </Button>
          </div>
        )}
      </div>

      <EventTypeFormDialog
        open={showFormDialog}
        onOpenChange={setShowFormDialog}
        eventType={selectedEventType}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Peringatan: Hapus Event Type</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4">
              <p>
                Anda akan menghapus event type
                <strong className='text-red-700'> {selectedEventType?.display_name}</strong>
                {' '}({selectedEventType?.name}).
              </p>
              <p className="text-red-600 font-medium">
                Tindakan ini akan mempengaruhi SEMUA EVENT yang menggunakan type ini dan TIDAK DAPAT DIBATALKAN.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm font-medium text-red-800 mb-2">
                  Untuk melanjutkan, ketik persis seperti ini:
                </p>
                <code className="bg-red-100 text-red-800 px-2 py-1 rounded font-mono text-sm">
                  hapus {selectedEventType?.name}
                </code>
              </div>
              <Input
                type="text"
                placeholder={`Ketik: hapus ${selectedEventType?.name}`}
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                disabled={isSubmitting}
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedEventType(null);
                setConfirmationText('');
              }}
              disabled={isSubmitting}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isSubmitting || !confirmationText || confirmationText !== `hapus ${selectedEventType?.name}`}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Menghapus...' : 'Ya, Hapus Event Type'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
