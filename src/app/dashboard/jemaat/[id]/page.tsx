'use client';

import axios from 'axios';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  User,
  Heart,
  Home,
  Mail,
  Phone,
  Users,
  Calendar,
  MapPin,
  Edit2,
  Building,
  Briefcase,
  Cake,
  VenetianMask,
  Smile,
  BadgeInfo,
  Stethoscope,
  BookUser,
  Group,
  HandHelping,
  Fingerprint,
  Footprints,
  Check,
} from 'lucide-react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { getToken } from '@/lib/helper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Definisi tipe data jemaat sesuai backend response
interface LifeGroupResponse {
  id: string;
  name: string;
}

interface PelayananResponse {
  pelayanan_id: string;
  pelayanan: string;
  church_id: string;
  church_name: string;
  is_pic: boolean;
}

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
  life_groups: LifeGroupResponse[];
  kabupaten_id: number;
  kabupaten: string;
  pelayanan: PelayananResponse[];
  created_at: string;
  updated_at: string;
}

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | React.ReactNode;
}) => {
  const displayValue = value || '-';
  return (
    <div className='flex items-start space-x-4'>
      <div className='p-2 bg-blue-50 rounded-lg'>
        <Icon className='w-5 h-5 text-blue-600' />
      </div>
      <div>
        <p className='text-sm text-gray-500'>{label}</p>
        <p className='font-medium text-gray-800 break-words'>{displayValue}</p>
      </div>
    </div>
  );
};

