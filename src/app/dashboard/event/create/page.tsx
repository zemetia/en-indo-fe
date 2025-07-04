'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EventFormData {
  title: string;
  description: string;
  capacity: number;
  type: 'event' | 'ibadah' | 'spiritual_journey';
  eventDate: string;
  eventLocation: string;
  startDatetime: string;
  endDatetime: string;
  allDay: boolean;
  timezone: string;
  isPublic: boolean;
  recurrenceRule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    interval: number;
    byWeekday?: string[];
    byMonthDay?: number[];
    byMonth?: number[];
    count?: number;
    until?: string;
  };
}

export default function CreateEventPage() {
  const router = useRouter();
  const [isRecurring, setIsRecurring] = useState(false);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    capacity: 99999,
    type: 'event',
    eventDate: format(new Date(), 'yyyy-MM-dd'),
    eventLocation: '',
    startDatetime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endDatetime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    allDay: false,
    timezone: 'Asia/Jakarta',
    isPublic: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to create event
    console.log('Creating event:', formData);
    router.push('/dashboard/event');
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className='space-y-6'>
      {/* Featured Card */}
      <FeaturedCard
        title='Buat Event Baru'
        description='Isi detail event yang akan dibuat'
        actionLabel='Simpan Event'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form
          onSubmit={handleSubmit}
          className='p-6 bg-white rounded-xl shadow-sm border border-gray-200'
        >
          <div className='space-y-6'>
            {/* Basic Information */}
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Informasi Dasar
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='title'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Judul Event
                  </label>
                  <Input
                    type='text'
                    name='title'
                    id='title'
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor='type'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Tipe Event
                  </label>
                  <Select
                    name='type'
                    required
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: value as 'event' | 'ibadah' | 'spiritual_journey',
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih Tipe Event' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='event'>Event</SelectItem>
                      <SelectItem value='ibadah'>Ibadah</SelectItem>
                      <SelectItem value='spiritual_journey'>
                        Spiritual Journey
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='mt-4'>
                <label
                  htmlFor='description'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Deskripsi
                </label>
                <textarea
                  name='description'
                  id='description'
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
                />
              </div>
            </div>

            {/* Date and Time */}
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Tanggal dan Waktu
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='eventDate'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Tanggal Event
                  </label>
                  <Input
                    type='date'
                    name='eventDate'
                    id='eventDate'
                    required
                    value={formData.eventDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor='eventLocation'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Lokasi
                  </label>
                  <Input
                    type='text'
                    name='eventLocation'
                    id='eventLocation'
                    required
                    value={formData.eventLocation}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='startDatetime'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Waktu Mulai
                  </label>
                  <Input
                    type='datetime-local'
                    name='startDatetime'
                    id='startDatetime'
                    required
                    value={formData.startDatetime}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor='endDatetime'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Waktu Selesai
                  </label>
                  <Input
                    type='datetime-local'
                    name='endDatetime'
                    id='endDatetime'
                    required
                    value={formData.endDatetime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className='mt-4'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    name='allDay'
                    checked={formData.allDay}
                    onChange={handleInputChange}
                    className='rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500'
                  />
                  <span className='ml-2 text-sm text-gray-600'>
                    Event seharian penuh
                  </span>
                </label>
              </div>
            </div>

            {/* Recurrence Settings */}
            <div>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium text-gray-900'>
                  Pengaturan Pengulangan
                </h3>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className='rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500'
                  />
                  <span className='ml-2 text-sm text-gray-600'>
                    Event berulang
                  </span>
                </label>
              </div>

              {isRecurring && (
                <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='frequency'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Frekuensi
                    </label>
                    <Select
                      name='frequency'
                      value={formData.recurrenceRule?.frequency || 'WEEKLY'}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          recurrenceRule: {
                            ...prev.recurrenceRule,
                            frequency: value as
                              | 'DAILY'
                              | 'WEEKLY'
                              | 'MONTHLY'
                              | 'YEARLY',
                            interval: prev.recurrenceRule?.interval || 1,
                          },
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Pilih Frekuensi' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='DAILY'>Setiap hari</SelectItem>
                        <SelectItem value='WEEKLY'>Setiap minggu</SelectItem>
                        <SelectItem value='MONTHLY'>Setiap bulan</SelectItem>
                        <SelectItem value='YEARLY'>Setiap tahun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label
                      htmlFor='interval'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Interval
                    </label>
                    <Input
                      type='number'
                      name='interval'
                      id='interval'
                      min='1'
                      value={formData.recurrenceRule?.interval || 1}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          recurrenceRule: {
                            ...prev.recurrenceRule,
                            frequency:
                              prev.recurrenceRule?.frequency || 'WEEKLY',
                            interval: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Additional Settings */}
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>
                Pengaturan Tambahan
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='capacity'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Kapasitas
                  </label>
                  <Input
                    type='number'
                    name='capacity'
                    id='capacity'
                    min='1'
                    value={formData.capacity}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor='timezone'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Zona Waktu
                  </label>
                  <Select
                    name='timezone'
                    required
                    value={formData.timezone}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, timezone: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Pilih Zona Waktu' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Asia/Jakarta'>WIB (UTC+7)</SelectItem>
                      <SelectItem value='Asia/Makassar'>
                        WITA (UTC+8)
                      </SelectItem>
                      <SelectItem value='Asia/Jayapura'>WIT (UTC+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='mt-4'>
                <label className='flex items-center'>
                  <input
                    type='checkbox'
                    name='isPublic'
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className='rounded border-gray-300 text-emerald-600 shadow-sm focus:border-emerald-500 focus:ring-emerald-500'
                  />
                  <span className='ml-2 text-sm text-gray-600'>
                    Event publik (dapat dilihat semua jemaat)
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div className='flex justify-end space-x-4 mt-6'>
            <Button
              type='button'
              onClick={() => router.back()}
              variant='outline'
            >
              <X className='h-4 w-4 mr-2' />
              Batal
            </Button>
            <Button type='submit'>
              <Save className='h-4 w-4 mr-2' />
              Simpan Event
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}