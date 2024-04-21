import { AdminDashboardTable } from '@/components/AdminDashboardTable';
import { AdminDashboardNotifications } from '@/components/AdminDashoardNotifications';
import Header from '@/components/Header';
import { DashboardParams } from '@/utils/types';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: DashboardParams;
}) {
  return (
    <div>
      <Header />
      <AdminDashboardNotifications />
      <AdminDashboardTable params={searchParams} />
    </div>
  );
}
