'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BsPeople,
  BsPersonPlus,
  BsGeoAlt,
} from 'react-icons/bs';
import { FiEdit2, FiSearch, FiTrash2, FiMail, FiPhone, FiMoreVertical } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getToken } from '@/lib/helper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';


interface Jemaat {
  id: string;
  nama: string;
  gender: string;
  alamat: string;
  church: string;
  tanggal_lahir: string;
  email: string;
  nomor_telepon: string;
  is_aktif: boolean;
}

export default function DataJemaatPage() {
  const [jemaat, setJemaat] = React.useState<Array<Jemaat> | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [selectedJemaat, setSelectedJemaat] = React.useState<Jemaat | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const fetchJemaat = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();

      if (!token) {
        setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/person?all=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle different response formats gracefully
      let jemaatData: Jemaat[] = [];
      if (response.data && Array.isArray(response.data)) {
        jemaatData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        jemaatData = response.data.data;
      } else {
        console.warn('Unexpected response format:', response.data);
        jemaatData = [];
      }

      setJemaat(jemaatData);
      
    } catch (error) {
      console.error('Failed to fetch jemaat:', error);
      setError('Gagal memuat data jemaat. Silakan coba lagi.');
      // Don't clear existing data on error
      if (!jemaat) {
        setJemaat([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load data once on mount
  useEffect(() => {
    fetchJemaat();
  }, []);

  const handleToggleStatus = async () => {
    if (!selectedJemaat) return;

    try {
      const token = getToken();
      if (!token) {
        setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/person/nonaktif`,
        { id: selectedJemaat.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJemaat(
        (prevJemaat) =>
          prevJemaat?.map((j) =>
            j.id === selectedJemaat.id ? { ...j, is_aktif: !j.is_aktif } : j
          ) || null
      );

      setShowConfirmation(false);
      setSelectedJemaat(null);
    } catch (error) {
      setError('Gagal mengubah status jemaat. Silakan coba lagi nanti.');
      fetchJemaat();
    }
  };

  const filteredJemaat = jemaat
    ? jemaat.filter((item: Jemaat) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex justify-center items-center py-10'>
          <div className='w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      );
    }

    if (error && !jemaat) {
      return (
        <div className='text-center py-10 bg-red-50 rounded-xl border border-red-200'>
          <BsPeople className='w-10 h-10 text-red-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-red-800 mb-2'>Gagal Memuat Data</h3>
          <p className='text-red-600 mb-4'>{error}</p>
          <button
            onClick={fetchJemaat}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    if (filteredJemaat.length === 0) {
      return (
        <div className='text-center py-10 bg-gray-50 rounded-xl'>
          <BsPeople className='w-10 h-10 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Tidak ada data jemaat
          </h3>
          <p className='text-gray-600 max-w-md mx-auto mb-6'>
            {searchTerm
              ? `Tidak ada hasil yang cocok dengan "${searchTerm}"`
              : 'Belum ada data jemaat yang tersedia. Tambahkan data jemaat baru untuk melihatnya di sini.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='px-4 py-2 bg-gray-200 rounded-lg text-gray-800 hover:bg-gray-300 transition-colors'
            >
              Hapus Pencarian
            </button>
          )}
        </div>
      );
    }

    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredJemaat.map((item: Jemaat, index: number) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
            className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col'
          >
            <div 
              className='p-6 cursor-pointer flex-grow'
              onClick={() => router.push(`/dashboard/jemaat/${item.id}`)}
            >
              <div className='flex items-start justify-between'>
                <div className='flex items-center space-x-4 min-w-0'>
                    <div className={`w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 ring-4 ${item.is_aktif ? 'ring-green-300' : 'ring-red-300'}`}>
                        <BsPeople className='w-6 h-6 text-blue-600'/>
                    </div>
                    <div className='min-w-0'>
                        <h3 className='text-lg font-semibold text-gray-900 truncate'>
                            {item.nama}
                        </h3>
                        <p className='text-sm text-gray-500 truncate'>{item.church}</p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            onClick={(e) => e.stopPropagation()}
                            className='p-2 -mr-2 -mt-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors'
                            aria-label="Actions"
                        >
                            <FiMoreVertical className='w-4 h-4' />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent onClick={(e) => e.stopPropagation()} align="end">
                        <DropdownMenuItem onSelect={() => router.push(`/dashboard/jemaat/edit/${item.id}`)}>
                            <FiEdit2 className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            onSelect={() => {
                                setSelectedJemaat(item);
                                setShowConfirmation(true);
                            }}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50">
                            <FiTrash2 className="mr-2 h-4 w-4" />
                            <span>{item.is_aktif ? 'Nonaktifkan' : 'Aktifkan'}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className='mt-4 pt-4 border-t border-gray-100 space-y-2'>
                <div className='flex items-center text-sm text-gray-600'>
                    <FiMail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className='truncate'>{item.email || '-'}</span>
                </div>
                <div className='flex items-center text-sm text-gray-600'>
                    <FiPhone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className='truncate'>{item.nomor_telepon || '-'}</span>
                </div>
                <div className='flex items-center text-sm text-gray-600'>
                    <BsGeoAlt className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                    <span className='truncate'>{item.alamat || '-'}</span>
                </div>
              </div>
            </div>
            
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Data Jemaat'
        description='Kelola data jemaat gereja'
        actionLabel='Kembali ke Dashboard'
        gradientFrom='from-blue-500'
        gradientTo='to-blue-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        {error && jemaat && (
          <div className='mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='w-2 h-2 bg-yellow-500 rounded-full mr-2'></div>
                <span className='text-sm text-yellow-800'>Data mungkin tidak terbaru. {error}</span>
              </div>
              <button
                onClick={fetchJemaat}
                className='text-sm text-yellow-700 hover:text-yellow-900 underline'
              >
                Muat Ulang
              </button>
            </div>
          </div>
        )}
        
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Daftar Jemaat
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Kelola dan lihat data jemaat gereja
            </p>
          </div>
          <div className='flex space-x-4 w-full md:w-auto'>
            <div className='relative flex-1 md:flex-none'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Cari jemaat...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64'
              />
            </div>
            <Link href='/dashboard/jemaat/tambah' className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 whitespace-nowrap'>
              <BsPersonPlus className='w-5 h-5' />
              <span>Tambah Jemaat</span>
            </Link>
          </div>
        </div>
        {renderContent()}
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi {selectedJemaat?.is_aktif ? 'Nonaktifkan' : 'Aktifkan'}{' '} Jemaat</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin {selectedJemaat?.is_aktif ? 'menonaktifkan' : 'mengaktifkan'} jemaat bernama {selectedJemaat?.nama}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedJemaat(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className="bg-red-600 hover:bg-red-700"
            >
              Yakin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
