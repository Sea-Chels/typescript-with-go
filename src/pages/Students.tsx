import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useAuth } from '../hooks/useAuth';
import { useStudents } from '../hooks/useStudents';
import { Table } from '../components/ui/Table';
import { AddStudent } from '../components/AddStudent';
import type { Student } from '../api/types';
import { Button } from '../components/ui/Button';

export function Students() {
  const { logout } = useAuth();
  const { data, isLoading, error, refetch, createStudent, deleteStudent } = useStudents({ includeDeleted: true });

  // Define table columns
  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="font-medium text-dark-text">{row.original.name}</div>
        ),
      },
      {
        accessorKey: 'grade',
        header: 'Grade',
        cell: ({ row }) => (
          <div className="text-dark-text">{row.original.grade}</div>
        ),
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        cell: ({ row }) => {
          const date = new Date(row.original.created_at);
          return (
            <div className="text-dark-text">
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
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {isDeactivated ? 'True' : 'False'}
              </span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        accessorFn: (row) => row.deleted_at != null,
        cell: ({ row }) => {
          const isDeactivated = row.original.deleted_at != null;
          return (
            <Button disabled={isDeactivated} variant="danger" onClick={() => deleteStudent.mutate(row.original.id)}>Delete</Button>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-dark-bg relative">
      {/* Background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-primary/10 rounded-full mix-blend-screen filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-neon-purple/10 rounded-full mix-blend-screen filter blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative bg-dark-surface/50 backdrop-blur-sm border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-dark-text to-accent-light bg-clip-text text-transparent">
                Students
              </h1>
              <p className="text-sm text-dark-muted mt-1">Manage your student records</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-dark-text bg-dark-surface border border-dark-border rounded-lg hover:bg-dark-hover hover:border-red-500/50 hover:text-red-400 transition-all duration-200 group"
            >
              <span className="group-hover:inline hidden">⚡</span> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Add Student Button */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {data && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-dark-muted">Total:</span>
                  <span className="font-semibold text-accent-light px-2 py-1 bg-accent-primary/20 rounded-lg">
                    {data.count}
                  </span>
                  <span className="text-dark-muted">students</span>
                </div>
              )}
            </div>
            <AddStudent createStudent={createStudent} />
          </div>

          {/* Table Card */}
          <div className="bg-dark-surface/20 backdrop-blur-sm rounded-xl border border-dark-border/50 shadow-2xl overflow-hidden animate-slide-up">
            <div className="bg-gradient-to-r from-accent-primary/10 via-transparent to-neon-purple/10 h-1" />
            <div className="p-6">
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
        </div>
      </div>
    </div>
  );
}