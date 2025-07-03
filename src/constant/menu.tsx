import { BsCalendarEvent, BsCalendarWeek } from 'react-icons/bs';
import {
  FiCalendar,
  FiHome,
  FiList,
  FiLock,
  FiMusic,
  FiUsers,
  FiCheckSquare,
} from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { MdOutlineEvent, MdOutlineVolunteerActivism } from 'react-icons/md';
import { RiOrganizationChart } from 'react-icons/ri';
import { FaPeopleArrows } from 'react-icons/fa';
import { TbUserStar } from 'react-icons/tb';
import { QrCode } from 'lucide-react';

export type MenuItem = {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  permissions: string[];
  requirePIC?: boolean;
  submenu?: MenuItem[];
};

// Permission map untuk semua path
export const permissionMap: Record<
  string,
  { roles: string[]; requirePIC?: boolean }
> = {
  '/dashboard': { roles: ['*'] }, // Semua orang bisa akses dashboard
  '/dashboard/jemaat': { roles: ['admin', 'jemaat'] },
  '/dashboard/lifegroup': { roles: ['admin', 'lifegroup'] },
  '/dashboard/event': { roles: ['admin', 'event'] },
  '/dashboard/event/daftar': { roles: ['admin', 'event'] },
  '/dashboard/event/ibadah': { roles: ['admin', 'event'] },
  '/dashboard/event/tambah': { roles: ['admin', 'event'], requirePIC: true }, // Hanya PIC yang bisa tambah event
  '/dashboard/musik': { roles: ['admin', 'musik', 'Pemusik', 'Singer', 'WL'] },
  '/dashboard/musik/jadwal-saya': {
    roles: ['admin', 'musik', 'Pemusik', 'Singer', 'WL'],
  },
  '/dashboard/musik/penjadwalan': {
    roles: ['admin', 'musik'],
    requirePIC: true,
  }, // Hanya PIC musik yang bisa menjadwalkan
  '/dashboard/musik/list-lagu': {
    roles: ['admin', 'musik', 'Pemusik', 'Singer', 'WL'],
  },
  '/dashboard/musik/list-pelayan': {
    roles: ['admin', 'musik'],
    requirePIC: true,
  }, // Hanya PIC yang bisa kelola pelayan
  '/dashboard/pelayanan': { roles: ['admin', 'pelayanan'] },
  '/dashboard/departemen': { roles: ['admin', 'departemen'] },
  '/dashboard/pemuridan': { roles: ['admin', 'pemuridan', 'lifegroup'] },
  '/dashboard/role': { roles: ['admin'] },
  '/dashboard/role/user-role': { roles: ['admin'] },
  '/dashboard/role/role-permission': { roles: ['admin'] },
  '/dashboard/pengaturan': { roles: ['*'] }, // Semua orang bisa akses pengaturan
};

export const ADMIN_ROLE = 'admin';

