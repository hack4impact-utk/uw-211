import { AdminDashboardTable } from '@/components/AdminDashboardTable';
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
      <AdminDashboardTable params={searchParams} />
    </div>
  );
}
