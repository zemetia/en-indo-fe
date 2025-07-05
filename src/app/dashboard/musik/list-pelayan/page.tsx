'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { FiEdit2, FiMusic, FiPlus, FiSearch, FiTrash2, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import Image from 'next/image';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getToken } from '@/lib/helper';

interface Musician {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  instruments: string[];
  status: 'active' | 'inactive';
  avatar: string; // Added for better UI
}

// MOCK DATA for demonstration
const MOCK_MUSICIANS: Musician[] = [
    { id: 'm1', nama: 'Andi Suryo', email: 'andi@example.com', telepon: '081234567890', instruments: ['Gitar Akustik', 'Vokal'], status: 'active', avatar: 'https://placehold.co/100x100.png' },
    { id: 'm2', nama: 'Budi Santoso', email: 'budi@example.com', telepon: '081234567891', instruments: ['Keyboard', 'Piano'], status: 'active', avatar: 'https://placehold.co/100x100.png' },
    { id: 'm3', nama: 'Citra Lestari', email: 'citra@example.com', telepon: '081234567892', instruments: ['Vokal', 'Worship Leader'], status: 'active', avatar: 'https://placehold.co/100x100.png' },
    { id: 'm4', nama: 'Dewi Anggraini', email: 'dewi@example.com', telepon: '081234567893', instruments: ['Bass'], status: 'inactive', avatar: 'https://placehold.co/100x100.png' },
    { id: 'm5', nama: 'Eko Prasetyo', email: 'eko@example.com', telepon: '081234567894', instruments: ['Drum'], status: 'active', avatar: 'https://placehold.co/100x100.png' },
    { id: 'm6', nama: 'Fitri Handayani', email: 'fitri@example.com', telepon: '081234567895', instruments: ['Biola'], status: 'active', avatar: 'https://placehold.co/100x100.png' },
];


export default function ListPelayanPage() {
  const [musicians, setMusicians] = React.useState<Musician[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchMusicians = async () => {
      setLoading(true);
      // Mock API call
      setTimeout(() => {
          setMusicians(MOCK_MUSICIANS);
          setLoading(false);
      }, 1000);
    };
    fetchMusicians();
  }, []);

  const filteredMusicians = musicians.filter(m => 
    m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.instruments.some(i => i.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const renderContent = () => {
    if (loading) {
      return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 animate-pulse">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                </div>
            ))}
        </div>
      );
    }

    if (error) {
      return <p className='text-center text-red-500'>{error}</p>;
    }

    if (filteredMusicians.length === 0) {
      return (
        <div className='text-center py-10 bg-gray-50 rounded-xl'>
          <FiUser className='w-10 h-10 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Tidak ada pelayan musik ditemukan
          </h3>
          <p className='text-gray-600 max-w-md mx-auto mb-6'>
            {searchTerm ? `Tidak ada hasil yang cocok dengan "${searchTerm}"` : 'Belum ada data pelayan musik yang tersedia.'}
          </p>
        </div>
      );
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredMusicians.map((musician, index) => (
                <motion.div
                    key={musician.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                >
                    <div className='p-6 flex-grow'>
                        <div className='flex items-center space-x-4'>
                            <Image src={musician.avatar} alt={musician.nama} width={64} height={64} className="rounded-full border-2 border-amber-200" data-ai-hint="person portrait" />
                            <div className='flex-1 min-w-0'>
                                <h3 className='font-bold text-lg text-gray-900 truncate'>{musician.nama}</h3>
                                <p className='text-sm text-gray-500 truncate'>{musician.email}</p>
                            </div>
                        </div>
                        <div className='mt-4 pt-4 border-t border-gray-100'>
                            <p className='text-xs font-semibold text-gray-400 uppercase mb-2'>Keahlian</p>
                            <div className='flex flex-wrap gap-2'>
                                {musician.instruments.map((inst) => (
                                    <span key={inst} className='px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full flex items-center'>
                                        <FiMusic className='w-3 h-3 mr-1.5' />
                                        {inst}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='bg-gray-50 p-3 flex justify-between items-center border-t'>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            musician.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                            {musician.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                        <div className='flex items-center space-x-1'>
                             <button className='p-2 text-gray-500 hover:text-blue-600 rounded-md hover:bg-blue-50 transition-colors'>
                                <FiEdit2 className='w-4 h-4' />
                            </button>
                            <button className='p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors'>
                                <FiTrash2 className='w-4 h-4' />
                            </button>
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
        title='Daftar Pelayan Musik'
        description='Kelola tim pelayan musik gereja, termasuk para pemusik dan penyanyi.'
        actionLabel='Kembali ke Dashboard Musik'
        gradientFrom='from-amber-500'
        gradientTo='to-amber-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>Pelayan Musik</h2>
            <p className='text-sm text-gray-500 mt-1'>
              Kelola data pelayan musik dan keahlian mereka.
            </p>
          </div>
           <div className='flex w-full md:w-auto space-x-4'>
            <div className='relative flex-grow'>
              <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
              <input
                type='text'
                placeholder='Cari nama atau instrumen...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 sm:text-sm'
              />
            </div>
            <Link
                href='/dashboard/musik/list-pelayan/tambah'
                className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 whitespace-nowrap'
            >
                <FiPlus className='w-5 h-5' />
                <span>Tambah Pelayan</span>
            </Link>
           </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
