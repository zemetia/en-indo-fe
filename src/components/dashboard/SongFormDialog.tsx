'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export interface SongFormData {
    id?: string;
    judul: string;
    artis: string;
    youtubeLink: string;
    genre: string;
    lirik: string;
    tags: string;
    nadaDasar: string;
    tahunRilis: number | string;
}

interface SongFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SongFormData) => Promise<void>;
  initialData?: Partial<SongFormData> | null;
}

const NADA_DASAR_OPTIONS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function SongFormDialog({ open, onOpenChange, onSubmit, initialData }: SongFormDialogProps) {
  const [formData, setFormData] = useState<SongFormData>({
    judul: '',
    artis: '',
    youtubeLink: '',
    genre: '',
    lirik: '',
    tags: '',
    nadaDasar: '',
    tahunRilis: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          id: initialData.id || undefined,
          judul: initialData.judul || '',
          artis: initialData.artis || '',
          youtubeLink: initialData.youtubeLink || '',
          genre: initialData.genre || '',
          lirik: initialData.lirik || '',
          tags: initialData.tags || '',
          nadaDasar: initialData.nadaDasar || '',
          tahunRilis: initialData.tahunRilis || '',
        });
      } else {
        setFormData({
          judul: '',
          artis: '',
          youtubeLink: '',
          genre: '',
          lirik: '',
          tags: '',
          nadaDasar: '',
          tahunRilis: new Date().getFullYear(),
        });
      }
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(formData);
    setIsLoading(false);
  };

  const isEditMode = !!initialData?.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Lagu' : 'Tambah Lagu Baru'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Ubah detail lagu di bawah ini.' : 'Isi detail lagu untuk menambahkannya ke dalam database.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="judul">Judul Lagu <span className="text-red-500">*</span></Label>
              <Input id="judul" name="judul" value={formData.judul} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="artis">Artis / Penyanyi</Label>
              <Input id="artis" name="artis" value={formData.artis} onChange={handleChange} />
            </div>
             <div>
              <Label htmlFor="youtubeLink">Link YouTube</Label>
              <Input id="youtubeLink" name="youtubeLink" type="url" value={formData.youtubeLink} onChange={handleChange} placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div>
              <Label htmlFor="genre">Genre</Label>
              <Input id="genre" name="genre" value={formData.genre} onChange={handleChange} />
            </div>
             <div>
                <Label htmlFor="nadaDasar">Chord Asli</Label>
                <Select value={formData.nadaDasar} onValueChange={(value) => handleSelectChange('nadaDasar', value)}>
                    <SelectTrigger id="nadaDasar">
                        <SelectValue placeholder="Pilih chord asli" />
                    </SelectTrigger>
                    <SelectContent>
                        {NADA_DASAR_OPTIONS.map(key => <SelectItem key={key} value={key}>{key}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
             <div>
              <Label htmlFor="tahunRilis">Tahun Rilis</Label>
              <Input id="tahunRilis" name="tahunRilis" type="number" value={formData.tahunRilis} onChange={handleChange} placeholder="Contoh: 2023" />
            </div>
            <div className="md:col-span-2">
                <Label htmlFor="tags">Tag Lagu</Label>
                <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="Contoh: Pujian, Semangat, Natal (pisahkan dengan koma)" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="lirik">Lirik <span className="text-red-500">*</span></Label>
              <Textarea id="lirik" name="lirik" value={formData.lirik} onChange={handleChange} required className="min-h-[250px] font-mono" />
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Batal</Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isEditMode ? 'Simpan Perubahan' : 'Tambah Lagu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
