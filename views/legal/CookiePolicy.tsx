import React from "react";
import "../../styles/LegalPage.css"; // Reuse existing styles

const CookiePolicy = () => {
  return (
    <div className="legal-page-container">
      <div className="legal-content">
        <h1>Cookie Policy</h1>
        <p className="last-updated">Last updated: February 8, 2026</p>

        <section>
          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device when you visit a
            website. They help us remember your preferences, keep you logged in,
            and analyze how our site is used.
          </p>
        </section>

        <section>
          <h2>Types of Cookies We Use</h2>
          <ul>
            <li>
              <strong>Essential Cookies:</strong> Necessary for the website to
              function (e.g., login, security). These cannot be disabled.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand visitor
              behavior (e.g., page views, time on site).
            </li>
            <li>
              <strong>Functional Cookies:</strong> Enhance user experience
              (e.g., remembering language or theme).
            </li>
            <li>
              <strong>Marketing Cookies:</strong> Used to deliver relevant
              advertisements (not currently used).
            </li>
          </ul>
        </section>

        <section>
          <h2>Managing Your Cookies</h2>
          <p>
            You can manage your cookie preferences at any time by clicking the
            "Manage Cookies" link in the footer or by adjusting your browser
            settings.
          </p>
          <p>
            Please note that disabling essential cookies may affect your ability
            to use certain features of TrackCodex.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiePolicy;
