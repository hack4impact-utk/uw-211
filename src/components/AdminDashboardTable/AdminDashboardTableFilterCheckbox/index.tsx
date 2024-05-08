'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { DashboardParams } from '@/utils/types';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type AdminDashboardTableFilterCheckboxProps = {
  searchParams: DashboardParams;
  initialCompleted: boolean;
  initialNeedsReview: boolean;
  initialExpired: boolean;
};

export function AdminDashboardTableFilterCheckbox({
  searchParams,
  initialCompleted,
  initialNeedsReview,
  initialExpired,
}: AdminDashboardTableFilterCheckboxProps) {
  const t = useTranslations('Components.adminDashboardTable');
  const router = useRouter();
  const [filters, setFilters] = useState({
    completed: initialCompleted,
    needsReview: initialNeedsReview,
    expired: initialExpired,
  });

  const handleFilter = (event: React.MouseEvent) => {
    event.preventDefault();

    const urlSearchParams = new URLSearchParams(searchParams);

    urlSearchParams.set('completed', filters.completed ? 'true' : 'false');
    urlSearchParams.set('needsReview', filters.needsReview ? 'true' : 'false');
    urlSearchParams.set('expired', filters.expired ? 'true' : 'false');

    router.replace('/dashboard' + '?' + urlSearchParams.toString());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{t('filter.status')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          key={'completed'}
          checked={filters.completed}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setFilters((prev) => ({ ...prev, completed: !prev.completed }));
          }}
        >
          {t('currentStatus.completed')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          key={'needsReview'}
          checked={filters.needsReview}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setFilters((prev) => ({ ...prev, needsReview: !prev.needsReview }));
          }}
        >
          {t('currentStatus.needsReview')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          key={'expired'}
          checked={filters.expired}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setFilters((prev) => ({ ...prev, expired: !prev.expired }));
          }}
        >
          {t('currentStatus.expired')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <button
          onClick={handleFilter}
          className="mx-1 my-1 rounded-md bg-blue-500 px-2 py-1 font-semibold text-white  hover:bg-blue-700"
        >
          {t('filter.button')}
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
