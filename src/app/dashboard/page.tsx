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
    email: 'jjjj',
  },
  {
    name: 'test3',
    lastUpdate: new Date('August 17, 2022 03:24:00'),
    status: 'Expired',
    email: 'hhhh',
  },
  {
    name: 'test4',
    status: 'Up to date',
    email: 'gggg',
  },
];

export default function Dashboard() {
  return (
    <div className="p-2">
      <Navbar />
      <AdminDashboardTable data={Data} />
    </div>
  );
}
