import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-white py-8 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-4">
          <Link
            href="https://www.instagram.com/kawasandigitalid/"
            target="_blank"
            className="hover:text-brand-500 transition-colors"
          >
            <FaInstagram size={24} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/kawasan-digital-10583336a/"
            target="_blank"
            className="hover:text-brand-500 transition-colors"
          >
            <FaLinkedin size={24} />
          </Link>
          <Link
            href="https://github.com/Kawasan-Digital"
            target="_blank"
            className="hover:text-brand-500 transition-colors"
          >
            <FaGithub size={24} />
          </Link>
        </div>
        
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm">
            © {new Date().getFullYear()} Kawasan Digital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
