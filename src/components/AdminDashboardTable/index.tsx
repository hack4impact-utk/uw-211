import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import React, { cache } from 'react';
import { agencyUpdateStatus } from '@/utils/constants';
import { Agency, DashboardParams } from '@/utils/types';
import { getAgencies } from '@/server/actions/Agencies';
import { AdminDashboardTableFilterCheckbox } from '@/components/AdminDashboardTable/AdminDashboardTableFilterCheckbox';
import AdminDashboardTableSearch from '@/components/AdminDashboardTable/AdminDashboardTableSearch';
import AdminDashboardTableHeaders from './AdminDashboardTableHeaders';
import AdminDashboardTablePaginationControls from './AdminDashboardTablePaginationControls';
import { getLocale, getTranslations } from 'next-intl/server';

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
const cachedGetAgencies = cache(getAgencies);

type CurrentStatusFilters = {
  showCompleted: boolean;
  showNeedsReview: boolean;
  showExpired: boolean;
};

const getAgenciesOnPage = async (
  agencies: Agency[],
  currentStatusFilters?: CurrentStatusFilters,
  sortField?: string,
  sortAscending?: boolean
): Promise<Agency[] | null> => {
  try {
    if (currentStatusFilters) {
      agencies = agencies.filter((agency) => {
        switch (agency.currentStatus) {
          case 'Completed':
            return currentStatusFilters.showCompleted;
          case 'Needs Review':
            return currentStatusFilters.showNeedsReview;
          case 'Expired':
            return currentStatusFilters.showExpired;
          default:
            return true;
        }
      });
    }

    // process agencies array based on search params
    if (sortField) {
      const sortFunction = makeAgencyCmpFn(sortField, sortAscending);
      agencies = agencies.sort(sortFunction);
    }

    return agencies;
  } catch (e) {
    return null;
  }
};

export async function AdminDashboardTable({
  params,
}: AdminDashboardTableProps) {
  const locale = await getLocale();
  const t = await getTranslations('Components.adminDashboardTable');

  // extract sort and filter parameters
  const sortAscending: boolean =
    params.sortAscending === undefined || params.sortAscending === 'true';
  const showCompleted =
    params.completed === undefined || params.completed === 'true';
  const showNeedsReview =
    params.needsReview === undefined || params.needsReview === 'true';
  const showExpired = params.expired === undefined || params.expired === 'true';
  const count = params.count ? parseInt(params.count) : 10;
  const page = params.page ? parseInt(params.page) : 1;

  const currentStatusFilters = {
    showCompleted,
    showNeedsReview,
    showExpired,
  };

  const agencies = await cachedGetAgencies(false, params.search);
  const agenciesOnPage = await getAgenciesOnPage(
    agencies,
    currentStatusFilters,
    params.sortField,
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
          {agenciesOnPage
            .slice((page - 1) * count, page * count) // pagination
            .map((agency, index) => (
              <TableRow
                key={index}
                className={index % 2 === 1 ? 'bg-gray-100' : ''}
              >
                <TableCell>{agency.name}</TableCell>
                <TableCell>
                  {agency.updatedAt === undefined
                    ? ''
                    : agency.updatedAt.toLocaleDateString(locale, {
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
      <div className="flex justify-end p-4">
        <AdminDashboardTablePaginationControls
          searchParams={params}
          numAgencies={agencies.length}
        />
      </div>
    </div>
  );
}
