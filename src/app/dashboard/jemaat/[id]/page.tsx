'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  BsCalendarWeek,
  BsGeoAlt,
  BsPeople,
  BsPersonVcard,
} from 'react-icons/bs';
import {
  FiEdit2,
  FiHeart,
  FiHome,
  FiMail,
  FiPhone,
  FiUserCheck,
  FiUsers,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getToken } from '@/lib/helper';

// Definisi tipe data jemaat
interface JemaatData {
  id: string;
  nama: string;
  nama_lain: string;
  gender: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  fase_hidup: string;
  status_perkawinan: string;
  nama_pasangan: string;
  pasangan_id: string;
  pasangan: string;
  tanggal_perkawinan: string;
  alamat: string;
  nomor_telepon: string;
  email: string;
  ayah: string;
  ibu: string;
  kerinduan: string;
  komitmen_berjemaat: string;
  status: string;
  is_aktif: boolean;
  kode_jemaat: string;
  church_id: string;
  church: string;
  life_groups: string[];
  kabupaten_id: string;
  kabupaten: string;
  pelayanan: string[];
}

export default function DetailJemaatPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [jemaat, setJemaat] = useState<JemaatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJemaat = async () => {
      setLoading(true);
      const token = getToken(); // Ambil token dari local storage
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/person/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Tambahkan bearer token untuk otorisasi
            },
          }
        );
        setJemaat(response.data);
        setError(null);
      } catch (error) {
        setError('Gagal mengambil data jemaat. Silakan coba lagi nanti.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJemaat();
    }
  }, [id]);

  const handleEdit = () => {
    router.push(`/dashboard/jemaat/edit/${id}`);
  };

  if (loading) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Detail Jemaat'
          description='Informasi lengkap tentang jemaat'
          actionLabel='Kembali ke Data Jemaat'
          gradientFrom='from-blue-500'
          gradientTo='to-blue-700'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex justify-center items-center min-h-[400px]'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4'></div>
            <p className='text-gray-600'>Memuat data jemaat...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Detail Jemaat'
          description='Informasi lengkap tentang jemaat'
          actionLabel='Kembali ke Data Jemaat'
          gradientFrom='from-blue-500'
          gradientTo='to-blue-700'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='text-red-500 mb-2 text-5xl'>
              <BsGeoAlt className='mx-auto' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Error</h3>
            <p className='text-gray-600 mb-4'>{error}</p>
            <Link
              href='/dashboard/jemaat'
              className='text-blue-600 hover:text-blue-800 font-medium'
            >
              Kembali ke daftar jemaat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!jemaat) {
    return (
      <div className='space-y-6'>
        <FeaturedCard
          title='Detail Jemaat'
          description='Informasi lengkap tentang jemaat'
          actionLabel='Kembali ke Data Jemaat'
          gradientFrom='from-blue-500'
          gradientTo='to-blue-700'
        />
        <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200 flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='text-gray-400 mb-2 text-5xl'>
              <BsPeople className='mx-auto' />
            </div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Data Tidak Ditemukan
            </h3>
            <p className='text-gray-600 mb-4'>
              Jemaat dengan ID tersebut tidak ditemukan.
            </p>
            <Link
              href='/dashboard/jemaat'
              className='text-blue-600 hover:text-blue-800 font-medium'
            >
              Kembali ke daftar jemaat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Detail Jemaat'
        description='Informasi lengkap tentang jemaat'
        actionLabel='Kembali ke Data Jemaat'
        gradientFrom='from-blue-500'
        gradientTo='to-blue-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8'>
          <div className='flex items-center space-x-4'>
            <div className='w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center'>
              <BsPeople className='w-8 h-8 text-blue-600' />
            </div>
            <div>
              <h2 className='text-2xl font-semibold text-gray-900'>
                {jemaat.nama}
              </h2>
              <p className='text-sm text-blue-600 mt-1'>{jemaat.kode_jemaat}</p>
            </div>
          </div>
          <div className='flex items-center space-x-4 mt-4 md:mt-0'>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                jemaat.is_aktif
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {jemaat.is_aktif ? 'Aktif' : 'Tidak Aktif'}
            </span>
            <button
              onClick={handleEdit}
              className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2'
            >
              <FiEdit2 className='w-5 h-5' />
              <span>Edit Data</span>
            </button>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Kolom Kiri - Informasi Pribadi */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Informasi Pribadi */}
            <div className='bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6 flex items-center'>
                <span className='w-1 h-6 bg-blue-600 rounded-full mr-3'></span>
                Informasi Pribadi
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiUsers className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Nama Lain</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.nama_lain || '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiUsers className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Jenis Kelamin</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.gender == 'L' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <BsGeoAlt className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Tempat Lahir</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.tanggal_lahir}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <BsCalendarWeek className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Tanggal Lahir</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.tanggal_lahir}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiUserCheck className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Fase Hidup</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.fase_hidup}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiHeart className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Status Perkawinan</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.status_perkawinan}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Keluarga */}
            <div className='bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6 flex items-center'>
                <span className='w-1 h-6 bg-blue-600 rounded-full mr-3'></span>
                Informasi Keluarga
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiHeart className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Nama Pasangan</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.nama_pasangan || '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <BsCalendarWeek className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Tanggal Perkawinan</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.tanggal_perkawinan || '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiUsers className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Ayah</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.ayah || '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiUsers className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Ibu</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.ibu || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informasi Kontak */}
            <div className='bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6 flex items-center'>
                <span className='w-1 h-6 bg-blue-600 rounded-full mr-3'></span>
                Kontak
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiPhone className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Nomor Telepon</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.nomor_telepon || '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiMail className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Email</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.email || '-'}
                    </p>
                  </div>
                </div>
                <div className='md:col-span-2 flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <BsGeoAlt className='w-6 h-6 text-blue-600' />
                  </div>
                  <div className='flex-1'>
                    <p className='text-sm text-gray-500'>Alamat</p>
                    <p className='font-medium text-gray-900'>{jemaat.alamat}</p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <BsGeoAlt className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Kabupaten/Kota</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.kabupaten || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan - Informasi Pelayanan */}
          <div className='space-y-6'>
            {/* Gereja & Lifegroup */}
            <div className='bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6 flex items-center'>
                <span className='w-1 h-6 bg-blue-600 rounded-full mr-3'></span>
                Informasi Gereja
              </h3>
              <div className='space-y-4'>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiHome className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Gereja</p>
                    <p className='font-medium text-gray-900'>{jemaat.church}</p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <BsPersonVcard className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Kode Jemaat</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.kode_jemaat}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiUserCheck className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Status</p>
                    <p className='font-medium text-gray-900'>{jemaat.status}</p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiHeart className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Komitmen Berjemaat</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.komitmen_berjemaat || '-'}
                    </p>
                  </div>
                </div>
                <div className='flex items-start space-x-4'>
                  <div className='p-3 bg-blue-100 rounded-xl'>
                    <FiHeart className='w-6 h-6 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm text-gray-500'>Kerinduan</p>
                    <p className='font-medium text-gray-900'>
                      {jemaat.kerinduan || '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* LifeGroups */}
            <div className='bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6 flex items-center'>
                <span className='w-1 h-6 bg-blue-600 rounded-full mr-3'></span>
                LifeGroups
              </h3>
              <div className='space-y-4'>
                {jemaat.life_groups && jemaat.life_groups.length > 0 ? (
                  jemaat.life_groups.map((lg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className='bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
                    >
                      <p className='font-medium text-gray-900'>{lg}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className='text-gray-500 italic'>
                    Tidak ada data lifegroup
                  </p>
                )}
              </div>
            </div>

            {/* Pelayanan */}
            <div className='bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900 mb-6 flex items-center'>
                <span className='w-1 h-6 bg-blue-600 rounded-full mr-3'></span>
                Pelayanan
              </h3>
              <div className='space-y-4'>
                {jemaat.pelayanan && jemaat.pelayanan.length > 0 ? (
                  jemaat.pelayanan.map((pelayanan, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className='bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
                    >
                      <p className='font-medium text-gray-900'>{pelayanan}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className='text-gray-500 italic'>
                    Tidak ada data pelayanan
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
