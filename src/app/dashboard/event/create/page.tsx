'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Save, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import FeaturedCard from '@/components/dashboard/FeaturedCard';

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
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='bg-white p-6 rounded-xl shadow-sm'>
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
                      className='block text-sm font-medium text-gray-700'
                    >
                      Judul Event
                    </label>
                    <input
                      type='text'
                      name='title'
                      id='title'
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='type'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Tipe Event
                    </label>
                    <select
                      name='type'
                      id='type'
                      required
                      value={formData.type}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
                    >
                      <option value='event'>Event</option>
                      <option value='ibadah'>Ibadah</option>
                      <option value='spiritual_journey'>
                        Spiritual Journey
                      </option>
                    </select>
                  </div>
                </div>

                <div className='mt-4'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium text-gray-700'
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
                      className='block text-sm font-medium text-gray-700'
                    >
                      Tanggal Event
                    </label>
                    <input
                      type='date'
                      name='eventDate'
                      id='eventDate'
                      required
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='eventLocation'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Lokasi
                    </label>
                    <input
                      type='text'
                      name='eventLocation'
                      id='eventLocation'
                      required
                      value={formData.eventLocation}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
                    />
                  </div>
                </div>

                <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label
                      htmlFor='startDatetime'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Waktu Mulai
                    </label>
                    <input
                      type='datetime-local'
                      name='startDatetime'
                      id='startDatetime'
                      required
                      value={formData.startDatetime}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='endDatetime'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Waktu Selesai
                    </label>
                    <input
                      type='datetime-local'
                      name='endDatetime'
                      id='endDatetime'
                      required
                      value={formData.endDatetime}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
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
                        className='block text-sm font-medium text-gray-700'
                      >
                        Frekuensi
                      </label>
                      <select
                        name='frequency'
                        id='frequency'
                        value={formData.recurrenceRule?.frequency || 'WEEKLY'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            recurrenceRule: {
                              ...prev.recurrenceRule,
                              frequency: e.target.value as
                                | 'DAILY'
                                | 'WEEKLY'
                                | 'MONTHLY'
                                | 'YEARLY',
                              interval: prev.recurrenceRule?.interval || 1,
                            },
                          }))
                        }
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
                      >
                        <option value='DAILY'>Setiap hari</option>
                        <option value='WEEKLY'>Setiap minggu</option>
                        <option value='MONTHLY'>Setiap bulan</option>
                        <option value='YEARLY'>Setiap tahun</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor='interval'
                        className='block text-sm font-medium text-gray-700'
                      >
                        Interval
                      </label>
                      <input
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
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
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
                      className='block text-sm font-medium text-gray-700'
                    >
                      Kapasitas
                    </label>
                    <input
                      type='number'
                      name='capacity'
                      id='capacity'
                      min='1'
                      value={formData.capacity}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='timezone'
                      className='block text-sm font-medium text-gray-700'
                    >
                      Zona Waktu
                    </label>
                    <select
                      name='timezone'
                      id='timezone'
                      required
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm'
                    >
                      <option value='Asia/Jakarta'>WIB (UTC+7)</option>
                      <option value='Asia/Makassar'>WITA (UTC+8)</option>
                      <option value='Asia/Jayapura'>WIT (UTC+9)</option>
                    </select>
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
          </div>

          <div className='flex justify-end space-x-4'>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='button'
              onClick={() => router.back()}
              className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
            >
              <X className='h-4 w-4 mr-2' />
              Batal
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
            >
              <Save className='h-4 w-4 mr-2' />
              Simpan Event
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
