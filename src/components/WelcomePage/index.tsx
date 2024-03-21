import React from 'react';
import { Agency } from '@/utils/types';
import Link from 'next/link';
import FormHeader from '@/components/FormHeader';
import Footer from '@/components/Footer';
import uwLogo from '@/../public/img/UWGK_Logo.png';
import Image from 'next/image';
import useTranslation from 'next-translate/useTranslation';

interface WelcomePageProps {
  id?: string;
  agency?: Agency;
}

function WelcomePageBody({ id, agency }: WelcomePageProps) {
  const { t } = useTranslation('common');

  const validWelcome = t('landing.validWelcome', { org_name: 'xxxx' }).split(
    'xxxx'
  );
  const validInstructions = t('landing.validInstructions', {
    website: 'xxxx',
  }).split('xxxx');
  const invalidInstructions = t('landing.invalidInstructions', {
    email: 'xxxx',
    phone: 'xxxx',
  }).split('xxxx');

  if (agency) {
    return (
      <>
        <div>
          <h1 className="text-3xl">
            {validWelcome[0]}
            <span className="font-bold"> {agency.name}</span>
            {validWelcome[1]}
          </h1>
          <p className="mb-2 mt-4 text-gray-700">
            {validInstructions[0]}
            <a
              className="text-blue-700 hover:underline"
              href="https://www.211.org/about-us"
            >
              {t('landing.website')}
            </a>
            {validInstructions[1]}
          </p>
        </div>
        <div className="flex justify-center">
          <Link href={`/${id}`}>
            <button
              id="start-button"
              className="w-36 rounded-sm border-none bg-[#1e57a1] p-2 text-white  hover:bg-[#7b8fc3] sm:w-48"
            >
              <label htmlFor="start-button">{t('landing.getStarted')}</label>
            </button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">{t('landing.invalidWelcome')}</h1>
      <p className="mb-2 mt-4 text-gray-700">
        {invalidInstructions[0]}
        <a
          className="text-blue-700 hover:underline"
          href="mailto: respecialist@oconnorcenter.org"
        >
          respecialist@oconnorcenter.org
        </a>
        {invalidInstructions[1]}
        <a className="text-blue-700 hover:underline" href="tel:8655231329">
          (865) 523-1329
        </a>
        {invalidInstructions[2]}
      </p>
    </div>
  );
}
function WelcomePage({ id, agency }: WelcomePageProps) {
  return (
    <>
      <FormHeader />
      <div
        className="flex h-screen w-screen items-center justify-center bg-cover"
        style={{ backgroundImage: `url(/img/knoxville_bg.jpg)` }}
      >
        <div className="mx-auto flex w-screen max-w-md flex-col-reverse items-center justify-center gap-8 sm:w-auto md:flex-row">
          <div className="w-10/12 flex-1 rounded-2xl bg-slate-200 p-5 sm:w-auto">
            <div className="flex h-full w-full flex-col justify-center gap-5 break-words p-6 sm:break-normal">
              <div className="flex flex-1 justify-center border-b-2 border-zinc-500 pb-4">
                <Image
                  src={uwLogo.src}
                  alt="United Way Logo"
                  width="200"
                  height="200"
                />
              </div>
              <WelcomePageBody id={id} agency={agency} />
            </div>
          </div>
        </div>
      </div>
      <Footer className="fixed bottom-0 bg-orange-500 pb-2 pt-2" />
    </>
  );
}

export default WelcomePage;
