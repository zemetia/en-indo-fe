'use client';

import * as React from 'react';
import { useState } from 'react';
import { FiTrash2, FiAlertTriangle, FiX } from 'react-icons/fi';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Department } from '@/lib/department-service';

interface DeleteDepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export default function DeleteDepartmentModal({
  open,
  onOpenChange,
  department,
  onConfirm,
  isDeleting,
}: DeleteDepartmentModalProps) {
  const [confirmationText, setConfirmationText] = useState('');
  
  const expectedText = department ? `hapus ${department.name}` : '';
  const isConfirmationValid = confirmationText === expectedText;

  React.useEffect(() => {
    if (open) {
      setConfirmationText('');
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!isConfirmationValid) return;
    
    try {
      await onConfirm();
      setConfirmationText('');
    } catch (error) {
      // Error handling is done by parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <FiTrash2 className="h-5 w-5" />
            Konfirmasi Hapus Departemen
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Tindakan ini akan menghapus departemen secara permanen dan tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        {department && (
          <div className="space-y-4">
            {/* Warning Alert */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-start gap-3">
                <FiAlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-800 mb-2">Peringatan Penting:</p>
                  <ul className="text-red-700 space-y-1 list-disc list-inside">
                    <li>Departemen <strong>"{department.name}"</strong> akan dihapus secara permanen</li>
                    <li>Semua pelayanan yang terkait dengan departemen ini akan terpengaruh</li>
                    <li>Data PIC departemen akan ikut terhapus</li>
                    <li>Tindakan ini tidak dapat dibatalkan</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Department Info */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">Detail Departemen:</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Nama:</span> {department.name}</p>
                <p><span className="font-medium">Deskripsi:</span> {department.description}</p>
                <p><span className="font-medium">Dibuat:</span> {new Date(department.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2">
              <Label htmlFor="confirmation" className="text-sm font-medium text-gray-700">
                Untuk konfirmasi, ketik: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-red-600">{expectedText}</span>
              </Label>
              <Input
                id="confirmation"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder={`Ketik "${expectedText}" untuk konfirmasi`}
                className={`${
                  confirmationText && !isConfirmationValid 
                    ? 'border-red-500 focus:ring-red-500' 
                    : confirmationText && isConfirmationValid 
                    ? 'border-green-500 focus:ring-green-500' 
                    : ''
                }`}
                disabled={isDeleting}
                autoComplete="off"
              />
              {confirmationText && !isConfirmationValid && (
                <p className="text-sm text-red-600">
                  Teks konfirmasi tidak sesuai. Harap ketik persis seperti yang diminta.
                </p>
              )}
              {confirmationText && isConfirmationValid && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  ✓ Konfirmasi berhasil
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isDeleting}
                className="flex items-center gap-2"
              >
                <FiX className="h-4 w-4" />
                Batal
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!isConfirmationValid || isDeleting}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                <FiTrash2 className="h-4 w-4" />
                {isDeleting ? 'Menghapus...' : 'Hapus Departemen'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}