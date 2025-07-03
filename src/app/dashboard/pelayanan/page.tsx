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
import { FiSearch, FiUsers, FiCheck } from 'react-icons/fi';

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

// Mock data untuk pelayanan
const mockPelayanan: Pelayanan[] = [
  {
    id: '1',
    nama: 'Tim Worship',
    gereja: 'Every Nation Jakarta',
    jumlah_person: 15,
    is_aktif: true,
  },
  {
    id: '2',
    nama: 'Tim Multimedia',
    gereja: 'Every Nation Jakarta',
    jumlah_person: 8,
    is_aktif: true,
  },
  {
    id: '3',
    nama: 'Tim Usher',
    gereja: 'Every Nation Jakarta',
    jumlah_person: 12,
    is_aktif: true,
  },
  {
    id: '4',
    nama: 'Tim Doa',
    gereja: 'Every Nation Jakarta',
    jumlah_person: 10,
    is_aktif: true,
  },
];

// Mock data untuk person
const mockPersons: Person[] = [
  {
    id: '1',
    nama: 'John Doe',
    gender: 'L',
    church: 'Every Nation Jakarta',
    is_aktif: true,
  },
  {
    id: '2',
    nama: 'Jane Smith',
    gender: 'P',
    church: 'Every Nation Jakarta',
    is_aktif: true,
  },
  {
    id: '3',
    nama: 'Michael Johnson',
    gender: 'L',
    church: 'Every Nation Jakarta',
    is_aktif: true,
  },
  {
    id: '4',
    nama: 'Sarah Williams',
    gender: 'P',
    church: 'Every Nation Jakarta',
    is_aktif: true,
  },
  {
    id: '5',
    nama: 'David Brown',
    gender: 'L',
    church: 'Every Nation Jakarta',
    is_aktif: true,
  },
];

// Mock data untuk gereja
const mockChurches: Church[] = [
  { id: '1', nama: 'Every Nation Jakarta' },
  { id: '2', nama: 'Every Nation Bandung' },
  { id: '3', nama: 'Every Nation Surabaya' },
];

