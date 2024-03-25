// import {
//     Column,
//     ColumnDef,
//     PaginationState,
//     flexRender,
//     getCoreRowModel,
//     getFilteredRowModel,
//     getPaginationRowModel,
//     getSortedRowModel,
//     useReactTable,
// } from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
// import { InferGetServerSidePropsType, GetServerSideProps } from 'next';
// import { Button } from '@/components/ui/button';
// import { ArrowUpDown } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { agencyUpdateStatus } from '@/utils/constants';

import { Agency, dashboardParams } from '@/utils/types';
import { getAgencies } from '@/server/actions/Agencies';

interface AdminDashboardTableProps {
  params: dashboardParams;
}

function cmpAgencyByField(field: string, descending: boolean) {
  return (a: Agency, b: Agency) => {
    const reverse: number = descending === true ? -1 : 1;
    const key: keyof Agency = field as keyof Agency;
    console.log(a[key]!);

    if (a[key]! < b[key]!) {
      return -1 * reverse;
    }

    if (a[key]! > b[key]!) {
      return 1 * reverse;
    }

    return 0;
  };
}

export async function AdminDashboardTable({
  params,
}: AdminDashboardTableProps) {
  let agencies: Agency[] = [];
  const sortDescending: boolean =
    params.sortDescending === undefined ? false : params.sortDescending === '1';

  try {
    agencies = await getAgencies(
      true,
      cmpAgencyByField(params.sortField || 'name', sortDescending)
    );
  } catch (error) {
    return <h1>Error loading data</h1>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Agency Name</TableHead>
            <TableHead>Last Update</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updater Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agencies.map((agency, index) => (
            <TableRow key={index}>
              <TableCell>{agency.name}</TableCell>
              <TableCell>
                {agency.updatedAt === undefined
                  ? ''
                  : agency.updatedAt.toLocaleDateString('en-us', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
              </TableCell>
              <TableCell>{agency.currentStatus}</TableCell>
              <TableCell>
                <a
                  href={`mailto:${agency.latestInfo?.updaterContactInfo.email}`}
                >
                  {agency.latestInfo?.updaterContactInfo.email}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
