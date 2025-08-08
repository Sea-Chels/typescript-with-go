import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { Table } from '../components/ui/Table';
import { AddStudent } from '../components/AddStudent';
import type { Student, StudentsResponse } from '../api/types';
import { API_ENDPOINTS } from '../utils/constants';

export function Students() {
  const { server } = useApi();
  const { logout } = useAuth();

  // Fetch students data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await server.get<StudentsResponse>(API_ENDPOINTS.STUDENTS.LIST);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error?.message || 'Failed to fetch students');
    },
  });

  // Define table columns
  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="font-medium text-gray-900">{row.original.name}</div>
        ),
      },
      {
        accessorKey: 'grade',
        header: 'Grade',
        cell: ({ row }) => (
          <div className="text-gray-900">{row.original.grade}</div>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
          const date = new Date(row.original.created_at);
          return (
            <div className="text-gray-900">
              {date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          );
        },
      },
      {
        id: 'deactivated',
        header: 'Deactivated',
        accessorFn: (row) => row.deleted_at != null,
        cell: ({ row }) => {
          const isDeactivated = row.original.deleted_at != null;
          return (
            <div className="flex items-center">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  isDeactivated
                    ? 'bg-red-100 text-red-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {isDeactivated ? 'True' : 'False'}
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-gray-900">Students</h1>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Add Student Button */}
          <div className="mb-4 flex justify-end">
            <AddStudent />
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-4 py-5 sm:p-6">
              <Table
                data={data?.students || []}
                columns={columns}
                pageSize={3}
                isLoading={isLoading}
                error={error?.message || null}
                onRetry={() => refetch()}
                enableSearch={true}
                searchPlaceholder="Search students by name, grade..."
              />
            </div>
          </div>

          {/* Summary */}
          {data && (
            <div className="mt-4 px-4 py-3 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-600">
                Total students: <span className="font-semibold">{data.count}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}