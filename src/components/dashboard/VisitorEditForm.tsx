'use client';

import * as React from 'react';
import { FiSave, FiX } from 'react-icons/fi';

import { visitorApi, type Visitor, type VisitorRequest, type VisitorFormData } from '@/lib/visitor-service';
import { getToken } from '@/lib/helper';
import { ProvinceDistrictSelect } from '@/components/ui/province-district-select';

interface VisitorEditFormProps {
  visitor: Visitor;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function VisitorEditForm({ visitor, onSuccess, onCancel }: VisitorEditFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [formData, setFormData] = React.useState<VisitorFormData>({
    name: visitor.name,
    ig_username: visitor.ig_username || '',
    phone_number: visitor.phone_number || '',
    kabupaten_id: visitor.kabupaten_id || undefined,
    provinsi_id: visitor.provinsi_id || undefined,
  });


  const handleInputChange = (field: keyof VisitorFormData, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Nama tamu harus diisi.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
        return;
      }

      // Clean up empty strings to undefined for nullable fields
      const cleanedData: VisitorRequest = {
        name: formData.name.trim(),
        ig_username: formData.ig_username?.trim() || undefined,
        phone_number: formData.phone_number?.trim() || undefined,
        kabupaten_id: formData.kabupaten_id || undefined,
      };

      await visitorApi.update(visitor.id, cleanedData);
      onSuccess();
    } catch (error) {
      console.error('Failed to update visitor:', error);
      setError('Gagal mengupdate data tamu. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {error && (
        <div className='p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-red-700 text-sm'>{error}</p>
        </div>
      )}

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Nama Lengkap *
        </label>
        <input
          type='text'
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder='Masukkan nama lengkap tamu'
          className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Username Instagram
        </label>
        <input
          type='text'
          value={formData.ig_username || ''}
          onChange={(e) => handleInputChange('ig_username', e.target.value)}
          placeholder='Contoh: john_doe'
          className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
          disabled={loading}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Nomor WhatsApp
        </label>
        <input
          type='text'
          value={formData.phone_number || ''}
          onChange={(e) => handleInputChange('phone_number', e.target.value)}
          placeholder='Contoh: 081234567890'
          className='w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
          disabled={loading}
        />
      </div>

      <div>
        <ProvinceDistrictSelect
          selectedProvinceId={formData.provinsi_id}
          selectedDistrictId={formData.kabupaten_id}
          onProvinceChange={(provinceId) => handleInputChange('provinsi_id', provinceId)}
          onDistrictChange={(districtId) => handleInputChange('kabupaten_id', districtId)}
          disabled={loading}
        />
      </div>

      <div className='flex justify-end space-x-3 pt-4'>
        <button
          type='button'
          onClick={onCancel}
          className='px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2'
          disabled={loading}
        >
          <FiX className='w-4 h-4' />
          <span>Batal</span>
        </button>
        <button
          type='submit'
          className='px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
          disabled={loading || !formData.name.trim()}
        >
          {loading ? (
            <>
              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <FiSave className='w-4 h-4' />
              <span>Simpan</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}