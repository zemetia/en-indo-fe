'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BsPersonCheck,
  BsPersonPlus,
} from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import VisitorCard from '@/components/dashboard/VisitorCard';
import { visitorApi, type Visitor } from '@/lib/visitor-service';
import { getToken } from '@/lib/helper';
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

export default function DataTamuPage() {
  const [visitors, setVisitors] = React.useState<Visitor[] | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [selectedVisitor, setSelectedVisitor] = React.useState<Visitor | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const fetchVisitors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      if (!token) {
        setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
        return;
      }

      const visitorsData = await visitorApi.getAll();
      setVisitors(visitorsData);
      
    } catch (error) {
      console.error('Failed to fetch visitors:', error);
      setError('Gagal memuat data tamu. Silakan coba lagi.');
      if (!visitors) {
        setVisitors([]);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchVisitors();
  }, []);

  const handleDelete = async () => {
    if (!selectedVisitor) return;

    try {
      await visitorApi.delete(selectedVisitor.id);
      setVisitors(
        (prevVisitors) =>
          prevVisitors?.filter((v) => v.id !== selectedVisitor.id) || null
      );
      setShowConfirmation(false);
      setSelectedVisitor(null);
    } catch (error) {
      setError('Gagal menghapus data tamu. Silakan coba lagi nanti.');
      fetchVisitors();
    }
  };

  const filteredVisitors = visitors
    ? visitors.filter((visitor: Visitor) =>
        visitor.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    if (error && !visitors) {
      return (
        <div className='text-center py-10 bg-red-50 rounded-xl border border-red-200'>
          <BsPersonCheck className='w-10 h-10 text-red-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-red-800 mb-2'>Gagal Memuat Data</h3>
          <p className='text-red-600 mb-4'>{error}</p>
          <button
            onClick={fetchVisitors}
            className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
          >
            Coba Lagi
          </button>
        </div>
      );
    }

    if (filteredVisitors.length === 0) {
      return (
        <div className='text-center py-10 bg-gray-50 rounded-xl'>
          <BsPersonCheck className='w-10 h-10 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Tidak ada data tamu
          </h3>
          <p className='text-gray-600 max-w-md mx-auto mb-6'>
            {searchTerm
              ? `Tidak ada hasil yang cocok dengan "${searchTerm}"`
              : 'Belum ada data tamu yang tersedia. Tambahkan data tamu baru untuk melihatnya di sini.'}
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
        {filteredVisitors.map((visitor: Visitor, index: number) => (
          <VisitorCard
            key={visitor.id}
            visitor={visitor}
            index={index}
            onDelete={(visitor) => {
              setSelectedVisitor(visitor);
              setShowConfirmation(true);
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Data Tamu'
        description='Kelola data tamu dan pengunjung gereja'
        actionLabel='Kembali ke Dashboard'
        gradientFrom='from-green-500'
        gradientTo='to-green-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        {error && visitors && (
          <div className='mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <div className='w-2 h-2 bg-yellow-500 rounded-full mr-2'></div>
                <span className='text-sm text-yellow-800'>Data mungkin tidak terbaru. {error}</span>
              </div>
              <button
                onClick={fetchVisitors}
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
              Daftar Tamu
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Kelola dan lihat data tamu gereja
            </p>
          </div>
          <div className='flex space-x-4 w-full md:w-auto'>
            <div className='relative flex-1 md:flex-none'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder='Cari tamu...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent w-full md:w-64'
              />
            </div>
            <Link href='/dashboard/tamu/tambah' className='bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 whitespace-nowrap'>
              <BsPersonPlus className='w-5 h-5' />
              <span>Tambah Tamu</span>
            </Link>
          </div>
        </div>
        {renderContent()}
      </div>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Tamu</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data tamu bernama {selectedVisitor?.name}? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedVisitor(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}