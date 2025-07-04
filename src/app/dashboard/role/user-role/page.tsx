'use client';

import axios from 'axios';
import * as React from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';

import { getToken } from '@/lib/helper';

interface Role {
  id: string;
  nama: string;
  deskripsi: string;
  jumlahUser: number;
  status: 'Aktif' | 'Tidak Aktif';
}

export default function UserRolePage() {
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const token = getToken();
        if (!token) {
          setError('Akses ditolak. Silakan login kembali.');
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/role`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRoles(response.data.data);
      } catch (err) {
        setError('Gagal memuat data role.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleAdd = () => {
    // TODO: Implementasi tambah role
    console.log('Tambah role');
  };

  const handleEdit = (role: Role) => {
    // TODO: Implementasi edit role
    console.log('Edit role:', role);
  };

  const handleDelete = (id: string) => {
    // TODO: Implementasi hapus role
    console.log('Hapus role:', id);
  };

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
      <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Nama Role
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Deskripsi
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Jumlah User
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Status
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {roles.map((role) => (
                <tr key={role.id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {role.nama}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-500'>
                      {role.deskripsi}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-500'>
                      {role.jumlahUser} user
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        role.status === 'Aktif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {role.status}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button
                      onClick={() => handleEdit(role)}
                      className='text-primary-600 hover:text-primary-900 mr-4'
                    >
                      <FiEdit2 className='w-5 h-5' />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
                      className='text-red-600 hover:text-red-900'
                    >
                      <FiTrash2 className='w-5 h-5' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='text-2xl font-semibold text-gray-900'>User Role</h1>
        <p className='mt-2 text-sm text-gray-600'>
          Kelola peran pengguna dalam sistem
        </p>
      </div>

      <div className='p-6 border-b border-gray-200'>
        <button
          onClick={handleAdd}
          className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'
        >
          <FiPlus className='w-5 h-5 mr-2' />
          Tambah Role
        </button>
      </div>
      {renderContent()}
    </div>
  );
}
