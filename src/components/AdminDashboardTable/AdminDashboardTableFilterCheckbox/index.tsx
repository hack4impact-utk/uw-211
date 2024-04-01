'use client';

import { useState } from 'react';
// import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
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
  statusHiddenInputs: (React.JSX.Element | undefined)[];
  initialCompleted: boolean;
  initialNeedsReview: boolean;
  initialExpired: boolean;
};

export function AdminDashboardTableFilterCheckbox({
  statusHiddenInputs,
  initialCompleted,
  initialNeedsReview,
  initialExpired,
}: AdminDashboardTableFilterCheckboxProps) {
  const [filters, setFilters] = useState({
    completed: initialCompleted,
    needsReview: initialNeedsReview,
    expired: initialExpired,
  });

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
          key={'completed'}
          checked={filters.completed}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setFilters((prev) => ({ ...prev, completed: !prev.completed }));
          }}
        >
          Completed
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          key={'needsReview'}
          checked={filters.needsReview}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setFilters((prev) => ({ ...prev, needsReview: !prev.needsReview }));
          }}
        >
          Needs Review
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          key={'expired'}
          checked={filters.expired}
          onSelect={(e) => {
            e.preventDefault(); // stop dropdown from closing on click
            setFilters((prev) => ({ ...prev, expired: !prev.expired }));
          }}
        >
          Expired
        </DropdownMenuCheckboxItem>
        <form action="./dashboard" method="GET">
          {statusHiddenInputs}
          <input
            key={'completed'}
            type="hidden"
            name={'completed'}
            value={filters.completed ? '1' : '0'}
          />
          <input
            key={'needsReview'}
            type="hidden"
            name={'needsReview'}
            value={filters.needsReview ? '1' : '0'}
          />
          <input
            key={'expired'}
            type="hidden"
            name={'expired'}
            value={filters.expired ? '1' : '0'}
          />
          <DropdownMenuSeparator />
          <button
            type="submit"
            className="mx-1 my-1 rounded-md bg-blue-500 px-2 py-1 font-semibold text-white  hover:bg-blue-700"
          >
            Filter
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
