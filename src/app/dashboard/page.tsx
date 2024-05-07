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
    <div>
      <Header />
      {/* serialize agencies to pass to client component */}
      <AdminDashboardNotifications
        agencies={JSON.parse(JSON.stringify(allAgencies))}
      />
      <AdminDashboardTable
        searchParams={searchParams}
        agencies={JSON.parse(JSON.stringify(searchedAgencies))}
      />
    </div>
  );
}
