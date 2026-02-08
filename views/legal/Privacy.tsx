import React from "react";
import "../styles/LegalPage.css";

const Privacy: React.FC = () => {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: February 2026</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, including when
            you create an account, use our services, or communicate with us.
          </p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, to develop new features, and to protect TrackCodex and
            our users.
          </p>
        </section>

        <section>
          <h2>3. Information Sharing</h2>
          <p>
            We do not share your personal information with third parties except
            as described in this privacy policy or with your consent.
          </p>
        </section>

        <section>
          <h2>4. Data Security</h2>
          <p>
            We use industry-standard security measures to protect your
            information. However, no method of transmission over the Internet is
            100% secure.
          </p>
        </section>

        <section>
          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, update, and delete your personal
            information. You can do this through your account settings or by
            contacting us.
          </p>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:privacy@trackcodex.com">privacy@trackcodex.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
