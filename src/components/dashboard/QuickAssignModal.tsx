'use client';

import { motion } from 'framer-motion';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { FiX, FiUser, FiHome, FiAward, FiCheck, FiStar, FiTag, FiCrown } from 'react-icons/fi';
import Select from 'react-select';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import { pelayananService, PelayananInfo } from '@/lib/pelayanan-service';
import { churchService, Church } from '@/lib/church-service';
import { departmentService, Department } from '@/lib/department-service';
import { useServiceQuery, useMutation } from '@/lib/hooks/useApiRequest';
import { useSmartDebounce } from '@/lib/hooks/useSmartDebounce';

interface QuickAssignModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  personId: string;
  personName: string;
  onAssignComplete: () => void;
}

export default function QuickAssignModal({ 
  isOpen, 
  onOpenChange, 
  personId, 
  personName,
  onAssignComplete 
}: QuickAssignModalProps) {
  const { showToast } = useToast();
  const [selectedChurch, setSelectedChurch] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedPelayanan, setSelectedPelayanan] = useState<string>('');
  const [isPIC, setIsPIC] = useState(false);

  // Use new API hooks for data fetching
  const { data: churches, loading: churchesLoading } = useServiceQuery(
    () => churchService.getSimpleList(),
    { 
      enabled: isOpen,
      cacheTTL: 10 * 60 * 1000 // 10 minutes cache
    }
  );

  const { data: departments, loading: departmentsLoading } = useServiceQuery(
    () => departmentService.getAll(),
    { 
      enabled: isOpen,
      cacheTTL: 10 * 60 * 1000 // 10 minutes cache
    }
  );

  const { data: pelayanan, loading: pelayananLoading } = useServiceQuery(
    () => pelayananService.getAllPelayanan(selectedDepartment),
    {
      enabled: isOpen && !!selectedDepartment && !isPIC, // Only fetch pelayanan if not PIC mode
      dependencies: [selectedDepartment, isPIC],
      debounceMs: 300,
      cacheTTL: 5 * 60 * 1000
    }
  );

  // Reset pelayanan selection when department or PIC status changes
  React.useEffect(() => {
    setSelectedPelayanan('');
  }, [selectedDepartment, isPIC]);

  // Use mutation hook for assign operation
  const assignMutation = useMutation(
    (data: { person_id: string; church_id: string; pelayanan_id?: string; department_id?: string; is_pic?: boolean }) => 
      pelayananService.assignPelayanan(data),
    {
      onSuccess: () => {
        const message = isPIC 
          ? `${personName} berhasil ditugaskan sebagai PIC departemen!`
          : `Pelayanan berhasil ditugaskan kepada ${personName}!`;
        showToast(message, 'success');
        onAssignComplete();
        handleClose();
      },
      onError: (error) => {
        console.error('Failed to assign pelayanan:', error);
        showToast('Gagal menugaskan pelayanan. Silakan coba lagi.', 'error');
      }
    }
  );

  const handleAssign = async () => {
    if (!selectedChurch || !selectedDepartment) {
      showToast('Silakan pilih gereja dan departemen.', 'error');
      return;
    }

    if (isPIC) {
      // PIC assignment - assign as PIC of department
      await assignMutation.mutate({
        person_id: personId,
        church_id: selectedChurch,
        department_id: selectedDepartment,
        is_pic: true,
      });
    } else {
      // Regular pelayanan assignment
      if (!selectedPelayanan) {
        showToast('Silakan pilih pelayanan.', 'error');
        return;
      }
      await assignMutation.mutate({
        person_id: personId,
        church_id: selectedChurch,
        pelayanan_id: selectedPelayanan,
      });
    }
  };

  const handleClose = () => {
    setSelectedChurch('');
    setSelectedDepartment('');
    setSelectedPelayanan('');
    setIsPIC(false);
    onOpenChange(false);
  };

  const selectedChurchName = churches?.find(c => c.id === selectedChurch)?.name;
  const selectedDepartmentName = departments?.find(d => d.id === selectedDepartment)?.name;
  const selectedPelayananData = pelayanan?.find(p => p.id === selectedPelayanan);
  
  // Overall loading state
  const isLoading = churchesLoading || departmentsLoading || pelayananLoading;

  // React-Select options with null checks
  const churchOptions = React.useMemo(() => 
    (churches || []).map(church => ({
      value: church.id,
      label: church.name
    })),
    [churches]
  );

  const departmentOptions = React.useMemo(() => 
    (departments || []).map(dept => ({
      value: dept.id,
      label: dept.name
    })),
    [departments]
  );

  const pelayananOptions = React.useMemo(() => 
    (pelayanan || []).map(p => ({
      value: p.id,
      label: p.pelayanan,
    })),
    [pelayanan]
  );

  // React-Select styles
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '40px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      '&:hover': {
        border: '1px solid #6366f1'
      },
      '&:focus-within': {
        border: '1px solid #6366f1',
        boxShadow: '0 0 0 1px #6366f1'
      }
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? '#6366f1' 
        : state.isFocused 
        ? '#f3f4f6' 
        : 'white',
      color: state.isSelected ? 'white' : '#374151'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#374151'
    })
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiAward className="text-indigo-500 w-5 h-5" />
            Assign Pelayanan Cepat
          </DialogTitle>
          <DialogDescription>
            Tugaskan pelayanan kepada <strong>{personName}</strong> dengan cepat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Person Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
              <FiUser className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{personName}</p>
              <p className="text-sm text-gray-500">Person yang akan ditugaskan</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Church Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiHome className="inline w-4 h-4 mr-1" />
                  Pilih Gereja
                </label>
                <Select
                  options={churchOptions}
                  value={churchOptions.find(option => option.value === selectedChurch) || null}
                  onChange={(option) => setSelectedChurch(option?.value || '')}
                  placeholder="Cari dan pilih gereja..."
                  isSearchable
                  styles={selectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              {/* Department Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiTag className="inline w-4 h-4 mr-1" />
                  Pilih Departemen
                </label>
                <Select
                  options={departmentOptions}
                  value={departmentOptions.find(option => option.value === selectedDepartment) || null}
                  onChange={(option) => {
                    setSelectedDepartment(option?.value || '');
                    setSelectedPelayanan(''); // Reset pelayanan when department changes
                  }}
                  placeholder="Cari dan pilih departemen..."
                  isSearchable
                  styles={selectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>

              {/* PIC Toggle */}
              {selectedDepartment && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode Penugasan
                  </label>
                  <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg">
                    <input
                      type="checkbox"
                      id="isPIC"
                      checked={isPIC}
                      onChange={(e) => setIsPIC(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="isPIC" className="text-sm font-medium text-gray-700 flex items-center">
                      <FiCrown className="inline w-4 h-4 mr-1 text-yellow-600" />
                      Jadikan PIC Departemen (akan otomatis membuat pelayanan PIC)
                    </label>
                  </div>
                </div>
              )}

              {/* Pelayanan Selection - only show if department is selected and NOT PIC mode */}
              {selectedDepartment && !isPIC && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiAward className="inline w-4 h-4 mr-1" />
                    Pilih Pelayanan
                  </label>
                  <Select
                    options={pelayananOptions}
                    value={pelayananOptions.find(option => option.value === selectedPelayanan) || null}
                    onChange={(option) => setSelectedPelayanan(option?.value || '')}
                    placeholder="Cari dan pilih pelayanan..."
                    isSearchable
                    styles={selectStyles}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isDisabled={(pelayanan || []).length === 0}
                  />
                  {(pelayanan || []).length === 0 && selectedDepartment && (
                    <p className="text-sm text-gray-500 mt-1">
                      Tidak ada pelayanan tersedia untuk departemen ini.
                    </p>
                  )}
                </div>
              )}

              {/* Preview */}
              {selectedChurch && selectedDepartment && (isPIC || selectedPelayanan) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
                >
                  <p className="text-sm font-medium text-indigo-800 mb-2">Preview Penugasan:</p>
                  <div className="space-y-1 text-sm text-indigo-700">
                    <p><strong>Person:</strong> {personName}</p>
                    <p><strong>Gereja:</strong> {selectedChurchName}</p>
                    <p><strong>Departemen:</strong> {selectedDepartmentName}</p>
                    {isPIC ? (
                      <p><strong>Role:</strong> <span className="inline-flex items-center"><FiCrown className="w-4 h-4 mr-1 text-yellow-600" />PIC Departemen (otomatis membuat pelayanan PIC)</span></p>
                    ) : (
                      <p><strong>Pelayanan:</strong> {selectedPelayananData?.pelayanan}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={assignMutation.loading}
          >
            <FiX className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button
            onClick={handleAssign}
            disabled={!selectedChurch || !selectedDepartment || (!isPIC && !selectedPelayanan) || assignMutation.loading || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {assignMutation.loading ? (
              <>
                <div className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <FiCheck className="mr-2 h-4 w-4" />
                Assign Pelayanan
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}