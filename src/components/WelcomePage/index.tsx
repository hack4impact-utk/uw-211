import React from 'react';
import { Agency } from '@/utils/types';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import uwLogo from '@/../public/img/UWGK_Logo.png';
import Image from 'next/image';
import { Chunks } from '@/i18n';

interface WelcomePageProps {
  id?: string;
  agency?: Agency;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}

function WelcomePageBody({ id, agency, t }: WelcomePageProps) {
  if (agency) {
    return (
      <>
        <div>
          <h1 className="text-3xl">
            {t.rich('valid.welcome', {
              bold: (chunks: Chunks) => (
                <span className="font-bold">{chunks}</span>
              ),
              org: agency.name,
            })}
          </h1>
          <p className="mb-2 mt-4 text-gray-700">
            {t.rich('valid.instructions', {
              link: (chunks: Chunks) => (
                <a
                  className="text-blue-700 hover:underline"
                  href="https://www.211.org/about-us"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>
        <div className="flex justify-center">
          <Link href={`/${id}`}>
            <button
              id="start-button"
              className="w-36 rounded-sm border-none bg-[#1e57a1] p-2 text-white  hover:bg-[#7b8fc3] sm:w-48"
            >
              <label htmlFor="start-button">{t('valid.button')}</label>
            </button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">{t('invalid.welcome')}</h1>
      <p className="mb-2 mt-4 text-gray-700">
        {t.rich('invalid.instructions', {
          email: (chunks: Chunks) => (
            <a
              className="text-blue-700 hover:underline"
              href="mailto: respecialist@oconnorcenter.org"
            >
              {chunks}
            </a>
          ),
          phone: (chunks: Chunks) => (
            <a className="text-blue-700 hover:underline" href="tel:8655231329">
              {chunks}
            </a>
          ),
        })}
      </p>
    </div>
  );
}
function WelcomePage({ id, agency, t }: WelcomePageProps) {
  return (
    <>
      <Header className="fixed" />
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
              <WelcomePageBody id={id} agency={agency} t={t} />
            </div>
          </div>
        </div>
      </div>
      <Footer className="fixed bottom-0 bg-orange-500 pb-2 pt-2" />
    </>
  );
}

export default WelcomePage;