export const dashboardMenu: MenuItem[] = [
  {
    title: 'Beranda',
    description: 'Lihat beranda',
    icon: FiHome,
    href: '/dashboard',
    color: 'bg-blue-500',
    permissions: ['*'],
  },
  {
    title: 'Kehadiran',
    description: 'Kelola pencatatan kehadiran',
    icon: FiCheckSquare,
    href: '/dashboard/attendance',
    color: 'bg-emerald-500',
    permissions: ['admin', 'event'],
    submenu: [
      {
        title: 'Pencatatan Sederhana',
        description: 'Catat jumlah kehadiran berdasarkan kategori',
        icon: FiUsers,
        href: '/dashboard/attendance/simple',
        color: 'bg-emerald-600',
        permissions: ['admin', 'event'],
      },
      {
        title: 'Pencatatan Manual',
        description: 'Tandai kehadiran jemaat secara manual',
        icon: FiCheckSquare,
        href: '/dashboard/attendance/manual',
        color: 'bg-emerald-700',
        permissions: ['admin', 'event'],
      },
      {
        title: 'Scan QR Code',
        description: 'Scan QR Code untuk pencatatan kehadiran',
        icon: QrCode,
        href: '/dashboard/attendance/qr',
        color: 'bg-emerald-800',
        permissions: ['admin', 'event'],
      },
    ],
  },
  {
    title: 'Data Jemaat',
    description: 'Kelola data jemaat',
    icon: FiUsers,
    href: '/dashboard/jemaat',
    color: 'bg-green-500',
    permissions: ['admin', 'jemaat'],
  },
  {
    title: 'Lifegroup',
    description: 'Kelola data lifegroup',
    icon: HiOutlineUserGroup,
    href: '/dashboard/lifegroup',
    color: 'bg-purple-500',
    permissions: ['admin', 'lifegroup'],
  },
  {
    title: 'Event',
    description: 'Kelola event dan ibadah',
    icon: MdOutlineEvent,
    href: '/dashboard/event',
    color: 'bg-amber-500',
    permissions: ['admin', 'event'],
    submenu: [
      {
        title: 'Daftar Event',
        description: 'Lihat semua event yang akan datang',
        icon: BsCalendarEvent,
        href: '/dashboard/event/daftar',
        color: 'bg-amber-600',
        permissions: ['admin', 'event'],
      },
      {
        title: 'Jadwal Ibadah',
        description: 'Kelola jadwal ibadah mingguan',
        icon: BsCalendarWeek,
        href: '/dashboard/event/ibadah',
        color: 'bg-amber-700',
        permissions: ['admin', 'event'],
      },
      {
        title: 'Tambah Event',
        description: 'Buat event baru',
        icon: FiCalendar,
        href: '/dashboard/event/tambah',
        color: 'bg-amber-800',
        permissions: ['admin', 'event'],
        requirePIC: true,
      },
    ],
  },
  {
    title: 'Musik',
    description: 'Kelola tim musik',
    icon: IoMusicalNotesOutline,
    href: '/dashboard/musik',
    color: 'bg-pink-500',
    permissions: ['admin', 'musik', 'Pemusik', 'Singer', 'WL'],
    submenu: [
      {
        title: 'Jadwal Saya',
        description: 'Lihat jadwal pelayanan musik',
        icon: FiCalendar,
        href: '/dashboard/musik/jadwal-saya',
        color: 'bg-blue-500',
        permissions: ['admin', 'musik', 'Pemusik', 'Singer', 'WL'],
      },
      {
        title: 'Penjadwalan',
        description: 'Jadwalkan pelayanan musik',
        icon: FiCalendar,
        href: '/dashboard/musik/penjadwalan',
        color: 'bg-green-500',
        permissions: ['admin', 'musik'],
        requirePIC: true,
      },
      {
        title: 'List Lagu',
        description: 'Kelola daftar lagu',
        icon: FiMusic,
        href: '/dashboard/musik/list-lagu',
        color: 'bg-purple-500',
        permissions: ['admin', 'musik', 'Pemusik', 'Singer', 'WL'],
      },
      {
        title: 'List Pelayan',
        description: 'Kelola data pelayan musik',
        icon: FiList,
        href: '/dashboard/musik/list-pelayan',
        color: 'bg-orange-500',
        permissions: ['admin', 'musik'],
        requirePIC: true,
      },
    ],
  },
  {
    title: 'Pelayanan',
    description: 'Kelola data pelayanan',
    icon: MdOutlineVolunteerActivism,
    href: '/dashboard/pelayanan',
    color: 'bg-yellow-500',
    permissions: ['admin', 'pelayanan'],
  },
  {
    title: 'Departemen',
    description: 'Kelola departemen',
    icon: RiOrganizationChart,
    href: '/dashboard/departemen',
    color: 'bg-orange-500',
    permissions: ['admin', 'departemen'],
  },
  {
    title: 'Pemuridan',
    description: 'Kelola pemuridan anda',
    icon: FaPeopleArrows,
    href: '/dashboard/pemuridan',
    color: 'bg-cyan-800',
    permissions: ['admin', 'pemuridan', 'lifegroup'],
  },
  {
    title: 'Pelayanan',
    description: 'Kelola pelayanan pengguna',
    icon: TbUserStar,
    href: '/dashboard/role',
    color: 'bg-cyan-500',
    permissions: ['admin'],
    submenu: [
      {
        title: 'User Role',
        description: 'Kelola peran pengguna',
        icon: FiUsers,
        href: '/dashboard/role/user-role',
        color: 'bg-blue-500',
        permissions: ['admin'],
      },
      {
        title: 'Role Permission',
        description: 'Kelola izin peran',
        icon: FiLock,
        href: '/dashboard/role/role-permission',
        color: 'bg-green-500',
        permissions: ['admin'],
      },
    ],
  },
] as const;
