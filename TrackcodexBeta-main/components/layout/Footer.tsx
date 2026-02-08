import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 mt-12 text-[12px] text-gh-text-secondary" role="contentinfo">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 list-none p-0 m-0 w-full md:w-auto">
          <li className="flex items-center gap-2 mr-2">
            <span>&copy; {currentYear} TrackCodex, Inc.</span>
          </li>
          <li>
            <Link to="/terms" className="hover:text-blue-400 hover:underline transition-colors duration-200">
              Terms
            </Link>
          </li>
          <li>
            <Link to="/privacy" className="hover:text-blue-400 hover:underline transition-colors duration-200">
              Privacy
            </Link>
          </li>
          <li>
            <Link to="/security" className="hover:text-blue-400 hover:underline transition-colors duration-200">
              Security
            </Link>
          </li>
          <li>
            <Link to="/status" className="hover:text-blue-400 hover:underline transition-colors duration-200">
              Status
            </Link>
          </li>
          <li>
            <Link to="/docs" className="hover:text-blue-400 hover:underline transition-colors duration-200">
              Docs
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-blue-400 hover:underline transition-colors duration-200">
              Contact
            </Link>
          </li>
          <li>
            <button className="hover:text-blue-400 hover:underline transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer">
              Manage cookies
            </button>
          </li>
          <li>
            <button className="hover:text-blue-400 hover:underline transition-colors duration-200 bg-transparent border-none p-0 cursor-pointer">
              Do not share my personal information
            </button>
          </li>
        </ul>

        <nav className="flex items-center gap-4" aria-label="Social">
          <Link to="/community" className="hover:text-blue-400 hover:underline transition-colors duration-200">
            Community
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
