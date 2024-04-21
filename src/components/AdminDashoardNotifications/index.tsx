import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { getAgencies } from '@/server/actions/Agencies';
import { Agency } from '@/utils/types';
import { Newspaper } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export async function AdminDashboardNotifications() {
  const currentStatusFilters = {
    showCompleted: false,
    showNeedsReview: true,
    showExpired: false,
  };

  let agencies: Agency[] = [];

  try {
    agencies = await getAgencies(false, undefined, currentStatusFilters);
  } catch (error) {
    return <h1>Error loading data</h1>;
  }

  if (agencies.length <= 0) {
    return <></>;
  }

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>
            You have {agencies.length}{' '}
            {agencies.length == 1 ? 'agency' : 'agencies'} pending approval.
          </AccordionTrigger>
          <AccordionContent>
            <Table className="rounded-md border text-left shadow">
              <TableHeader>
                <TableRow>
                  <TableHead>Agency Pending Approval</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead>Information Form</TableHead>
                  <TableHead>Action</TableHead>
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
                      {agency.updatedAt?.toLocaleDateString('en-us', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline">
                        <Newspaper className="mr-2" />
                        View form
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button className="mr-4" variant="outline">
                        Approve
                      </Button>
                      <Button variant="destructive">Deny</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
