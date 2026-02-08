import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface CookieConsentProps {
  onAccept?: () => void;
  onReject?: () => void;
}

const STORAGE_KEY = "trackcodex_cookie_consent";

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onReject,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      // Delay showing banner slightly for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const newPrefs = { essential: true, analytics: true, marketing: true };
    savePreferences(newPrefs);
    if (onAccept) onAccept();
  };

  const handleRejectAll = () => {
    const newPrefs = { essential: true, analytics: false, marketing: false };
    savePreferences(newPrefs);
    if (onReject) onReject();
  };

  const handleSaveSettings = () => {
    savePreferences(preferences);
    setShowSettings(false);
  };

  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setPreferences(prefs);
    setIsVisible(false);

    // Dispatch event for other components to listen to
    window.dispatchEvent(
      new CustomEvent("cookie-consent-updated", { detail: prefs }),
    );
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#161b22] border-t border-[#30363d] shadow-2xl animate-slide-up">
      {!showSettings ? (
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-[#c9d1d9] mb-1">
              We value your privacy
            </h3>
            <p className="text-sm text-[#8b949e]">
              We use cookies to enhance your browsing experience, serve
              personalized ads or content, and analyze our traffic. By clicking
              "Accept All", you consent to our use of cookies. Read our{" "}
              <Link to="/cookies" className="text-[#58a6ff] hover:underline">
                Cookie Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setShowSettings(true)}
              className="px-4 py-2 text-sm font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d] transition-colors"
            >
              Customize
            </button>
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d] transition-colors"
            >
              Reject All
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-[#238636] border border-[#238636] rounded-md hover:bg-[#2ea043] transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-[#0d1117] p-6 rounded-lg border border-[#30363d]">
          <h3 className="text-lg font-bold text-[#c9d1d9] mb-4">
            Cookie Preferences
          </h3>
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#c9d1d9]">Essential</p>
                <p className="text-xs text-[#8b949e]">
                  Required for the site to function properly.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.essential}
                disabled
                aria-label="Essential cookies (required)"
                className="w-5 h-5 accent-[#238636]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#c9d1d9]">Analytics</p>
                <p className="text-xs text-[#8b949e]">
                  Help us improve our website by collecting and reporting
                  information on how you use it.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    analytics: e.target.checked,
                  })
                }
                aria-label="Analytics cookies"
                className="w-5 h-5 accent-[#238636]"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[#c9d1d9]">Marketing</p>
                <p className="text-xs text-[#8b949e]">
                  Used to track visitors across websites to display relevant
                  ads.
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    marketing: e.target.checked,
                  })
                }
                aria-label="Marketing cookies"
                className="w-5 h-5 accent-[#238636]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 text-sm font-medium text-[#c9d1d9] bg-[#21262d] border border-[#30363d] rounded-md hover:bg-[#30363d]"
            >
              Back
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-4 py-2 text-sm font-medium text-white bg-[#238636] border border-[#238636] rounded-md hover:bg-[#2ea043]"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
