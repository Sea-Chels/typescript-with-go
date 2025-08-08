import {useState} from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { LoadingSpinner } from './LoadingSpinner';

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageSize?: number;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  enableSearch?: boolean;
  searchPlaceholder?: string;
}

export function Table<T>({
  data,
  columns,
  pageSize = 3,
  isLoading = false,
  error = null,
  onRetry,
  enableSearch = true,
  searchPlaceholder = "Search...",
}: TableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: 'includesString',
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-gradient-to-r from-accent-primary to-neon-purple text-white rounded-lg hover:shadow-lg hover:shadow-accent-primary/25 transition-all duration-200 transform hover:scale-105"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search Bar */}
      {enableSearch && (
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-10 pr-4 py-3 bg-dark-surface/50 backdrop-blur-sm border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary outline-none transition-all duration-200 hover:border-accent-primary/50"
            />
          </div>
          {globalFilter && (
            <p className="text-sm text-dark-muted mt-2 animate-fade-in">
              Found <span className="text-accent-light font-medium">{table.getFilteredRowModel().rows.length}</span> result(s)
            </p>
          )}
        </div>
      )}
      
      <div className="overflow-x-auto rounded-lg border border-dark-border/50 bg-dark-surface/30 backdrop-blur-sm">
        <table className="min-w-full divide-y divide-dark-border">
          <thead className="bg-dark-surface/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-xs font-semibold text-accent-light uppercase tracking-wider cursor-pointer hover:bg-dark-hover/50 transition-colors duration-200"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center group">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() && (
                        <span className="ml-2 text-accent-primary animate-fade-in">
                          {header.column.getIsSorted() === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                      {!header.column.getIsSorted() && (
                        <span className="ml-2 opacity-0 group-hover:opacity-50 text-dark-muted transition-opacity">
                          ↕
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-dark-border/50">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-dark-hover/30 transition-colors duration-150">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-dark-text">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex items-center justify-between px-4 py-3 bg-dark-surface/30 backdrop-blur-sm rounded-lg border border-dark-border/50">
        <div className="flex items-center">
          <span className="text-sm text-dark-muted">
            Page <span className="text-accent-light font-medium">{table.getState().pagination.pageIndex + 1}</span> of <span className="text-accent-light font-medium">{table.getPageCount()}</span>
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 text-sm bg-dark-surface border border-dark-border rounded-lg text-dark-text hover:bg-dark-hover hover:border-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:bg-dark-surface disabled:hover:border-dark-border"
          >
            First
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1.5 text-sm bg-dark-surface border border-dark-border rounded-lg text-dark-text hover:bg-dark-hover hover:border-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:bg-dark-surface disabled:hover:border-dark-border"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 text-sm bg-dark-surface border border-dark-border rounded-lg text-dark-text hover:bg-dark-hover hover:border-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:bg-dark-surface disabled:hover:border-dark-border"
          >
            Next
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1.5 text-sm bg-dark-surface border border-dark-border rounded-lg text-dark-text hover:bg-dark-hover hover:border-accent-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 disabled:hover:bg-dark-surface disabled:hover:border-dark-border"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}