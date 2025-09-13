'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Select, { SingleValue, StylesConfig } from 'react-select';
import { Label } from '@/components/ui/label';
import { provinsiService, Provinsi } from '@/lib/provinsi-service';
import { kabupatenApi, Kabupaten } from '@/lib/kabupaten-service';

interface ProvinceDistrictSelectProps {
  selectedProvinceId?: number;
  selectedDistrictId?: number;
  onProvinceChange: (provinceId: number | undefined) => void;
  onDistrictChange: (districtId: number | undefined) => void;
  provinceError?: string;
  districtError?: string;
  disabled?: boolean;
}

interface SelectOption {
  value: number;
  label: string;
}

export function ProvinceDistrictSelect({
  selectedProvinceId,
  selectedDistrictId,
  onProvinceChange,
  onDistrictChange,
  provinceError,
  districtError,
  disabled = false,
}: ProvinceDistrictSelectProps) {
  const [provinces, setProvinces] = useState<Provinsi[]>([]);
  const [districts, setDistricts] = useState<Kabupaten[]>([]);
  const [loading, setLoading] = useState(true);
  const [districtLoading, setDistrictLoading] = useState(false);

  // Convert data to React-Select option format
  const provinceOptions: SelectOption[] = provinces.map((province) => ({
    value: province.id,
    label: province.name,
  }));

  const districtOptions: SelectOption[] = districts.map((district) => ({
    value: district.id,
    label: district.name,
  }));

  // Find selected options
  const selectedProvinceOption = provinceOptions.find(
    (option) => option.value === selectedProvinceId
  ) || null;

  const selectedDistrictOption = districtOptions.find(
    (option) => option.value === selectedDistrictId
  ) || null;

  // Custom styles to match existing Tailwind design
  const getCustomStyles = (hasError: boolean): StylesConfig<SelectOption, false> => ({
    control: (provided, state) => ({
      ...provided,
      minHeight: '40px',
      borderColor: hasError ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
      borderWidth: '1px',
      borderRadius: '0.375rem',
      backgroundColor: '#ffffff',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      '&:hover': {
        borderColor: hasError ? '#ef4444' : '#9ca3af',
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      paddingLeft: '0.75rem',
      paddingRight: '0.75rem',
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      display: 'none',
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingRight: '0.5rem',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '0.875rem',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#111827',
      fontSize: '0.875rem',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.375rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e5e7eb',
      maxHeight: '300px',
      zIndex: 50,
    }),
    menuList: (provided) => ({
      ...provided,
      padding: '0.25rem',
      maxHeight: '250px',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? '#3b82f6'
        : state.isFocused
        ? '#f3f4f6'
        : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#111827',
      fontSize: '0.875rem',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.25rem',
      margin: '0.125rem 0',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6',
      },
    }),
    loadingMessage: (provided) => ({
      ...provided,
      fontSize: '0.875rem',
      color: '#6b7280',
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      fontSize: '0.875rem',
      color: '#6b7280',
    }),
  });

  // Load all provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(true);
        const data = await provinsiService.getAll();
        setProvinces(data);
      } catch (error) {
        console.error('Failed to load provinces:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    const loadDistricts = async (provinceId: number) => {
      try {
        setDistrictLoading(true);
        const data = await kabupatenApi.getByProvinsiId(provinceId);
        setDistricts(data);
      } catch (error) {
        console.error('Failed to load districts:', error);
        setDistricts([]);
      } finally {
        setDistrictLoading(false);
      }
    };

    if (selectedProvinceId) {
      loadDistricts(selectedProvinceId);
    } else {
      setDistricts([]);
    }
  }, [selectedProvinceId]);

  const handleProvinceChange = (selectedOption: SingleValue<SelectOption>) => {
    const provinceId = selectedOption?.value;
    onProvinceChange(provinceId);
    
    // Clear district selection when province changes
    onDistrictChange(undefined);
  };

  const handleDistrictChange = (selectedOption: SingleValue<SelectOption>) => {
    const districtId = selectedOption?.value;
    onDistrictChange(districtId);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Province Select */}
      <div className="space-y-2">
        <Label htmlFor="province">
          Provinsi <span className="text-red-500">*</span>
        </Label>
        <Select<SelectOption>
          inputId="province"
          options={provinceOptions}
          value={selectedProvinceOption}
          onChange={handleProvinceChange}
          placeholder={loading ? 'Memuat provinsi...' : 'Pilih provinsi'}
          isSearchable={true}
          isLoading={loading}
          isDisabled={disabled || loading}
          isClearable={true}
          styles={getCustomStyles(!!provinceError)}
          noOptionsMessage={() => 'Provinsi tidak ditemukan'}
          loadingMessage={() => 'Memuat provinsi...'}
          menuPlacement="auto"
          menuPosition="absolute"
        />
        {provinceError && (
          <p className="text-sm text-red-500">{provinceError}</p>
        )}
      </div>

      {/* District Select */}
      <div className="space-y-2">
        <Label htmlFor="district">
          Kabupaten/Kota <span className="text-red-500">*</span>
        </Label>
        <Select<SelectOption>
          inputId="district"
          options={districtOptions}
          value={selectedDistrictOption}
          onChange={handleDistrictChange}
          placeholder={
            !selectedProvinceId 
              ? 'Pilih provinsi terlebih dahulu' 
              : districtLoading 
              ? 'Memuat kabupaten...' 
              : 'Pilih kabupaten/kota'
          }
          isSearchable={true}
          isLoading={districtLoading}
          isDisabled={disabled || !selectedProvinceId || districtLoading}
          isClearable={true}
          styles={getCustomStyles(!!districtError)}
          noOptionsMessage={() => 'Kabupaten/kota tidak ditemukan'}
          loadingMessage={() => 'Memuat kabupaten...'}
          menuPlacement="auto"
          menuPosition="absolute"
        />
        {districtError && (
          <p className="text-sm text-red-500">{districtError}</p>
        )}
        {!selectedProvinceId && (
          <p className="text-xs text-gray-500">
            Pilih provinsi terlebih dahulu untuk melihat kabupaten/kota.
          </p>
        )}
      </div>
    </div>
  );
}