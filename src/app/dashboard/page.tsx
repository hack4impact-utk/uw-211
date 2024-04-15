import { AdminDashboardTable } from '@/components/AdminDashboardTable';
import { Navbar } from '@/components/Navbar';
import { DashboardParams } from '@/utils/types';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: DashboardParams;
}) {
  return (
    <div>
      <Navbar />
      <AdminDashboardTable params={searchParams} />
    </div>
  );
}
