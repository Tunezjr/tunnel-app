import { NavLink, Outlet } from 'react-router-dom';
import { PROTOCOL } from '../config.js';

export function AppShell({ account, onConnect }) {
  return (
    <div className="shell">
      <header className="topbar">
        <div>
          <strong className="brand">{PROTOCOL.app}</strong>
          <span className="sub">Zenith testnet · chain 936485</span>
        </div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/markets">{PROTOCOL.markets}</NavLink>
          <NavLink to="/position">{PROTOCOL.position}</NavLink>
        </nav>
        <button onClick={onConnect}>{account ? account.slice(0, 6) + '...' + account.slice(-4) : 'Connect'}</button>
      </header>
      <Outlet />
    </div>
  );
}
