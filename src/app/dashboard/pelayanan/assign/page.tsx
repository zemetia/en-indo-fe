'use client';

import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  BsPeople,
  BsCheck2,
  BsX,
  BsArrowRight,
  BsCheckCircle,
} from 'react-icons/bs';
import { FiSearch, FiUsers, FiCheck, FiHome, FiAward } from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getToken } from '@/lib/helper';

interface Pelayanan {
  id: string;
  nama: string;
  gereja: string;
  jumlah_person: number;
  is_aktif: boolean;
}

interface Person {
  id: string;
  nama: string;
  gender: string;
  church: string;
  is_aktif: boolean;
}

interface Church {
  id: string;
  nama: string;
}

export default function AssignPelayananPage() {
  const [pelayanan, setPelayanan] = useState<Array<Pelayanan>>([
      { id: 'p1', nama: 'Pemusik', gereja: 'EN Jakarta', jumlah_person: 10, is_aktif: true },
      { id: 'p2', nama: 'Singer', gereja: 'EN Jakarta', jumlah_person: 15, is_aktif: true },
      { id: 'p3', nama: 'Usher', gereja: 'EN Jakarta', jumlah_person: 20, is_aktif: true },
      { id: 'p4', nama: 'Media', gereja: 'EN Bandung', jumlah_person: 8, is_aktif: true },
      { id: 'p5', nama: 'Kids', gereja: 'EN Surabaya', jumlah_person: 12, is_aktif: false },
  ]);
  const [persons, setPersons] = useState<Array<Person>>([
      { id: 'u1', nama: 'Andi Suryo', gender: 'L', church: 'EN Jakarta', is_aktif: true },
      { id: 'u2', nama: 'Budi Santoso', gender: 'L', church: 'EN Jakarta', is_aktif: true },
      { id: 'u3', nama: 'Citra Lestari', gender: 'P', church: 'EN Bandung', is_aktif: true },
      { id: 'u4', nama: 'Dewi Anggraini', gender: 'P', church: 'EN Surabaya', is_aktif: false },
  ]);
  const [churches, setChurches] = useState<Array<Church>>([
      { id: 'c1', nama: 'EN Jakarta' },
      { id: 'c2', nama: 'EN Bandung' },
      { id: 'c3', nama: 'EN Surabaya' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // Set to false since we use mock data
  const [error, setError] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [selectedPelayanan, setSelectedPelayanan] = useState<Pelayanan | null>(
    null
  );
  const [isPIC, setIsPIC] = useState(false);
  const [activeTab, setActiveTab] = useState<'person' | 'church' | 'pelayanan'>(
    'person'
  );
  const [showSuccess, setShowSuccess] = useState(false);

  // Since we are using mock data, we can comment out the API fetching logic for now.
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const token = getToken();
  //       if (!token) {
  //         setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
  //         setLoading(false);
  //         return;
  //       }

  //       const [pelayananResponse, personsResponse, churchesResponse] =
  //         await Promise.all([
  //           axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/pelayanan`, {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }),
  //           axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/person`, {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }),
  //           axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/church`, {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }),
  //         ]);

  //       setPelayanan(pelayananResponse.data.data);
  //       setPersons(personsResponse.data.data);
  //       setChurches(churchesResponse.data.data);
  //       setError(null);
  //     } catch (error) {
  //       setError('Gagal mengambil data. Silakan coba lagi nanti.');
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleAssignPelayanan = async () => {
    // Mock assignment logic
    console.log({
        person: selectedPerson,
        church: selectedChurch,
        pelayanan: selectedPelayanan,
        isPIC,
    });
    setShowSuccess(true);
  };

  const handleAssignAgain = () => {
    setShowSuccess(false);
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedPerson(null);
    setSelectedChurch(null);
    setSelectedPelayanan(null);
    setIsPIC(false);
    setActiveTab('person');
  };

  const filteredPersons = persons
    ? persons.filter((item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredPelayanan = pelayanan
    ? pelayanan.filter((item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredChurches = churches
    ? churches.filter((item) =>
        item.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];
    
  if (loading) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Assign Pelayanan'
          description='Assign pelayanan kepada person'
          actionLabel='Kembali ke Dashboard'
          gradientFrom='from-blue-500'
          gradientTo='to-blue-700'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex justify-center items-center min-h-[400px]'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4'></div>
            <p className='text-gray-600'>Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Assign Pelayanan'
          description='Assign pelayanan kepada person'
          actionLabel='Kembali ke Dashboard'
          gradientFrom='from-blue-500'
          gradientTo='to-blue-700'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='text-red-500 mb-2 text-5xl'>
              <BsPeople className='mx-auto' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Error</h3>
            <p className='text-gray-600 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Assign Pelayanan'
        description='Tugaskan peran pelayanan kepada jemaat dalam tiga langkah mudah.'
        actionLabel='Kembali ke Dashboard'
        gradientFrom='from-indigo-500'
        gradientTo='to-purple-500'
      />

      <AnimatePresence mode='wait'>
        {showSuccess ? (
          <motion.div
            key='success'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'
          >
            <div className='flex flex-col items-center justify-center py-12 space-y-6'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className='w-20 h-20 rounded-full bg-green-100 flex items-center justify-center'
              >
                <BsCheckCircle className='w-12 h-12 text-green-600' />
              </motion.div>

              <div className='text-center space-y-2'>
                <h3 className='text-2xl font-semibold text-gray-900'>
                  Berhasil!
                </h3>
                <p className='text-gray-600 max-w-md'>
                  {selectedPerson?.nama} berhasil ditugaskan sebagai{' '}
                  {isPIC ? 'PIC ' : ''}pelayanan {selectedPelayanan?.nama} di{' '}
                  {selectedChurch?.nama}
                </p>
              </div>

              <div className='flex space-x-4 pt-4'>
                <button
                  onClick={handleAssignAgain}
                  className='px-6 py-3 rounded-lg flex items-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-colors'
                >
                  <BsPeople className='w-5 h-5' />
                  <span>Assign Lagi</span>
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key='form'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'
          >
            {/* Progress Indicator */}
            <div className='flex items-center justify-center mb-8'>
              <div className='flex items-center space-x-2 md:space-x-4'>
                <div className='flex flex-col items-center text-center'>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${selectedPerson ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200'}`}>
                    1
                  </div>
                  <span className='text-xs md:text-sm mt-2 text-gray-600'>Pilih Person</span>
                </div>
                <div className='w-12 md:w-16 h-1 bg-gray-200 rounded-full'><div className={`h-full bg-indigo-600 rounded-full transition-all duration-300 ${selectedPerson ? 'w-full' : 'w-0'}`} /></div>
                <div className='flex flex-col items-center text-center'>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${selectedChurch ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200'}`}>
                    2
                  </div>
                  <span className='text-xs md:text-sm mt-2 text-gray-600'>Pilih Gereja</span>
                </div>
                <div className='w-12 md:w-16 h-1 bg-gray-200 rounded-full'><div className={`h-full bg-indigo-600 rounded-full transition-all duration-300 ${selectedChurch ? 'w-full' : 'w-0'}`} /></div>
                <div className='flex flex-col items-center text-center'>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2 ${selectedPelayanan ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200'}`}>
                    3
                  </div>
                  <span className='text-xs md:text-sm mt-2 text-gray-600'>Pilih Pelayanan</span>
                </div>
              </div>
            </div>
            
            <div className='relative mb-6'>
              <FiSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder={`Cari ${activeTab === 'person' ? 'nama jemaat' : activeTab === 'church' ? 'nama gereja' : 'nama pelayanan'}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full bg-gray-50'
              />
            </div>

            <div className='min-h-[300px]'>
              <AnimatePresence mode='wait'>
                {activeTab === 'person' && (
                  <motion.div key='person' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredPersons.map((item) => (
                      <motion.div key={item.id} whileHover={{y: -3}} onClick={() => { setSelectedPerson(item); setActiveTab('church'); }} className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${selectedPerson?.id === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}>
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 rounded-full bg-indigo-100 text-indigo-600'><BsPeople className='w-5 h-5' /></div>
                          <div className='flex-1'><h4 className='font-semibold text-gray-900'>{item.nama}</h4><p className='text-xs text-gray-500'>{item.church}</p></div>
                          {selectedPerson?.id === item.id && <FiCheck className='w-5 h-5 text-indigo-600' />}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'church' && (
                   <motion.div key='church' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {filteredChurches.map((item) => (
                      <motion.div key={item.id} whileHover={{y: -3}} onClick={() => { setSelectedChurch(item); setActiveTab('pelayanan'); }} className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${selectedChurch?.id === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}>
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 rounded-full bg-indigo-100 text-indigo-600'><FiHome className='w-5 h-5' /></div>
                          <div className='flex-1'><h4 className='font-semibold text-gray-900'>{item.nama}</h4></div>
                          {selectedChurch?.id === item.id && <FiCheck className='w-5 h-5 text-indigo-600' />}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'pelayanan' && (
                  <motion.div key='pelayanan' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {filteredPelayanan.map((item) => (
                        <motion.div key={item.id} whileHover={{y: -3}} onClick={() => setSelectedPelayanan(item)} className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${selectedPelayanan?.id === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}>
                          <div className='flex items-center space-x-3'>
                            <div className='p-2 rounded-full bg-indigo-100 text-indigo-600'><FiAward className='w-5 h-5' /></div>
                            <div className='flex-1'><h4 className='font-semibold text-gray-900'>{item.nama}</h4></div>
                            {selectedPelayanan?.id === item.id && <FiCheck className='w-5 h-5 text-indigo-600' />}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {selectedPelayanan && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='bg-indigo-50 rounded-lg p-4 mt-6'>
                        <div className='flex items-center space-x-3'>
                          <input type='checkbox' id='isPIC' checked={isPIC} onChange={(e) => setIsPIC(e.target.checked)} className='w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500' />
                          <label htmlFor='isPIC' className='text-gray-700 font-medium'>Jadikan sebagai PIC (Person in Charge)</label>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className='mt-8 flex justify-between items-center pt-6 border-t border-gray-200'>
              <button onClick={() => { if (activeTab === 'church') setActiveTab('person'); if (activeTab === 'pelayanan') setActiveTab('church'); }} className={`px-4 py-2 rounded-lg flex items-center space-x-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-opacity ${activeTab === 'person' ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`} disabled={activeTab === 'person'}>
                <BsArrowRight className='w-5 h-5 transform rotate-180' />
                <span>Kembali</span>
              </button>
              <div className='flex items-center space-x-4'>
                <button onClick={resetSelection} className='px-4 py-2 rounded-lg flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100'>
                  <BsX className='w-5 h-5' />
                  <span>Reset</span>
                </button>
                <button onClick={handleAssignPelayanan} disabled={!selectedPerson || !selectedChurch || !selectedPelayanan} className={`px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors ${selectedPerson && selectedChurch && selectedPelayanan ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-300' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
                  <FiCheck className='w-5 h-5' />
                  <span className='font-semibold'>Assign Pelayanan</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
