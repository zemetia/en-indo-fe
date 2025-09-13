'use client';

import axios from 'axios';
import * as React from 'react';
import { FiCheck, FiUserPlus, FiSearch } from 'react-icons/fi';

import { getToken } from '@/lib/helper';

interface User {
  id: string;
  nama: string;
  email: string;
  currentRole: string;
  department: string;
}

interface Role {
  id: string;
  nama: string;
  deskripsi: string;
}

export default function AssignRolePage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          setError('Akses ditolak. Silakan login kembali.');
          return;
        }
        const [usersResponse, rolesResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/role`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersResponse.data.data);
        setRoles(rolesResponse.data.data);
      } catch (err) {
        setError('Gagal memuat data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className='flex justify-center items-center py-10'>
          <div className='w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin'></div>
        </div>
      );
    }

    if (error) {
      return <p className='text-center text-red-500'>{error}</p>;
    }

    return (
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
        <table className='w-full text-sm text-left text-gray-500'>
          <thead className='text-xs text-gray-700 uppercase bg-gray-50'>
            <tr>
              <th scope='col' className='px-6 py-3 font-medium'>
                Nama
              </th>
              <th scope='col' className='px-6 py-3 font-medium'>
                Email
              </th>
              <th scope='col' className='px-6 py-3 font-medium'>
                Role Saat Ini
              </th>
              <th scope='col' className='px-6 py-3 font-medium'>
                Departemen
              </th>
              <th scope='col' className='px-6 py-3 font-medium text-right'>
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className='bg-white border-b last:border-b-0 hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {user.nama}
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>{user.email}</td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                    {user.currentRole}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {user.department}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                  <button className='text-primary-600 hover:text-primary-900'>
                    Edit Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold text-gray-900'>
          Tugaskan Role ke Pengguna
        </h1>
        <button className='px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'>
          <FiUserPlus className='w-4 h-4 inline-block mr-2' />
          Tambah Pengguna
        </button>
      </div>

      {/* Search and Filter */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <FiSearch className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Cari pengguna...'
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm'
              />
            </div>
          </div>
          <div className='flex gap-4'>
            <select className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md'>
              <option value=''>Semua Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.nama}
                </option>
              ))}
            </select>
            <select className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md'>
              <option value=''>Semua Departemen</option>
              <option value='IT'>IT</option>
              <option value='Marketing'>Marketing</option>
              <option value='Finance'>Finance</option>
            </select>
          </div>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
