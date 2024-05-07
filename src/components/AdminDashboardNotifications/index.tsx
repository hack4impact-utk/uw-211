'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Agency } from '@/utils/types';
import { AlertCircle, Newspaper, Check, X } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { approveAgency } from '@/server/actions/Agencies';
import { toast } from 'sonner';

type AdminDashboardNotificationsProps = {
  agencies: Agency[];
};

export function AdminDashboardNotifications({
  agencies,
}: AdminDashboardNotificationsProps) {
  // deserialize JSON date string as Date object
  for (const agency of agencies) {
    agency.updatedAt = new Date(agency.updatedAt as unknown as string);
    agency.createdAt = new Date(agency.createdAt as unknown as string);
  }

  const agenciesPendingApproval = agencies.filter(
    (agency) => agency.approvalStatus === 'Pending'
  );
  console.log('agenciesPendingApproval', agenciesPendingApproval);

  if (agencies.length <= 0) {
    return <></>;
  }

  const handleApprove = async (agency: Agency) => {
    if (!agency._id || !agency.latestInfo) {
      return;
    }

    try {
      await approveAgency(agency._id, agency.latestInfo, 'Approved');
      toast.success('Agency approved');
    } catch (error) {
      toast.error('Failed to approve agency');
    }
  };

  const handleReject = (agency: Agency) => {
    console.log('handleReject', agency);
  };

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
            <Table className="mt-2 rounded-md border text-left shadow">
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
                      <Link href={`/api/pdf/${agency._id}`} target="_blank">
                        <Button variant="outline">
                          <Newspaper className="mr-2" />
                          View form
                        </Button>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Button
                        className="mr-4"
                        variant="outline"
                        onClick={() => handleApprove(agency)}
                      >
                        <Check className="mr-2" />
                        Approve
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => handleReject(agency)}
                      >
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
