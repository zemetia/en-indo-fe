'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RiBuilding2Line } from 'react-icons/ri';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Department } from '@/lib/department-service';

const departmentSchema = z.object({
  name: z.string()
    .min(1, 'Nama departemen wajib diisi')
    .min(2, 'Nama departemen minimal 2 karakter')
    .max(100, 'Nama departemen maksimal 100 karakter'),
  description: z.string()
    .min(1, 'Deskripsi departemen wajib diisi')
    .min(10, 'Deskripsi minimal 10 karakter')
    .max(500, 'Deskripsi maksimal 500 karakter'),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

interface DepartmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onSubmit: (data: DepartmentFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function DepartmentFormDialog({
  open,
  onOpenChange,
  department,
  onSubmit,
  isSubmitting,
}: DepartmentFormDialogProps) {
  const isEditing = Boolean(department);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  React.useEffect(() => {
    if (open) {
      if (department) {
        reset({
          name: department.name,
          description: department.description,
        });
      } else {
        reset({
          name: '',
          description: '',
        });
      }
    }
  }, [open, department, reset]);

  const handleFormSubmit = async (data: DepartmentFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RiBuilding2Line className="h-5 w-5 text-indigo-600" />
            {isEditing ? 'Edit Departemen' : 'Tambah Departemen Baru'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Perbarui informasi departemen. PIC departemen akan tetap terjaga.'
              : 'Buat departemen baru. PIC departemen akan dibuat secara otomatis.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nama Departemen <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Contoh: Multimedia, Konseling, Penyambutan"
              className={errors.name ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Deskripsi Departemen <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Jelaskan tanggung jawab dan fungsi departemen ini..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {!isEditing && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="p-1 bg-blue-100 rounded">
                  <RiBuilding2Line className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-1">Catatan Penting:</p>
                  <p className="text-blue-700">
                    Ketika departemen baru dibuat, sistem akan otomatis membuat pelayanan "PIC" 
                    untuk departemen ini yang dapat digunakan untuk menunjuk Person In Charge.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting
                ? isEditing
                  ? 'Memperbarui...'
                  : 'Membuat...'
                : isEditing
                ? 'Perbarui Departemen'
                : 'Buat Departemen'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}