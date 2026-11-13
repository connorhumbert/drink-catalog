import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import useDrinks from "../../database/useDrinks";
import DrinkList from "../../components/DrinkList";
import { LoadingOrEmpty, OfflineNote } from "../../components/StatusMessages";
import "../../components/RecordList.css";
import "../addEdit/edit&create.css";

// One drink on its own page, opened from a shared link (/drink/:id). Keep this route: links already sent use it.
export default function DrinkPage() {
  const { records, loading, error, fromCache } = useDrinks();
  const { id } = useParams();
  const record = records.find((r) => r._id === id);

  let body;
  if (record) {
    body = <DrinkList records={[record]} initialOpenId={record._id} />;
  } else if (!loading && !fromCache) {
    // Only once the server has answered: the copy on this phone may simply not have the drink yet.
    body = (
      <div className="empty-state">
        This cocktail couldn't be found. It may have been deleted.
        <br />
        <Link to="/">See all cocktails</Link>
      </div>
    );
  } else {
    body = <LoadingOrEmpty loading={loading || records.length > 0} error={error} fromCache={fromCache} />;
  }

  return (
    <div className="page">
      <OfflineNote />
      <Link className="back-link" to="/">← All cocktails</Link>
      {body}
    </div>
  );
}
