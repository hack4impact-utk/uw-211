import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import React from 'react';
import { agencyUpdateStatus } from '@/utils/constants';
import { Agency, DashboardParams } from '@/utils/types';
import { getAgencies } from '@/server/actions/Agencies';
import { AdminDashboardTableFilterCheckbox } from '@/components/AdminDashboardTable/AdminDashboardTableFilterCheckbox';
import AdminDashboardTableSearch from '@/components/AdminDashboardTable/AdminDashboardTableSearch';
import AdminDashboardTableHeaders from './AdminDashboardTableHeaders';

interface AdminDashboardTableProps {
  params: DashboardParams;
}

/**
 * @brief Accesses nested properties of an object
 * @example Can access obj.prop1.prop2 like getValueByPath(obj, "prop1.prop2")
 * @param obj Any object
 * @param path Path to the property as a dot-delimited string
 * @returns The property at the specified path
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
function getValueByPath(obj: any, path: string) {
  const keys: string[] = path.split('.');
  let current = obj;
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
 * @param ascending If false, reverses the sort
 * @returns A comparison function used to sort agencies
 */
function makeAgencyCmpFn(
  field: string = 'name',
  ascending: boolean = false
): (a: Agency, b: Agency) => number {
  return (a: Agency, b: Agency) => {
    const reverse: number = ascending === true ? 1 : -1;
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

export async function AdminDashboardTable({
  params,
}: AdminDashboardTableProps) {
  // extract sort and filter parameters
  const sortAscending: boolean =
    params.sortAscending === undefined || params.sortAscending === 'true';
  const showCompleted =
    params.completed === undefined || params.completed === 'true';
  const showNeedsReview =
    params.needsReview === undefined || params.needsReview === 'true';
  const showExpired = params.expired === undefined || params.expired === 'true';

  const currentStatusFilters = {
    showCompleted,
    showNeedsReview,
    showExpired,
  };

  let agencies: Agency[] = [];
  try {
    agencies = await getAgencies(
      false,
      params.search,
      currentStatusFilters,
      makeAgencyCmpFn(params.sortField, sortAscending)
    );
  } catch (error) {
    return <h1>Error loading data</h1>;
  }

  return (
    <div className="mx-8">
      <div className="flex py-4">
        <AdminDashboardTableSearch searchParams={params} />
        <AdminDashboardTableFilterCheckbox
          searchParams={params}
          initialCompleted={showCompleted}
          initialNeedsReview={showNeedsReview}
          initialExpired={showExpired}
        />
      </div>
      <Table className="rounded-md border shadow">
        <AdminDashboardTableHeaders searchParams={params} />
        <TableBody>
          {agencies.map((agency, index) => (
            <TableRow
              key={index}
              className={index % 2 === 1 ? 'bg-gray-100' : ''}
            >
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
              <TableCell
                className={
                  agency.currentStatus
                    ? statusColor(agency.currentStatus as agencyUpdateStatus)
                    : ''
                }
              >
                {agency.currentStatus}
              </TableCell>
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
