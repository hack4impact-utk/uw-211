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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showCompleted}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setShowCompleted((prev: boolean) => !prev);
          }}
        >
          Completed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showNeedsReview}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setShowNeedsReview((prev: boolean) => !prev);
          }}
        >
          Needs Review
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showExpired}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setShowExpired((prev: boolean) => !prev);
          }}
        >
          Expired
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
