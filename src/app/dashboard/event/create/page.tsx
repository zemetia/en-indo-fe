'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Image as ImageIcon, Users, Plus, Calendar as CalendarIcon, ArrowRight, Settings } from 'lucide-react';
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
import { createEvent, CreateEventRequest, EventPICRequest, getAvailablePICRoles, EventPICRole } from '@/lib/api/events';
import { RecurrencePicker } from '@/components/ui/recurrence-picker';
import { ParticipantPlanner, ParticipantData } from '@/components/ui/participant-planner';
import { personService, SimplePerson } from '@/lib/person-service';

// --- Interfaces ---
interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval: number;
  byWeekday?: string[];
  byMonthDay?: number[];
  byMonth?: number[];
  bySetPos?: number[];
  weekStart?: string;
  byYearDay?: number[];
  count?: number;
  until?: string;
}

interface EventPICFormData {
  personId: string;
  role: string;
  description: string;
  isPrimary: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAssignPIC: boolean;
  notifyOnChanges: boolean;
  notifyOnReminders: boolean;
  person: SimplePerson;
}

export default function CreateEventPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [picSearch, setPicSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [dataError, setDataError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Data from API
  const [availablePersons, setAvailablePersons] = useState<SimplePerson[]>([]);
  const [availableRoles, setAvailableRoles] = useState<EventPICRole[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    capacity: 99999,
    type: 'event' as 'event' | 'ibadah' | 'spiritual_journey',
    eventLocation: '',
    eventDate: format(new Date(), "yyyy-MM-dd"),
    startTime: format(new Date(), "HH:mm"),
    endTime: format(new Date(), "HH:mm"),
    allDay: false,
    timezone: 'Asia/Jakarta',
    isPublic: false,
    bannerImage: null as File | null,
    pics: [] as EventPICFormData[],
    recurrenceRule: null as RecurrenceRule | null,
    expectedParticipants: {
      expectedParticipants: 0,
      expectedAdults: 0,
      expectedYouth: 0,
      expectedKids: 0
    } as ParticipantData
  });

  // Load initial data
  useEffect(() => {
    const loadInitialData = async (isRetry = false) => {
      try {
        if (!isRetry) {
          setIsLoadingData(true);
        }
        setDataError(null);
        
        console.log('Loading PIC data...', { isRetry, retryCount });
        
        const [personsData, rolesData] = await Promise.all([
          personService.getSimpleList(),
          getAvailablePICRoles()
        ]);
        
        console.log('PIC data loaded successfully:', { 
          personsCount: personsData.length, 
          rolesCount: Array.isArray(rolesData) ? rolesData.length : 'not an array',
          rolesDataType: typeof rolesData,
          rolesData: rolesData
        });
        
        setAvailablePersons(personsData || []);
        // Ensure rolesData is always an array before filtering
        const rolesArray = Array.isArray(rolesData) ? rolesData : [];
        setAvailableRoles(rolesArray.filter(role => role.isActive));
        setRetryCount(0);
      } catch (error) {
        console.error('Failed to load initial data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setDataError(`Gagal memuat data: ${errorMessage}`);
        
        if (!isRetry) {
          showToast('Gagal memuat data PIC. Coba lagi atau refresh halaman.', 'error');
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    loadInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]); // Re-run when retryCount changes
  
  const retryLoadData = () => {
    setRetryCount(prev => prev + 1);
  };

  const availablePics = useMemo(() => {
    const filtered = availablePersons.filter(person => 
      !formData.pics.some(pic => pic.personId === person.id) &&
      person.nama.toLowerCase().includes(picSearch.toLowerCase())
    );
    
    console.log('Available PICs filtered:', { 
      totalPersons: availablePersons.length,
      alreadySelectedCount: formData.pics.length,
      searchTerm: picSearch,
      filteredCount: filtered.length
    });
    
    return filtered;
  }, [availablePersons, formData.pics, picSearch]);

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
  
  const handleRecurrenceChange = (rule: RecurrenceRule | null) => {
    setFormData(prev => ({
      ...prev,
      recurrenceRule: rule
    }));
  };

  const handleParticipantChange = (data: ParticipantData) => {
    setFormData(prev => ({
      ...prev,
      expectedParticipants: data
    }));
  };

  const addPic = useCallback((person: SimplePerson) => {
    console.log('Adding PIC:', { person, availableRolesCount: availableRoles.length });
    
    // Check if person is already added
    if (formData.pics.some(pic => pic.personId === person.id)) {
      showToast('Person sudah dipilih sebagai PIC.', 'warning');
      return;
    }
    
    setFormData(prev => {
      // Try to find a good default role
      let defaultRole = availableRoles.find(role => role.name === 'Secondary PIC') || 
                       availableRoles.find(role => role.name.includes('PIC')) ||
                       availableRoles[0];
      
      // Fallback if no roles are available
      if (!defaultRole) {
        console.warn('No roles available, using fallback role');
        defaultRole = {
          id: 'fallback-role',
          name: 'PIC',
          description: 'Penanggung Jawab',
          defaultCanEdit: true,
          defaultCanDelete: false,
          defaultCanAssignPIC: false,
          isActive: true,
          createdAt: '',
          updatedAt: ''
        };
      }

      const newPic: EventPICFormData = {
        personId: person.id,
        role: defaultRole.name,
        description: defaultRole.description,
        isPrimary: prev.pics.length === 0, // First PIC becomes primary
        canEdit: defaultRole.defaultCanEdit,
        canDelete: defaultRole.defaultCanDelete,
        canAssignPIC: defaultRole.defaultCanAssignPIC,
        notifyOnChanges: true,
        notifyOnReminders: true,
        person: person
      };
      
      console.log('PIC added successfully:', newPic);
      showToast(`${person.nama} berhasil ditambahkan sebagai PIC.`, 'success');
      
      return { ...prev, pics: [...prev.pics, newPic] };
    });
  }, [availableRoles, formData.pics, showToast]);

  const removePic = useCallback((personId: string) => {
    setFormData(prev => {
      const updatedPics = prev.pics.filter(p => p.personId !== personId);
      
      // If we removed the primary PIC, make the first remaining PIC primary
      if (updatedPics.length > 0 && !updatedPics.some(pic => pic.isPrimary)) {
        updatedPics[0].isPrimary = true;
      }
      
      return { ...prev, pics: updatedPics };
    });
  }, []);

  const updatePicRole = useCallback((personId: string, roleId: string) => {
    setFormData(prev => {
      const selectedRole = availableRoles.find(role => role.id === roleId);
      if (!selectedRole) return prev;

      return {
        ...prev,
        pics: prev.pics.map(pic => 
          pic.personId === personId 
            ? {
                ...pic,
                role: selectedRole.name,
                description: selectedRole.description,
                canEdit: selectedRole.defaultCanEdit,
                canDelete: selectedRole.defaultCanDelete,
                canAssignPIC: selectedRole.defaultCanAssignPIC
              }
            : pic
        )
      };
    });
  }, [availableRoles]);

  const updatePicPermissions = useCallback((personId: string, field: 'canEdit' | 'canDelete' | 'canAssignPIC' | 'notifyOnChanges' | 'notifyOnReminders', value: boolean) => {
    setFormData(prev => ({
      ...prev,
      pics: prev.pics.map(pic => 
        pic.personId === personId ? { ...pic, [field]: value } : pic
      )
    }));
  }, []);

  const setPrimaryPic = useCallback((personId: string) => {
    setFormData(prev => ({
      ...prev,
      pics: prev.pics.map(pic => ({ ...pic, isPrimary: pic.personId === personId }))
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validation
    if (formData.pics.length === 0) {
      showToast('Minimal harus ada satu PIC (Penanggung Jawab) untuk event ini.', 'error');
      return;
    }

    const primaryPicCount = formData.pics.filter(pic => pic.isPrimary).length;
    if (primaryPicCount !== 1) {
      showToast('Harus ada tepat satu Primary PIC untuk event ini.', 'error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare EventPIC data
      const eventPics: EventPICRequest[] = formData.pics.map(pic => ({
        personId: pic.personId,
        role: pic.role,
        description: pic.description,
        isPrimary: pic.isPrimary,
        startDate: formData.eventDate,
        canEdit: pic.canEdit,
        canDelete: pic.canDelete,
        canAssignPIC: pic.canAssignPIC,
        notifyOnChanges: pic.notifyOnChanges,
        notifyOnReminders: pic.notifyOnReminders
      }));

      // Prepare the request data according to our API interface
      const requestData: CreateEventRequest = {
        title: formData.title,
        description: formData.description || undefined,
        capacity: formData.capacity,
        type: formData.type,
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation,
        startTime: formData.startTime,
        endTime: formData.endTime,
        allDay: formData.allDay,
        timezone: formData.timezone,
        isPublic: formData.isPublic,
        expectedParticipants: formData.expectedParticipants.expectedParticipants || undefined,
        expectedAdults: formData.expectedParticipants.expectedAdults || undefined,
        expectedYouth: formData.expectedParticipants.expectedYouth || undefined,
        expectedKids: formData.expectedParticipants.expectedKids || undefined,
        eventPics: eventPics,
        // Add recurrence rule if it exists
        ...(formData.recurrenceRule && {
          recurrenceRule: {
            frequency: formData.recurrenceRule.frequency,
            interval: formData.recurrenceRule.interval,
            ...(formData.recurrenceRule.byWeekday?.length && { 
              byWeekday: formData.recurrenceRule.byWeekday 
            }),
            ...(formData.recurrenceRule.byMonthDay?.length && { 
              byMonthDay: formData.recurrenceRule.byMonthDay 
            }),
            ...(formData.recurrenceRule.byMonth?.length && { 
              byMonth: formData.recurrenceRule.byMonth 
            }),
            ...(formData.recurrenceRule.bySetPos?.length && { 
              bySetPos: formData.recurrenceRule.bySetPos 
            }),
            ...(formData.recurrenceRule.weekStart && { 
              weekStart: formData.recurrenceRule.weekStart 
            }),
            ...(formData.recurrenceRule.byYearDay?.length && { 
              byYearDay: formData.recurrenceRule.byYearDay 
            }),
            ...(formData.recurrenceRule.until && { 
              until: formData.recurrenceRule.until 
            }),
            ...(formData.recurrenceRule.count && { 
              count: formData.recurrenceRule.count 
            }),
          }
        })
      };
      
      // TODO: Handle banner image upload separately
      if (formData.bannerImage) {
        // For now, we'll skip the banner upload
        // In a real implementation, you'd upload the file first and get the URL
        console.log('Banner image upload not implemented yet');
      }
      
      console.log('Creating event with data:', requestData);
      
      try {
        const createdEvent = await createEvent(requestData);
        console.log('Event created successfully:', createdEvent);
        
        showToast(`Event "${createdEvent.title}" berhasil dibuat!`, 'success');
        router.push('/dashboard/event');
      } catch (apiError) {
        console.error('API Error creating event:', apiError);
        // Handle different types of API errors
        let errorMessage = 'Unknown error occurred';
        if (apiError instanceof Error) {
          errorMessage = apiError.message;
        } else if (typeof apiError === 'object' && apiError !== null && 'message' in apiError) {
          errorMessage = String((apiError as any).message);
        }
        
        showToast(`Gagal membuat event: ${errorMessage}`, 'error');
        throw apiError; // Re-throw to be caught by outer catch
      }
      
    } catch (error) {
      console.error('Error creating event:', error);
      // This is already handled by the inner try-catch, but keeping for safety
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Buat Event Baru'
        description='Isi detail event yang akan dibuat, termasuk pengulangan dan penanggung jawab.'
        actionLabel='Mulai Buat'
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
                <div className='mt-4 grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Field label="Tanggal Event">
                        <Input type='date' name='eventDate' value={formData.eventDate} onChange={handleInputChange} required />
                    </Field>
                    <Field label="Waktu Mulai">
                        <Input type='time' name='startTime' value={formData.startTime} onChange={handleInputChange} required disabled={formData.allDay} />
                    </Field>
                    <Field label="Waktu Selesai">
                        <Input type='time' name='endTime' value={formData.endTime} onChange={handleInputChange} required disabled={formData.allDay} />
                    </Field>
                </div>
                <div className='mt-4'>
                    <label className='flex items-center'>
                        <input type='checkbox' name='allDay' checked={formData.allDay} onChange={handleInputChange} className='rounded' />
                        <span className='ml-2 text-sm'>Seharian penuh</span>
                    </label>
                </div>
            </Section>
            
            {/* --- Recurrence --- */}
            <Section title="Pengaturan Pengulangan">
                <RecurrencePicker
                    value={formData.recurrenceRule}
                    onChange={handleRecurrenceChange}
                    startDate={formData.eventDate}
                />
            </Section>

            {/* --- Expected Participants --- */}
            <Section title="Perkiraan Jumlah Peserta">
                <ParticipantPlanner
                    value={formData.expectedParticipants}
                    onChange={handleParticipantChange}
                    capacity={formData.capacity}
                    disabled={isSubmitting}
                />
            </Section>

            {/* --- PIC Selection --- */}
            <Section title="Penanggung Jawab (PIC)">
                {dataError ? (
                    <div className="text-center py-8 space-y-4">
                        <div className="text-red-500">
                            <p className="text-sm">{dataError}</p>
                        </div>
                        <Button
                            type="button"
                            onClick={retryLoadData}
                            variant="outline"
                            size="sm"
                            className="mx-auto"
                        >
                            Coba Lagi
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Selected PICs */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-700">PIC Terpilih ({formData.pics.length})</h4>
                            <div className="space-y-4">
                                {formData.pics.length === 0 && (
                                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-md text-center">
                                        <p className="text-sm text-gray-400">Belum ada PIC dipilih</p>
                                        <p className="text-xs text-gray-400 mt-1">Minimal satu PIC diperlukan untuk event</p>
                                    </div>
                                )}
                                {formData.pics.map(pic => (
                                    <div key={pic.personId} className="bg-white border rounded-lg p-4 space-y-3">
                                        {/* PIC Header */}
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">{pic.person.nama}</span>
                                                        {pic.isPrimary && (
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                                Primary
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">{pic.person.email}</p>
                                                </div>
                                            </div>
                                            <Button 
                                                type="button" 
                                                size="sm" 
                                                variant="ghost" 
                                                onClick={() => removePic(pic.personId)}
                                                className="text-red-500 hover:bg-red-50"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Role & Permissions */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Role</label>
                                                <Select 
                                                    value={availableRoles.find(r => r.name === pic.role)?.id || ''} 
                                                    onValueChange={(value) => updatePicRole(pic.personId, value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Pilih role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {availableRoles.map(role => (
                                                            <SelectItem key={role.id} value={role.id}>
                                                                <div>
                                                                    <div className="font-medium">{role.name}</div>
                                                                    <div className="text-xs text-gray-500">{role.description}</div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Status</label>
                                                <div className="flex items-center space-x-4">
                                                    <label className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            name={`primary-${pic.personId}`}
                                                            checked={pic.isPrimary}
                                                            onChange={() => setPrimaryPic(pic.personId)}
                                                            className="mr-2"
                                                        />
                                                        <span className="text-sm">Primary PIC</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Permissions */}
                                        <div className="pt-2 border-t">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                <label className="flex items-center text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={pic.canEdit}
                                                        onChange={(e) => updatePicPermissions(pic.personId, 'canEdit', e.target.checked)}
                                                        className="mr-2 rounded"
                                                    />
                                                    Dapat Edit
                                                </label>
                                                <label className="flex items-center text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={pic.canDelete}
                                                        onChange={(e) => updatePicPermissions(pic.personId, 'canDelete', e.target.checked)}
                                                        className="mr-2 rounded"
                                                    />
                                                    Dapat Hapus
                                                </label>
                                                <label className="flex items-center text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={pic.canAssignPIC}
                                                        onChange={(e) => updatePicPermissions(pic.personId, 'canAssignPIC', e.target.checked)}
                                                        className="mr-2 rounded"
                                                    />
                                                    Assign PIC
                                                </label>
                                                <label className="flex items-center text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={pic.notifyOnChanges}
                                                        onChange={(e) => updatePicPermissions(pic.personId, 'notifyOnChanges', e.target.checked)}
                                                        className="mr-2 rounded"
                                                    />
                                                    Notif Perubahan
                                                </label>
                                                <label className="flex items-center text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={pic.notifyOnReminders}
                                                        onChange={(e) => updatePicPermissions(pic.personId, 'notifyOnReminders', e.target.checked)}
                                                        className="mr-2 rounded"
                                                    />
                                                    Notif Reminder
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add New PIC */}
                        <div className="space-y-3">
                            <h4 className="font-medium text-gray-700">Tambah PIC</h4>
                            <Input 
                                type="text" 
                                placeholder="Cari nama..." 
                                value={picSearch} 
                                onChange={(e) => setPicSearch(e.target.value)}
                                disabled={isLoadingData}
                            />
                            <div className="p-2 border rounded-md max-h-[200px] overflow-y-auto space-y-1">
                                {isLoadingData ? (
                                    // Skeleton loading for PIC list
                                    <div className="space-y-2">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 rounded">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                                                    <div>
                                                        <div className="h-4 bg-gray-200 animate-pulse rounded w-24 mb-1"></div>
                                                        <div className="h-3 bg-gray-200 animate-pulse rounded w-32"></div>
                                                    </div>
                                                </div>
                                                <div className="w-4 h-4 bg-gray-200 animate-pulse rounded"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : availablePics.length === 0 ? (
                                    <p className="text-center text-sm text-gray-400 p-4">
                                        {picSearch ? 'Tidak ada hasil pencarian' : 'Semua person sudah dipilih sebagai PIC'}
                                    </p>
                                ) : (
                                    availablePics.map(person => (
                                        <div 
                                            key={person.id} 
                                            className="flex items-center justify-between p-3 rounded hover:bg-emerald-50 cursor-pointer transition-colors"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                console.log('PIC item clicked:', person.nama);
                                                addPic(person);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    addPic(person);
                                                }
                                            }}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <Users className="h-4 w-4 text-gray-500" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">{person.nama}</div>
                                                    <div className="text-xs text-gray-500">{person.email}</div>
                                                </div>
                                            </div>
                                            <Plus className="h-4 w-4 text-emerald-500" />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Section>
            
            {/* --- Final Settings & Actions --- */}
            <div className='flex items-center justify-between mt-8 pt-6 border-t'>
                <label className='flex items-center'><input type='checkbox' name='isPublic' checked={formData.isPublic} onChange={handleInputChange} className='rounded' /><span className='ml-2 text-sm'>Event publik (dapat dilihat semua jemaat)</span></label>
                <div className="flex justify-end space-x-4">
                    <Button type='button' onClick={() => router.back()} variant='outline' disabled={isSubmitting}>
                        <X className='h-4 w-4 mr-2' />Batal
                    </Button>
                    <Button type='submit' className="bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
                        <Save className='h-4 w-4 mr-2' />
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Event'}
                    </Button>
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
