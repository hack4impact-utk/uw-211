import React from 'react';
import uw211Logo from '@/../public/img/unitedway211.png';
import Image from 'next/image';

function WelcomePage(props: { id: string }) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex w-screen flex-col-reverse items-center justify-center gap-8 sm:w-auto md:flex-row">
        <div className="w-10/12 flex-1 rounded-2xl bg-slate-200 p-5 sm:w-auto">
          <div className="flex h-full w-full flex-col justify-center gap-5 break-words p-8 sm:break-normal">
            <div>
              <h2 className="text-xl font-semibold text-[#df593e]">
                211 Knoxville
              </h2>
              <h1 className="text-3xl">
                Welcome
                <span className="font-bold"> {props.id}</span>!
              </h1>
              <p className=""></p>
            </div>
            <button className="w-36 rounded-sm border-none bg-[#1e57a1] p-2 text-white  hover:bg-[#7b8fc3] sm:w-48">
              Get Started!
            </button>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <Image
            src={uw211Logo.src}
            alt="United Way 211 Logo"
            width="300"
            height="300"
          />
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
