import WelcomePage from '@/components/WelcomePage/Index';
import { Agency } from '@/utils/types';

async function getAgency(id: string): Promise<Agency> {
  const res = await fetch(`${process.env.BASE_URL}/api/agencies/${id}`);
  const body = await res.json();
  return body.data.agency;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // extract id query parameter
  let id = searchParams.id;

  // if multiple id query parameters, just take the first one
  if (typeof id === 'object') {
    id = id[0];
  }

  // fetch agency if possible
  const agency = id ? await getAgency(id) : undefined;

  return (
    <>
      <WelcomePage id={id} agency={agency}></WelcomePage>
    </>
  );
}
