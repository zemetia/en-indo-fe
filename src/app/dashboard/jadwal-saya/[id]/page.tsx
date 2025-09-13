'use client';
import { motion } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiUsers, FiMusic, FiAward, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Button } from '@/components/ui/button';

interface TeamMember {
  id: string;
  nama: string;
  peran: string;
}

interface Song {
  id: string;
  judul: string;
  artis: string;
}

interface ScheduleDetail {
  id: string;
  event: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  peranAnda: string;
  pelayanan: string;
  status: 'confirmed' | 'pending';
  timPelayanan: TeamMember[];
  daftarLagu?: Song[];
  catatan?: string;
}

const getPelayananColor = (pelayanan: string) => {
    const p = pelayanan.toLowerCase();
    if (p.includes('musik')) return { from: 'from-amber-500', to: 'to-amber-700' };
    if (p.includes('media')) return { from: 'from-blue-500', to: 'to-blue-700' };
    if (p.includes('usher') || p.includes('welcome')) return { from: 'from-green-500', to: 'to-green-700' };
    return { from: 'from-gray-500', to: 'to-gray-700' };
}

export default function DetailJadwalPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [schedule, setSchedule] = useState<ScheduleDetail | null>(null);

  useEffect(() => {
    // MOCK API call
    const mockData: { [key: string]: ScheduleDetail } = {
        '1': {
            id: '1',
            event: 'Ibadah Minggu Pagi',
            tanggal: '2025-05-12',
            waktu: '09:00',
            lokasi: 'Gedung Utama',
            peranAnda: 'Pianist',
            pelayanan: 'Musik',
            status: 'confirmed',
            timPelayanan: [
                { id: 't1', nama: 'Andi Suryo', peran: 'Worship Leader' },
                { id: 't2', nama: 'Budi Santoso', peran: 'Gitaris' },
                { id: 't3', nama: 'Citra Lestari', peran: 'Singer' },
            ],
            daftarLagu: [
                { id: 's1', judul: 'Amazing Grace', artis: 'John Newton' },
                { id: 's2', judul: 'How Great Thou Art', artis: 'Carl Boberg' },
                { id: 's3', judul: '10,000 Reasons', artis: 'Matt Redman' },
            ],
            catatan: 'Dress code: smart casual. Latihan diadakan jam 8 pagi di ruang musik.'
        },
        '3': {
            id: '3',
            event: 'Ibadah Minggu Pagi',
            tanggal: '2025-05-19',
            waktu: '09:00',
            lokasi: 'Gedung Utama',
            peranAnda: 'Usher',
            pelayanan: 'Welcome Ministry',
            status: 'pending',
            timPelayanan: [
                { id: 't4', nama: 'Dewi Anggraini', peran: 'PIC Usher' },
                { id: 't5', nama: 'Eko Prasetyo', peran: 'Usher' },
            ],
            catatan: 'Briefing tim jam 8:30 di lobi utama. Harap hadir tepat waktu.'
        }
    };
    // A simple way to handle not found
    const data = mockData[id] || mockData['1'];
    setSchedule(data);
  }, [id]);

  if (!schedule) {
    return <div className="text-center p-8">Jadwal tidak ditemukan atau sedang memuat...</div>;
  }
  
  const {from, to} = getPelayananColor(schedule.pelayanan);

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title={schedule.event}
        description={`Anda dijadwalkan sebagai ${schedule.peranAnda} untuk pelayanan ${schedule.pelayanan}.`}
        actionLabel='Kembali ke Jadwal'
        gradientFrom={from}
        gradientTo={to}
        onAction={() => router.push('/dashboard/jadwal-saya')}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>Detail Jadwal</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm'>
                <div className="flex items-center"><FiCalendar className="w-4 h-4 mr-3 text-gray-400"/><div><p className="text-gray-500">Tanggal</p><p className="font-medium text-gray-700">{new Date(schedule.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div></div>
                <div className="flex items-center"><FiClock className="w-4 h-4 mr-3 text-gray-400"/><div><p className="text-gray-500">Waktu</p><p className="font-medium text-gray-700">{schedule.waktu}</p></div></div>
                <div className="flex items-center"><FiMapPin className="w-4 h-4 mr-3 text-gray-400"/><div><p className="text-gray-500">Lokasi</p><p className="font-medium text-gray-700">{schedule.lokasi}</p></div></div>
                <div className="flex items-center"><FiAward className="w-4 h-4 mr-3 text-gray-400"/><div><p className="text-gray-500">Peran Anda</p><p className="font-medium text-gray-700">{schedule.peranAnda}</p></div></div>
            </div>
        </div>

        {schedule.status === 'pending' && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <FiAlertCircle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                            Jadwal ini masih menunggu konfirmasi Anda.
                        </p>
                         <div className="mt-4 flex space-x-4">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">Konfirmasi Kehadiran</Button>
                            <Button size="sm" variant="outline">Tolak Jadwal</Button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'><FiUsers className="mr-3"/>Tim Pelayanan</h3>
                <ul className="space-y-3">
                    {schedule.timPelayanan.map(member => (
                        <li key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                           <span className="font-medium text-gray-800">{member.nama}</span>
                           <span className="text-sm text-gray-500">{member.peran}</span>
                        </li>
                    ))}
                </ul>
            </div>
            {schedule.daftarLagu && (
                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'><FiMusic className="mr-3"/>Daftar Lagu</h3>
                     <ul className="space-y-3">
                        {schedule.daftarLagu.map(song => (
                            <li key={song.id} className="p-3 bg-gray-50 rounded-md">
                               <p className="font-medium text-gray-800">{song.judul}</p>
                               <p className="text-sm text-gray-500">{song.artis}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>

         {schedule.catatan && (
                 <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h3 className='text-lg font-semibold text-gray-800 mb-2'>Catatan Tambahan</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{schedule.catatan}</p>
                </div>
            )}
      </motion.div>
    </div>
  );
}
