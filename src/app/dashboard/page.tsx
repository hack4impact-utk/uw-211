import {
  AdminDashboardTable,
  Nonprofit,
} from '@/components/AdminDashboardTable';
import { Navbar } from '@/components/Navbar';

const Data: Nonprofit[] = [
  {
    name: 'test1',
    status: 'Close to deadline',
    email: 'ffff',
  },
  {
    name: 'test2',
    status: 'Email sent recently',
    email: 'jjjj',
  },
  {
    name: 'test3',
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
