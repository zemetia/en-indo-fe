'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Image as ImageIcon, Users as UsersIcon, Plus, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Image from 'next/image';

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
import { useToast } from '@/context/ToastContext';

// --- Interfaces and Mock Data ---
interface User {
  id: string;
  name: string;
  avatar: string;
}

interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  endDate?: string;
  byWeekday?: string[];
}

interface EventFormData {
  title: string;
  description: string;
  capacity: number;
  type: 'event' | 'ibadah' | 'spiritual_journey';
  eventLocation: string;
  startDatetime: string;
  endDatetime: string;
  allDay: boolean;
  timezone: string;
  isPublic: boolean;
  bannerImage: File | null;
  pics: User[];
  recurrenceRule?: RecurrenceRule;
}

const MOCK_USERS: User[] = [
  { id: 'user1', name: 'Pdt. Budi Santoso', avatar: 'https://placehold.co/100x100.png' },
  { id: 'user2', name: 'Pdt. Rina Wijaya', avatar: 'https://placehold.co/100x100.png' },
  { id: 'user3', name: 'Ev. Michael Tan', avatar: 'https://placehold.co/100x100.png' },
  { id: 'user4', name: 'Andi Suryo', avatar: 'https://placehold.co/100x100.png' },
  { id: 'user5', name: 'Citra Lestari', avatar: 'https://placehold.co/100x100.png' },
];

const WEEKDAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const WEEKDAY_LABELS = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];


