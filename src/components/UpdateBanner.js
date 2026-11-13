import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { onNewVersion } from "../serviceWorkerRegistration";

// Long enough to read the banner, short enough not to get in the way.
export const RELOAD_DELAY_MS = 1200;

// Add and Edit hold typing that a reload would lose, so the update waits until the person saves or leaves the form.
export function isFormPage(pathname) {
  return pathname === "/create" || pathname.startsWith("/edit/");
}

// Defined once, so the reload timer isn't restarted every time the screen re-renders.
const reloadPage = () => window.location.reload();

// When a new version of the app has taken over, says so and reloads into it.
export default function UpdateBanner({ reload = reloadPage }) {
  const { pathname } = useLocation();
  const [ready, setReady] = useState(false);
  useEffect(() => onNewVersion(() => setReady(true)), []);

  const updating = ready && !isFormPage(pathname);
  useEffect(() => {
    if (!updating) return undefined;
    const timer = setTimeout(reload, RELOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, [updating, reload]);

  if (!updating) return null;
  return (
    <div className="updating-banner" role="status">
      <span className="updating-spinner" aria-hidden="true"></span>
      Updating to the newest version…
    </div>
  );
}
