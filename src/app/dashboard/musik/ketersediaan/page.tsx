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

// Tanggal hari ini
const HARI_INI = new Date();

// Daftar nama bulan dalam Bahasa Indonesia
const NAMA_BULAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

// Daftar nama hari dalam Bahasa Indonesia
const NAMA_HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// Dummy data untuk contoh
const dummyEvents = [
  // April 2025
  {
    id: '1',
    tanggal: '2025-04-07',
    waktu: '09:00 - 12:00',
    nama: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    warna: 'indigo',
  },
  {
    id: '11',
    tanggal: '2025-04-07',
    waktu: '12:00 - 15:00',
    nama: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    warna: 'indigo',
  },
  {
    id: '2',
    tanggal: '2025-04-14',
    waktu: '09:00 - 12:00',
    nama: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    warna: 'indigo',
  },
  {
    id: '3',
    tanggal: '2025-04-21',
    waktu: '09:00 - 12:00',
    nama: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    warna: 'indigo',
  },
  {
    id: '4',
    tanggal: '2025-04-28',
    waktu: '09:00 - 12:00',
    nama: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    warna: 'indigo',
  },
  {
    id: '5',
    tanggal: '2025-04-12',
    waktu: '18:30 - 21:00',
    nama: 'Doa Jumat',
    lokasi: 'Aula Samping',
    warna: 'sky',
  },
  {
    id: '6',
    tanggal: '2025-04-19',
    waktu: '18:30 - 21:00',
    nama: 'Doa Jumat',
    lokasi: 'Aula Samping',
    warna: 'sky',
  },
  {
    id: '7',
    tanggal: '2025-04-10',
    waktu: '18:00 - 20:00',
    nama: 'Latihan Musik',
    lokasi: 'Studio Musik',
    warna: 'teal',
  },
  {
    id: '8',
    tanggal: '2025-04-17',
    waktu: '18:00 - 20:00',
    nama: 'Latihan Musik',
    lokasi: 'Studio Musik',
    warna: 'teal',
  },
  {
    id: '9',
    tanggal: '2025-04-24',
    waktu: '18:00 - 20:00',
    nama: 'Latihan Musik',
    lokasi: 'Studio Musik',
    warna: 'teal',
  },
  // Mei 2025
  {
    id: '10',
    tanggal: '2025-05-05',
    waktu: '09:00 - 12:00',
    nama: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    warna: 'indigo',
  },
  {
    id: '11',
    tanggal: '2025-05-12',
    waktu: '09:00 - 12:00',
    nama: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    warna: 'indigo',
  },
  {
    id: '12',
    tanggal: '2025-05-19',
    waktu: '09:00 - 12:00',
    nama: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    warna: 'indigo',
  },
  {
    id: '13',
    tanggal: '2025-05-26',
    waktu: '09:00 - 12:00',
    nama: 'Ibadah Minggu',
    lokasi: 'Gedung Utama',
    warna: 'indigo',
  },
  {
    id: '14',
    tanggal: '2025-05-03',
    waktu: '18:30 - 21:00',
    nama: 'Doa Jumat',
    lokasi: 'Aula Samping',
    warna: 'sky',
  },
  {
    id: '15',
    tanggal: '2025-05-10',
    waktu: '18:30 - 21:00',
    nama: 'Doa Jumat',
    lokasi: 'Aula Samping',
    warna: 'sky',
  },
  {
    id: '16',
    tanggal: '2025-05-17',
    waktu: '18:30 - 21:00',
    nama: 'Doa Jumat',
    lokasi: 'Aula Samping',
    warna: 'sky',
  },
  {
    id: '17',
    tanggal: '2025-05-24',
    waktu: '18:30 - 21:00',
    nama: 'Doa Jumat',
    lokasi: 'Aula Samping',
    warna: 'sky',
  },
  {
    id: '18',
    tanggal: '2025-05-31',
    waktu: '18:30 - 21:00',
    nama: 'Doa Jumat',
    lokasi: 'Aula Samping',
    warna: 'sky',
  },
  {
    id: '19',
    tanggal: '2025-05-01',
    waktu: '18:00 - 20:00',
    nama: 'Latihan Musik',
    lokasi: 'Studio Musik',
    warna: 'teal',
  },
  {
    id: '20',
    tanggal: '2025-05-08',
    waktu: '18:00 - 20:00',
    nama: 'Latihan Musik',
    lokasi: 'Studio Musik',
    warna: 'teal',
  },
  {
    id: '21',
    tanggal: '2025-05-15',
    waktu: '18:00 - 20:00',
    nama: 'Latihan Musik',
    lokasi: 'Studio Musik',
    warna: 'teal',
  },
  {
    id: '22',
    tanggal: '2025-05-22',
    waktu: '18:00 - 20:00',
    nama: 'Latihan Musik',
    lokasi: 'Studio Musik',
    warna: 'teal',
  },
  {
    id: '23',
    tanggal: '2025-05-29',
    waktu: '18:00 - 20:00',
    nama: 'Latihan Musik',
    lokasi: 'Studio Musik',
    warna: 'teal',
  },
  // Event Spesial
  {
    id: '24',
    tanggal: '2025-04-30',
    waktu: '17:00 - 21:00',
    nama: 'Konser Paskah',
    lokasi: 'Aula Utama',
    warna: 'purple',
  },
  {
    id: '25',
    tanggal: '2025-05-20',
    waktu: '09:00 - 15:00',
    nama: 'Retret Pelayan Musik',
    lokasi: 'Villa Retreat',
    warna: 'purple',
  },
];

