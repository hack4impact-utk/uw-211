import Image from 'next/image';
import uw211Logo from '@/../public/img/unitedway211.png';
// import uwLogo from '@/../public/img/UWGK_Logo.png';

export default function Header() {
  return (
    <header className="fixed top-0 z-50 flex w-full border-b-2 border-[#1e57a1] bg-orange-500 pb-2 pt-2">
      <div className="flex flex-1 items-center justify-center">
        <Image
          src={uw211Logo.src}
          alt="United Way 211 Logo"
          width="100"
          height="100"
        />
      </div>
    </header>
  );
}
