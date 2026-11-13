import { Link } from 'react-router-dom';
import { PROTOCOL } from '../config.js';

export function PositionPage({ rows, account }) {
  const active = rows.filter((row) => Number(row.supplied) > 0 || Number(row.debt) > 0);
  return (
    <main>
      <h1>{PROTOCOL.position}</h1>
      <p className="muted">{PROTOCOL.health}: {account ? 'open a position to see it' : 'connect a wallet'}</p>
      {!account && <p>Connect to load your position.</p>}
      {account && !active.length && <p>No open position yet. Go to a market and supply {rows[0]?.symbol || 'an asset'}.</p>}
      {active.map((row) => (
        <section key={row.symbol} className="panel">
          <h3>{row.symbol}</h3>
          <p>Supplied {Number(row.supplied).toFixed(4)}</p>
          <p>Borrowed {Number(row.debt).toFixed(4)}</p>
          <Link to={'/market/' + row.symbol}>Manage</Link>
        </section>
      ))}
    </main>
  );
}
