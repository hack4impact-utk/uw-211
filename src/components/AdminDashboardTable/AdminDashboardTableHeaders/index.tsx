'use client';

import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DashboardParams } from '@/utils/types';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

type AdminDashboardTableHeadersProps = {
  searchParams: DashboardParams;
};

function getSortArrow(property: string, searchParams: DashboardParams) {
  if (searchParams.sortField !== property) {
    return <div className="ml-2 h-4 w-4" />;
  }

  if (searchParams.sortAscending === 'true') {
    return <ArrowUp className="ml-2 h-4 w-4" />;
  } else {
    return <ArrowDown className="ml-2 h-4 w-4" />;
  }
}

export default function AdminDashboardTableHeaders({
  searchParams,
}: AdminDashboardTableHeadersProps) {
  const t = useTranslations('Components.adminDashboardTable.tableHeader');

  const tableHeaders = [
    {
      name: t('name'),
      property: 'name',
    },
    {
      name: t('date'),
      property: 'updatedAt',
    },
    {
      name: t('status'),
      property: 'currentStatus',
    },
    {
      name: t('email'),
      property: 'latestInfo.updaterContactInfo.email',
    },
  ];

  const router = useRouter();

  const handleSort = (property: string) => {
    const urlSearchParams = new URLSearchParams(searchParams);

    urlSearchParams.set('sortField', property);

    let searchAscendingValue: boolean;
    if (searchParams.sortField === property) {
      searchAscendingValue = !(searchParams.sortAscending === 'true');
    } else {
      searchAscendingValue = true;
    }

    urlSearchParams.set('sortAscending', searchAscendingValue.toString());

    router.replace('/dashboard' + '?' + urlSearchParams.toString());
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
                {getSortArrow(header.property, searchParams)}
              </button>
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
}
