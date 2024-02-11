import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer({ className }: { className?: string }) {
  return (
    <footer className={`w-full ${className}`}>
      <ul className="flex items-center justify-center gap-4 text-xs">
        <li>
          <a
            href="https://uwgk.org/wpautoterms/terms-and-conditions/"
            target="_blank"
            aria-label="Terms and Conditions"
          >
            Terms and Conditions
          </a>
        </li>
        <li>
          <a
            href="https://uwgk.org/wpautoterms/privacy-policy/"
            target="_blank"
            aria-label="Privacy Policy"
          >
            Privacy Policy
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
            <Twitter size={14} aria-label="Twitter Icon" />
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
