import { PROTOCOL } from '../config.js';
import { MarketTable } from '../components/MarketTable.jsx';

export function MarketsPage({ rows, loading, error }) {
  return (
    <main>
      <h1>{PROTOCOL.markets}</h1>
      <p className="muted">Live reserves. Asset names stay as deployed. Section names are protocol theme only.</p>
      {error && <p className="status">{error}</p>}
      <MarketTable rows={rows} loading={loading} />
    </main>
  );
}
