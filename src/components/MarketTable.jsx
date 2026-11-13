import { Link } from 'react-router-dom';
import { PROTOCOL } from '../config.js';

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '$0';
  return n < 1 ? '$' + n.toFixed(4) : '$' + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function MarketTable({ rows, loading }) {
  return (
    <table className="markets">
      <thead>
        <tr>
          <th>Asset</th>
          <th>Price</th>
          <th>{PROTOCOL.supply}</th>
          <th>{PROTOCOL.borrow}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.symbol}>
            <td>
              <strong>{row.symbol}</strong>
              <div className="text">{row.name}</div>
            </td>
            <td>
              <strong>{money(row.price)}</strong>
              <div className="text">{row.reference}</div>
            </td>
            <td>{Number(row.liquidity).toFixed(2)}</td>
            <td>{Number(row.borrowed).toFixed(2)}</td>
            <td><Link to={'/market/' + row.symbol}>Open</Link></td>
          </tr>
        ))}
        {!rows.length && (
          <tr><td colSpan="5">{loading ? 'Loading' : 'No markets'}</td></tr>
        )}
      </tbody>
    </table>
  );
}
