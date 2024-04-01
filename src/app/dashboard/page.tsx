import { AdminDashboardTable } from '@/components/AdminDashboardTable';
import { Navbar } from '@/components/Navbar';
import { dashboardParams } from '@/utils/types';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: dashboardParams;
}) {
  return (
    <div>
      <Navbar />
      <AdminDashboardTable params={searchParams} />
    </div>
  );
}
