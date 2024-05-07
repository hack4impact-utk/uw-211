import { AdminDashboardTable } from '@/components/AdminDashboardTable';
import { AdminDashboardNotifications } from '@/components/AdminDashboardNotifications';
import Header from '@/components/Header';
import { Agency } from '@/utils/types';
import { getAgencies } from '@/server/actions/Agencies';

export type DashboardSearchParams = {
  search?: string;
};

export default async function Dashboard({
  searchParams,
}: {
  searchParams: DashboardSearchParams;
}) {
  let allAgencies: Agency[];
  let searchedAgencies: Agency[];

  try {
    allAgencies = await getAgencies(true, undefined);
    searchedAgencies =
      searchParams.search === undefined
        ? allAgencies
        : allAgencies.filter((agency) =>
            agency.name
              .toLowerCase()
              .includes((searchParams.search as string).toLowerCase())
          );
  } catch (e) {
    allAgencies = [];
    searchedAgencies = [];
  }
  return (
    <div className="h-full bg-gradient-to-b from-gray-200 to-gray-100">
      <Header />
      <div className="m-8">
        <div className="mb-4 rounded-lg bg-white p-1 pb-4">
          <AdminDashboardNotifications
            agencies={JSON.parse(JSON.stringify(allAgencies))}
          />
        </div>
      </div>
      <div className="m-8">
        <div className="rounded-lg bg-white p-4">
          <AdminDashboardTable
            searchParams={searchParams}
            agencies={JSON.parse(JSON.stringify(searchedAgencies))}
          />
        </div>
      </div>
    </div>
  );
}
