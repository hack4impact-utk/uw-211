import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
import { agencyUpdateStatus } from '@/utils/constants';
import { Input } from '@/components/ui/input';
import { ArrowUp, ArrowDown } from 'lucide-react';
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

/** Helper function to create sortable table heads */
function addTableHead(
  property: string,
  name: string,
  activeSortField: string | undefined,
  sortHiddenInputs: (React.JSX.Element | undefined)[],
  sortAscending: boolean
) {
  return (
    <TableHead>
      <form action="./dashboard" method="GET">
        {sortHiddenInputs}
        <input
          type="hidden"
          key={'sortField'}
          name={'sortField'}
          value={property}
        ></input>
        <input
          type="hidden"
          key={'sortAscending'}
          name={'sortAscending'}
          value={sortAscending ? '0' : '1'}
        ></input>
        <button className="flex items-center">
          {name}
          {activeSortField == property ? (
            sortAscending ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDown className="ml-2 h-4 w-4" />
            )
          ) : (
            <></>
          )}
        </button>
      </form>
    </TableHead>
  );
}

export async function AdminDashboardTable({
  params,
}: AdminDashboardTableProps) {
  let agencies: Agency[] = [];
  const sortAscending: boolean =
    params.sortAscending === undefined ? false : params.sortAscending === '1';

  try {
    agencies = await getAgencies(
      false,
      params.search,
      makeAgencyCmpFn(params.sortField, sortAscending)
    );
  } catch (error) {
    return <h1>Error loading data</h1>;
  }

  // Hidden inputs inserted into the search form to preserve other query parameters
  const searchHiddenInputs = Object.entries(params).map(([key, value]) => {
    if (key !== 'search') {
      return <input type="hidden" key={key} name={key} value={value} />;
    }
  });

  // Same, but for the sort buttons on each table head
  const sortHiddenInputs = Object.entries(params).map(([key, value]) => {
    if (key !== 'sortField' && key !== 'sortAscending') {
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
        {searchHiddenInputs}
        <Input
          placeholder="Search for an agency..."
          className="max-w"
          name="search"
          defaultValue={params.search || ''}
        />
        <button
          type="submit"
          className="rounded-r-md border border-l-0 bg-blue-500 px-4 font-bold text-white hover:bg-blue-700"
        >
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
      <Table className="rounded-md border shadow">
        <TableHeader>
          <TableRow>
            {addTableHead(
              'name',
              'Agency Name',
              params.sortField,
              sortHiddenInputs,
              sortAscending
            )}
            {addTableHead(
              'updatedAt',
              'Last Update',
              params.sortField,
              sortHiddenInputs,
              sortAscending
            )}
            {addTableHead(
              'currentStatus',
              'Status',
              params.sortField,
              sortHiddenInputs,
              sortAscending
            )}
            {addTableHead(
              'latestInfo.updaterContactInfo.email',
              'Updater Email',
              params.sortField,
              sortHiddenInputs,
              sortAscending
            )}
          </TableRow>
        </TableHeader>
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
