import { Link } from 'react-router-dom';
import { PROTOCOL } from '../config.js';

function usd(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '$0.00';
  return '$' + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function PositionPage({ rows, accountData, account }) {
  const active = rows.filter((row) => Number(row.supplied) > 0 || Number(row.debt) > 0);
  return (
    <main>
      <div className="hero">
        <div>
          <p className="eyebrow">Your home</p>
          <h1>{PROTOCOL.position}</h1>
          <p className="muted">{PROTOCOL.health}: {account ? (accountData.health === 'inf' ? 'No debt' : accountData.health === '0' ? 'No position' : Number(accountData.health).toFixed(2)) : 'connect a wallet'}</p>
        </div>
        <img className="hero-art" src="/characters/sandy.jpg" alt="" />
      </div>

      <section className="statgrid">
        <article className="stat"><span className="label">Collateral</span><strong>{usd(accountData.collateral)}</strong></article>
        <article className="stat"><span className="label">Debt</span><strong>{usd(accountData.debt)}</strong></article>
        <article className="stat"><span className="label">Available</span><strong>{usd(accountData.available)}</strong></article>
        <article className="stat"><span className="label">Account LTV</span><strong>{accountData.ltv}%</strong></article>
      </section>

      {!account && <p>Connect to load your position.</p>}
      {account && !active.length && <p>No open position yet. Supply an asset from Markets.</p>}

      {active.map((row) => (
        <section key={row.symbol} className="panel">
          <h3>{row.symbol}</h3>
          <div className="line">
            <span>Supplied</span>
            <strong>{Number(row.supplied).toFixed(4)} · {usd(Number(row.supplied) * Number(row.price))}</strong>
          </div>
          <div className="line">
            <span>Borrowed</span>
            <strong>{Number(row.debt).toFixed(4)} · {usd(Number(row.debt) * Number(row.price))}</strong>
          </div>
          <div className="line">
            <span>Collateral</span>
            <strong>{row.collateral ? 'Enabled' : 'Disabled'}</strong>
          </div>
          <Link to={'/market/' + row.symbol}>Manage</Link>
        </section>
      ))}
    </main>
  );
}
