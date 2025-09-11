'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Settings, Bell, Shield, Globe, Download, Trash2 } from 'lucide-react';
import { userSettingsApi, UpdateUserDataRequest, ChangePasswordRequest } from '@/lib/api/user-settings';

const personalDataSchema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid').optional(),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Password lama wajib diisi'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
  confirmPassword: z.string().min(6, 'Konfirmasi password wajib diisi'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Password baru dan konfirmasi tidak cocok',
  path: ['confirmPassword'],
});

type PersonalDataForm = z.infer<typeof personalDataSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const personalForm = useForm<PersonalDataForm>({
    resolver: zodResolver(personalDataSchema),
    defaultValues: {
      nama: user?.nama || '',
      email: '',
      phone: '',
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onPersonalDataSubmit = async (data: PersonalDataForm) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const requestData: UpdateUserDataRequest = {
        nama: data.nama,
        email: data.email || undefined,
        phone: data.phone || undefined,
      };
      
      const response = await userSettingsApi.updateUserData(requestData);
      
      if (response.success) {
        showToast(response.message || 'Data pribadi berhasil diperbarui', 'success');
      } else {
        showToast(response.message || 'Gagal memperbarui data pribadi', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Gagal memperbarui data pribadi', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const requestData: ChangePasswordRequest = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      };
      
      const response = await userSettingsApi.changePassword(requestData);
      
      if (response.success) {
        showToast(response.message || 'Password berhasil diubah', 'success');
        passwordForm.reset();
      } else {
        showToast(response.message || 'Gagal mengubah password', 'error');
      }
    } catch (error: any) {
      showToast(error.message || 'Gagal mengubah password', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportData = async () => {
    try {
      const blob = await userSettingsApi.exportUserData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast('Data berhasil diexport', 'success');
    } catch (error: any) {
      showToast(error.message || 'Gagal export data', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan!')) {
      const password = window.prompt('Masukkan password Anda untuk konfirmasi:');
      if (!password) return;

      try {
        const response = await userSettingsApi.deleteAccount(password);
        if (response.success) {
          showToast(response.message || 'Akun berhasil dihapus', 'success');
          // Redirect to login or home page
          window.location.href = '/';
        } else {
          showToast(response.message || 'Gagal menghapus akun', 'error');
        }
      } catch (error: any) {
        showToast(error.message || 'Gagal menghapus akun', 'error');
      }
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-600 mt-2">Kelola akun dan preferensi Anda</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Data Pribadi</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">Password</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notifikasi</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Privasi</span>
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">Bahasa</span>
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Lanjutan</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Data Pribadi
              </CardTitle>
              <CardDescription>
                Perbarui informasi pribadi Anda yang akan ditampilkan di profil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={personalForm.handleSubmit(onPersonalDataSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input
                      id="nama"
                      {...personalForm.register('nama')}
                      placeholder="Masukkan nama lengkap"
                    />
                    {personalForm.formState.errors.nama && (
                      <p className="text-sm text-red-600">{personalForm.formState.errors.nama.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...personalForm.register('email')}
                      placeholder="contoh@email.com"
                    />
                    {personalForm.formState.errors.email && (
                      <p className="text-sm text-red-600">{personalForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...personalForm.register('phone')}
                      placeholder="+62xxx-xxxx-xxxx"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Pelayanan</Label>
                    <div className="p-3 bg-gray-50 rounded-md">
                      {user.pelayanan.map((p, index) => (
                        <div key={p.pelayanan_id} className="flex justify-between items-center">
                          <span className="text-sm">{p.pelayanan} - {p.church_name}</span>
                          {p.is_pic && (
                            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">PIC</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" className="min-w-32" disabled={isSubmitting}>
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Ubah Password
              </CardTitle>
              <CardDescription>
                Pastikan password Anda aman dan mudah diingat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Password Lama</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...passwordForm.register('currentPassword')}
                      placeholder="Masukkan password lama"
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-red-600">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...passwordForm.register('newPassword')}
                      placeholder="Masukkan password baru"
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-red-600">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                      placeholder="Ulangi password baru"
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end">
                  <Button type="submit" className="min-w-32" disabled={isSubmitting}>
                    {isSubmitting ? 'Mengubah...' : 'Ubah Password'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>
                Atur preferensi notifikasi yang ingin Anda terima
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Aktif
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Nonaktif
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Jadwal Pelayanan</p>
                    <p className="text-sm text-gray-600">Notifikasi untuk jadwal pelayanan</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Aktif
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Pengaturan Privasi
              </CardTitle>
              <CardDescription>
                Kelola pengaturan privasi dan keamanan akun Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Profil Publik</p>
                    <p className="text-sm text-gray-600">Izinkan orang lain melihat profil Anda</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Aktif
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Riwayat Aktivitas</p>
                    <p className="text-sm text-gray-600">Simpan riwayat aktivitas Anda</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Aktif
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data Analytics</p>
                    <p className="text-sm text-gray-600">Berbagi data untuk meningkatkan layanan</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Nonaktif
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Pengaturan Bahasa
              </CardTitle>
              <CardDescription>
                Pilih bahasa yang Anda inginkan untuk interface aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bahasa Interface</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="default" className="justify-start">
                      Bahasa Indonesia
                    </Button>
                    <Button variant="outline" className="justify-start">
                      English
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Zona Waktu</Label>
                  <div className="max-w-sm">
                    <Input value="Asia/Jakarta (WIB)" readOnly />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Pengaturan Lanjutan
              </CardTitle>
              <CardDescription>
                Pengaturan untuk pengguna tingkat lanjut
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-red-600">Zona Bahaya</h4>
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-red-800">Hapus Akun</h5>
                        <p className="text-sm text-red-700">
                          Tindakan ini akan menghapus akun Anda secara permanen dan tidak dapat dibatalkan.
                        </p>
                      </div>
                      <Button variant="destructive" size="sm" onClick={handleDeleteAccount} className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        Hapus Akun
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Eksport Data</h4>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Download semua data pribadi Anda dalam format JSON
                    </p>
                    <Button variant="outline" size="sm" onClick={handleExportData} className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Data
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}