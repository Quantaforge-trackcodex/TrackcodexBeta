import React from "react";
import "../../styles/LegalPage.css"; // Reuse existing styles

const Security = () => {
  return (
    <div className="legal-page-container">
      <div className="legal-content">
        <h1>Security Policy</h1>
        <p className="last-updated">Last updated: February 8, 2026</p>

        <section>
          <h2>Reporting Vulnerabilities</h2>
          <p>
            We take security seriously. If you discover a vulnerability, please
            report it to our security team immediately by emailing
            security@trackcodex.com.
          </p>
          <p>We will respond to security reports within 24 hours.</p>
        </section>

        <section>
          <h2>Data Protection</h2>
          <p>
            All user data is encrypted at rest and in transit. We use
            industry-standard security practices to protect your information.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Security;
