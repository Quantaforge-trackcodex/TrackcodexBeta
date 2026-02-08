import React from "react";
import "../../styles/LegalPage.css"; // Reuse existing styles
import styles from "./Status.module.css";

const Status = () => {
  return (
    <div className="legal-page-container">
      <div className="legal-content">
        <h1>System Status</h1>
        <p className="last-updated">Realtime</p>

        <div className={`status-grid ${styles.statusGrid}`}>
          <div className="status-item">
            <strong>API Services</strong>
          </div>
          <div className={`status-check ${styles.statusOperational}`}>
            <span className="material-symbols-outlined">check_circle</span>{" "}
            Operational
          </div>

          <div className="status-item">
            <strong>Database</strong>
          </div>
          <div className={`status-check ${styles.statusOperational}`}>
            <span className="material-symbols-outlined">check_circle</span>{" "}
            Operational
          </div>

          <div className="status-item">
            <strong>ForgeAI Engine</strong>
          </div>
          <div className={`status-check ${styles.statusOperational}`}>
            <span className="material-symbols-outlined">check_circle</span>{" "}
            Operational
          </div>

          <div className="status-item">
            <strong>Web Interface</strong>
          </div>
          <div className={`status-check ${styles.statusOperational}`}>
            <span className="material-symbols-outlined">check_circle</span>{" "}
            Operational
          </div>
        </div>

        <p className={`status-note ${styles.statusNote}`}>
          All systems operational.
        </p>
      </div>
    </div>
  );
};

export default Status;
