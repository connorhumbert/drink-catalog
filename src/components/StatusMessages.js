import React from "react";
import useOnline from "../hooks/useOnline";
import "./RecordList.css";

export function LoadingOrEmpty({ loading, error, fromCache }) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="custom-spinner"></div>
      </div>
    );
  }
  return (
    <div className="empty-state">
      {error || !fromCache
        ? "There is a big ol' problem, wait up to a minute and then refresh. If nothing appears contact Connor."
        : "You're offline and the recipes haven't been saved to this device yet. Open the app once with a connection and they'll be available offline after that."}
    </div>
  );
}

export function OfflineNote() {
  const online = useOnline();
  if (online) return null;
  return <div className="offline-note">Offline. You can browse recipes, but adding or changing them needs an internet connection.</div>;
}
