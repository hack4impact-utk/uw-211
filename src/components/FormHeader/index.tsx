'use client';
import React from 'react';
import Image from 'next/image';
import uw211Logo from '@/../public/img/unitedway211.png';
import { useState } from 'react';
import { useWindowSize } from '@/utils/hooks/useWindowSize';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const windowSize = useWindowSize();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getOffset = () => {
    const offset = Math.max(0, windowSize.width - 240);
    return offset / 2;
  };

  const refreshEnglish = () => {
    // Function to refresh English content
  };

  const refreshSpanish = () => {
    // Function to refresh Spanish content
  };

  return (
    <header className="fixed top-0 z-50 flex w-full border-b-2 border-[#1e57a1] bg-orange-500 pb-2 pt-2">
      <div className="flex flex-1 items-center justify-center">
        <Image
          src={uw211Logo.src}
          alt="United Way 211 Logo"
          width="100"
          height="100"
        />
        <div
          className="relative inline-block text-left"
          style={{ left: getOffset() + 'px' }}
        >
          <div>
            <button
              type="button"
              className="inline-flex justify-center gap-x-1.5 rounded-md bg-orange-400 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
              id="menu-button"
              aria-expanded={isDropdownOpen ? 'true' : 'false'}
              aria-haspopup="true"
              onClick={toggleDropdown}
              style={{
                backgroundColor: isDropdownOpen ? '#ffffff' : '#f59e0b',
              }}
            >
              Language
              <svg
                className="-mr-1 h-5 w-5 text-gray-900"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                style={{
                  transform: isDropdownOpen
                    ? 'rotate(-180deg)'
                    : 'rotate(0deg)',
                  transition: 'transform 0.3s ease',
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div
            className={`absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 focus:outline-none ${isDropdownOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            style={{
              width: 'calc(100%)',
              maxHeight: isDropdownOpen ? '14rem' : '0',
            }}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
          >
            <div className="py-1" role="none">
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 focus:outline-none"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-0"
                onClick={refreshEnglish}
              >
                English
              </button>
              <button
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 focus:outline-none"
                role="menuitem"
                tabIndex={-1}
                id="menu-item-2"
                onClick={refreshSpanish}
              >
                Español
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
