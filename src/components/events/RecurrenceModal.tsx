'use client';

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Users, Repeat } from 'lucide-react';

export type RecurrenceUpdateType = 'single' | 'all' | 'future';

interface RecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (updateType: RecurrenceUpdateType) => void;
  eventTitle: string;
  occurrenceDate?: string;
  action: 'edit' | 'delete';
}

export default function RecurrenceModal({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
  occurrenceDate,
  action = 'edit'
}: RecurrenceModalProps) {
  const [updateType, setUpdateType] = useState<RecurrenceUpdateType>('single');

  const handleConfirm = () => {
    onConfirm(updateType);
    onClose();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getActionText = () => {
    return action === 'edit' ? 'mengubah' : 'menghapus';
  };

  const getActionTitle = () => {
    return action === 'edit' ? 'Ubah Event Berulang' : 'Hapus Event Berulang';
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-blue-100">
              <Repeat className="h-5 w-5 text-blue-600" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold">
              {getActionTitle()}
            </AlertDialogTitle>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-sm text-gray-700">
                {eventTitle}
              </span>
            </div>
            {occurrenceDate && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{formatDate(occurrenceDate)}</span>
              </div>
            )}
          </div>

          <AlertDialogDescription className="text-sm text-gray-600 mb-4">
            Event ini adalah bagian dari serie berulang. Anda ingin {getActionText()} yang mana?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <RadioGroup value={updateType} onValueChange={(value) => setUpdateType(value as RecurrenceUpdateType)}>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="single" id="single" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="single" className="font-medium text-sm cursor-pointer">
                    Hanya event ini
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    {action === 'edit' 
                      ? 'Ubah hanya event pada tanggal ini, event lainnya tetap sama'
                      : 'Hapus hanya event pada tanggal ini'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="all" id="all" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="all" className="font-medium text-sm cursor-pointer">
                    Seluruh serie event
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    {action === 'edit'
                      ? 'Ubah semua event dalam serie ini (masa lalu dan masa depan)'
                      : 'Hapus seluruh serie event ini'
                    }
                  </p>
                </div>
              </div>

              {action === 'edit' && (
                <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="future" id="future" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="future" className="font-medium text-sm cursor-pointer">
                      Event ini dan selanjutnya
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Ubah event ini dan semua event berikutnya, event sebelumnya tetap sama
                    </p>
                  </div>
                </div>
              )}

              {action === 'delete' && (
                <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="future" id="future" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="future" className="font-medium text-sm cursor-pointer">
                      Event ini dan selanjutnya
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Hapus event ini dan semua event berikutnya
                    </p>
                  </div>
                </div>
              )}
            </div>
          </RadioGroup>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel onClick={onClose}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
            {action === 'edit' ? 'Ubah Event' : 'Hapus Event'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}