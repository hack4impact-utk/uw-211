'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { agencyUpdateStatus } from '@/utils/constants';
import useTranslation from 'next-translate/useTranslation';

export type AgencyDashboardInfo = {
  name: string;
  lastUpdate?: Date | undefined;
  status: agencyUpdateStatus;
  email: string | undefined;
};

function statusColor(status: agencyUpdateStatus) {
  switch (status) {
    case agencyUpdateStatus.Completed:
      return 'bg-green-100';
    case agencyUpdateStatus.NeedsReview:
      return 'bg-blue-100';
    case agencyUpdateStatus.Expired:
      return 'bg-red-100';
    default:
      return '';
  }
}

interface AdminDashboardTableProps {
  data: AgencyDashboardInfo[];
}

export function AdminDashboardTable({ data }: AdminDashboardTableProps) {
  const { t, lang } = useTranslation('common');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Column definitions for table
  const columns: ColumnDef<AgencyDashboardInfo>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {t('dashboard.agency')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: 'lastUpdate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {t('dashboard.lastUpdate')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ getValue }) => {
        const value = getValue() as Date;
        return value
          ? new Date(value).toLocaleDateString(lang, {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
          : 'Never';
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {t('dashboard.informationStatus')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        let text;
        switch (row.original.status) {
          case agencyUpdateStatus.Completed:
            text = t('agencyUpdateStatus.completed');
            break;
          case agencyUpdateStatus.NeedsReview:
            text = t('agencyUpdateStatus.needsReview');
            break;
          case agencyUpdateStatus.Expired:
            text = t('agencyUpdateStatus.expired');
            break;
          default:
            text = 'Error'; // Default case to handle unexpected values
        }

        return <span>{text}</span>;
      },
    },
    {
      accessorKey: 'email',
      header: t('dashboard.email'),
      // Overwrites every cell in column to be a <a/> link with the email, instead of just text.
      cell: ({ row }) => (
        <a href={`mailto:${row.original.email}`} className="hover:underline">
          {row.original.email}
        </a>
      ),
    },
  ];

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="px-5">
      {/* Search Bar for filtering by name */}
      <div className="flex items-center py-4">
        <Input
          placeholder={t('dashboard.search')}
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w"
        />
      </div>

      {/* Dynamic Table: doesn't need to be edited to add additional functionality.*/}
      <div className="rounded-md border shadow">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  className={rowIndex % 2 === 1 ? 'bg-gray-100' : ''}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === 'status'
                          ? statusColor(cell.getValue() as agencyUpdateStatus)
                          : ''
                      }
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t('dashboard.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