export default function DataPelayananPage() {
  const [pelayanan, setPelayanan] = useState<Array<Pelayanan> | null>(null);
  const [persons, setPersons] = useState<Array<Person> | null>(null);
  const [churches, setChurches] = useState<Array<Church> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [selectedChurch, setSelectedChurch] = useState<Church | null>(null);
  const [selectedPelayanan, setSelectedPelayanan] = useState<Pelayanan | null>(
    null
  );
  const [isPIC, setIsPIC] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'person' | 'church' | 'pelayanan'>(
    'person'
  );
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        setPelayanan(mockPelayanan);
        setPersons(mockPersons);
        setChurches(mockChurches);
        setError(null);

        // Kode axios yang dikomentari untuk referensi nanti
        /*
        const token = getToken();
        if (!token) {
          setError('Token autentikasi tidak ditemukan. Silakan login kembali.');
          setLoading(false);
          return;
        }

        const [pelayananResponse, personsResponse, churchesResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/pelayanan`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/person`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/church`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPelayanan(pelayananResponse.data);
        setPersons(personsResponse.data);
        setChurches(churchesResponse.data);
        */
      } catch (error) {
        setError('Gagal mengambil data. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAssignPelayanan = async () => {
    try {
      if (!selectedPerson || !selectedChurch || !selectedPelayanan) return;

      // Simulasi assign pelayanan dengan mock data
      console.log(
        `Assigning pelayanan ${selectedPelayanan.id} to person ${selectedPerson.id} at church ${selectedChurch.id} as PIC: ${isPIC}`
      );

      // Kode axios yang dikomentari untuk referensi nanti
      /*
      const token = getToken();
      if (!token) return;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/person/${selectedPerson.id}/pelayanan`,
        { 
          pelayanan_id: selectedPelayanan.id,
          church_id: selectedChurch.id,
          is_pic: isPIC
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh data setelah assign
      const [pelayananResponse, personsResponse] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/pelayanan`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/person`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPelayanan(pelayananResponse.data);
      setPersons(personsResponse.data);
      */

      setShowSuccess(true);
    } catch (error) {
      console.error('Gagal mengassign pelayanan:', error);
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
        description='Assign pelayanan kepada person'
        actionLabel='Kembali ke Dashboard'
        gradientFrom='from-blue-500'
        gradientTo='to-blue-700'
      />

      <AnimatePresence mode='wait'>
        {showSuccess ? (
          <motion.div
            key='success'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className='bg-white rounded-xl shadow-sm p-6 border border-blue-50'
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
                  className='px-6 py-3 rounded-lg flex items-center space-x-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors'
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
            className='bg-white rounded-xl shadow-sm p-6 border border-blue-50'
          >
            {/* Progress Indicator */}
            <div className='flex items-center justify-center mb-8'>
              <div className='flex items-center space-x-4'>
                <div className='flex flex-col items-center'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      selectedPerson
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <BsPeople className='w-5 h-5' />
                  </div>
                  <span className='text-sm mt-2 text-gray-600'>Person</span>
                </div>
                <div className='w-16 h-1 bg-gray-200'>
                  <div
                    className={`h-full bg-blue-600 transition-all duration-300 ${
                      selectedPerson ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
                <div className='flex flex-col items-center'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      selectedChurch
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <FiUsers className='w-5 h-5' />
                  </div>
                  <span className='text-sm mt-2 text-gray-600'>Gereja</span>
                </div>
                <div className='w-16 h-1 bg-gray-200'>
                  <div
                    className={`h-full bg-blue-600 transition-all duration-300 ${
                      selectedChurch ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
                <div className='flex flex-col items-center'>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      selectedPelayanan
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    <FiUsers className='w-5 h-5' />
                  </div>
                  <span className='text-sm mt-2 text-gray-600'>Pelayanan</span>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className='relative mb-6'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
              <input
                type='text'
                placeholder={`Cari ${
                  activeTab === 'person'
                    ? 'person'
                    : activeTab === 'church'
                    ? 'gereja'
                    : 'pelayanan'
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full'
              />
            </div>

            {/* Content */}
            <div className='space-y-6'>
              <AnimatePresence mode='wait'>
                {activeTab === 'person' && (
                  <motion.div
                    key='person'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  >
                    {filteredPersons.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedPerson?.id === item.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => {
                          setSelectedPerson(item);
                          setActiveTab('church');
                        }}
                      >
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 rounded-lg bg-blue-600 text-white'>
                            <BsPeople className='w-5 h-5' />
                          </div>
                          <div className='flex-1'>
                            <h4 className='font-medium text-gray-900'>
                              {item.nama}
                            </h4>
                            <p className='text-sm text-gray-500'>
                              {item.church}
                            </p>
                          </div>
                          {selectedPerson?.id === item.id && (
                            <BsCheck2 className='w-5 h-5 text-blue-600' />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'church' && (
                  <motion.div
                    key='church'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                  >
                    {filteredChurches.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          selectedChurch?.id === item.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                        onClick={() => {
                          setSelectedChurch(item);
                          setActiveTab('pelayanan');
                        }}
                      >
                        <div className='flex items-center space-x-3'>
                          <div className='p-2 rounded-lg bg-blue-600 text-white'>
                            <FiUsers className='w-5 h-5' />
                          </div>
                          <div className='flex-1'>
                            <h4 className='font-medium text-gray-900'>
                              {item.nama}
                            </h4>
                          </div>
                          {selectedChurch?.id === item.id && (
                            <BsCheck2 className='w-5 h-5 text-blue-600' />
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'pelayanan' && (
                  <motion.div
                    key='pelayanan'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className='space-y-6'
                  >
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {filteredPelayanan.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedPelayanan?.id === item.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                          onClick={() => setSelectedPelayanan(item)}
                        >
                          <div className='flex items-center space-x-3'>
                            <div className='p-2 rounded-lg bg-blue-600 text-white'>
                              <FiUsers className='w-5 h-5' />
                            </div>
                            <div className='flex-1'>
                              <h4 className='font-medium text-gray-900'>
                                {item.nama}
                              </h4>
                              <p className='text-sm text-gray-500'>
                                {item.gereja}
                              </p>
                            </div>
                            {selectedPelayanan?.id === item.id && (
                              <BsCheck2 className='w-5 h-5 text-blue-600' />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {selectedPelayanan && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-gray-50 rounded-lg p-4'
                      >
                        <div className='flex items-center space-x-3'>
                          <input
                            type='checkbox'
                            id='isPIC'
                            checked={isPIC}
                            onChange={(e) => setIsPIC(e.target.checked)}
                            className='w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500'
                          />
                          <label htmlFor='isPIC' className='text-gray-700'>
                            Jadikan sebagai PIC (Person in Charge) untuk
                            pelayanan ini
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons */}
            <div className='mt-8 flex justify-between items-center'>
              <button
                onClick={() => {
                  if (activeTab === 'church') setActiveTab('person');
                  if (activeTab === 'pelayanan') setActiveTab('church');
                }}
                className='px-4 py-2 rounded-lg flex items-center space-x-2 bg-gray-200 text-gray-700 hover:bg-gray-300'
              >
                <BsArrowRight className='w-5 h-5 transform rotate-180' />
                <span>Kembali</span>
              </button>
              <div className='flex items-center space-x-4'>
                <button
                  onClick={resetSelection}
                  className='px-4 py-2 rounded-lg flex items-center space-x-2 bg-gray-200 text-gray-700 hover:bg-gray-300'
                >
                  <BsX className='w-5 h-5' />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleAssignPelayanan}
                  disabled={
                    !selectedPerson || !selectedChurch || !selectedPelayanan
                  }
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                    selectedPerson && selectedChurch && selectedPelayanan
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiCheck className='w-5 h-5' />
                  <span>Assign Pelayanan</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
