import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RedirectToLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Save the current location to redirect back after login
    // We filter out auth pages to avoid redirect loops
    if (
      !location.pathname.startsWith("/auth") &&
      !location.pathname.startsWith("/login") &&
      !location.pathname.startsWith("/signup")
    ) {
      localStorage.setItem(
        "redirect_after_login",
        location.pathname + location.search,
      );
    }
    navigate("/login", { replace: true });
  }, [navigate, location]);

  return null;
};

export default RedirectToLogin;
