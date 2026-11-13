import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { missingById, nextBottles, useCabinet } from "./cabinet";
import useDrinks from "../../database/useDrinks";
import DrinkList from "../../components/DrinkList";
import { LoadingOrEmpty, OfflineNote } from "../../components/StatusMessages";
import "./MyBar.css";

// The "My Bar" tab: what you can make with what you have, and what's one ingredient away.
export default function BarTab() {
  const { records, loading, error, fromCache } = useDrinks();
  const [bar] = useCabinet();
  const hasBar = bar.items.length > 0;

  const { ready, almost, missing, buyNext } = useMemo(() => {
    if (!hasBar) return { ready: [], almost: [], missing: new Map(), buyNext: [] };
    const missing = missingById(records, bar);
    return {
      ready: records.filter((record) => missing.get(record._id).length === 0),
      almost: records.filter((record) => missing.get(record._id).length === 1),
      missing,
      buyNext: nextBottles(records, bar, 1),
    };
  }, [records, bar, hasBar]);

  if (loading || records.length === 0) {
    return <LoadingOrEmpty loading={loading} error={error} fromCache={fromCache} />;
  }

  return (
    <div className="page bar-page">
      <OfflineNote />
      <h2 className="page-title">My Bar</h2>

      {!hasBar ? (
        <div className="bar-welcome">
          <p>Tell us which bottles and mixers you have at home, and we'll show you the cocktails you can make with them.</p>
          <Link className="big-button" to="/bar/bottles">Add what I have</Link>
        </div>
      ) : (
        <>
          <div className="bar-status">
            <span>
              Based on the {bar.items.length} {bar.items.length === 1 ? "thing" : "things"} in your bar.
            </span>
            <Link className="outline-button" to="/bar/bottles">Update my bar</Link>
          </div>

          <section className="bar-section">
            <h3 className="section-title">
              Ready to make <span className="section-count">{ready.length}</span>
            </h3>
            {ready.length === 0 ? (
              <p className="section-empty">
                Nothing yet. Add a few more things to your bar, or look below for drinks that need just one more ingredient.
              </p>
            ) : (
              <DrinkList records={ready} />
            )}
          </section>

          <section className="bar-section">
            <h3 className="section-title">
              Need one more thing <span className="section-count">{almost.length}</span>
            </h3>
            {buyNext.length > 0 && (
              <p className="buy-tip">
                Tip: buying <strong>{buyNext[0].name}</strong> would let you make {buyNext[0].count} more{" "}
                {buyNext[0].count === 1 ? "cocktail" : "cocktails"}.
              </p>
            )}
            {almost.length === 0 ? (
              <p className="section-empty">No drinks are just one ingredient away.</p>
            ) : (
              <DrinkList records={almost} missing={missing} />
            )}
          </section>
        </>
      )}
    </div>
  );
}
