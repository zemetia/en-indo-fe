'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiTag } from 'react-icons/fi';

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
import { Switch } from '@/components/ui/switch';
import { EventType } from '@/lib/event-type-service';

// Predefined color palette for easy selection
const COLOR_PALETTE = [
  { name: 'Blue', hex: '#2980b9' },
  { name: 'Red', hex: '#e74c3c' },
  { name: 'Green', hex: '#27ae60' },
  { name: 'Orange', hex: '#e67e22' },
  { name: 'Purple', hex: '#8e44ad' },
  { name: 'Teal', hex: '#16a085' },
  { name: 'Pink', hex: '#e91e63' },
  { name: 'Indigo', hex: '#3f51b5' },
  { name: 'Amber', hex: '#ff9800' },
  { name: 'Cyan', hex: '#00bcd4' },
  { name: 'Lime', hex: '#cddc39' },
  { name: 'Brown', hex: '#795548' },
];

const eventTypeSchema = z.object({
  display_name: z.string()
    .min(1, 'Display name wajib diisi')
    .min(2, 'Display name minimal 2 karakter')
    .max(100, 'Display name maksimal 100 karakter'),
  description: z.string()
    .max(500, 'Deskripsi maksimal 500 karakter')
    .optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color harus dalam format hex (contoh: #2980b9)')
    .optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().int().min(0).optional(),
});

type EventTypeFormData = z.infer<typeof eventTypeSchema>;

interface EventTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventType: EventType | null;
  onSubmit: (data: EventTypeFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function EventTypeFormDialog({
  open,
  onOpenChange,
  eventType,
  onSubmit,
  isSubmitting,
}: EventTypeFormDialogProps) {
  const isEditing = Boolean(eventType);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EventTypeFormData>({
    resolver: zodResolver(eventTypeSchema),
    defaultValues: {
      display_name: '',
      description: '',
      color: '#2980b9',
      is_active: true,
      sort_order: 0,
    },
  });

  const isActive = watch('is_active');
  const colorValue = watch('color');

  React.useEffect(() => {
    if (open) {
      if (eventType) {
        reset({
          display_name: eventType.display_name,
          description: eventType.description || '',
          color: eventType.color || '#2980b9',
          is_active: eventType.is_active,
          sort_order: eventType.sort_order || 0,
        });
      } else {
        reset({
          display_name: '',
          description: '',
          color: '#2980b9',
          is_active: true,
          sort_order: 0,
        });
      }
    }
  }, [open, eventType, reset]);

  const handleFormSubmit = async (data: EventTypeFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiTag className="h-5 w-5 text-blue-600" />
            {isEditing ? 'Edit Event Type' : 'Tambah Event Type Baru'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Perbarui informasi event type. Perubahan akan mempengaruhi event yang menggunakan type ini.'
              : 'Buat event type baru untuk mengkategorikan event dalam sistem.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name" className="text-sm font-medium text-gray-700">
              Nama Event Type <span className="text-red-500">*</span>
            </Label>
            <Input
              id="display_name"
              {...register('display_name')}
              placeholder="Event, Ibadah, Spiritual Journey"
              className={errors.display_name ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500">
              Nama event type yang ditampilkan di UI (internal name akan otomatis dibuat).
            </p>
            {errors.display_name && (
              <p className="text-sm text-red-600">{errors.display_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Jelaskan tujuan dan penggunaan event type ini..."
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Warna
            </Label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => setValue('color', color.hex)}
                  className={`h-10 rounded-lg border-2 transition-all ${
                    colorValue === color.hex
                      ? 'border-gray-900 ring-2 ring-gray-400'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  disabled={isSubmitting}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-8 h-8 rounded border-2 border-gray-300"
                style={{ backgroundColor: colorValue || '#2980b9' }}
              />
              <span className="text-sm text-gray-600">
                Warna terpilih: {colorValue || '#2980b9'}
              </span>
            </div>
            {errors.color && (
              <p className="text-sm text-red-600">{errors.color.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sort_order" className="text-sm font-medium text-gray-700">
                Sort Order
              </Label>
              <Input
                id="sort_order"
                type="number"
                {...register('sort_order', { valueAsNumber: true })}
                placeholder="0"
                className={errors.sort_order ? 'border-red-500' : ''}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                Urutan tampilan (lebih kecil = lebih awal)
              </p>
              {errors.sort_order && (
                <p className="text-sm text-red-600">{errors.sort_order.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <div className="flex items-center space-x-2 h-10">
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={(checked) => setValue('is_active', checked)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="is_active" className="text-sm font-normal cursor-pointer">
                  {isActive ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>
          </div>

          {!isEditing && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="p-1 bg-blue-100 rounded">
                  <FiTag className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-blue-800 mb-1">Catatan Penting:</p>
                  <p className="text-blue-700">
                    Event type digunakan untuk mengkategorikan event. Internal name akan otomatis dibuat dari nama yang Anda masukkan.
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting
                ? isEditing
                  ? 'Memperbarui...'
                  : 'Membuat...'
                : isEditing
                ? 'Perbarui Event Type'
                : 'Buat Event Type'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