export default function DetailJemaatPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [jemaat, setJemaat] = useState<JemaatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Mock data for Spiritual Journey ---
  const journeySteps = [
    { name: 'One to One' },
    { name: 'Baptis Selam' },
    { name: 'Victory Weekend' },
    { name: 'Church Community' },
    { name: 'L113' },
    { name: 'L215' },
  ];
  // This will be replaced with actual data from `jemaat` object later
  const completedSteps = ['One to One', 'Baptis Selam', 'Victory Weekend'];

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
        setJemaat(response.data.data);
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
              <MapPin className='mx-auto' />
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
              <Users className='mx-auto' />
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
        description={`Informasi lengkap tentang ${jemaat.nama}`}
        actionLabel='Kembali ke Data Jemaat'
        gradientFrom='from-blue-500'
        gradientTo='to-blue-700'
      />

      <div className='space-y-6'>
        {/* Header Section */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
              <div className='flex items-center space-x-4'>
                <div className='w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white ring-2 ring-blue-200'>
                  <User className='w-10 h-10 text-blue-600' />
                </div>
                <div>
                  <h2 className='text-2xl font-bold text-gray-900'>
                    {jemaat.nama}
                  </h2>
                  <p className='text-sm text-gray-500 mt-1'>
                    {jemaat.kode_jemaat}
                  </p>
                  <span
                    className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      jemaat.is_aktif
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {jemaat.is_aktif ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </div>
              </div>
              <div className='flex items-center space-x-4 mt-4 md:mt-0'>
                <Button onClick={handleEdit} variant='outline'>
                  <Edit2 className='w-4 h-4 mr-2' />
                  Edit Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Kolom Kiri */}
          <div className='lg:col-span-2 space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <User className='w-5 h-5 mr-3 text-blue-600' />
                  Informasi Pribadi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4'>
                  <InfoItem icon={User} label='Nama Lengkap' value={jemaat.nama} />
                  <InfoItem
                    icon={VenetianMask}
                    label='Nama Panggilan'
                    value={jemaat.nama_lain}
                  />
                  <InfoItem
                    icon={Users}
                    label='Jenis Kelamin'
                    value={jemaat.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  />
                  <InfoItem
                    icon={MapPin}
                    label='Tempat Lahir'
                    value={jemaat.tempat_lahir}
                  />
                  <InfoItem
                    icon={Cake}
                    label='Tanggal Lahir'
                    value={jemaat.tanggal_lahir}
                  />
                  <InfoItem
                    icon={Smile}
                    label='Fase Hidup'
                    value={jemaat.fase_hidup}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Heart className='w-5 h-5 mr-3 text-blue-600' />
                  Informasi Perkawinan & Keluarga
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4'>
                  <InfoItem
                    icon={Heart}
                    label='Status Perkawinan'
                    value={jemaat.status_perkawinan}
                  />
                  <InfoItem
                    icon={Heart}
                    label='Nama Pasangan'
                    value={jemaat.nama_pasangan}
                  />
                  <InfoItem
                    icon={Calendar}
                    label='Tanggal Perkawinan'
                    value={jemaat.tanggal_perkawinan}
                  />
                  <InfoItem icon={User} label='Nama Ayah' value={jemaat.ayah} />
                  <InfoItem icon={User} label='Nama Ibu' value={jemaat.ibu} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Phone className='w-5 h-5 mr-3 text-blue-600' />
                  Informasi Kontak & Alamat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4'>
                  <InfoItem
                    icon={Phone}
                    label='Nomor Telepon'
                    value={jemaat.nomor_telepon}
                  />
                  <InfoItem icon={Mail} label='Email' value={jemaat.email} />
                  <InfoItem
                    icon={MapPin}
                    label='Kabupaten/Kota'
                    value={jemaat.kabupaten}
                  />
                  <InfoItem icon={Home} label='Alamat' value={jemaat.alamat} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan */}
          <div className='space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Building className='w-5 h-5 mr-3 text-blue-600' />
                  Informasi Gereja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  <InfoItem icon={Building} label='Gereja' value={jemaat.church} />
                  <InfoItem
                    icon={Fingerprint}
                    label='Kode Jemaat'
                    value={jemaat.kode_jemaat}
                  />
                  <InfoItem
                    icon={BadgeInfo}
                    label='Status Keanggotaan'
                    value={jemaat.status}
                  />
                  <InfoItem
                    icon={BookUser}
                    label='Komitmen Berjemaat'
                    value={jemaat.komitmen_berjemaat}
                  />
                  <InfoItem
                    icon={Stethoscope}
                    label='Kerinduan'
                    value={jemaat.kerinduan}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Briefcase className='w-5 h-5 mr-3 text-blue-600' />
                  Keterlibatan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
                    <Group className='w-4 h-4 mr-2' />
                    LifeGroups
                  </h4>
                  <div className='space-y-2'>
                    {jemaat.life_groups && jemaat.life_groups.length > 0 ? (
                      jemaat.life_groups.map((lg, index) => (
                        <motion.div
                          key={lg.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className='bg-blue-50 rounded-md p-3 text-sm font-medium text-blue-800'
                        >
                          {lg.name}
                        </motion.div>
                      ))
                    ) : (
                      <p className='text-sm text-gray-500 italic'>
                        Tidak tergabung dalam lifegroup.
                      </p>
                    )}
                  </div>
                </div>

                <div className='mt-6'>
                  <h4 className='font-medium text-gray-700 mb-3 flex items-center'>
                    <HandHelping className='w-4 h-4 mr-2' />
                    Pelayanan
                  </h4>
                  <div className='space-y-3'>
                    {jemaat.pelayanan && jemaat.pelayanan.length > 0 ? (
                      jemaat.pelayanan.map((p, index) => (
                        <motion.div
                          key={p.pelayanan_id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className='bg-emerald-50 rounded-lg p-4 border border-emerald-200'
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex-1'>
                              <h5 className='font-semibold text-emerald-900 text-sm'>
                                {p.pelayanan}
                              </h5>
                              <p className='text-xs text-emerald-700 mt-1'>
                                {p.church_name}
                              </p>
                            </div>
                            {p.is_pic && (
                              <span className='bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full border border-yellow-300'>
                                PIC
                              </span>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className='text-sm text-gray-500 italic'>
                        Tidak memiliki pelayanan.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'>
                  <Footprints className='w-5 h-5 mr-3 text-blue-600' />
                  Spiritual Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className='relative border-l border-gray-200 ml-3'>
                  {journeySteps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.name);
                    return (
                      <li key={step.name} className='mb-6 ml-6 last:mb-0'>
                        <span
                          className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-4 ring-white ${
                            isCompleted ? 'bg-green-100' : 'bg-gray-100'
                          }`}
                        >
                          {isCompleted ? (
                            <Check className='w-4 h-4 text-green-600' />
                          ) : (
                            <div className='w-3 h-3 bg-gray-400 rounded-full'></div>
                          )}
                        </span>
                        <p
                          className={`font-medium ${
                            isCompleted ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {step.name}
                        </p>
                        {!isCompleted && index === completedSteps.length && (
                          <p className='text-xs text-blue-600 mt-0.5'>
                            Langkah Berikutnya
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
