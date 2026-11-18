import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/AppShell.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { MarketsPage } from './pages/MarketsPage.jsx';
import { MarketPage } from './pages/MarketPage.jsx';
import { PositionPage } from './pages/PositionPage.jsx';
import { useWallet } from './hooks/useWallet.js';
import { useMarkets } from './hooks/useMarkets.js';

export default function App() {
  const { account, status, setStatus, connect } = useWallet();
  const { rows, accountData, loading, error, refresh } = useMarkets(account);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell account={account} onConnect={connect} />}>
          <Route index element={<DashboardPage rows={rows} accountData={accountData} account={account} loading={loading} error={error} />} />
          <Route path="markets" element={<MarketsPage rows={rows} loading={loading} error={error} />} />
          <Route path="market/:symbol" element={<MarketPage rows={rows} account={account} setStatus={setStatus} refresh={refresh} />} />
          <Route path="position" element={<PositionPage rows={rows} accountData={accountData} account={account} />} />
        </Route>
      </Routes>
      {status && <p className="toast">{status}</p>}
    </BrowserRouter>
  );
}
