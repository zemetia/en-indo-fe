'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';
import {
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiGrid,
  FiInfo,
  FiList,
  FiMapPin,
  FiSave,
  FiX,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';

// Tanggal hari ini
const HARI_INI = new Date();

// Daftar nama bulan dalam Bahasa Indonesia
const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli',
  'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// Daftar nama hari dalam Bahasa Indonesia
const NAMA_HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// Dummy data untuk contoh
const dummyEvents = [
  // April 2025
  { id: '1', tanggal: '2025-04-07', waktu: '09:00 - 12:00', nama: 'Ibadah Minggu', lokasi: 'Gedung Utama', warna: 'indigo' },
  { id: '11', tanggal: '2025-04-07', waktu: '12:00 - 15:00', nama: 'Ibadah Minggu', lokasi: 'Gedung Utama', warna: 'indigo' },
  { id: '2', tanggal: '2025-04-14', waktu: '09:00 - 12:00', nama: 'Ibadah Minggu', lokasi: 'Gedung Utama', warna: 'indigo' },
  { id: '3', tanggal: '2025-04-21', waktu: '09:00 - 12:00', nama: 'Ibadah Minggu', lokasi: 'Gedung Utama', warna: 'indigo' },
  { id: '4', tanggal: '2025-04-28', waktu: '09:00 - 12:00', nama: 'Ibadah Minggu', lokasi: 'Gedung Utama', warna: 'indigo' },
  { id: '5', tanggal: '2025-04-12', waktu: '18:30 - 21:00', nama: 'Doa Jumat', lokasi: 'Aula Samping', warna: 'sky' },
  { id: '6', tanggal: '2025-04-19', waktu: '18:30 - 21:00', nama: 'Doa Jumat', lokasi: 'Aula Samping', warna: 'sky' },
  { id: '7', tanggal: '2025-04-10', waktu: '18:00 - 20:00', nama: 'Latihan Musik', lokasi: 'Studio Musik', warna: 'teal' },
  { id: '8', tanggal: '2025-04-17', waktu: '18:00 - 20:00', nama: 'Latihan Musik', lokasi: 'Studio Musik', warna: 'teal' },
  { id: '9', tanggal: '2025-04-24', waktu: '18:00 - 20:00', nama: 'Latihan Musik', lokasi: 'Studio Musik', warna: 'teal' },
  // Mei 2025
  { id: '10', tanggal: '2025-05-05', waktu: '09:00 - 12:00', nama: 'Ibadah Minggu', lokasi: 'Gedung Utama', warna: 'indigo' },
  { id: '11', tanggal: '2025-05-12', waktu: '09:00 - 12:00', nama: 'Ibadah Minggu', lokasi: 'Gedung Utama', warna: 'indigo' },
  { id: '12', tanggal: '2025-05-19', waktu: '09:00 - 12:00', nama: 'Ibadah Minggu', lokasi: 'Gedung Utama', warna: 'indigo' },
  { id: '13', tanggal: '2025-05-26', waktu: '09:00 - 12:00', nama: 'Ibadah Minggu', lokasi: 'Gedung Utama', warna: 'indigo' },
  { id: '14', tanggal: '2025-05-03', waktu: '18:30 - 21:00', nama: 'Doa Jumat', lokasi: 'Aula Samping', warna: 'sky' },
  { id: '15', tanggal: '2025-05-10', waktu: '18:30 - 21:00', nama: 'Doa Jumat', lokasi: 'Aula Samping', warna: 'sky' },
  { id: '16', tanggal: '2025-05-17', waktu: '18:30 - 21:00', nama: 'Doa Jumat', lokasi: 'Aula Samping', warna: 'sky' },
  { id: '17', tanggal: '2025-05-24', waktu: '18:30 - 21:00', nama: 'Doa Jumat', lokasi: 'Aula Samping', warna: 'sky' },
  { id: '18', tanggal: '2025-05-31', waktu: '18:30 - 21:00', nama: 'Doa Jumat', lokasi: 'Aula Samping', warna: 'sky' },
  { id: '19', tanggal: '2025-05-01', waktu: '18:00 - 20:00', nama: 'Latihan Musik', lokasi: 'Studio Musik', warna: 'teal' },
  { id: '20', tanggal: '2025-05-08', waktu: '18:00 - 20:00', nama: 'Latihan Musik', lokasi: 'Studio Musik', warna: 'teal' },
  { id: '21', tanggal: '2025-05-15', waktu: '18:00 - 20:00', nama: 'Latihan Musik', lokasi: 'Studio Musik', warna: 'teal' },
  { id: '22', tanggal: '2025-05-22', waktu: '18:00 - 20:00', nama: 'Latihan Musik', lokasi: 'Studio Musik', warna: 'teal' },
  { id: '23', tanggal: '2025-05-29', waktu: '18:00 - 20:00', nama: 'Latihan Musik', lokasi: 'Studio Musik', warna: 'teal' },
  // Event Spesial
  { id: '24', tanggal: '2025-04-30', waktu: '17:00 - 21:00', nama: 'Konser Paskah', lokasi: 'Aula Utama', warna: 'purple' },
  { id: '25', tanggal: '2025-05-20', waktu: '09:00 - 15:00', nama: 'Retret Pelayan Musik', lokasi: 'Villa Retreat', warna: 'purple' },
];

// Enum untuk status ketersediaan
enum StatusKetersediaan {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  TENTATIVE = 'tentative',
  UNSELECTED = 'unselected',
}

export default function KetersediaanPage() {
  const { showToast } = useToast();
  const [bulanSaatIni, setBulanSaatIni] = React.useState(HARI_INI.getMonth());
  const [tahunSaatIni, setTahunSaatIni] = React.useState(HARI_INI.getFullYear());
  const [ketersediaan, setKetersediaan] = React.useState<Record<string, StatusKetersediaan>>({});
  const [tampilan, setTampilan] = React.useState<'kalender' | 'daftar'>('kalender');

  React.useEffect(() => {
    const checkIsMobile = () => {
      if (window.innerWidth < 768) {
        setTampilan('daftar');
      }
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const formatTanggal = (tanggal: Date): string => `${tanggal.getFullYear()}-${String(tanggal.getMonth() + 1).padStart(2, '0')}-${String(tanggal.getDate()).padStart(2, '0')}`;

  const getTanggalBulan = (): Date[] => {
    const hariPertamaBulan = new Date(tahunSaatIni, bulanSaatIni, 1);
    const hariPertamaMinggu = new Date(hariPertamaBulan);
    hariPertamaMinggu.setDate(hariPertamaMinggu.getDate() - hariPertamaMinggu.getDay());

    const hariTerakhirBulan = new Date(tahunSaatIni, bulanSaatIni + 1, 0);
    const hariTerakhirMinggu = new Date(hariTerakhirBulan);
    hariTerakhirMinggu.setDate(hariTerakhirMinggu.getDate() + (6 - hariTerakhirMinggu.getDay()));

    const tanggalArray = [];
    for (let d = new Date(hariPertamaMinggu); d <= hariTerakhirMinggu; d.setDate(d.getDate() + 1)) {
      tanggalArray.push(new Date(d));
    }
    return tanggalArray;
  };

  const bulanSebelumnya = () => setBulanSaatIni(prev => prev === 0 ? (setTahunSaatIni(t => t - 1), 11) : prev - 1);
  const bulanBerikutnya = () => setBulanSaatIni(prev => prev === 11 ? (setTahunSaatIni(t => t + 1), 0) : prev + 1);

  const cekEventTanggal = (tanggal: Date) => dummyEvents.filter((event) => event.tanggal === formatTanggal(tanggal));

  const ubahKetersediaan = (tanggal: Date, event: any) => {
    const tanggalKey = `${event.id}_${formatTanggal(tanggal)}`;
    const statusSaatIni = ketersediaan[tanggalKey];
    let statusBaru: StatusKetersediaan;

    if (statusSaatIni === StatusKetersediaan.AVAILABLE) statusBaru = StatusKetersediaan.TENTATIVE;
    else if (statusSaatIni === StatusKetersediaan.TENTATIVE) statusBaru = StatusKetersediaan.UNAVAILABLE;
    else if (statusSaatIni === StatusKetersediaan.UNAVAILABLE) statusBaru = StatusKetersediaan.UNSELECTED;
    else statusBaru = StatusKetersediaan.AVAILABLE;

    setKetersediaan((prev) => ({ ...prev, [tanggalKey]: statusBaru }));
  };

  const simpanKetersediaan = () => {
    console.log('Menyimpan ketersediaan:', ketersediaan);
    showToast('Ketersediaan berhasil disimpan!', 'success');
  };

  const getEventsBulanIni = () => dummyEvents.filter(event => new Date(event.tanggal).getMonth() === bulanSaatIni && new Date(event.tanggal).getFullYear() === tahunSaatIni).sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  const formatTanggalHuman = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${NAMA_BULAN[date.getMonth()]} ${date.getFullYear()}`;
  };

  const groupedEvents = getEventsBulanIni().reduce((acc, event) => {
    (acc[event.tanggal] = acc[event.tanggal] || []).push(event);
    return acc;
  }, {} as Record<string, typeof dummyEvents>);

  const renderDaftarEvent = () => (
    <div className='mt-6 space-y-6'>
      {Object.keys(groupedEvents).length === 0 ? (
        <div className='bg-gray-50 rounded-xl p-8 text-center'>
          <FiCalendar className='w-12 h-12 text-gray-400 mx-auto mb-3' />
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>Tidak ada event</h3>
          <p className='text-gray-600'>Tidak ada jadwal pelayanan di bulan ini.</p>
        </div>
      ) : (
        Object.entries(groupedEvents).map(([tanggal, events]) => {
          const tanggalObj = new Date(tanggal);
          const isHariIni = formatTanggal(new Date()) === tanggal;
          return (
            <motion.div key={tanggal} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <div className={`flex items-center p-2 rounded-t-lg ${isHariIni ? 'bg-indigo-50' : 'bg-gray-50'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isHariIni ? 'bg-indigo-500 text-white' : 'bg-gray-200 text-gray-700'}`}>{tanggalObj.getDate()}</div>
                <div>
                  <h3 className='font-medium text-gray-900'>{formatTanggalHuman(tanggal)}</h3>
                  <p className='text-xs text-gray-500'>{NAMA_HARI[tanggalObj.getDay()]}</p>
                </div>
              </div>
              <div className='border-l-2 border-indigo-100 pl-4 py-2 space-y-3'>
                {events.map((event) => {
                  const eventKey = `${event.id}_${tanggal}`;
                  const statusKetersediaan = ketersediaan[eventKey] || StatusKetersediaan.UNSELECTED;
                  const colors = { indigo: 'bg-indigo-50 border-indigo-200', sky: 'bg-sky-50 border-sky-200', teal: 'bg-teal-50 border-teal-200', purple: 'bg-purple-50 border-purple-200' };
                  const statusStyles = {
                    [StatusKetersediaan.AVAILABLE]: { bg: 'bg-green-100', text: 'text-green-800', label: 'Bisa Hadir', icon: <FiCheck className='w-3 h-3 mr-1' /> },
                    [StatusKetersediaan.TENTATIVE]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Mungkin', icon: <FiInfo className='w-3 h-3 mr-1' /> },
                    [StatusKetersediaan.UNAVAILABLE]: { bg: 'bg-red-100', text: 'text-red-800', label: 'Tidak Bisa', icon: <FiX className='w-3 h-3 mr-1' /> }
                  };
                  return (
                    <motion.div key={event.id} className={`p-3 rounded-lg border shadow-sm ${colors[event.warna as keyof typeof colors] || ''} relative cursor-pointer`} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => ubahKetersediaan(tanggalObj, event)}>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h4 className='font-medium text-gray-800'>{event.nama}</h4>
                          <div className='flex items-center mt-1 text-xs text-gray-600'><FiClock className='w-3 h-3 mr-1 text-gray-500' />{event.waktu}</div>
                          <div className='flex items-center mt-1 text-xs text-gray-600'><FiMapPin className='w-3 h-3 mr-1 text-gray-500' />{event.lokasi}</div>
                        </div>
                        {statusKetersediaan !== StatusKetersediaan.UNSELECTED ? (
                          <span className={`px-2 py-1 rounded-full text-xs flex items-center ${statusStyles[statusKetersediaan].bg} ${statusStyles[statusKetersediaan].text}`}>{statusStyles[statusKetersediaan].icon}{statusStyles[statusKetersediaan].label}</span>
                        ) : (
                          <span className='px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600'>Klik untuk pilih</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })
      )}
    </div>
  );

  const renderKalender = () => {
    const tanggalBulan = getTanggalBulan();
    return (
      <div className='border border-gray-200 rounded-xl overflow-hidden shadow-sm mt-6'>
        <div className='grid grid-cols-7 bg-gray-50 border-b'>{NAMA_HARI.map(hari => <div key={hari} className='p-3 text-center text-sm font-semibold text-gray-600'>{hari}</div>)}</div>
        <div className='grid grid-cols-7 grid-rows-6'>
          {tanggalBulan.map((tanggal, index) => {
            const tanggalStr = formatTanggal(tanggal);
            const events = cekEventTanggal(tanggal);
            const isBulanLain = tanggal.getMonth() !== bulanSaatIni;
            const isHariIni = tanggalStr === formatTanggal(HARI_INI);
            return (
              <div key={index} className={`relative p-2 h-32 border-b border-r border-gray-200 ${isBulanLain ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full mb-1 text-sm ${isHariIni ? 'bg-indigo-600 text-white font-bold' : isBulanLain ? 'text-gray-400' : 'text-gray-700'}`}>{tanggal.getDate()}</div>
                <div className='space-y-1 overflow-y-auto max-h-20'>
                  {events.map(event => {
                    const eventKey = `${event.id}_${tanggalStr}`;
                    const status = ketersediaan[eventKey] || StatusKetersediaan.UNSELECTED;
                    const statusColors = { [StatusKetersediaan.AVAILABLE]: 'bg-green-500', [StatusKetersediaan.TENTATIVE]: 'bg-yellow-500', [StatusKetersediaan.UNAVAILABLE]: 'bg-red-500' };
                    return (
                      <motion.div key={event.id} className='p-1.5 rounded-md text-xs cursor-pointer bg-indigo-50 hover:bg-indigo-100' onClick={() => ubahKetersediaan(tanggal, event)}>
                        <div className='flex items-center font-medium text-indigo-800'>
                          {status !== StatusKetersediaan.UNSELECTED && <div className={`w-2 h-2 rounded-full mr-1.5 ${statusColors[status]}`}></div>}
                          <span className="truncate">{event.nama}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderInfoKetersediaan = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
      <div className='p-4 bg-gray-50 rounded-xl border border-gray-200'>
        <h3 className='text-md font-semibold text-gray-800 mb-3 flex items-center'><FiInfo className='w-5 h-5 mr-2 text-indigo-500' />Status Ketersediaan</h3>
        <div className='flex flex-wrap gap-4'>
          <div className='flex items-center'><div className='w-3 h-3 rounded-full bg-green-500 mr-2'></div><span className='text-sm text-gray-700'>Bisa hadir</span></div>
          <div className='flex items-center'><div className='w-3 h-3 rounded-full bg-yellow-500 mr-2'></div><span className='text-sm text-gray-700'>Mungkin</span></div>
          <div className='flex items-center'><div className='w-3 h-3 rounded-full bg-red-500 mr-2'></div><span className='text-sm text-gray-700'>Tidak bisa</span></div>
        </div>
        <p className='text-xs text-gray-500 mt-3'>Tip: Klik pada acara untuk mengubah status ketersediaan Anda.</p>
      </div>
    </motion.div>
  );

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Ketersediaan Pelayanan'
        description='Tandai ketersediaan Anda untuk jadwal pelayanan yang akan datang.'
        actionLabel='Simpan'
        onAction={simpanKetersediaan}
        gradientFrom='from-purple-500'
        gradientTo='to-indigo-500'
      />
      
      <Card>
        <CardHeader>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <CardTitle>Kalender Ketersediaan</CardTitle>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2'>
                <Button variant="outline" size="icon" onClick={bulanSebelumnya}><FiChevronLeft className='w-4 h-4' /></Button>
                <h2 className='text-lg font-semibold text-gray-800 w-40 text-center'>{NAMA_BULAN[bulanSaatIni]} {tahunSaatIni}</h2>
                <Button variant="outline" size="icon" onClick={bulanBerikutnya}><FiChevronRight className='w-4 h-4' /></Button>
              </div>
              <div className='hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg'>
                  <Button size="sm" variant={tampilan === 'kalender' ? 'default' : 'ghost'} onClick={() => setTampilan('kalender')} className="flex items-center gap-2"><FiGrid className="w-4 h-4" />Kalender</Button>
                  <Button size="sm" variant={tampilan === 'daftar' ? 'default' : 'ghost'} onClick={() => setTampilan('daftar')} className="flex items-center gap-2"><FiList className="w-4 h-4" />Daftar</Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderInfoKetersediaan()}
          <div className='md:block hidden'>{tampilan === 'kalender' ? renderKalender() : renderDaftarEvent()}</div>
          <div className='md:hidden block'>{renderDaftarEvent()}</div>
        </CardContent>
      </Card>
    </div>
  );
}
