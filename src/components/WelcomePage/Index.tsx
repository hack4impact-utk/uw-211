import React from 'react';
import uw211Logo from './images/unitedway211.png';

function WelcomePage(props: { name: string }) {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex items-center justify-center flex-wrap w-5/6 h-5/6">
        <div className="flex-1 w-1/3 h-2/3 bg-slate-200 rounded-2xl">
          <div className="w-full h-full flex justify-center flex-col gap-5 p-8">
            <div>
              <h2 className="text-[#df593e] text-xl font-semibold">
                211 Knoxville
              </h2>
              <h1 className="text-3xl">
                Welcome
                <span className="font-bold"> {props.name}</span>!
              </h1>
              <p className=""></p>
            </div>
            <button className="bg-[#1e57a1] border-none p-2 rounded-sm text-white w-48">
              Get Started!
            </button>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src={uw211Logo.src}
            alt="United Way 211 Logo"
            className="w-3/4"
          />
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
