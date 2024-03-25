// TOOD:
// Pagination
// Styling from old
// Sort buttons to change sort
// Search bar
// Other nicities from the old dashboard

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
import { Input } from '@/components/ui/input';
import { Agency, dashboardParams } from '@/utils/types';
import { getAgencies } from '@/server/actions/Agencies';

interface AdminDashboardTableProps {
  params: dashboardParams;
}

/**
 * @brief Accesses nested properties of an object
 * @example Can access obj.prop1.prop2 like getValueByPath(obj, "prop1.prop2")
 * @param obj Any object
 * @param path Path to the property as a dot-delimited string
 * @returns The property at the specified path
 */
function getValueByPath(obj: any, path: string) {
  const keys: string[] = path.split('.');
  let current: any = obj;
  for (const key of keys) {
    if (current[key] === undefined) {
      return undefined;
    }
    current = current[key];
  }
  return current;
}

/**
 * @brief Makes a comparison function that compares two agencies based on a provided field; used to sort agencies
 * @param field A field of the Agency type (e.g. "name")
 * @param descending If true, reverses the sort
 * @returns A comparison function used to sort agencies
 */
function makeAgencyCmpFn(
  field: string = 'name',
  descending: boolean = false
): (a: Agency, b: Agency) => number {
  return (a: Agency, b: Agency) => {
    const reverse: number = descending === true ? -1 : 1;
    const a_val = getValueByPath(a, field);
    const b_val = getValueByPath(b, field);

    if (a_val < b_val) {
      return -1 * reverse;
    }

    if (a_val > b_val) {
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
      false,
      params.search,
      makeAgencyCmpFn(params.sortField, sortDescending)
    );
  } catch (error) {
    return <h1>Error loading data</h1>;
  }

  const hiddenInputs = Object.entries(params).map(([key, value]) => {
    if (key !== 'search') {
      return <input type="hidden" key={key} name={key} value={value} />;
    }
  });

  return (
    <div>
      <form
        className="flex items-center py-4"
        action="./dashboard"
        method="GET"
      >
        {hiddenInputs}
        <Input
          placeholder="Search for an agency..."
          className="max-w"
          name="search"
        />
        <button type="submit" className="ml-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 15 15"
          >
            <path
              fill="currentColor"
              fill-rule="evenodd"
              d="M10 6.5a3.5 3.5 0 1 1-7 0a3.5 3.5 0 0 1 7 0m-.691 3.516a4.5 4.5 0 1 1 .707-.707l2.838 2.837a.5.5 0 0 1-.708.708z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </form>
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
