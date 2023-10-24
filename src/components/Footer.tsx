import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full">
      <ul className="flex items-center justify-center gap-2 text-xs">
        <li>
          <a
            href="https://uwgk.org/wpautoterms/terms-and-conditions/"
            target="_blank"
          >
            Terms and Conditions
          </a>
        </li>
        <li>
          <a
            href="https://uwgk.org/wpautoterms/privacy-policy/"
            target="_blank"
          >
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="https://www.facebook.com/unitedwayknox" target="_blank">
            <Facebook size={14} />
          </a>
        </li>
        <li>
          <a href="https://www.instagram.com/unitedwayknox/" target="_blank">
            <Instagram size={14} />
          </a>
        </li>
        <li>
          <a href="https://twitter.com/unitedwayknox" target="_blank">
            <Twitter size={14} />
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/company/united-way-of-greater-knoxville/"
            target="_blank"
          >
            <Linkedin size={14} />
          </a>
        </li>
      </ul>
    </footer>
  );
}
