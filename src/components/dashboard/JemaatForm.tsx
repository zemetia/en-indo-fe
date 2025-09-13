'use client';

import * as React from 'react';
import { FiX } from 'react-icons/fi';

type Jemaat = {
  id: string;
  nama: string;
  namaLain: string;
  gender: 'L' | 'P';
  tempatLahir: string;
  tanggalLahir: string;
  faseHidup: string;
  statusPerkawinan: string;
  pasangan: string;
  tanggalPerkawinan: string;
  nomorTelepon: string;
  email: string;
  gereja: string;
  ayah: string;
  ibu: string;
  kerinduan: string;
  komitmenBerjemaat: string;
  status: string;
  kodeJemaat: string;
};

type JemaatFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Jemaat, 'id'>) => void;
  initialData?: Jemaat;
  title: string;
};

export default function JemaatForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  title,
}: JemaatFormProps) {
  const [formData, setFormData] = React.useState<Omit<Jemaat, 'id'>>({
    nama: '',
    namaLain: '',
    gender: 'L',
    tempatLahir: '',
    tanggalLahir: '',
    faseHidup: '',
    statusPerkawinan: '',
    pasangan: '',
    tanggalPerkawinan: '',
    nomorTelepon: '',
    email: '',
    gereja: '',
    ayah: '',
    ibu: '',
    kerinduan: '',
    komitmenBerjemaat: '',
    status: '',
    kodeJemaat: '',
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData({
        nama: initialData.nama,
        namaLain: initialData.namaLain,
        gender: initialData.gender,
        tempatLahir: initialData.tempatLahir,
        tanggalLahir: initialData.tanggalLahir,
        faseHidup: initialData.faseHidup,
        statusPerkawinan: initialData.statusPerkawinan,
        pasangan: initialData.pasangan,
        tanggalPerkawinan: initialData.tanggalPerkawinan,
        nomorTelepon: initialData.nomorTelepon,
        email: initialData.email,
        gereja: initialData.gereja,
        ayah: initialData.ayah,
        ibu: initialData.ibu,
        kerinduan: initialData.kerinduan,
        komitmenBerjemaat: initialData.komitmenBerjemaat,
        status: initialData.status,
        kodeJemaat: initialData.kodeJemaat,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-xl shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white'>
          <h2 className='text-xl font-semibold text-gray-900'>{title}</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-500'
          >
            <FiX className='w-6 h-6' />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Data Pribadi */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Data Pribadi
              </h3>
              <div>
                <label
                  htmlFor='kodeJemaat'
                  className='block text-sm font-medium text-gray-700'
                >
                  Kode Jemaat
                </label>
                <input
                  type='text'
                  id='kodeJemaat'
                  value={formData.kodeJemaat}
                  onChange={(e) =>
                    setFormData({ ...formData, kodeJemaat: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='nama'
                  className='block text-sm font-medium text-gray-700'
                >
                  Nama
                </label>
                <input
                  type='text'
                  id='nama'
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='namaLain'
                  className='block text-sm font-medium text-gray-700'
                >
                  Nama Lain
                </label>
                <input
                  type='text'
                  id='namaLain'
                  value={formData.namaLain}
                  onChange={(e) =>
                    setFormData({ ...formData, namaLain: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='gender'
                  className='block text-sm font-medium text-gray-700'
                >
                  Gender
                </label>
                <select
                  id='gender'
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      gender: e.target.value as 'L' | 'P',
                    })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                >
                  <option value='L'>Laki-laki</option>
                  <option value='P'>Perempuan</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor='tempatLahir'
                  className='block text-sm font-medium text-gray-700'
                >
                  Tempat Lahir
                </label>
                <input
                  type='text'
                  id='tempatLahir'
                  value={formData.tempatLahir}
                  onChange={(e) =>
                    setFormData({ ...formData, tempatLahir: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='tanggalLahir'
                  className='block text-sm font-medium text-gray-700'
                >
                  Tanggal Lahir
                </label>
                <input
                  type='date'
                  id='tanggalLahir'
                  value={formData.tanggalLahir}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggalLahir: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='faseHidup'
                  className='block text-sm font-medium text-gray-700'
                >
                  Fase Hidup
                </label>
                <input
                  type='text'
                  id='faseHidup'
                  value={formData.faseHidup}
                  onChange={(e) =>
                    setFormData({ ...formData, faseHidup: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
            </div>

            {/* Status & Kontak */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Status & Kontak
              </h3>
              <div>
                <label
                  htmlFor='statusPerkawinan'
                  className='block text-sm font-medium text-gray-700'
                >
                  Status Perkawinan
                </label>
                <select
                  id='statusPerkawinan'
                  value={formData.statusPerkawinan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      statusPerkawinan: e.target.value,
                    })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                >
                  <option value=''>Pilih Status</option>
                  <option value='Belum Menikah'>Belum Menikah</option>
                  <option value='Menikah'>Menikah</option>
                  <option value='Cerai'>Cerai</option>
                  <option value='Janda'>Janda</option>
                  <option value='Duda'>Duda</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor='pasangan'
                  className='block text-sm font-medium text-gray-700'
                >
                  Pasangan
                </label>
                <input
                  type='text'
                  id='pasangan'
                  value={formData.pasangan}
                  onChange={(e) =>
                    setFormData({ ...formData, pasangan: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='tanggalPerkawinan'
                  className='block text-sm font-medium text-gray-700'
                >
                  Tanggal Perkawinan
                </label>
                <input
                  type='date'
                  id='tanggalPerkawinan'
                  value={formData.tanggalPerkawinan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tanggalPerkawinan: e.target.value,
                    })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='nomorTelepon'
                  className='block text-sm font-medium text-gray-700'
                >
                  Nomor Telepon
                </label>
                <input
                  type='tel'
                  id='nomorTelepon'
                  value={formData.nomorTelepon}
                  onChange={(e) =>
                    setFormData({ ...formData, nomorTelepon: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='gereja'
                  className='block text-sm font-medium text-gray-700'
                >
                  Gereja
                </label>
                <input
                  type='text'
                  id='gereja'
                  value={formData.gereja}
                  onChange={(e) =>
                    setFormData({ ...formData, gereja: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
            </div>

            {/* Data Keluarga */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900'>
                Data Keluarga
              </h3>
              <div>
                <label
                  htmlFor='ayah'
                  className='block text-sm font-medium text-gray-700'
                >
                  Ayah
                </label>
                <input
                  type='text'
                  id='ayah'
                  value={formData.ayah}
                  onChange={(e) =>
                    setFormData({ ...formData, ayah: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
              <div>
                <label
                  htmlFor='ibu'
                  className='block text-sm font-medium text-gray-700'
                >
                  Ibu
                </label>
                <input
                  type='text'
                  id='ibu'
                  value={formData.ibu}
                  onChange={(e) =>
                    setFormData({ ...formData, ibu: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                />
              </div>
            </div>

            {/* Data Rohani */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium text-gray-900'>Data Rohani</h3>
              <div>
                <label
                  htmlFor='kerinduan'
                  className='block text-sm font-medium text-gray-700'
                >
                  Kerinduan
                </label>
                <textarea
                  id='kerinduan'
                  value={formData.kerinduan}
                  onChange={(e) =>
                    setFormData({ ...formData, kerinduan: e.target.value })
                  }
                  rows={3}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='komitmenBerjemaat'
                  className='block text-sm font-medium text-gray-700'
                >
                  Komitmen Berjemaat
                </label>
                <textarea
                  id='komitmenBerjemaat'
                  value={formData.komitmenBerjemaat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      komitmenBerjemaat: e.target.value,
                    })
                  }
                  rows={3}
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                />
              </div>
              <div>
                <label
                  htmlFor='status'
                  className='block text-sm font-medium text-gray-700'
                >
                  Status
                </label>
                <select
                  id='status'
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm'
                  required
                >
                  <option value=''>Pilih Status</option>
                  <option value='Aktif'>Aktif</option>
                  <option value='Tidak Aktif'>Tidak Aktif</option>
                  <option value='Pindah'>Pindah</option>
                  <option value='Meninggal'>Meninggal</option>
                </select>
              </div>
            </div>
          </div>

          <div className='flex justify-end space-x-3 pt-4'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              Batal
            </button>
            <button
              type='submit'
              className='px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
