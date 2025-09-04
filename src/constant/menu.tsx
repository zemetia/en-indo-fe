
import { BsCalendarEvent, BsCalendarWeek, BsPersonCircle, BsPersonCheck } from 'react-icons/bs';
import {
  FiCalendar,
  FiHome,
  FiList,
  FiLock,
  FiMusic,
  FiUsers,
  FiCheckSquare,
  FiUserPlus,
  FiEdit3,
} from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { IoMusicalNotesOutline } from 'react-icons/io5';
import { MdOutlineEvent, MdOutlineVolunteerActivism } from 'react-icons/md';
import { RiOrganizationChart } from 'react-icons/ri';
import { FaPeopleArrows } from 'react-icons/fa';
import { TbUserStar } from 'react-icons/tb';
import { QrCode } from 'lucide-react';
import { FaChurch } from 'react-icons/fa';
import { RiBuilding2Line } from 'react-icons/ri';
import { MdOutlineBarChart, MdOutlineList } from 'react-icons/md';

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

export const ADMIN_ROLE = 'admin';

// Centralized function to check permissions
export const hasAccess = (
  menu: MenuItem,
  userRoles: string[],
  userPelayanan: any[]
): boolean => {
  // Admin has access to everything
  if (userRoles.includes(ADMIN_ROLE)) {
    return true;
  }

  // Check if user has any of the required roles
  const hasRequiredRole =
    menu.permissions.includes('*') ||
    menu.permissions.some((permission) => userRoles.includes(permission));

  // If the menu doesn't require PIC status, role is enough
  if (!menu.requirePIC) {
    return hasRequiredRole;
  }

  // If it requires PIC status, check both role and PIC status
  if (hasRequiredRole && menu.requirePIC) {
    return userPelayanan.some(
      (p) => menu.permissions.includes(p.pelayanan.toLowerCase()) && p.is_pic
    );
  }

  return false;
};

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
    title: 'Jadwal Saya',
    description: 'Lihat semua jadwal pelayanan Anda',
    icon: FiCalendar,
    href: '/dashboard/jadwal-saya',
    color: 'bg-teal-500',
    permissions: ['*'],
  },
  {
    title: 'Ketersediaan',
    description: 'Tandai ketersediaan pelayanan Anda',
    icon: FiCheckSquare,
    href: '/dashboard/ketersediaan',
    color: 'bg-purple-500',
    permissions: ['*'],
  },
  {
    title: 'Pelayanan Saya',
    description: 'Lihat pelayanan dan tanggung jawab Anda',
    icon: TbUserStar,
    href: '/dashboard/pelayanan/pelayanan-saya',
    color: 'bg-yellow-500',
    permissions: ['*'], // Available to all authenticated users
  },
  {
    title: 'Kehadiran',
    description: 'Pindai QR Code untuk kehadiran',
    icon: QrCode,
    href: '/dashboard/attendance',
    color: 'bg-emerald-500',
    permissions: ['admin', 'event'],
  },
  {
    title: 'Manajemen Data',
    description: 'Kelola data jemaat dan tamu',
    icon: FiUsers,
    href: '/dashboard/data',
    color: 'bg-green-500',
    permissions: ['admin', 'jemaat'],
    submenu: [
      {
        title: 'Data Jemaat',
        description: 'Kelola data jemaat gereja',
        icon: FiUsers,
        href: '/dashboard/jemaat',
        color: 'bg-green-600',
        permissions: ['admin', 'jemaat'],
      },
      {
        title: 'Data Tamu',
        description: 'Kelola data tamu dan pengunjung gereja',
        icon: BsPersonCheck,
        href: '/dashboard/tamu',
        color: 'bg-green-700',
        permissions: ['admin', 'jemaat'],
      },
    ],
  },
  {
    title: 'Gereja',
    description: 'Kelola data gereja',
    icon: FaChurch,
    href: '/dashboard/church',
    color: 'bg-blue-500',
    permissions: ['admin'],
    submenu: [
      {
        title: 'Daftar Gereja',
        description: 'Kelola data gereja dan informasi gereja',
        icon: MdOutlineList,
        href: '/dashboard/church',
        color: 'bg-blue-600',
        permissions: ['admin'],
      },
      {
        title: 'Statistik Gereja',
        description: 'Lihat statistik dan analitik gereja',
        icon: MdOutlineBarChart,
        href: '/dashboard/church/statistics',
        color: 'bg-blue-700',
        permissions: ['admin'],
      },
    ],
  },
  {
    title: 'Lifegroup',
    description: 'Kelola data lifegroup',
    icon: HiOutlineUserGroup,
    href: '/dashboard/lifegroup',
    color: 'bg-purple-500',
    permissions: ['admin', 'lifegroup'],
    submenu: [
      {
        title: 'Daftar Lifegroup',
        description: 'Kelola semua lifegroup di gereja',
        icon: FiList,
        href: '/dashboard/lifegroup/daftar',
        color: 'bg-purple-600',
        permissions: ['admin', 'lifegroup'],
        requirePIC: true,
      },
      {
        title: 'My Lifegroup',
        description: 'Lihat lifegroup saya',
        icon: BsPersonCircle,
        href: '/dashboard/lifegroup/my-lifegroup',
        color: 'bg-purple-700',
        permissions: ['*'],
      },
      {
        title: 'Tambah Lifegroup',
        description: 'Buat lifegroup baru',
        icon: FiUserPlus,
        href: '/dashboard/lifegroup/tambah',
        color: 'bg-purple-800',
        permissions: ['admin', 'lifegroup'],
        requirePIC: true,
      },
    ],
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
        href: '/dashboard/event/create',
        color: 'bg-amber-800',
        permissions: ['admin', 'event'],
        requirePIC: true,
      },
      {
        title: 'Kalender Event',
        description: 'Lihat event dalam tampilan kalender',
        icon: BsCalendarEvent,
        href: '/dashboard/event/calendar',
        color: 'bg-amber-900',
        permissions: ['admin', 'event'],
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
    submenu: [
        {
          title: 'Daftar Penugasan',
          description: 'Lihat semua penugasan pelayanan',
          icon: FiList,
          href: '/dashboard/pelayanan',
          color: 'bg-yellow-600',
          permissions: ['admin', 'pelayanan'],
        },
        {
          title: 'Kelola Pelayanan',
          description: 'Kelola jenis-jenis pelayanan',
          icon: FiEdit3,
          href: '/dashboard/pelayanan/manage',
          color: 'bg-yellow-500',
          permissions: ['admin'],
        },
        {
          title: 'Assign Pelayanan',
          description: 'Tugaskan jemaat ke pelayanan',
          icon: FiUserPlus,
          href: '/dashboard/pelayanan/assign',
          color: 'bg-yellow-700',
          permissions: ['admin', 'pelayanan'],
          requirePIC: true,
        },
        {
          title: 'Departemen',
          description: 'Kelola departemen dan PIC',
          icon: RiBuilding2Line,
          href: '/dashboard/department',
          color: 'bg-yellow-800',
          permissions: ['admin'],
        },
    ]
  },
  {
    title: 'Pemuridan',
    description: 'Kelola pemuridan anda',
    icon: FaPeopleArrows,
    href: '/dashboard/pemuridan',
    color: 'bg-cyan-800',
    permissions: ['admin', 'pemuridan', 'lifegroup'],
  },
] as const;
