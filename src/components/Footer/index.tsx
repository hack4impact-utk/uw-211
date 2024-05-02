import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer({ className }: { className?: string }) {
  const t = useTranslations('Footer');

  return (
    <footer className={`w-full ${className}`}>
      <ul className="flex items-center justify-center gap-4 text-xs">
        <li>
          <a
            href="https://uwgk.org/wpautoterms/terms-and-conditions/"
            target="_blank"
            aria-label="Terms and Conditions"
          >
            {t('terms')}
          </a>
        </li>
        <li>
          <a
            href="https://uwgk.org/wpautoterms/privacy-policy/"
            target="_blank"
            aria-label="Privacy Policy"
          >
            {t('privacy')}
          </a>
        </li>
        <li>
          <a
            href="https://www.facebook.com/unitedwayknox"
            target="_blank"
            aria-label="United Way Facebook Page"
          >
            <Facebook size={14} aria-label="Facebook Icon" />
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/unitedwayknox/"
            target="_blank"
            aria-label="United Way Instagram Page"
          >
            <Instagram size={14} aria-label="Instagram Icon" />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/unitedwayknox"
            target="_blank"
            aria-label="United Way Twitter Page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentcolor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-twitter"
              aria-label="Twitter Icon"
            >
              {' '}
              <path d="M8,2H3L16.7,22h5.1L8,2z" />{' '}
              <line x1="2.3" y1="22.1" x2="10.2" y2="12.8" />{' '}
              <line x1="19.8" y1="2" x2="13.3" y2="9.6" />{' '}
            </svg>
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/company/united-way-of-greater-knoxville/"
            target="_blank"
            aria-label="United Way LinkedIn Page"
          >
            <Linkedin size={14} aria-label="LinkedIn Icon" />
          </a>
        </li>
      </ul>
    </footer>
  );
}
