'use client';

import { useState, useEffect } from 'react';
import Select, { MultiValue, ActionMeta } from 'react-select';
import { Church, churchService } from '@/lib/church-service';

export interface ChurchOption {
  value: string;
  label: string;
  church: Church;
}

interface ChurchMultiSelectProps {
  value?: string[];
  onChange: (churchIds: string[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  name?: string;
}

export default function ChurchMultiSelect({
  value = [],
  onChange,
  placeholder = "Pilih gereja penyelenggara...",
  isDisabled = false,
  className = "",
  name
}: ChurchMultiSelectProps) {
  const [churches, setChurches] = useState<Church[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch churches on component mount
  useEffect(() => {
    const fetchChurches = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const churchList = await churchService.getSimpleList();
        setChurches(churchList);
      } catch (error) {
        console.error('Failed to fetch churches:', error);
        setError('Gagal memuat daftar gereja');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChurches();
  }, []);

  // Convert churches to options for react-select
  const options: ChurchOption[] = churches.map(church => ({
    value: church.id,
    label: `${church.name} (${church.church_code || 'N/A'})`,
    church
  }));

  // Get selected options based on current value
  const selectedOptions = options.filter(option => 
    value.includes(option.value)
  );

  // Handle selection change
  const handleChange = (
    newValue: MultiValue<ChurchOption>,
    actionMeta: ActionMeta<ChurchOption>
  ) => {
    const selectedIds = newValue.map(option => option.value);
    onChange(selectedIds);
  };

  // Custom styles for react-select to match Tailwind design
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      borderRadius: '0.375rem',
      borderWidth: '1px',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#9ca3af',
      },
      minHeight: '2.5rem',
      padding: '0 0.5rem',
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: '#f3f4f6',
      borderRadius: '0.25rem',
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: '#374151',
      fontSize: '0.875rem',
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        backgroundColor: '#ef4444',
        color: 'white',
      },
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
        ? '#f3f4f6' 
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      padding: '0.5rem 0.75rem',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6',
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '0.875rem',
    }),
    loadingMessage: (provided: any) => ({
      ...provided,
      color: '#6b7280',
      fontSize: '0.875rem',
    }),
    noOptionsMessage: (provided: any) => ({
      ...provided,
      color: '#6b7280',
      fontSize: '0.875rem',
    }),
  };

  if (error) {
    return (
      <div className={`border border-red-300 bg-red-50 text-red-700 px-3 py-2 rounded-md text-sm ${className}`}>
        {error}
      </div>
    );
  }

  return (
    <div className={className}>
      <Select<ChurchOption, true>
        isMulti
        isSearchable
        isLoading={isLoading}
        isDisabled={isDisabled}
        options={options}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={placeholder}
        loadingMessage={() => "Memuat gereja..."}
        noOptionsMessage={() => "Tidak ada gereja ditemukan"}
        styles={customStyles}
        className="react-select-container"
        classNamePrefix="react-select"
        name={name}
        filterOption={(option, inputValue) => {
          const church = option.data.church;
          const searchText = inputValue.toLowerCase();
          
          return (
            church.name.toLowerCase().includes(searchText) ||
            church.church_code?.toLowerCase().includes(searchText) ||
            church.address.toLowerCase().includes(searchText) ||
            church.kabupaten?.toLowerCase().includes(searchText) ||
            church.provinsi?.toLowerCase().includes(searchText)
          );
        }}
        formatOptionLabel={(option, { context }) => (
          <div className="flex flex-col">
            <div className="font-medium text-sm">
              {option.church.name}
            </div>
            <div className="text-xs text-gray-500">
              {option.church.church_code} • {option.church.kabupaten}, {option.church.provinsi}
            </div>
          </div>
        )}
      />
    </div>
  );
}