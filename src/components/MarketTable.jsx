import { Link } from 'react-router-dom';
import { PROTOCOL } from '../config.js';

export function MarketTable({ rows, loading }) {
  return (
    <table className="markets">
      <thead>
        <tr>
          <th>Asset</th>
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
              <div className="muted">{row.name}</div>
            </td>
            <td>{Number(row.liquidity).toFixed(2)}</td>
            <td>{Number(row.borrowed).toFixed(2)}</td>
            <td><Link to={'/market/' + row.symbol}>Open</Link></td>
          </tr>
        ))}
        {!rows.length && (
          <tr><td colSpan="4">{loading ? 'Loading' : 'No markets'}</td></tr>
        )}
      </tbody>
    </table>
  );
}
