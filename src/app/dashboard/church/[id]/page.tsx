'use client';

import { useRouter, useParams } from 'next/navigation';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ProvinceDistrictSelect } from '@/components/ui/province-district-select';
import { useToast } from '@/context/ToastContext';
import { churchService, Church, ChurchRequest } from '@/lib/church-service';
import Skeleton from '@/components/Skeleton';

const churchSchema = z.object({
  name: z.string().min(1, 'Nama gereja harus diisi'),
  address: z.string().min(1, 'Alamat harus diisi'),
  church_code: z.string().min(1, 'Kode gereja harus diisi').max(10, 'Kode gereja maksimal 10 karakter'),
  phone: z.string().optional(),
  email: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  website: z.string().url('Format URL tidak valid').optional().or(z.literal('')),
  latitude: z.number().min(-90, 'Latitude tidak valid').max(90, 'Latitude tidak valid').optional(),
  longitude: z.number().min(-180, 'Longitude tidak valid').max(180, 'Longitude tidak valid').optional(),
  provinsi_id: z.number().min(1, 'Provinsi harus dipilih'),
  kabupaten_id: z.number().min(1, 'Kabupaten harus dipilih'),
});

type ChurchFormData = z.infer<typeof churchSchema>;

export default function EditChurchPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [church, setChurch] = useState<Church | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<ChurchFormData>({
    resolver: zodResolver(churchSchema),
    defaultValues: {
      name: '',
      address: '',
      church_code: '',
      phone: '',
      email: '',
      website: '',
      latitude: undefined,
      longitude: undefined,
      provinsi_id: 0,
      kabupaten_id: 0,
    },
  });

  useEffect(() => {
    const fetchChurch = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const churchId = params.id as string;
        const churchData = await churchService.getById(churchId);
        setChurch(churchData);
        
        // Set form values
        reset({
          name: churchData.name,
          address: churchData.address,
          church_code: churchData.church_code,
          phone: churchData.phone || '',
          email: churchData.email || '',
          website: churchData.website || '',
          latitude: churchData.latitude || undefined,
          longitude: churchData.longitude || undefined,
          provinsi_id: churchData.provinsi_id,
          kabupaten_id: churchData.kabupaten_id,
        });
      } catch (error: any) {
        console.error('Failed to fetch church:', error);
        const errorMessage = error.response?.data?.message || 'Gagal memuat data gereja.';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchChurch();
    }
  }, [params.id, reset, showToast]);

  const onSubmit = async (data: ChurchFormData) => {
    try {
      setIsSubmitting(true);
      
      const requestData: ChurchRequest = {
        name: data.name,
        address: data.address,
        church_code: data.church_code,
        kabupaten_id: data.kabupaten_id,
        ...(data.phone && { phone: data.phone }),
        ...(data.email && { email: data.email }),
        ...(data.website && { website: data.website }),
        ...(data.latitude && { latitude: data.latitude }),
        ...(data.longitude && { longitude: data.longitude }),
      };
      
      const churchId = params.id as string;
      await churchService.update(churchId, requestData);
      showToast('Gereja berhasil diperbarui!', 'success');
      router.push('/dashboard/church');
    } catch (error: any) {
      console.error('Failed to update church:', error);
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui gereja.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" disabled>
            <FiArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/church')}
            className="flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Gereja</h1>
            <p className="text-gray-600">Data gereja tidak dapat dimuat.</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-16 text-red-500 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-semibold text-red-800">Terjadi Kesalahan</h3>
              <p>{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Muat Ulang
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard/church')}
          className="flex items-center gap-2"
        >
          <FiArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Gereja</h1>
          <p className="text-gray-600">
            Perbarui informasi gereja {church?.name}.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Gereja</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Nama Gereja <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Masukkan nama gereja"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="church_code">
                  Kode Gereja <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="church_code"
                  {...register('church_code')}
                  placeholder="Contoh: ENST"
                  className={errors.church_code ? 'border-red-500' : ''}
                  maxLength={10}
                />
                {errors.church_code && (
                  <p className="text-sm text-red-500">{errors.church_code.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Kode unik gereja, maksimal 10 karakter (contoh: "ENST" untuk Every Nation Surabaya Timur).
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Alamat <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                {...register('address')}
                placeholder="Masukkan alamat lengkap gereja"
                rows={3}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <ProvinceDistrictSelect
              selectedProvinceId={watch('provinsi_id') || undefined}
              selectedDistrictId={watch('kabupaten_id') || undefined}
              onProvinceChange={(provinceId) => setValue('provinsi_id', provinceId || 0)}
              onDistrictChange={(districtId) => setValue('kabupaten_id', districtId || 0)}
              provinceError={errors.provinsi_id?.message}
              districtError={errors.kabupaten_id?.message}
              disabled={isSubmitting}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  {...register('latitude', { valueAsNumber: true })}
                  placeholder="Contoh: -6.2088"
                  className={errors.latitude ? 'border-red-500' : ''}
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500">{errors.latitude.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Koordinat latitude dari Google Maps (opsional).
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  {...register('longitude', { valueAsNumber: true })}
                  placeholder="Contoh: 106.8456"
                  className={errors.longitude ? 'border-red-500' : ''}
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500">{errors.longitude.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Koordinat longitude dari Google Maps (opsional).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Masukkan nomor telepon"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="Masukkan alamat email"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                {...register('website')}
                placeholder="https://example.com"
                className={errors.website ? 'border-red-500' : ''}
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/church')}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <FiSave className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}