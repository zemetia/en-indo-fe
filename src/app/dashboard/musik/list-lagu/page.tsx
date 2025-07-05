'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';
import { FiEdit2, FiMusic, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { Loader2, Sparkles } from 'lucide-react';

import FeaturedCard from '@/components/dashboard/FeaturedCard';
import { useToast } from '@/context/ToastContext';
import { recommendSongs, SongRecommendationOutput } from '@/ai/flows/songRecommendation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Song {
  id: string;
  judul: string;
  penyanyi: string;
  genre: string;
  durasi: string;
  status: 'active' | 'inactive';
}

const MOCK_SONGS: Song[] = [
    { id: 's1', judul: 'Amazing Grace', penyanyi: 'John Newton', genre: 'Hymn', durasi: '04:30', status: 'active' },
    { id: 's2', judul: 'How Great Thou Art', penyanyi: 'Carl Boberg', genre: 'Hymn', durasi: '05:15', status: 'active' },
    { id: 's3', judul: '10,000 Reasons (Bless the Lord)', penyanyi: 'Matt Redman', genre: 'Penyembahan', durasi: '05:45', status: 'active' },
    { id: 's4', judul: 'What A Beautiful Name', penyanyi: 'Hillsong Worship', genre: 'Penyembahan', durasi: '05:20', status: 'active' },
    { id: 's5', judul: 'This is Amazing Grace', penyanyi: 'Phil Wickham', genre: 'Pujian', durasi: '04:50', status: 'active' },
    { id: 's6', judul: 'Goodness of God', penyanyi: 'Bethel Music', genre: 'Penyembahan', durasi: '04:55', status: 'inactive' },
];

