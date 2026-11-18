import { Link } from 'react-router-dom';

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '$0';
  return n < 1 ? '$' + n.toFixed(4) : '$' + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function usdValue(amount, price) {
  return money(Number(amount) * Number(price));
}

export function MarketTable({ rows, loading }) {
  return (
    <div className="tablewrap">
      <table className="markets">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Price</th>
            <th>Total supply</th>
            <th>Total borrow</th>
            <th>Utilization</th>
            <th>Supply APY</th>
            <th>Borrow APY</th>
            <th>LTV</th>
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
              <td>
                {Number(row.liquidity).toFixed(2)}
                <div className="text">{usdValue(row.liquidity, row.price)}</div>
              </td>
              <td>
                {Number(row.borrowed).toFixed(2)}
                <div className="text">{usdValue(row.borrowed, row.price)}</div>
              </td>
              <td>{row.utilization.toFixed(1)}%</td>
              <td>{row.supplyApy.toFixed(2)}%</td>
              <td>{row.borrowApy.toFixed(2)}%</td>
              <td>{row.ltv.toFixed(0)}%</td>
              <td><Link to={'/market/' + row.symbol}>Open</Link></td>
            </tr>
          ))}
          {!rows.length && (
            <tr><td colSpan="9">{loading ? 'Loading' : 'No markets'}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
