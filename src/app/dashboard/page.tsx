import { AdminDashboardTable } from '@/components/AdminDashboardTable';
import { AdminDashboardNotifications } from '@/components/AdminDashboardNotifications';
import Header from '@/components/Header';
import { DashboardParams } from '@/utils/types';

export default async function Dashboard({
  searchParams,
}: {
  searchParams: DashboardParams;
}) {
  return (
    <div className="h-full bg-gradient-to-b from-gray-200 to-gray-100">
      <Header />
      <div className="m-8">
        <div className="mb-4 rounded-lg bg-white p-1 pb-4">
          <AdminDashboardNotifications />
        </div>
      </div>
      <div className="m-8">
        <div className="rounded-lg bg-white p-4">
          <AdminDashboardTable params={searchParams} />
        </div>
      </div>
    </div>
  );
}
