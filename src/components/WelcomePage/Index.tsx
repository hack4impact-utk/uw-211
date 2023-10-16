import React from 'react';
import uw211Logo from './images/unitedway211.png';

function WelcomePage(props: { name: string }) {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <div className="flex items-center justify-center flex-wrap flex-intial w-11/12 h-11/12">
        <div className="flex-1 flex items-center justify-center flex-col">
          <h1>Welcome {props.name}!</h1>
          <button className="bg-[#1e57a1] border-none p-2 rounded-sm">
            Continue!
          </button>
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
