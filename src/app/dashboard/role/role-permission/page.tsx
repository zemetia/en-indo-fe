'use client';

import * as React from 'react';
import { FiCheck, FiEdit2, FiX } from 'react-icons/fi';

type PermissionKey =
  | 'dashboard'
  | 'jemaat'
  | 'life-group'
  | 'role'
  | 'settings';

type Permissions = {
  [K in PermissionKey]: boolean;
};

// Data dummy untuk contoh
const dummyData = [
  {
    id: '1',
    nama: 'Admin',
    permissions: {
      dashboard: true,
      jemaat: true,
      'life-group': true,
      role: true,
      settings: true,
    } as Permissions,
  },
  {
    id: '2',
    nama: 'Pembina',
    permissions: {
      dashboard: true,
      jemaat: true,
      'life-group': true,
      role: false,
      settings: false,
    } as Permissions,
  },
  {
    id: '3',
    nama: 'Jemaat',
    permissions: {
      dashboard: true,
      jemaat: false,
      'life-group': false,
      role: false,
      settings: false,
    } as Permissions,
  },
];

const permissionLabels: Record<PermissionKey, string> = {
  dashboard: 'Dashboard',
  jemaat: 'Manajemen Jemaat',
  'life-group': 'Manajemen Life Group',
  role: 'Manajemen Role',
  settings: 'Pengaturan Sistem',
};

export default function RolePermissionPage() {
  const [roles, setRoles] = React.useState(dummyData);

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
                  {Object.entries(permissionLabels).map(([key, label]) => (
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
    </div>
  );
}
