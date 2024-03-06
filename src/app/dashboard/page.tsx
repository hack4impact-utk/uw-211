import { AdminDashboardTable, Agency } from '@/components/AdminDashboardTable';
import { Navbar } from '@/components/Navbar';

const Data: Agency[] = [
  {
    name: 'Knox Area Rescue Ministries',
    lastUpdate: new Date('December 17, 2023 03:24:00'),
    status: 'Close to deadline',
    email: 'info@karm.org',
  },
  {
    name: 'Joy of Music School',
    lastUpdate: new Date('January 17, 2023 03:24:00'),
    status: 'Email sent recently',
    email: 'info@joymusic.com',
  },
  {
    name: 'The S.M.A.R.T. Institute',
    lastUpdate: new Date('January 29, 2024 03:24:00'),
    status: 'Up to date',
    email: 'info@smart.com',
  },
  {
    name: 'Epilepsy Foundation of East TN',
    lastUpdate: new Date('August 17, 2022 03:24:00'),
    status: 'Expired',
    email: 'info@easttnepilespsy.com',
  },
  {
    name: 'Muse Knoxville',
    lastUpdate: new Date('August 17, 2019 03:24:00'),
    status: 'Expired',
    email: 'info@muse.com',
  },
  {
    name: 'Girls Inc. of the TN Valley',
    lastUpdate: new Date('August 17, 2019 03:24:00'),
    status: 'Expired',
    email: 'info@girlsinc.com',
  },
  {
    name: 'Magnolia Harbor Carefarm',
    lastUpdate: new Date('August 17, 2019 03:24:00'),
    status: 'Expired',
    email: 'info@magnoliaharbor.com',
  },
  {
    name: 'Soar Youth Ministries',
    lastUpdate: new Date('August 17, 2019 03:24:00'),
    status: 'Expired',
    email: 'info@soaryouth.com',
  },
];

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <AdminDashboardTable data={Data} />
    </div>
  );
}
