'use client';

import { Dispatch, SetStateAction } from 'react';
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
import { useTranslations } from 'next-intl';

type AdminDashboardTableFilterCheckboxProps = {
  showCompleted: boolean;
  showNeedsReview: boolean;
  showExpired: boolean;
  setShowCompleted: Dispatch<SetStateAction<boolean>>;
  setShowNeedsReview: Dispatch<SetStateAction<boolean>>;
  setShowExpired: Dispatch<SetStateAction<boolean>>;
};

export function AdminDashboardTableFilterCheckbox({
  showCompleted,
  showNeedsReview,
  showExpired,
  setShowCompleted,
  setShowNeedsReview,
  setShowExpired,
}: AdminDashboardTableFilterCheckboxProps) {
  const t = useTranslations('Components.adminDashboardTable');

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
          checked={showCompleted}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setShowCompleted((prev: boolean) => !prev);
          }}
        >
          {t('currentStatus.completed')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showNeedsReview}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setShowNeedsReview((prev: boolean) => !prev);
          }}
        >
          {t('currentStatus.needsReview')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showExpired}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setShowExpired((prev: boolean) => !prev);
          }}
        >
          {t('currentStatus.expired')}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
