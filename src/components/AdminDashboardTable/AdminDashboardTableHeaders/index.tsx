'use client';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

type AdminDashboardTableHeadersProps = {
  sortField: string;
  sortAscending: boolean;
  setSortField: Dispatch<SetStateAction<string>>;
  setSortAscending: Dispatch<SetStateAction<boolean>>;
};

const tableHeaders = [
  {
    name: 'Agency Name',
    property: 'name',
  },
  {
    name: 'Last Update',
    property: 'updatedAt',
  },
  {
    name: 'Status',
    property: 'currentStatus',
  },
  {
    name: 'Updater Email',
    property: 'latestInfo.updaterContactInfo.email',
  },
];

function getSortArrow(
  property: string,
  sortField: string,
  sortAscending: boolean
) {
  if (sortField !== property) {
    return <div className="ml-2 h-4 w-4" />;
  }

  if (sortAscending) {
    return <ArrowUp className="ml-2 h-4 w-4" />;
  } else {
    return <ArrowDown className="ml-2 h-4 w-4" />;
  }
}

export default function AdminDashboardTableHeaders({
  sortField,
  sortAscending,
  setSortField,
  setSortAscending,
}: AdminDashboardTableHeadersProps) {
  const handleSort = (property: string) => {
    setSortField(property);

    // the first time you click on a header, sort ascending
    // otherwise, it should go true --> false --> not sorted
    if (sortField !== property) {
      setSortAscending(true);
    } else if (sortAscending) {
      setSortAscending(false);
    } else {
      setSortField('');
      setSortAscending(true); // the default sortAscending is true
    }
  };

  return (
    <TableHeader>
      <TableRow>
        {tableHeaders.map((header, i) => {
          return (
            <TableHead key={i}>
              <button
                onClick={() => handleSort(header.property)}
                className="flex items-center"
              >
                {header.name}
                {getSortArrow(header.property, sortField, sortAscending)}
              </button>
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}