export default function CreateEventPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isRecurring, setIsRecurring] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [picSearch, setPicSearch] = useState('');

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    capacity: 99999,
    type: 'event',
    eventLocation: '',
    startDatetime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    endDatetime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    allDay: false,
    timezone: 'Asia/Jakarta',
    isPublic: false,
    bannerImage: null,
    pics: [],
    recurrenceRule: {
        frequency: 'WEEKLY',
        byWeekday: [],
    }
  });

  const availablePics = MOCK_USERS.filter(user => 
    !formData.pics.some(pic => pic.id === user.id) &&
    user.name.toLowerCase().includes(picSearch.toLowerCase())
  );

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, bannerImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  
  const handleRecurrenceChange = (key: keyof RecurrenceRule, value: any) => {
    setFormData(prev => ({
      ...prev,
      recurrenceRule: {
        ...prev.recurrenceRule!,
        [key]: value,
      } as RecurrenceRule
    }));
  };

  const toggleWeekday = (day: string) => {
    const currentDays = formData.recurrenceRule?.byWeekday || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    handleRecurrenceChange('byWeekday', newDays);
  };

  const addPic = (user: User) => {
    setFormData(prev => ({ ...prev, pics: [...prev.pics, user] }));
  };

  const removePic = (userId: string) => {
    setFormData(prev => ({ ...prev, pics: prev.pics.filter(p => p.id !== userId) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalFormData = isRecurring ? formData : { ...formData, recurrenceRule: undefined };
    console.log('Creating event:', finalFormData);
    showToast('Event berhasil dibuat!', 'success');
    router.push('/dashboard/event');
  };

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Buat Event Baru'
        description='Isi detail event yang akan dibuat, termasuk pengulangan dan penanggung jawab.'
        gradientFrom='from-emerald-500'
        gradientTo='to-emerald-700'
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <form onSubmit={handleSubmit} className='p-6 bg-white rounded-xl shadow-sm border border-gray-200 space-y-8'>
            {/* --- Basic Information --- */}
            <Section title="Informasi Dasar">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Field label="Judul Event">
                        <Input type='text' name='title' value={formData.title} onChange={handleInputChange} required />
                    </Field>
                    <Field label="Tipe Event">
                        <Select name='type' required value={formData.type} onValueChange={(value) => setFormData(p => ({...p, type: value as any}))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value='ibadah'>Ibadah</SelectItem>
                                <SelectItem value='event'>Event Spesial</SelectItem>
                                <SelectItem value='spiritual_journey'>Kelas Spiritual Journey</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
                <div className="mt-4">
                    <Field label="Deskripsi">
                        <textarea name='description' rows={3} value={formData.description} onChange={handleInputChange} className='w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2' />
                    </Field>
                </div>
            </Section>

            {/* --- Banner Upload --- */}
            <Section title="Banner Event">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                        {bannerPreview ? (
                            <div className="relative w-full h-48">
                                <Image src={bannerPreview} alt="Preview Banner" layout="fill" objectFit="contain" className="rounded-md" />
                            </div>
                        ) : (
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                        <div className="flex text-sm text-gray-600 justify-center">
                            <label htmlFor="bannerImage" className="relative cursor-pointer bg-white rounded-md font-medium text-emerald-600 hover:text-emerald-500 focus-within:outline-none">
                                <span>Upload file</span>
                                <input id="bannerImage" name="bannerImage" type="file" className="sr-only" accept="image/*" onChange={handleBannerChange} />
                            </label>
                            <p className="pl-1">atau drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 10MB</p>
                    </div>
                </div>
            </Section>

            {/* --- Date and Time --- */}
            <Section title="Tanggal dan Waktu">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Field label="Lokasi">
                        <Input type='text' name='eventLocation' value={formData.eventLocation} onChange={handleInputChange} required />
                    </Field>
                    <Field label="Zona Waktu">
                        <Select name='timezone' required value={formData.timezone} onValueChange={(value) => setFormData(p => ({ ...p, timezone: value }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Asia/Jakarta'>WIB (UTC+7)</SelectItem>
                                <SelectItem value='Asia/Makassar'>WITA (UTC+8)</SelectItem>
                                <SelectItem value='Asia/Jayapura'>WIT (UTC+9)</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
                <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <Field label="Waktu Mulai">
                        <Input type='datetime-local' name='startDatetime' value={formData.startDatetime} onChange={handleInputChange} required />
                    </Field>
                    <Field label="Waktu Selesai">
                        <Input type='datetime-local' name='endDatetime' value={formData.endDatetime} onChange={handleInputChange} required />
                    </Field>
                </div>
                <div className='mt-4'><label className='flex items-center'><input type='checkbox' name='allDay' checked={formData.allDay} onChange={handleInputChange} className='rounded' /><span className='ml-2 text-sm'>Seharian penuh</span></label></div>
            </Section>
            
            {/* --- Recurrence --- */}
            <Section title="Pengaturan Pengulangan">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Aktifkan jika ini adalah acara rutin atau berulang.</p>
                    <label className='flex items-center cursor-pointer'>
                        <span className='mr-2 text-sm font-medium text-gray-700'>Event Berulang</span>
                        <input type='checkbox' checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} className='toggle-checkbox' />
                    </label>
                </div>

                {isRecurring && (
                    <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} className='mt-4 p-4 bg-gray-50 rounded-lg border space-y-4'>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Frekuensi">
                                <Select value={formData.recurrenceRule?.frequency} onValueChange={(v) => handleRecurrenceChange('frequency', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='DAILY'>Setiap Hari</SelectItem>
                                        <SelectItem value='WEEKLY'>Setiap Minggu</SelectItem>
                                        <SelectItem value='MONTHLY'>Setiap Bulan</SelectItem>
                                        <SelectItem value='YEARLY'>Setiap Tahun</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Berakhir Pada">
                                <Input type='date' value={formData.recurrenceRule?.endDate || ''} onChange={(e) => handleRecurrenceChange('endDate', e.target.value)} />
                            </Field>
                        </div>
                        {formData.recurrenceRule?.frequency === 'WEEKLY' && (
                            <Field label="Ulangi Pada Hari">
                                <div className="flex space-x-2">
                                    {WEEKDAYS.map((day, index) => (
                                        <Button key={day} type="button" size="icon" variant={formData.recurrenceRule?.byWeekday?.includes(day) ? "default" : "outline"} onClick={() => toggleWeekday(day)}>
                                            {WEEKDAY_LABELS[index]}
                                        </Button>
                                    ))}
                                </div>
                            </Field>
                        )}
                    </motion.div>
                )}
            </Section>

            {/* --- PIC Selection --- */}
            <Section title="Penanggung Jawab (PIC)">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">PIC Terpilih ({formData.pics.length})</h4>
                        <div className="p-2 border rounded-md min-h-[150px] space-y-2 bg-gray-50">
                            {formData.pics.length === 0 && <p className="text-center text-sm text-gray-400 p-4">Belum ada PIC dipilih</p>}
                            {formData.pics.map(pic => (
                                <div key={pic.id} className="flex items-center justify-between bg-white p-2 rounded shadow-sm">
                                    <div className="flex items-center space-x-2">
                                        <Image src={pic.avatar} alt={pic.name} width={24} height={24} className="rounded-full" />
                                        <span className="text-sm font-medium">{pic.name}</span>
                                    </div>
                                    <Button type="button" size="icon" variant="ghost" className="h-6 w-6" onClick={() => removePic(pic.id)}><X className="h-4 w-4 text-red-500" /></Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Pilih dari Daftar</h4>
                        <Input type="text" placeholder="Cari nama..." value={picSearch} onChange={(e) => setPicSearch(e.target.value)} />
                        <div className="p-2 border rounded-md max-h-[150px] overflow-y-auto space-y-1">
                            {availablePics.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-2 rounded hover:bg-emerald-50 cursor-pointer" onClick={() => addPic(user)}>
                                    <div className="flex items-center space-x-2">
                                        <Image src={user.avatar} alt={user.name} width={24} height={24} className="rounded-full" />
                                        <span className="text-sm">{user.name}</span>
                                    </div>
                                    <Plus className="h-4 w-4 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>
            
            {/* --- Final Settings & Actions --- */}
            <div className='flex items-center justify-between mt-8 pt-6 border-t'>
                <label className='flex items-center'><input type='checkbox' name='isPublic' checked={formData.isPublic} onChange={handleInputChange} className='rounded' /><span className='ml-2 text-sm'>Event publik (dapat dilihat semua jemaat)</span></label>
                <div className="flex justify-end space-x-4">
                    <Button type='button' onClick={() => router.back()} variant='outline'><X className='h-4 w-4 mr-2' />Batal</Button>
                    <Button type='submit' className="bg-emerald-600 hover:bg-emerald-700"><Save className='h-4 w-4 mr-2' />Simpan Event</Button>
                </div>
            </div>
        </form>
      </motion.div>
    </div>
  );
}

// Helper components for sectioning the form
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div>
    <h3 className='text-lg font-medium text-gray-900 mb-4 pb-2 border-b'>{title}</h3>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>{label}</label>
        {children}
    </div>
);

// Custom toggle switch style
const customStyles = `
  .toggle-checkbox:checked {
    right: 0;
    border-color: #10B981;
  }
  .toggle-checkbox:checked + .toggle-label {
    background-color: #10B981;
  }
`;

const styleSheet = typeof window !== 'undefined' ? document.createElement("style") : null;
if (styleSheet) {
  styleSheet.type = "text/css";
  styleSheet.innerText = customStyles;
  document.head.appendChild(styleSheet);
}
