import {
  AdminDashboardTable,
  AgencyDashboardInfo,
} from '@/components/AdminDashboardTable';
import { Navbar } from '@/components/Navbar';
import { Agency, AgencyInfoForm } from '@/utils/types/models';
import { agencyUpdateStatus } from '@/utils/constants';

// const Data: AgencyDashboardInfo[] = [
//   {
//     name: 'Knox Area Rescue Ministries',
//     lastUpdate: new Date('December 17, 2023 03:24:00'),
//     status: 'Close to deadline',
//     email: 'info@karm.org',
//   },
//   {
//     name: 'Joy of Music School',
//     lastUpdate: new Date('January 17, 2023 03:24:00'),
//     status: 'Email sent recently',
//     email: 'info@joymusic.com',
//   },
//   {
//     name: 'The S.M.A.R.T. Institute',
//     lastUpdate: new Date('January 29, 2024 03:24:00'),
//     status: 'Up to date',
//     email: 'info@smart.com',
//   },
//   {
//     name: 'Epilepsy Foundation of East TN',
//     lastUpdate: new Date('August 17, 2022 03:24:00'),
//     status: 'Expired',
//     email: 'info@easttnepilespsy.com',
//   },
//   {
//     name: 'Muse Knoxville',
//     lastUpdate: new Date('August 17, 2019 03:24:00'),
//     status: 'Expired',
//     email: 'info@muse.com',
//   },
//   {
//     name: 'Girls Inc. of the TN Valley',
//     lastUpdate: new Date('August 17, 2019 03:24:00'),
//     status: 'Expired',
//     email: 'info@girlsinc.com',
//   },
//   {
//     name: 'Magnolia Harbor Carefarm',
//     lastUpdate: new Date('August 17, 2019 03:24:00'),
//     status: 'Expired',
//     email: 'info@magnoliaharbor.com',
//   },
//   {
//     name: 'Soar Youth Ministries',
//     lastUpdate: new Date('August 17, 2019 03:24:00'),
//     status: 'Expired',
//     email: 'info@soaryouth.com',
//   },
// ];

async function fetchAllAgencies(): Promise<AgencyDashboardInfo[]> {
  const res: Response = await fetch(`${process.env.BASE_URL}/api/agencies/`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Not able to fetch agencies.');
  }

  const body = await res.json();
  if (body.status != 'success') {
    throw new Error('Not able to fetch agencies.');
  }

  const data: AgencyDashboardInfo[] = [];
  body.data.agencies.forEach((agency: Agency) => {
    const mostRecentForm: AgencyInfoForm = agency.info[agency.info.length - 1];

    const name: string = agency.name;
    const lastUpdate: Date | undefined =
      agency.updatedAt === undefined ? undefined : agency.updatedAt;
    const email: string | undefined = mostRecentForm.updaterContactInfo.email;
    const status: agencyUpdateStatus =
      agency.currentStatus === undefined
        ? agencyUpdateStatus.Expired
        : (agency.currentStatus as agencyUpdateStatus);

    data.push({
      name: name,
      lastUpdate: lastUpdate,
      status: status,
      email: email,
    });
  });

  return data;
}

export default async function Dashboard() {
  const data: AgencyDashboardInfo[] = await fetchAllAgencies();

  return (
    <div>
      <Navbar />
      <AdminDashboardTable data={data} />
    </div>
  );
}