export default function ListLaguPage() {
  const { showToast } = useToast();
  const [songs] = React.useState<Song[]>(MOCK_SONGS);
  const [loading] = React.useState(false);
  const [error] = React.useState<string | null>(null);

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [recommendationOccasion, setRecommendationOccasion] = React.useState('');
  const [recommendations, setRecommendations] = React.useState<SongRecommendationOutput['recommendations']>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleGetRecommendations = async () => {
    if (!recommendationOccasion.trim() || songs.length === 0) {
        showToast('Mohon isi tema acara terlebih dahulu.', 'warning');
        return;
    }
    setIsGenerating(true);
    setRecommendations([]);
    
    const availableSongs = songs
      .filter(s => s.status === 'active')
      .map(s => ({
        id: s.id,
        judul: s.judul,
        penyanyi: s.penyanyi,
        genre: s.genre,
    }));

    try {
        const result = await recommendSongs({
            occasion: recommendationOccasion,
            songs: availableSongs,
        });
        if (result.recommendations.length === 0) {
          showToast('AI tidak menemukan rekomendasi yang cocok.', 'info');
        }
        setRecommendations(result.recommendations);
    } catch (e) {
        console.error(e);
        showToast('Gagal mendapatkan rekomendasi dari AI.', 'error');
    } finally {
        setIsGenerating(false);
    }
  }


  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex justify-center items-center py-10'>
          <div className='w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
      );
    }

    if (error) {
      return <p className='text-center text-red-500'>{error}</p>;
    }

    if (songs.length === 0) {
      return (
        <div className='text-center py-10 bg-gray-50 rounded-xl'>
          <FiMusic className='w-10 h-10 text-gray-400 mx-auto mb-4' />
          <h3 className='text-lg font-semibold text-gray-900 mb-2'>
            Tidak ada lagu
          </h3>
          <p className='text-gray-600 max-w-md mx-auto mb-6'>
            Belum ada lagu yang tersedia. Silakan tambahkan lagu baru.
          </p>
          <Link
            href='/dashboard/musik/list-lagu/tambah'
            className='px-4 py-2 bg-amber-600 rounded-lg text-white hover:bg-amber-700 transition-colors'
          >
            Tambah Lagu Baru
          </Link>
        </div>
      );
    }

    return (
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3 font-medium'>
                Judul Lagu
              </th>
              <th scope='col' className='px-6 py-3 font-medium'>
                Penyanyi
              </th>
              <th scope='col' className='px-6 py-3 font-medium'>
                Genre
              </th>
              <th scope='col' className='px-6 py-3 font-medium'>
                Durasi
              </th>
              <th scope='col' className='px-6 py-3 font-medium'>
                Status
              </th>
              <th scope='col' className='px-6 py-3 font-medium text-right'>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, index) => (
              <motion.tr
                key={song.id}
                className='bg-white border-b last:border-b-0 hover:bg-gray-50'
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  <div className='flex items-center'>
                    <div className='flex-shrink-0 h-10 w-10'>
                      <div className='h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center'>
                        <FiMusic className='h-6 w-6 text-amber-600' />
                      </div>
                    </div>
                    <div className='ml-4'>{song.judul}</div>
                  </div>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>{song.penyanyi}</td>
                <td className='px-6 py-4 whitespace-nowrap'>{song.genre}</td>
                <td className='px-6 py-4 whitespace-nowrap'>{song.durasi}</td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      song.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {song.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <div className='flex space-x-2 justify-end'>
                    <Link
                      href={`/dashboard/musik/list-lagu/${song.id}/edit`}
                      className='text-blue-600 hover:text-blue-900'
                    >
                      <FiEdit2 className='w-5 h-5' />
                    </Link>
                    <button className='text-red-600 hover:text-red-900'>
                      <FiTrash2 className='w-5 h-5' />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <FeaturedCard
        title='Daftar Lagu'
        description='Kelola daftar lagu untuk pelayanan musik'
        actionLabel='Kembali ke Dashboard Musik'
        gradientFrom='from-amber-500'
        gradientTo='to-amber-700'
      />

      <div className='bg-white rounded-xl shadow-sm p-6 border border-gray-200'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>Kelola Lagu</h2>
            <p className='text-sm text-gray-500 mt-1'>
              Tambah, edit, dan kelola lagu untuk pelayanan musik
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:text-amber-800">
                    <Sparkles className="mr-2 h-4 w-4" /> Rekomendasi AI
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Rekomendasi Lagu Berbasis AI</DialogTitle>
                  <DialogDescription>
                    Jelaskan suasana atau tema acara (misalnya: "Ibadah pembuka yang semangat", "Momen perenungan", "Pernikahan outdoor sore hari"), dan AI akan merekomendasikan lagu dari daftar Anda.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Label htmlFor="occasion">Tema / Suasana Acara</Label>
                    <Textarea 
                        id="occasion" 
                        value={recommendationOccasion} 
                        onChange={(e) => setRecommendationOccasion(e.target.value)}
                        placeholder="Contoh: Ibadah penyembahan yang khusyuk dan intim"
                        className="min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleGetRecommendations} disabled={isGenerating} className="bg-amber-600 hover:bg-amber-700">
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        {isGenerating ? 'Mencari...' : 'Dapatkan Rekomendasi'}
                    </Button>
                </DialogFooter>

                {(isGenerating || recommendations.length > 0) && (
                    <div className="mt-6 pt-4 border-t">
                        <h4 className="font-semibold mb-3 text-gray-800">Hasil Rekomendasi:</h4>
                        {isGenerating && (
                           <div className="space-y-2">
                                <div className="h-16 bg-gray-100 rounded-md animate-pulse"></div>
                                <div className="h-16 bg-gray-100 rounded-md animate-pulse delay-75"></div>
                                <div className="h-16 bg-gray-100 rounded-md animate-pulse delay-150"></div>
                           </div>
                        )}
                        {recommendations.length > 0 && !isGenerating && (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {recommendations.map(rec => (
                                    <div key={rec.id} className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                        <p className="font-bold text-amber-900">{rec.judul}</p>
                                        <p className="text-sm text-gray-600 italic mt-1">"{rec.reason}"</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
              </DialogContent>
            </Dialog>
            <Link
              href='/dashboard/musik/list-lagu/tambah'
              className='bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 whitespace-nowrap'
            >
              <FiPlus className='w-5 h-5' />
              <span>Tambah Lagu</span>
            </Link>
          </div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
