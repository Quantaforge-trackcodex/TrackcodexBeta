import React from "react";
import { Link } from "react-router-dom";
import "../../styles/Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="trackcodex-footer">
      <div className="footer-content">
        <div className="footer-copyright">© {currentYear} TrackCodex, Inc.</div>

        <nav className="footer-links">
          <Link to="/terms" className="footer-link">
            Terms
          </Link>
          <Link to="/privacy" className="footer-link">
            Privacy
          </Link>
          <Link to="/security" className="footer-link">
            Security
          </Link>
          <Link to="/status" className="footer-link">
            Status
          </Link>
          <Link to="/community" className="footer-link">
            Community
          </Link>
          <a
            href="https://docs.trackcodex.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Docs
          </a>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
          <button className="footer-link footer-cookie-btn">
            Manage cookies
          </button>
        </nav>
      </div>

      <div className="footer-privacy">
        <button className="footer-privacy-link">
          Do not share my personal information
        </button>
      </div>
    </footer>
  );
};

export default Footer;
