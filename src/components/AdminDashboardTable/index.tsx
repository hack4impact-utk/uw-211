'use client';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useState } from 'react';
import { agencyUpdateStatus } from '@/utils/constants';
import { Agency } from '@/utils/types';
import { AdminDashboardTableFilterCheckbox } from '@/components/AdminDashboardTable/AdminDashboardTableFilterCheckbox';
import AdminDashboardTableSearch from '@/components/AdminDashboardTable/AdminDashboardTableSearch';
import AdminDashboardTableHeaders from './AdminDashboardTableHeaders';
import AdminDashboardTablePaginationControls from './AdminDashboardTablePaginationControls';
import { DashboardSearchParams } from '@/app/[locale]/dashboard/page';
import { useTranslations } from 'next-intl';

interface AdminDashboardTableProps {
  searchParams: DashboardSearchParams;
  agencies: Agency[];
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

function statusColor(status?: agencyUpdateStatus) {
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

const getAgenciesOnPage = (
  agencies: Agency[],
  showCompleted: boolean,
  showNeedsReview: boolean,
  showExpired: boolean,
  sortField?: string,
  sortAscending?: boolean
): Agency[] => {
  try {
    agencies = agencies.filter((agency) => {
      switch (agency.currentStatus) {
        case 'Completed':
          return showCompleted;
        case 'Needs Review':
          return showNeedsReview;
        case 'Expired':
          return showExpired;
        default:
          return true;
      }
    });

    if (sortField) {
      const sortFunction = makeAgencyCmpFn(sortField, sortAscending);
      agencies = agencies.sort(sortFunction);
    }

    return agencies;
  } catch (e) {
    return [];
  }
};

export function AdminDashboardTable({
  searchParams,
  agencies,
}: AdminDashboardTableProps) {
  const t = useTranslations('Components.adminDashboardTable');

  const [sortAscending, setSortAscending] = useState<boolean>(false);
  const [sortField, setSortField] = useState<string>('');
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  const [showNeedsReview, setShowNeedsReview] = useState<boolean>(true);
  const [showExpired, setShowExpired] = useState<boolean>(true);
  const [count, setCount] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  // deserialize JSON date string as Date object
  for (const agency of agencies) {
    agency.updatedAt = new Date(agency.updatedAt as unknown as string);
    agency.createdAt = new Date(agency.createdAt as unknown as string);
  }

  // apply filters and sort
  const agenciesOnPage = getAgenciesOnPage(
    agencies,
    showCompleted,
    showNeedsReview,
    showExpired,
    sortField,
    sortAscending
  );

  if (!agenciesOnPage) {
    return <div>{t('error')}</div>;
  }

  const translateAgencyStatus = (status: string | undefined) => {
    const statuses = new Map([
      ['Completed', t('currentStatus.completed')],
      ['Needs Review', t('currentStatus.needsReview')],
      ['Expired', t('currentStatus.expired')],
    ]);

    return statuses.get(status || '');
  };

  return (
    <div className="mx-8">
      <h1 className="text-l font-bold">{t('title')}</h1>

      <div className="flex py-4">
        <AdminDashboardTableSearch searchParams={searchParams} />
        <AdminDashboardTableFilterCheckbox
          showCompleted={showCompleted}
          showNeedsReview={showNeedsReview}
          showExpired={showExpired}
          setShowCompleted={setShowCompleted}
          setShowNeedsReview={setShowNeedsReview}
          setShowExpired={setShowExpired}
        />
      </div>
      {agenciesOnPage.length > 0 && (
        <Table className="rounded-md border shadow">
          <AdminDashboardTableHeaders
            sortField={sortField}
            sortAscending={sortAscending}
            setSortField={setSortField}
            setSortAscending={setSortAscending}
          />
          <TableBody>
            {agenciesOnPage
              .slice((page - 1) * count, page * count) // pagination
              .map((agency, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 1 ? 'bg-gray-100' : ''}
                >
                  <TableCell>{agency.name}</TableCell>
                  <TableCell>
                    {agency.updatedAt?.toLocaleDateString('en-us', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell
                    className={statusColor(
                      agency.currentStatus as agencyUpdateStatus | undefined
                    )}
                  >
                    {translateAgencyStatus(agency.currentStatus)}
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
      )}
      <div className="flex justify-end p-4">
        <AdminDashboardTablePaginationControls
          numAgencies={agencies.length}
          count={count}
          page={page}
          setCount={setCount}
          setPage={setPage}
        />
      </div>
    </div>
  );
}
