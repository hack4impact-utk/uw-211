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
import { AlertCircle, Check, X } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import PdfButton from '@/components/PdfButton';

export async function AdminDashboardNotifications() {
  let agencies: Agency[] = [];

  try {
    agencies = await getAgencies(false, undefined); // TODO: only grab pending agencies
  } catch (error) {
    return <h1>Error loading data</h1>;
  }

  if (agencies.length <= 0) {
    return <></>;
  }

  return (
    <div className="mx-8">
      <Accordion type="single" collapsible>
        <AccordionItem className="w-full" value="item-1">
          <AccordionTrigger>
            <AlertCircle />
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
                      <PdfButton agencyId={agency._id?.toString()} />
                    </TableCell>
                    <TableCell>
                      <Button className="mr-4" variant="outline">
                        <Check className="mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive">
                        <X className="mr-2" />
                        Deny
                      </Button>
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
