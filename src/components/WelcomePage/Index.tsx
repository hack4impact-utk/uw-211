import React from 'react';
import uw211Logo from '@/../public/img/unitedway211.png';

function WelcomePage(props: { id: string }) {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex items-center flex-col-reverse md:flex-row gap-8 w-screen sm:w-auto justify-center">
        <div className="flex-1 bg-slate-200 rounded-2xl w-10/12 sm:w-auto p-5">
          <div className="flex justify-center flex-col gap-5 p-8 break-words sm:break-normal w-full h-full">
            <div>
              <h2 className="text-[#df593e] text-xl font-semibold">
                211 Knoxville
              </h2>
              <h1 className="text-3xl">
                Welcome
                <span className="font-bold"> {props.id}</span>!
              </h1>
              <p className=""></p>
            </div>
            <button className="bg-[#1e57a1] hover:bg-[#7b8fc3] border-none p-2 rounded-sm text-white  w-36 sm:w-48">
              Get Started!
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src={uw211Logo.src}
            alt="United Way 211 Logo"
            className="w-60 sm:w-72"
          />
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