// Enum untuk status ketersediaan
enum StatusKetersediaan {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  TENTATIVE = 'tentative',
  UNSELECTED = 'unselected',
}

export default function KetersediaanPage() {
  // State untuk bulan dan tahun yang sedang ditampilkan
  const [bulanSaatIni, setBulanSaatIni] = React.useState(HARI_INI.getMonth());
  const [tahunSaatIni, setTahunSaatIni] = React.useState(
    HARI_INI.getFullYear()
  );

  // State untuk menyimpan ketersediaan
  const [ketersediaan, setKetersediaan] = React.useState<
    Record<string, StatusKetersediaan>
  >({});

  // State untuk informasi detail event yang dipilih
  const [eventDipilih, setEventDipilih] = React.useState<null | any>(null);

  // State untuk tanggal yang di-hover
  const [tanggalHover, setTanggalHover] = React.useState<string | null>(null);

  // State untuk menampilkan notifikasi
  const [notifikasi, setNotifikasi] = React.useState<{
    tampil: boolean;
    pesan: string;
    tipe: 'sukses' | 'error';
  }>({
    tampil: false,
    pesan: '',
    tipe: 'sukses',
  });

  // State untuk tampilan (kalender atau daftar)
  const [tampilan, setTampilan] = React.useState<'kalender' | 'daftar'>(
    'kalender'
  );

  // State untuk deteksi ukuran layar
  const [isMobile, setIsMobile] = React.useState(false);

  // Effect untuk deteksi ukuran layar
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px adalah breakpoint md di Tailwind
      if (window.innerWidth < 768) {
        setTampilan('daftar');
      } else {
        setTampilan('kalender');
      }
    };

    // Cek ukuran layar saat komponen di-mount
    checkIsMobile();

    // Tambahkan event listener untuk perubahan ukuran layar
    window.addEventListener('resize', checkIsMobile);

    // Cleanup event listener saat komponen di-unmount
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Fungsi untuk mendapatkan tanggal dalam format string YYYY-MM-DD
  const formatTanggal = (tanggal: Date): string => {
    return `${tanggal.getFullYear()}-${String(tanggal.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(tanggal.getDate()).padStart(2, '0')}`;
  };

  // Fungsi untuk mendapatkan array tanggal dalam bulan
  const getTanggalBulan = () => {
    const hariPertamaBulan = new Date(tahunSaatIni, bulanSaatIni, 1);
    const hariPertamaMinggu = new Date(hariPertamaBulan);
    hariPertamaMinggu.setDate(
      hariPertamaMinggu.getDate() - hariPertamaMinggu.getDay()
    );

    const hariTerakhirBulan = new Date(tahunSaatIni, bulanSaatIni + 1, 0);
    const hariTerakhirMinggu = new Date(hariTerakhirBulan);
    hariTerakhirMinggu.setDate(
      hariTerakhirMinggu.getDate() + (6 - hariTerakhirMinggu.getDay())
    );

    const tanggalArray = [];
    const tanggalIterasi = new Date(hariPertamaMinggu);

    while (tanggalIterasi <= hariTerakhirMinggu) {
      tanggalArray.push(new Date(tanggalIterasi));
      tanggalIterasi.setDate(tanggalIterasi.getDate() + 1);
    }

    return tanggalArray;
  };

  // Fungsi untuk pindah ke bulan sebelumnya
  const bulanSebelumnya = () => {
    if (bulanSaatIni === 0) {
      setBulanSaatIni(11);
      setTahunSaatIni(tahunSaatIni - 1);
    } else {
      setBulanSaatIni(bulanSaatIni - 1);
    }
  };

  // Fungsi untuk pindah ke bulan berikutnya
  const bulanBerikutnya = () => {
    if (bulanSaatIni === 11) {
      setBulanSaatIni(0);
      setTahunSaatIni(tahunSaatIni + 1);
    } else {
      setBulanSaatIni(bulanSaatIni + 1);
    }
  };

  // Fungsi untuk mengecek apakah tanggal memiliki event
  const cekEventTanggal = (tanggal: Date) => {
    const tanggalStr = formatTanggal(tanggal);
    return dummyEvents.filter((event) => event.tanggal === tanggalStr);
  };

  // Fungsi untuk menampilkan detail event
  const tampilDetailEvent = (event: any) => {
    setEventDipilih(event);
  };

  // Fungsi untuk mengubah status ketersediaan
  const ubahKetersediaan = (tanggal: Date, event: any) => {
    const tanggalKey = `${event.id}_${formatTanggal(tanggal)}`;

    // Rotasi status: unselected -> available -> tentative -> unavailable -> unselected
    let statusBaru = StatusKetersediaan.AVAILABLE;

    if (ketersediaan[tanggalKey] === StatusKetersediaan.AVAILABLE) {
      statusBaru = StatusKetersediaan.TENTATIVE;
    } else if (ketersediaan[tanggalKey] === StatusKetersediaan.TENTATIVE) {
      statusBaru = StatusKetersediaan.UNAVAILABLE;
    } else if (ketersediaan[tanggalKey] === StatusKetersediaan.UNAVAILABLE) {
      statusBaru = StatusKetersediaan.UNSELECTED;
    }

    setKetersediaan((prev) => ({
      ...prev,
      [tanggalKey]: statusBaru,
    }));
  };

  // Fungsi untuk menyimpan ketersediaan
  const simpanKetersediaan = () => {
    // Di sini akan dilakukan API call untuk menyimpan data ke server
    console.log('Menyimpan ketersediaan:', ketersediaan);

    // Tampilkan notifikasi sukses
    setNotifikasi({
      tampil: true,
      pesan: 'Ketersediaan berhasil disimpan!',
      tipe: 'sukses',
    });

    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => {
      setNotifikasi((prev) => ({ ...prev, tampil: false }));
    }, 3000);
  };

  // Fungsi untuk mendapatkan event di bulan saat ini
  const getEventsBulanIni = () => {
    const bulanAwal = new Date(tahunSaatIni, bulanSaatIni, 1);
    const bulanAkhir = new Date(tahunSaatIni, bulanSaatIni + 1, 0);

    const formatTanggalObj = (date: Date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
      )}-${String(date.getDate()).padStart(2, '0')}`;
    };

    return dummyEvents
      .filter((event) => {
        const eventDate = new Date(event.tanggal);
        return eventDate >= bulanAwal && eventDate <= bulanAkhir;
      })
      .sort((a, b) => {
        // Urutkan berdasarkan tanggal
        return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
      });
  };

  // Fungsi untuk memformat tanggal menjadi tampilan yang lebih user-friendly
  const formatTanggalHuman = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${
      NAMA_BULAN[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  // Render tampilan daftar untuk mobile
  const renderDaftarEvent = () => {
    const eventsBulanIni = getEventsBulanIni();

    return (
      <div className='mt-6'>
        <motion.div
          className='flex justify-between items-center mb-6'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className='text-xl font-bold text-gray-800 flex items-center'>
            <FiCalendar className='w-5 h-5 mr-2 text-indigo-500' />
            {NAMA_BULAN[bulanSaatIni]} {tahunSaatIni}
          </h2>
          <div className='flex space-x-2'>
            <motion.button
              onClick={bulanSebelumnya}
              className='p-2 rounded-full bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-sm'
              whileHover={{ scale: 1.05, backgroundColor: '#eef2ff' }}
              whileTap={{ scale: 0.95 }}
            >
              <FiChevronLeft className='w-4 h-4' />
            </motion.button>
            <motion.button
              onClick={bulanBerikutnya}
              className='p-2 rounded-full bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-sm'
              whileHover={{ scale: 1.05, backgroundColor: '#eef2ff' }}
              whileTap={{ scale: 0.95 }}
            >
              <FiChevronRight className='w-4 h-4' />
            </motion.button>
          </div>
        </motion.div>

        <div className='space-y-4'>
          {eventsBulanIni.length === 0 ? (
            <div className='bg-gray-50 rounded-xl p-8 text-center'>
              <FiCalendar className='w-12 h-12 text-gray-400 mx-auto mb-3' />
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Tidak ada event
              </h3>
              <p className='text-gray-600'>
                Tidak ada jadwal pelayanan di bulan ini
              </p>
            </div>
          ) : (
            <div>
              {/* Grup event berdasarkan tanggal */}
              {Array.from(new Set(eventsBulanIni.map((e) => e.tanggal))).map(
                (tanggal) => {
                  const eventsByDate = eventsBulanIni.filter(
                    (e) => e.tanggal === tanggal
                  );
                  const tanggalObj = new Date(tanggal);
                  const isHariIni = formatTanggal(new Date()) === tanggal;

                  return (
                    <motion.div
                      key={tanggal}
                      className='mb-6'
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className={`flex items-center p-2 rounded-lg ${
                          isHariIni ? 'bg-indigo-50' : 'bg-gray-50'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                            isHariIni
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {tanggalObj.getDate()}
                        </div>
                        <div>
                          <h3 className='font-medium text-gray-900'>
                            {formatTanggalHuman(tanggal)}
                          </h3>
                          <p className='text-xs text-gray-500'>
                            {NAMA_HARI[tanggalObj.getDay()]}
                          </p>
                        </div>
                      </div>

                      <div className='ml-5 border-l-2 border-indigo-100 pl-4 pt-2 pb-1 space-y-3'>
                        {eventsByDate.map((event) => {
                          const eventKey = `${event.id}_${tanggal}`;
                          const statusKetersediaan =
                            ketersediaan[eventKey] ||
                            StatusKetersediaan.UNSELECTED;

                          let eventBgColor = '';
                          let statusBgColor = '';
                          let statusText = '';
                          let statusIcon = null;

                          // Event styling based on type
                          if (event.warna === 'indigo') {
                            eventBgColor = 'bg-indigo-50 border-indigo-200';
                          } else if (event.warna === 'sky') {
                            eventBgColor = 'bg-sky-50 border-sky-200';
                          } else if (event.warna === 'teal') {
                            eventBgColor = 'bg-teal-50 border-teal-200';
                          } else if (event.warna === 'purple') {
                            eventBgColor = 'bg-purple-50 border-purple-200';
                          }

                          // Status styling
                          if (
                            statusKetersediaan === StatusKetersediaan.AVAILABLE
                          ) {
                            statusBgColor = 'bg-green-100 text-green-800';
                            statusText = 'Bisa Hadir';
                            statusIcon = <FiCheck className='w-3 h-3 mr-1' />;
                          } else if (
                            statusKetersediaan === StatusKetersediaan.TENTATIVE
                          ) {
                            statusBgColor = 'bg-yellow-100 text-yellow-800';
                            statusText = 'Mungkin';
                            statusIcon = <FiInfo className='w-3 h-3 mr-1' />;
                          } else if (
                            statusKetersediaan ===
                            StatusKetersediaan.UNAVAILABLE
                          ) {
                            statusBgColor = 'bg-red-100 text-red-800';
                            statusText = 'Tidak Bisa';
                            statusIcon = <FiX className='w-3 h-3 mr-1' />;
                          }

                          return (
                            <motion.div
                              key={event.id}
                              className={`p-3 rounded-lg border shadow-sm ${eventBgColor} relative`}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => {
                                tampilDetailEvent(event);
                                ubahKetersediaan(new Date(tanggal), event);
                              }}
                            >
                              <div className='flex justify-between items-start'>
                                <div>
                                  <h4 className='font-medium text-gray-800'>
                                    {event.nama}
                                  </h4>
                                  <div className='flex items-center mt-1'>
                                    <FiClock className='w-3 h-3 mr-1 text-gray-500' />
                                    <span className='text-xs text-gray-600'>
                                      {event.waktu}
                                    </span>
                                  </div>
                                  <div className='flex items-center mt-1'>
                                    <FiMapPin className='w-3 h-3 mr-1 text-gray-500' />
                                    <span className='text-xs text-gray-600'>
                                      {event.lokasi}
                                    </span>
                                  </div>
                                </div>

                                {statusKetersediaan !==
                                StatusKetersediaan.UNSELECTED ? (
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs flex items-center ${statusBgColor}`}
                                  >
                                    {statusIcon}
                                    {statusText}
                                  </span>
                                ) : (
                                  <span className='px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 flex items-center'>
                                    Klik untuk pilih
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render kalender
  const renderKalender = () => {
    const tanggalBulan = getTanggalBulan();
    const mingguArray = [];

    for (let i = 0; i < tanggalBulan.length; i += 7) {
      mingguArray.push(tanggalBulan.slice(i, i + 7));
    }

    return (
      <div className='mt-6'>
        <motion.div
          className='flex justify-between items-center mb-6'
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className='text-2xl font-bold text-gray-800 flex items-center'>
            <FiCalendar className='w-6 h-6 mr-2 text-indigo-500' />
            {NAMA_BULAN[bulanSaatIni]} {tahunSaatIni}
          </h2>
          <div className='flex space-x-3'>
            <motion.button
              onClick={bulanSebelumnya}
              className='p-2 rounded-full bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-sm'
              whileHover={{ scale: 1.05, backgroundColor: '#eef2ff' }}
              whileTap={{ scale: 0.95 }}
            >
              <FiChevronLeft className='w-5 h-5' />
            </motion.button>
            <motion.button
              onClick={bulanBerikutnya}
              className='p-2 rounded-full bg-white text-indigo-700 hover:bg-indigo-100 border border-indigo-200 shadow-sm'
              whileHover={{ scale: 1.05, backgroundColor: '#eef2ff' }}
              whileTap={{ scale: 0.95 }}
            >
              <FiChevronRight className='w-5 h-5' />
            </motion.button>
          </div>
        </motion.div>

        <div className='border border-indigo-100 rounded-xl overflow-hidden shadow-lg'>
          {/* Header Hari */}
          <div className='grid grid-cols-7 bg-indigo-50 border-b border-indigo-200'>
            {NAMA_HARI.map((hari, index) => (
              <div
                key={index}
                className='p-3 text-center text-indigo-700 font-semibold'
              >
                {hari}
              </div>
            ))}
          </div>

          {/* Grid Tanggal */}
          {mingguArray.map((minggu, mingguIndex) => (
            <div key={mingguIndex} className='grid grid-cols-7'>
              {minggu.map((tanggal, tanggalIndex) => {
                const tanggalStr = formatTanggal(tanggal);
                const events = cekEventTanggal(tanggal);
                const isBulanLain = tanggal.getMonth() !== bulanSaatIni;
                const isHariIni = tanggalStr === formatTanggal(HARI_INI);
                const isHover = tanggalStr === tanggalHover;

                return (
                  <motion.div
                    key={tanggalIndex}
                    className={`relative p-2 min-h-[120px] border-b border-r border-indigo-100 
                      ${
                        isBulanLain ? 'bg-gray-50/70 text-gray-400' : 'bg-white'
                      } 
                      ${isHariIni ? 'bg-indigo-50/70' : ''}
                      ${isHover ? 'bg-indigo-50/30' : ''}
                      hover:bg-indigo-50/20 transition-colors duration-200`}
                    onMouseEnter={() => setTanggalHover(tanggalStr)}
                    onMouseLeave={() => setTanggalHover(null)}
                  >
                    <div className='flex justify-between items-start'>
                      <motion.div
                        className={`w-8 h-8 flex items-center justify-center rounded-full mb-2
                        ${
                          isHariIni
                            ? 'bg-indigo-500 text-white font-bold shadow-md'
                            : 'font-medium text-gray-700'
                        }`}
                        whileHover={
                          !isHariIni
                            ? { scale: 1.1, backgroundColor: '#eef2ff' }
                            : {}
                        }
                      >
                        {tanggal.getDate()}
                      </motion.div>

                      {events.length > 0 && (
                        <div className='w-2 h-2 rounded-full bg-indigo-500 animate-pulse mr-1'></div>
                      )}
                    </div>

                    <AnimatePresence>
                      {events.length > 0 && (
                        <div className='mt-1 space-y-2'>
                          {events.map((event) => {
                            const eventKey = `${event.id}_${tanggalStr}`;
                            const statusKetersediaan =
                              ketersediaan[eventKey] ||
                              StatusKetersediaan.UNSELECTED;

                            let eventBgColor = '';
                            let eventBorderColor = '';
                            let statusBgColor = '';

                            // Event styling based on type and status
                            if (event.warna === 'indigo') {
                              eventBgColor = 'bg-indigo-50';
                              eventBorderColor = 'border-indigo-200';
                            } else if (event.warna === 'sky') {
                              eventBgColor = 'bg-sky-50';
                              eventBorderColor = 'border-sky-200';
                            } else if (event.warna === 'teal') {
                              eventBgColor = 'bg-teal-50';
                              eventBorderColor = 'border-teal-200';
                            } else if (event.warna === 'purple') {
                              eventBgColor = 'bg-purple-50';
                              eventBorderColor = 'border-purple-200';
                            }

                            if (
                              statusKetersediaan ===
                              StatusKetersediaan.AVAILABLE
                            ) {
                              statusBgColor = 'bg-green-400';
                            } else if (
                              statusKetersediaan ===
                              StatusKetersediaan.TENTATIVE
                            ) {
                              statusBgColor = 'bg-yellow-400';
                            } else if (
                              statusKetersediaan ===
                              StatusKetersediaan.UNAVAILABLE
                            ) {
                              statusBgColor = 'bg-red-400';
                            }

                            return (
                              <motion.div
                                key={event.id}
                                className={`p-2 rounded-lg text-xs shadow-sm cursor-pointer 
                                  border ${eventBorderColor} ${eventBgColor} relative overflow-hidden`}
                                whileHover={{
                                  scale: 1.02,
                                  boxShadow:
                                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                  tampilDetailEvent(event);
                                  ubahKetersediaan(tanggal, event);
                                }}
                                layout
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                              >
                                {/* Status indicator */}
                                {statusKetersediaan !==
                                  StatusKetersediaan.UNSELECTED && (
                                  <div
                                    className={`absolute left-0 top-0 bottom-0 w-1 ${statusBgColor}`}
                                  ></div>
                                )}

                                <div className='font-medium text-gray-800 truncate'>
                                  {event.nama}
                                </div>
                                <div className='flex items-center mt-1'>
                                  <FiClock className='w-3 h-3 mr-1 text-gray-500' />
                                  <span className='text-gray-600 text-[10px]'>
                                    {event.waktu}
                                  </span>
                                </div>
                                <div className='flex items-center mt-1 text-[10px]'>
                                  <FiMapPin className='w-3 h-3 mr-1 text-gray-500' />
                                  <span className='text-gray-600 truncate'>
                                    {event.lokasi}
                                  </span>
                                </div>

                                {/* Status label */}
                                <div className='mt-1 w-full flex justify-end'>
                                  {statusKetersediaan ===
                                    StatusKetersediaan.AVAILABLE && (
                                    <span className='inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-800'>
                                      <FiCheck className='w-2 h-2 mr-1' />
                                      Bisa
                                    </span>
                                  )}
                                  {statusKetersediaan ===
                                    StatusKetersediaan.UNAVAILABLE && (
                                    <span className='inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800'>
                                      <FiX className='w-2 h-2 mr-1' />
                                      Tidak Bisa
                                    </span>
                                  )}
                                  {statusKetersediaan ===
                                    StatusKetersediaan.TENTATIVE && (
                                    <span className='inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800'>
                                      <FiInfo className='w-2 h-2 mr-1' />
                                      Mungkin
                                    </span>
                                  )}
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render panel info ketersediaan
  const renderInfoKetersediaan = () => (
    <motion.div
      className='bg-white rounded-xl shadow-md p-5 border border-indigo-100 mt-6'
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h3 className='text-lg font-semibold text-gray-800 mb-3 flex items-center'>
        <FiInfo className='w-5 h-5 mr-2 text-indigo-500' />
        Status Ketersediaan
      </h3>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <motion.div
          className='flex items-center p-3 rounded-lg bg-green-50 border border-green-100'
          whileHover={{ scale: 1.02, backgroundColor: '#dcfce7' }}
        >
          <div className='w-4 h-4 rounded-full bg-green-500 mr-3'></div>
          <span className='text-sm text-gray-700 font-medium'>Bisa hadir</span>
        </motion.div>
        <motion.div
          className='flex items-center p-3 rounded-lg bg-yellow-50 border border-yellow-100'
          whileHover={{ scale: 1.02, backgroundColor: '#fef9c3' }}
        >
          <div className='w-4 h-4 rounded-full bg-yellow-500 mr-3'></div>
          <span className='text-sm text-gray-700 font-medium'>
            Mungkin bisa hadir
          </span>
        </motion.div>
        <motion.div
          className='flex items-center p-3 rounded-lg bg-red-50 border border-red-100'
          whileHover={{ scale: 1.02, backgroundColor: '#fee2e2' }}
        >
          <div className='w-4 h-4 rounded-full bg-red-500 mr-3'></div>
          <span className='text-sm text-gray-700 font-medium'>
            Tidak bisa hadir
          </span>
        </motion.div>
      </div>
      <p className='text-sm text-gray-500 mt-4 bg-indigo-50 border-l-4 border-indigo-400 p-3 rounded-r-lg'>
        <span className='font-medium text-indigo-700'>Tip:</span> Klik pada
        acara di kalender untuk mengubah status ketersediaan Anda. Setiap klik
        akan mengubah status secara berurutan. Pastikan untuk menyimpan setelah
        selesai.
      </p>
    </motion.div>
  );

  // Render detail event
  const renderDetailEvent = () => {
    if (!eventDipilih) return null;

    return (
      <motion.div
        className='bg-white rounded-xl shadow-md p-6 border border-indigo-100 mt-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        layout
      >
        <div className='flex justify-between items-start mb-4'>
          <h3 className='text-xl font-bold text-gray-800 flex items-center'>
            <div
              className={`w-2 h-10 rounded-l-md mr-3 
              ${
                eventDipilih.warna === 'indigo'
                  ? 'bg-indigo-500'
                  : eventDipilih.warna === 'sky'
                  ? 'bg-sky-500'
                  : eventDipilih.warna === 'teal'
                  ? 'bg-teal-500'
                  : 'bg-purple-500'
              }`}
            ></div>
            {eventDipilih.nama}
          </h3>
          <motion.button
            onClick={() => setEventDipilih(null)}
            className='p-2 bg-gray-100 hover:bg-gray-200 rounded-full'
            whileHover={{ scale: 1.1, backgroundColor: '#f3f4f6' }}
            whileTap={{ scale: 0.9 }}
          >
            <FiX className='w-5 h-5 text-gray-500' />
          </motion.button>
        </div>

        <div className='bg-gray-50 p-4 rounded-lg mb-6'>
          <div className='space-y-3'>
            <div className='flex items-center bg-white p-2 rounded-md shadow-sm'>
              <div className='bg-indigo-100 p-2 rounded-md mr-3'>
                <FiCalendar className='w-5 h-5 text-indigo-500' />
              </div>
              <div>
                <span className='text-xs text-gray-500'>Tanggal</span>
                <p className='text-gray-700 font-medium'>
                  {eventDipilih.tanggal}
                </p>
              </div>
            </div>

            <div className='flex items-center bg-white p-2 rounded-md shadow-sm'>
              <div className='bg-indigo-100 p-2 rounded-md mr-3'>
                <FiClock className='w-5 h-5 text-indigo-500' />
              </div>
              <div>
                <span className='text-xs text-gray-500'>Waktu</span>
                <p className='text-gray-700 font-medium'>
                  {eventDipilih.waktu}
                </p>
              </div>
            </div>

            <div className='flex items-center bg-white p-2 rounded-md shadow-sm'>
              <div className='bg-indigo-100 p-2 rounded-md mr-3'>
                <FiMapPin className='w-5 h-5 text-indigo-500' />
              </div>
              <div>
                <span className='text-xs text-gray-500'>Lokasi</span>
                <p className='text-gray-700 font-medium'>
                  {eventDipilih.lokasi}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 border-t border-indigo-100 pt-4'>
          <h4 className='font-semibold text-gray-700 mb-4 flex items-center'>
            <FiInfo className='w-5 h-5 mr-2 text-indigo-500' />
            Pilih ketersediaan Anda:
          </h4>
          <div className='grid grid-cols-1 gap-3'>
            {Object.values(StatusKetersediaan)
              .filter((status) => status !== StatusKetersediaan.UNSELECTED)
              .map((status) => {
                const eventKey = `${eventDipilih.id}_${eventDipilih.tanggal}`;
                const isSelected = ketersediaan[eventKey] === status;
                let bgColor = '';
                let bgHoverColor = '';
                let borderColor = '';
                let textColor = '';
                let icon = null;

                if (status === StatusKetersediaan.AVAILABLE) {
                  bgColor = isSelected ? 'bg-green-500' : 'bg-green-50';
                  bgHoverColor = isSelected
                    ? 'hover:bg-green-600'
                    : 'hover:bg-green-100';
                  borderColor = isSelected
                    ? 'border-green-600'
                    : 'border-green-200';
                  textColor = isSelected ? 'text-white' : 'text-green-700';
                  icon = <FiCheck className={`w-5 h-5 mr-3 ${textColor}`} />;
                } else if (status === StatusKetersediaan.TENTATIVE) {
                  bgColor = isSelected ? 'bg-yellow-500' : 'bg-yellow-50';
                  bgHoverColor = isSelected
                    ? 'hover:bg-yellow-600'
                    : 'hover:bg-yellow-100';
                  borderColor = isSelected
                    ? 'border-yellow-600'
                    : 'border-yellow-200';
                  textColor = isSelected ? 'text-white' : 'text-yellow-700';
                  icon = <FiInfo className={`w-5 h-5 mr-3 ${textColor}`} />;
                } else if (status === StatusKetersediaan.UNAVAILABLE) {
                  bgColor = isSelected ? 'bg-red-500' : 'bg-red-50';
                  bgHoverColor = isSelected
                    ? 'hover:bg-red-600'
                    : 'hover:bg-red-100';
                  borderColor = isSelected
                    ? 'border-red-600'
                    : 'border-red-200';
                  textColor = isSelected ? 'text-white' : 'text-red-700';
                  icon = <FiX className={`w-5 h-5 mr-3 ${textColor}`} />;
                }

                return (
                  <motion.button
                    key={status}
                    className={`flex items-center px-4 py-3 rounded-lg ${bgColor} ${bgHoverColor} ${textColor} border ${borderColor}
                      transition-all duration-200`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      setKetersediaan((prev) => ({
                        ...prev,
                        [eventKey]: status,
                      }));
                    }}
                  >
                    {icon}
                    <span className='font-medium'>
                      {status === StatusKetersediaan.AVAILABLE &&
                        'Saya bisa hadir'}
                      {status === StatusKetersediaan.TENTATIVE &&
                        'Saya mungkin bisa hadir'}
                      {status === StatusKetersediaan.UNAVAILABLE &&
                        'Saya tidak bisa hadir'}
                    </span>
                  </motion.button>
                );
              })}
          </div>

          <div className='mt-6 flex justify-end'>
            <motion.button
              className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center shadow-md'
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={simpanKetersediaan}
            >
              <FiSave className='w-5 h-5 mr-2' />
              <span>Simpan Ketersediaan</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  };

  // Render notifikasi
  const renderNotifikasi = () => {
    if (!notifikasi.tampil) return null;

    const bgColor =
      notifikasi.tipe === 'sukses'
        ? 'bg-green-50 border-green-500'
        : 'bg-red-50 border-red-500';
    const textColor =
      notifikasi.tipe === 'sukses' ? 'text-green-800' : 'text-red-800';
    const icon =
      notifikasi.tipe === 'sukses' ? (
        <FiCheck className='w-5 h-5' />
      ) : (
        <FiX className='w-5 h-5' />
      );

    return (
      <motion.div
        className={`fixed bottom-4 right-4 px-5 py-3 rounded-lg shadow-lg border ${bgColor} ${textColor} z-50 flex items-center space-x-3`}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
      >
        <div
          className={`p-2 rounded-full ${
            notifikasi.tipe === 'sukses' ? 'bg-green-200' : 'bg-red-200'
          }`}
        >
          {icon}
        </div>
        <span className='font-medium'>{notifikasi.pesan}</span>
        <motion.button
          onClick={() => setNotifikasi((prev) => ({ ...prev, tampil: false }))}
          className='ml-2 p-1 hover:bg-white rounded-full'
          whileHover={{ scale: 1.2, backgroundColor: 'white' }}
          whileTap={{ scale: 0.9 }}
        >
          <FiX className='w-4 h-4' />
        </motion.button>
      </motion.div>
    );
  };

  // Tombol toggle tampilan (hanya tampil di desktop)
  const renderToggleViewButtons = () => (
    <div className='hidden md:flex space-x-2 mt-4'>
      <motion.button
        onClick={() => setTampilan('kalender')}
        className={`p-2 rounded-lg flex items-center space-x-1 ${
          tampilan === 'kalender'
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <FiGrid className='w-4 h-4' />
        <span className='text-sm font-medium'>Grid</span>
      </motion.button>
      <motion.button
        onClick={() => setTampilan('daftar')}
        className={`p-2 rounded-lg flex items-center space-x-1 ${
          tampilan === 'daftar'
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <FiList className='w-4 h-4' />
        <span className='text-sm font-medium'>Daftar</span>
      </motion.button>
    </div>
  );

  return (
    <div className='space-y-6 pb-16'>
      <FeaturedCard
        title='Ketersediaan Pelayanan'
        description='Tandai ketersediaan Anda untuk pelayanan musik yang akan datang'
        actionLabel='Kembali ke Jadwal Saya'
        gradientFrom='from-indigo-500'
        gradientTo='to-indigo-700'
      />

      <div className='bg-white rounded-xl shadow-md p-6 border border-indigo-50'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Kalender Ketersediaan
            </h2>
            <p className='text-sm text-gray-500 mt-1'>
              Pilih event dan tandai ketersediaan Anda untuk pelayanan musik
            </p>
          </div>
          <motion.button
            className='bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-md'
            whileHover={{
              scale: 1.02,
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
            whileTap={{ scale: 0.98 }}
            onClick={simpanKetersediaan}
          >
            <FiSave className='w-5 h-5' />
            <span>Simpan Ketersediaan</span>
          </motion.button>
        </div>

        {renderInfoKetersediaan()}
        {renderToggleViewButtons()}

        <div className='md:block hidden'>
          {tampilan === 'kalender' ? renderKalender() : renderDaftarEvent()}
        </div>

        <div className='md:hidden block'>{renderDaftarEvent()}</div>

        {renderDetailEvent()}
        {renderNotifikasi()}
      </div>
    </div>
  );
}
