'use client';

import axios from 'axios';
import * as React from 'react';
import { FiCheck, FiEdit2, FiX } from 'react-icons/fi';

import { getToken } from '@/lib/helper';

type PermissionKey =
  | 'dashboard'
  | 'jemaat'
  | 'life-group'
  | 'role'
  | 'settings';

type Permissions = {
  [K in PermissionKey]: boolean;
};

interface Role {
  id: string;
  nama: string;
  permissions: Permissions;
}

const permissionLabels: Record<PermissionKey, string> = {
  dashboard: 'Dashboard',
  jemaat: 'Manajemen Jemaat',
  'life-group': 'Manajemen Life Group',
  role: 'Manajemen Role',
  settings: 'Pengaturan Sistem',
};

export default function RolePermissionPage() {
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/role-permission`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRoles(response.data.data);
      } catch (err) {
        setError('Gagal memuat data izin role.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleTogglePermission = (
    roleId: string,
    permission: PermissionKey
  ) => {
    setRoles((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: {
              ...role.permissions,
              [permission]: !role.permissions[permission],
            },
          };
        }
        return role;
      })
    );
    // TODO: Add API call to update permission on backend
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
                  Role
                </th>
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <th
                    key={key}
                    className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
                  >
                    {label}
                  </th>
                ))}
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
                  {Object.entries(permissionLabels).map(([key]) => (
                    <td
                      key={key}
                      className='px-6 py-4 whitespace-nowrap text-center'
                    >
                      <button
                        onClick={() =>
                          handleTogglePermission(role.id, key as PermissionKey)
                        }
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          role.permissions[key as PermissionKey]
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {role.permissions[key as PermissionKey] ? (
                          <FiCheck className='w-5 h-5' />
                        ) : (
                          <FiX className='w-5 h-5' />
                        )}
                      </button>
                    </td>
                  ))}
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <button
                      onClick={() => {
                        // TODO: Implementasi edit role
                        console.log('Edit role:', role);
                      }}
                      className='text-primary-600 hover:text-primary-900'
                    >
                      <FiEdit2 className='w-5 h-5' />
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
        <h1 className='text-2xl font-semibold text-gray-900'>
          Role Permission
        </h1>
        <p className='mt-2 text-sm text-gray-600'>
          Kelola izin untuk setiap peran dalam sistem
        </p>
      </div>
      {renderContent()}
    </div>
  );
}
