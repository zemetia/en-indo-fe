'use client';

import { useRouter } from 'next/navigation';
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
import { pelayananService, PelayananRequest } from '@/lib/pelayanan-service';
import { departmentService, Department } from '@/lib/department-service';
import Skeleton from '@/components/Skeleton';

const pelayananSchema = z.object({
  pelayanan: z.string().min(1, 'Nama pelayanan harus diisi'),
  description: z.string().optional(),
  department_id: z.string().min(1, 'Departemen harus dipilih'),
});

type PelayananFormData = z.infer<typeof pelayananSchema>;

export default function TambahPelayananPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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
    const fetchDepartments = async () => {
      try {
        setIsLoadingDepartments(true);
        const data = await departmentService.getAll();
        setDepartments(data);
      } catch (error) {
        console.error('Failed to fetch departments:', error);
        showToast('Gagal memuat data departemen.', 'error');
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, [showToast]);

  const onSubmit = async (data: PelayananFormData) => {
    try {
      setIsSubmitting(true);
      
      const requestData: PelayananRequest = {
        pelayanan: data.pelayanan,
        description: data.description || '',
        department_id: data.department_id,
      };
      
      await pelayananService.createPelayanan(requestData);
      showToast('Pelayanan berhasil ditambahkan!', 'success');
      router.push('/dashboard/pelayanan/manage');
    } catch (error: any) {
      console.error('Failed to create pelayanan:', error);
      const errorMessage = error.response?.data?.message || 'Gagal menambahkan pelayanan.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Tambah Pelayanan Baru</h1>
          <p className="text-gray-600">Tambahkan jenis pelayanan baru ke dalam sistem.</p>
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
                {isSubmitting ? 'Menyimpan...' : 'Simpan Pelayanan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}