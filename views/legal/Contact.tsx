import React from "react";
import "../../styles/LegalPage.css"; // Reuse existing styles

const Contact = () => {
  return (
    <div className="legal-page-container">
      <div className="legal-content">
        <h1>Contact Us</h1>
        <p>Last updated: February 8, 2026</p>

        <section>
          <h2>Support</h2>
          <p>
            For technical support and account inquiries, please contact our
            support team at{" "}
            <a href="mailto:support@trackcodex.com">support@trackcodex.com</a>.
          </p>
        </section>

        <section>
          <h2>Business Inquiries</h2>
          <p>
            For enterprise solutions and partnerships, please contact{" "}
            <a href="mailto:sales@trackcodex.com">sales@trackcodex.com</a>.
          </p>
        </section>

        <section>
          <h2>Mailing Address</h2>
          <p>
            TrackCodex Inc.
            <br />
            123 Innovation Way
            <br />
            San Francisco, CA 94107
          </p>
        </section>
      </div>
    </div>
  );
};

export default Contact;
