'use client';

import { useRouter, useParams } from 'next/navigation';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiArrowLeft, FiSave, FiTag } from 'react-icons/fi';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/context/ToastContext';
import { pelayananService, PelayananInfo, UpdatePelayananRequest } from '@/lib/pelayanan-service';
import { departmentService, Department } from '@/lib/department-service';
import Skeleton from '@/components/Skeleton';

const pelayananSchema = z.object({
  pelayanan: z.string().min(1, 'Nama pelayanan harus diisi'),
  description: z.string().optional(),
  department_id: z.string().min(1, 'Departemen harus dipilih'),
});

type PelayananFormData = z.infer<typeof pelayananSchema>;

export default function EditPelayananPage() {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pelayanan, setPelayanan] = useState<PelayananInfo | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PelayananFormData>({
    resolver: zodResolver(pelayananSchema),
    defaultValues: {
      pelayanan: '',
      description: '',
      department_id: '',
    },
  });

  const selectedDepartmentId = watch('department_id');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch departments and pelayanan data in parallel
        const [departmentsData, pelayananData] = await Promise.all([
          departmentService.getAll(),
          pelayananService.getPelayananById(params.id as string)
        ]);

        setDepartments(departmentsData);
        setPelayanan(pelayananData);
        
        // Set form values
        reset({
          pelayanan: pelayananData.pelayanan,
          description: pelayananData.description || '',
          department_id: pelayananData.department.id,
        });
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        const errorMessage = error.response?.data?.message || 'Gagal memuat data pelayanan.';
        setError(errorMessage);
        showToast(errorMessage, 'error');
      } finally {
        setIsLoading(false);
        setIsLoadingDepartments(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id, reset, showToast]);

  const onSubmit = async (data: PelayananFormData) => {
    try {
      setIsSubmitting(true);
      
      const requestData: UpdatePelayananRequest = {
        pelayanan: data.pelayanan,
        description: data.description || '',
        department_id: data.department_id,
      };
      
      const pelayananId = params.id as string;
      await pelayananService.updatePelayanan(pelayananId, requestData);
      showToast('Pelayanan berhasil diperbarui!', 'success');
      router.push('/dashboard/pelayanan/manage');
    } catch (error: any) {
      console.error('Failed to update pelayanan:', error);
      const errorMessage = error.response?.data?.message || 'Gagal memperbarui pelayanan.';
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
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-24 w-full" />
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
            onClick={() => router.push('/dashboard/pelayanan/manage')}
            className="flex items-center gap-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Pelayanan</h1>
            <p className="text-gray-600">Data pelayanan tidak dapat dimuat.</p>
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
          onClick={() => router.push('/dashboard/pelayanan/manage')}
          className="flex items-center gap-2"
        >
          <FiArrowLeft className="w-4 h-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Pelayanan</h1>
          <p className="text-gray-600">
            Perbarui informasi pelayanan {pelayanan?.pelayanan}.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Pelayanan</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pelayanan">
                Nama Pelayanan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="pelayanan"
                {...register('pelayanan')}
                placeholder="Contoh: Tim Penyembah, Tim Usher, Tim Doa"
                className={errors.pelayanan ? 'border-red-500' : ''}
              />
              {errors.pelayanan && (
                <p className="text-sm text-red-500">{errors.pelayanan.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department_id">
                Departemen <span className="text-red-500">*</span>
              </Label>
              {isLoadingDepartments ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedDepartmentId}
                  onValueChange={(value) => setValue('department_id', value)}
                >
                  <SelectTrigger className={errors.department_id ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Pilih departemen">
                      {selectedDepartmentId && (
                        <div className="flex items-center gap-2">
                          <FiTag className="w-4 h-4 text-gray-400" />
                          {departments.find(d => d.id === selectedDepartmentId)?.name}
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        <div className="flex items-center gap-2">
                          <FiTag className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="font-medium">{department.name}</div>
                            {department.description && (
                              <div className="text-xs text-gray-500">{department.description}</div>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {errors.department_id && (
                <p className="text-sm text-red-500">{errors.department_id.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Saat ini: {pelayanan?.department.name}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Masukkan deskripsi pelayanan (opsional)"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
              <p className="text-xs text-gray-500">
                Deskripsi akan membantu dalam memahami tugas dan tanggung jawab pelayanan ini.
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/pelayanan/manage')}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingDepartments}>
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