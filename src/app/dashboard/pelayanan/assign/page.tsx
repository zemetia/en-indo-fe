'use client';

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
import { FiSearch, FiUsers, FiCheck, FiHome, FiAward, FiList } from 'react-icons/fi';
import Link from 'next/link';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { personService, SimplePerson } from '@/lib/person-service';
import { churchService, Church } from '@/lib/church-service';
import { pelayananService, PelayananInfo } from '@/lib/pelayanan-service';
import { useToast } from '@/context/ToastContext';


export default function AssignPelayananPage() {
  const { showToast } = useToast();
  const [pelayanan, setPelayanan] = useState<Array<PelayananInfo>>([]);
  const [persons, setPersons] = useState<Array<SimplePerson>>([]);
  const [churches, setChurches] = useState<Array<Church>>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<SimplePerson | null>(null);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [selectedPelayanan, setSelectedPelayanan] = useState<PelayananInfo | null>(
    null
  );
  const [isPIC, setIsPIC] = useState(false);
  const [activeTab, setActiveTab] = useState<'person' | 'church' | 'pelayanan'>(
    'person'
  );
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch data independently and handle partial failures
        const results = await Promise.allSettled([
          pelayananService.getAllPelayanan(),
          personService.getSimpleList(),
          churchService.getSimpleList(),
        ]);

        // Handle pelayanan data
        if (results[0].status === 'fulfilled') {
          setPelayanan(results[0].value);
        } else {
          console.error('Failed to fetch pelayanan:', results[0].reason);
          showToast('Gagal memuat data pelayanan', 'warning');
        }

        // Handle persons data  
        if (results[1].status === 'fulfilled') {
          setPersons(results[1].value);
        } else {
          console.error('Failed to fetch persons:', results[1].reason);
          showToast('Gagal memuat data jemaat', 'warning');
        }

        // Handle churches data
        if (results[2].status === 'fulfilled') {
          setChurches(results[2].value);
        } else {
          console.error('Failed to fetch churches:', results[2].reason);
          showToast('Gagal memuat data gereja', 'warning');
        }

        // Only show error if ALL requests failed
        const allFailed = results.every(result => result.status === 'rejected');
        if (allFailed) {
          setError('Tidak dapat memuat data. Silakan periksa koneksi internet Anda.');
        } else if (results.some(result => result.status === 'rejected')) {
          showToast('Beberapa data tidak dapat dimuat, tetapi Anda masih dapat menggunakan fitur yang tersedia.', 'warning');
        }

      } catch (unexpectedError) {
        console.error('Unexpected error in fetchData:', unexpectedError);
        setError('Terjadi kesalahan tidak terduga.');
      } finally {
        setLoading(false);
      }
    };

    // Only run once on mount
    fetchData();
  }, []);

  const handleAssignPelayanan = async () => {
    if (!selectedPerson || !selectedChurch || !selectedPelayanan) {
      showToast('Please select person, church, and pelayanan', 'error');
      return;
    }

    try {
      setLoading(true);
      await pelayananService.assignPelayanan({
        person_id: selectedPerson.id,
        church_id: selectedChurch.id,
        pelayanan_id: selectedPelayanan.id,
        is_pic: isPIC,
      });
      
      setShowSuccess(true);
      showToast('Pelayanan berhasil di-assign!', 'success');
    } catch (error) {
      console.error('Failed to assign pelayanan:', error);
      showToast('Gagal assign pelayanan. Silakan coba lagi.', 'error');
    } finally {
      setLoading(false);
    }
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

  const filteredPersons = persons && Array.isArray(persons)
    ? persons.filter((item) =>
        item?.nama?.toLowerCase()?.includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredPelayanan = pelayanan && Array.isArray(pelayanan)
    ? pelayanan.filter((item) =>
        item?.pelayanan?.toLowerCase()?.includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredChurches = churches && Array.isArray(churches)
    ? churches.filter((item) =>
        item?.name?.toLowerCase()?.includes(searchTerm.toLowerCase())
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

  // Only show full error state if ALL data failed AND we're not loading
  if (error && !loading && pelayanan.length === 0 && persons.length === 0 && churches.length === 0) {
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
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Tidak Dapat Memuat Data</h3>
            <p className='text-gray-600 mb-4'>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Muat Ulang Halaman
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
                  {isPIC ? 'PIC ' : ''}pelayanan {selectedPelayanan?.pelayanan} di{' '}
                  {selectedChurch?.name}
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
                <Link
                  href='/dashboard/pelayanan'
                  className='px-6 py-3 rounded-lg flex items-center space-x-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
                >
                  <FiList className='w-5 h-5' />
                  <span>Lihat Daftar Pelayanan</span>
                </Link>
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
                  <motion.div key='person' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {filteredPersons.length > 0 ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {filteredPersons.map((item, index) => (
                          <motion.div key={item?.id || `person-${index}`} whileHover={{y: -3}} onClick={() => { setSelectedPerson(item); setActiveTab('church'); }} className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${selectedPerson?.id === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}>
                            <div className='flex items-center space-x-3'>
                              <div className='p-2 rounded-full bg-indigo-100 text-indigo-600'><BsPeople className='w-5 h-5' /></div>
                              <div className='flex-1'><h4 className='font-semibold text-gray-900'>{item?.nama || 'Nama tidak tersedia'}</h4><p className='text-xs text-gray-500'>{item?.church || 'Gereja tidak tersedia'}</p></div>
                              {selectedPerson?.id === item.id && <FiCheck className='w-5 h-5 text-indigo-600' />}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-12 text-gray-500'>
                        <BsPeople className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                        <h3 className='font-semibold text-gray-700 mb-2'>
                          {persons.length === 0 ? 'Data Jemaat Tidak Tersedia' : 'Tidak Ada Hasil Pencarian'}
                        </h3>
                        <p className='text-sm'>
                          {persons.length === 0 ? 'Data jemaat sedang tidak dapat dimuat.' : `Tidak ada jemaat yang cocok dengan "${searchTerm}".`}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'church' && (
                  <motion.div key='church' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {filteredChurches.length > 0 ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {filteredChurches.map((item, index) => (
                          <motion.div key={item?.id || `church-${index}`} whileHover={{y: -3}} onClick={() => { setSelectedChurch(item); setActiveTab('pelayanan'); }} className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${selectedChurch?.id === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}>
                            <div className='flex items-center space-x-3'>
                              <div className='p-2 rounded-full bg-indigo-100 text-indigo-600'><FiHome className='w-5 h-5' /></div>
                              <div className='flex-1'><h4 className='font-semibold text-gray-900'>{item?.name || 'Nama gereja tidak tersedia'}</h4></div>
                              {selectedChurch?.id === item.id && <FiCheck className='w-5 h-5 text-indigo-600' />}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-12 text-gray-500'>
                        <FiHome className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                        <h3 className='font-semibold text-gray-700 mb-2'>
                          {churches.length === 0 ? 'Data Gereja Tidak Tersedia' : 'Tidak Ada Hasil Pencarian'}
                        </h3>
                        <p className='text-sm'>
                          {churches.length === 0 ? 'Data gereja sedang tidak dapat dimuat.' : `Tidak ada gereja yang cocok dengan "${searchTerm}".`}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'pelayanan' && (
                  <motion.div key='pelayanan' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='space-y-6'>
                    {filteredPelayanan.length > 0 ? (
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {filteredPelayanan.map((item, index) => (
                          <motion.div key={item?.id || `pelayanan-${index}`} whileHover={{y: -3}} onClick={() => setSelectedPelayanan(item)} className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${selectedPelayanan?.id === item.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300 bg-white'}`}>
                            <div className='flex items-center space-x-3'>
                              <div className='p-2 rounded-full bg-indigo-100 text-indigo-600'><FiAward className='w-5 h-5' /></div>
                              <div className='flex-1'><h4 className='font-semibold text-gray-900'>{item?.pelayanan || 'Pelayanan tidak tersedia'}</h4><p className='text-xs text-gray-500'>{item?.department?.name || 'Departemen tidak tersedia'}</p></div>
                              {selectedPelayanan?.id === item.id && <FiCheck className='w-5 h-5 text-indigo-600' />}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className='text-center py-12 text-gray-500'>
                        <FiAward className='mx-auto h-12 w-12 text-gray-400 mb-4' />
                        <h3 className='font-semibold text-gray-700 mb-2'>
                          {pelayanan.length === 0 ? 'Data Pelayanan Tidak Tersedia' : 'Tidak Ada Hasil Pencarian'}
                        </h3>
                        <p className='text-sm'>
                          {pelayanan.length === 0 ? 'Data pelayanan sedang tidak dapat dimuat.' : `Tidak ada pelayanan yang cocok dengan "${searchTerm}".`}
                        </p>
                      </div>
                    )}

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
