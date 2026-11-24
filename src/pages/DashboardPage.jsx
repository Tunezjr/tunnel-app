import { Link } from 'react-router-dom';
import { PROTOCOL } from '../config.js';
import { Cast } from '../components/Cast.jsx';

function usd(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '$0.00';
  return '$' + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function healthLabel(health) {
  if (!health || health === '0') return 'No position';
  if (health === 'inf') return 'No debt';
  const n = Number(health);
  if (n >= 2) return n.toFixed(2) + ' · safe';
  if (n >= 1.1) return n.toFixed(2) + ' · watch';
  return n.toFixed(2) + ' · at risk';
}

export function DashboardPage({ rows, accountData, account, loading, error }) {
  const tvl = rows.reduce((sum, row) => sum + Number(row.liquidity) * Number(row.price), 0);
  const borrows = rows.reduce((sum, row) => sum + Number(row.borrowed) * Number(row.price), 0);
  const supplied = rows.filter((row) => Number(row.supplied) > 0);
  const borrowed = rows.filter((row) => Number(row.debt) > 0);

  return (
    <main>
      <div className="hero">
        <div>
          <p className="eyebrow">Bikini Bottom</p>
          <h1>Dashboard</h1>
          <p className="muted">Portfolio and protocol state for the live Tunnel market.</p>
        </div>
        <img className="hero-art" src="/characters/spongebob.jpg" alt="" />
      </div>
      {error && <p className="status">{error}</p>}

      <section className="statgrid">
        <article className="stat">
          <span className="label">Net worth</span>
          <strong>{account ? usd(Number(accountData.collateral) - Number(accountData.debt)) : '—'}</strong>
        </article>
        <article className="stat">
          <span className="label">Collateral</span>
          <strong>{account ? usd(accountData.collateral) : '—'}</strong>
        </article>
        <article className="stat">
          <span className="label">Debt</span>
          <strong>{account ? usd(accountData.debt) : '—'}</strong>
        </article>
        <article className="stat">
          <span className="label">{PROTOCOL.health}</span>
          <strong>{account ? healthLabel(accountData.health) : 'Connect'}</strong>
        </article>
      </section>

      <section className="statgrid">
        <article className="stat">
          <span className="label">Protocol TVL</span>
          <strong>{usd(tvl)}</strong>
        </article>
        <article className="stat">
          <span className="label">Total borrows</span>
          <strong>{usd(borrows)}</strong>
        </article>
        <article className="stat">
          <span className="label">Available to borrow</span>
          <strong>{account ? usd(accountData.available) : '—'}</strong>
        </article>
        <article className="stat">
          <span className="label">Markets</span>
          <strong>{rows.length}</strong>
        </article>
      </section>

      <Cast />

      <div className="grid">
        <section className="panel">
          <div className="panelhead">
            <img src="/characters/krabs.jpg" alt="" />
            <h3>{PROTOCOL.supply}</h3>
          </div>
          {!supplied.length && <p className="muted">{loading ? 'Loading' : 'No supplied assets.'}</p>}
          {supplied.map((row) => (
            <div key={row.symbol} className="line">
              <div>
                <strong>{row.symbol}</strong>
                <div className="text">{Number(row.supplied).toFixed(4)} · {row.supplyApy.toFixed(2)}% APY</div>
              </div>
              <Link to={'/market/' + row.symbol}>Manage</Link>
            </div>
          ))}
        </section>
        <section className="panel">
          <div className="panelhead">
            <img src="/characters/squidward.jpg" alt="" />
            <h3>{PROTOCOL.borrow}</h3>
          </div>
          {!borrowed.length && <p className="muted">{loading ? 'Loading' : 'No borrowed assets.'}</p>}
          {borrowed.map((row) => (
            <div key={row.symbol} className="line">
              <div>
                <strong>{row.symbol}</strong>
                <div className="text">{Number(row.debt).toFixed(4)} · {row.borrowApy.toFixed(2)}% APY</div>
              </div>
              <Link to={'/market/' + row.symbol}>Manage</Link>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
