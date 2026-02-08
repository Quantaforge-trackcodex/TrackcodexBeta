import React from "react";
import "../styles/LegalPage.css";

const Terms: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: February 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using TrackCodex, you accept and agree to be bound
            by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the
            materials on TrackCodex for personal, non-commercial transitory
            viewing only.
          </p>
        </section>

        <section>
          <h2>3. User Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account and password and for restricting access to your computer.
          </p>
        </section>

        <section>
          <h2>4. Disclaimer</h2>
          <p>
            The materials on TrackCodex are provided on an 'as is' basis.
            TrackCodex makes no warranties, expressed or implied, and hereby
            disclaims and negates all other warranties.
          </p>
        </section>

        <section>
          <h2>5. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:legal@trackcodex.com">legal@trackcodex.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
