'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiUser,
  FiHeart,
  FiHome,
  FiSave,
  FiArrowLeft,
  FiPhone,
  FiFileText,
  FiLoader,
} from 'react-icons/fi';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/context/ToastContext';
import axios from 'axios';
import { getToken } from '@/lib/helper';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function TambahJemaatPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama: '',
    nama_lain: '',
    gender: '',
    tempat_lahir: '',
    tanggal_lahir: '',
    fase_hidup: '',
    status_perkawinan: '',
    nama_pasangan: '',
    tanggal_perkawinan: '',
    alamat: '',
    nomor_telepon: '',
    email: '',
    ayah: '',
    ibu: '',
    kode_jemaat: '',
    church_id: '',
    kabupaten_id: '',
    kerinduan: '',
    komitmen_berjemaat: '',
    status: 'aktif',
    is_aktif: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = getToken();
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/person`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      showToast('Data jemaat berhasil ditambahkan!', 'success');
      router.push('/dashboard/jemaat');
    } catch (error) {
      console.error('Failed to add jemaat:', error);
      showToast('Gagal menambahkan data jemaat.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
     setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const RequiredStar = () => (
    <Tooltip>
        <TooltipTrigger asChild>
            <span className='text-red-500 ml-1 cursor-help'>*</span>
        </TooltipTrigger>
        <TooltipContent>
            <p>Wajib diisi</p>
        </TooltipContent>
    </Tooltip>
  );

  return (
    <TooltipProvider>
      <div className='space-y-6 pb-16'>
        <FeaturedCard
          title='Tambah Jemaat Baru'
          description='Lengkapi formulir di bawah untuk menambahkan data jemaat baru ke dalam sistem.'
          gradientFrom='from-blue-500'
          gradientTo='to-blue-700'
        />

        <motion.form
          onSubmit={handleSubmit}
          className='bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Data Pribadi */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center'>
              <FiUser className='mr-3 text-blue-500' />
              Data Pribadi
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              <div>
                <label htmlFor='nama' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Nama Lengkap <RequiredStar /></label>
                <Input id='nama' name='nama' value={formData.nama} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor='nama_lain' className='block text-sm font-medium text-gray-700 mb-1'>Nama Panggilan</label>
                <Input id='nama_lain' name='nama_lain' value={formData.nama_lain} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor='gender' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Jenis Kelamin <RequiredStar /></label>
                <Select name="gender" onValueChange={(value) => handleSelectChange('gender', value)} required>
                    <SelectTrigger><SelectValue placeholder="Pilih Jenis Kelamin" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="L">Laki-laki</SelectItem>
                        <SelectItem value="P">Perempuan</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor='fase_hidup' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Fase Hidup <RequiredStar /></label>
                <Select name="fase_hidup" onValueChange={(value) => handleSelectChange('fase_hidup', value)} required>
                    <SelectTrigger><SelectValue placeholder="Pilih Fase Hidup" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="anak">Anak</SelectItem>
                        <SelectItem value="remaja">Remaja</SelectItem>
                        <SelectItem value="pemuda">Pemuda</SelectItem>
                        <SelectItem value="dewasa">Dewasa</SelectItem>
                        <SelectItem value="lansia">Lansia</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor='tempat_lahir' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Tempat Lahir <RequiredStar /></label>
                <Input id='tempat_lahir' name='tempat_lahir' value={formData.tempat_lahir} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor='tanggal_lahir' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Tanggal Lahir <RequiredStar /></label>
                <Input id='tanggal_lahir' name='tanggal_lahir' type='date' value={formData.tanggal_lahir} onChange={handleChange} required />
              </div>
            </div>
          </div>

          {/* Perkawinan & Keluarga */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center'>
              <FiHeart className='mr-3 text-pink-500' />
              Perkawinan & Keluarga
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              <div>
                <label htmlFor='status_perkawinan' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Status Perkawinan <RequiredStar /></label>
                <Select name="status_perkawinan" onValueChange={(value) => handleSelectChange('status_perkawinan', value)} required>
                    <SelectTrigger><SelectValue placeholder="Pilih Status Perkawinan" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="belum_menikah">Belum Menikah</SelectItem>
                        <SelectItem value="menikah">Menikah</SelectItem>
                        <SelectItem value="cerai">Cerai</SelectItem>
                        <SelectItem value="janda">Janda</SelectItem>
                        <SelectItem value="duda">Duda</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div>
                <label htmlFor='nama_pasangan' className='block text-sm font-medium text-gray-700 mb-1'>Nama Pasangan</label>
                <Input id='nama_pasangan' name='nama_pasangan' value={formData.nama_pasangan} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor='tanggal_perkawinan' className='block text-sm font-medium text-gray-700 mb-1'>Tanggal Perkawinan</label>
                <Input id='tanggal_perkawinan' name='tanggal_perkawinan' type='date' value={formData.tanggal_perkawinan} onChange={handleChange} />
              </div>
              <div className='md:col-span-2' />
              <div>
                <label htmlFor='ayah' className='block text-sm font-medium text-gray-700 mb-1'>Nama Ayah</label>
                <Input id='ayah' name='ayah' value={formData.ayah} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor='ibu' className='block text-sm font-medium text-gray-700 mb-1'>Nama Ibu</label>
                <Input id='ibu' name='ibu' value={formData.ibu} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Kontak & Alamat */}
          <div className='mb-8'>
            <h2 className='text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center'>
              <FiPhone className='mr-3 text-green-500' />
              Kontak & Alamat
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
              <div className='md:col-span-2'>
                <label htmlFor='alamat' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Alamat Lengkap <RequiredStar /></label>
                <textarea id='alamat' name='alamat' value={formData.alamat} onChange={handleChange} rows={3} required className='w-full rounded-md border-gray-300 p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2' />
              </div>
              <div>
                <label htmlFor='nomor_telepon' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Nomor Telepon <RequiredStar /></label>
                <Input id='nomor_telepon' name='nomor_telepon' type='tel' value={formData.nomor_telepon} onChange={handleChange} required />
              </div>
              <div>
                <label htmlFor='email' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Email <RequiredStar /></label>
                <Input id='email' name='email' type='email' value={formData.email} onChange={handleChange} required />
              </div>
              <div>
                  <label htmlFor='kabupaten_id' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Kabupaten/Kota <RequiredStar /></label>
                  <Select name="kabupaten_id" onValueChange={(value) => handleSelectChange('kabupaten_id', value)} required>
                      <SelectTrigger><SelectValue placeholder="Pilih Kabupaten/Kota" /></SelectTrigger>
                      <SelectContent>
                          {/* TODO: Populate with real data */}
                          <SelectItem value="1">Jakarta</SelectItem>
                          <SelectItem value="2">Bandung</SelectItem>
                          <SelectItem value="3">Surabaya</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
            </div>
          </div>

          {/* Data Gereja */}
          <div className='mb-8'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center'>
                  <FiHome className='mr-3 text-purple-500' />
                  Data Gereja
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                  <div>
                      <label htmlFor='kode_jemaat' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Kode Jemaat <RequiredStar /></label>
                      <Input id='kode_jemaat' name='kode_jemaat' value={formData.kode_jemaat} onChange={handleChange} required />
                  </div>
                  <div>
                      <label htmlFor='church_id' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Gereja Lokal <RequiredStar /></label>
                      <Select name="church_id" onValueChange={(value) => handleSelectChange('church_id', value)} required>
                          <SelectTrigger><SelectValue placeholder="Pilih Gereja" /></SelectTrigger>
                          <SelectContent>
                              {/* TODO: Populate with real data */}
                              <SelectItem value="1">EN Jakarta</SelectItem>
                              <SelectItem value="2">EN Bandung</SelectItem>
                              <SelectItem value="3">EN Surabaya</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div>
                      <label htmlFor='status' className='flex items-center text-sm font-medium text-gray-700 mb-1'>Status Keanggotaan <RequiredStar /></label>
                      <Select name="status" onValueChange={(value) => handleSelectChange('status', value)} defaultValue='aktif' required>
                          <SelectTrigger><SelectValue placeholder="Pilih Status" /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="aktif">Aktif</SelectItem>
                              <SelectItem value="tidak_aktif">Tidak Aktif</SelectItem>
                              <SelectItem value="pindah">Pindah</SelectItem>
                              <SelectItem value="meninggal">Meninggal</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className='flex items-end'>
                      <div className='flex items-center space-x-2'>
                          <input type='checkbox' id='is_aktif' name='is_aktif' checked={formData.is_aktif} onChange={handleChange} className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded' />
                          <label htmlFor='is_aktif' className='text-sm font-medium text-gray-700'>Jemaat Aktif</label>
                      </div>
                  </div>
              </div>
          </div>

          {/* Data Tambahan */}
          <div className='mb-8'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center'>
                  <FiFileText className='mr-3 text-gray-500' />
                  Data Tambahan
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4'>
                  <div className='md:col-span-2'>
                      <label htmlFor='kerinduan' className='block text-sm font-medium text-gray-700 mb-1'>Kerinduan</label>
                      <textarea id='kerinduan' name='kerinduan' value={formData.kerinduan} onChange={handleChange} rows={3} className='w-full rounded-md border-gray-300 p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2' />
                  </div>
                  <div className='md:col-span-2'>
                      <label htmlFor='komitmen_berjemaat' className='block text-sm font-medium text-gray-700 mb-1'>Komitmen Berjemaat</label>
                      <textarea id='komitmen_berjemaat' name='komitmen_berjemaat' value={formData.komitmen_berjemaat} onChange={handleChange} rows={3} className='w-full rounded-md border-gray-300 p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2' />
                  </div>
              </div>
          </div>

          {/* Action Buttons */}
          <div className='mt-10 flex justify-end gap-4'>
              <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
                  <FiArrowLeft className="mr-2 h-4 w-4" /> Batal
              </Button>
              <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                      <FiLoader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                      <FiSave className="mr-2 h-4 w-4" />
                  )}
                  Simpan Jemaat
              </Button>
          </div>
        </motion.form>
      </div>
    </TooltipProvider>
  );
}
