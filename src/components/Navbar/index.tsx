'use client';

import Link from 'next/link';
import Image from 'next/image';
import uwLogo from '@/../public/img/UWGK_Logo.png';
import React, { useState, useEffect } from 'react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(true);
  const lgCutoff = 1024; // TailwindCSS 'lg' size

  const checkScreenSize = () => {
    if (window.innerWidth >= lgCutoff) {
      setIsMenuOpen(true); // Always show the menu on large screens
    } else {
      setIsMenuOpen(false); // Otherwise, rely on the state (user's toggle)
    }
  };

  useEffect(() => {
    checkScreenSize(); // Check initially on mount
    window.addEventListener('resize', checkScreenSize); // Add resize listener

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <header className="antialiased">
      <nav>
        <div className="flex flex-wrap items-center justify-between py-5 font-bold text-black">
          <Image
            className="mr-8 flex-shrink-0"
            src={uwLogo.src}
            alt="United Way Logo"
            width="200"
            height="200"
          />
          <div className="block lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="border-black-400 flex items-center rounded border px-3 py-2"
            >
              <svg
                className="h-3 w-3 fill-current"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>
          {isMenuOpen && (
            <div className="block w-full flex-grow lg:flex lg:w-auto lg:items-center">
              <div className="lg:flex-grow">
                <Link
                  className="mt-4 block text-[#393a3d] lg:mr-8 lg:mt-0 lg:inline-block"
                  href="/"
                >
                  Home
                </Link>
                <Link
                  className="mt-4 block text-[#393a3d] lg:mr-8 lg:mt-0 lg:inline-block"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className="mt-4 block text-[#393a3d] lg:mr-8 lg:mt-0 lg:inline-block"
                  href="/"
                >
                  Resources
                </Link>
                <Link
                  className="mt-4 block text-[#393a3d] lg:mt-0 lg:inline-block"
                  href="/"
                >
                  About
                </Link>
              </div>
              <div>
                <div>
                  {/* Filler profile icon SVG */}
                  <svg
                    className="inline-block leading-none"
                    width="50px"
                    height="50px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      opacity="0.4"
                      d="M12.1207 12.78C12.0507 12.77 11.9607 12.77 11.8807 12.78C10.1207 12.72 8.7207 11.28 8.7207 9.50998C8.7207 7.69998 10.1807 6.22998 12.0007 6.22998C13.8107 6.22998 15.2807 7.69998 15.2807 9.50998C15.2707 11.28 13.8807 12.72 12.1207 12.78Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      opacity="0.34"
                      d="M18.7398 19.3801C16.9598 21.0101 14.5998 22.0001 11.9998 22.0001C9.39977 22.0001 7.03977 21.0101 5.25977 19.3801C5.35977 18.4401 5.95977 17.5201 7.02977 16.8001C9.76977 14.9801 14.2498 14.9801 16.9698 16.8001C18.0398 17.5201 18.6398 18.4401 18.7398 19.3801Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="#292D32"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
