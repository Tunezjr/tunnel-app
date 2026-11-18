import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { ADDRESSES, PROTOCOL } from '../config.js';
import { erc20Abi, poolAbi } from '../abi.js';
import { ActionPanel } from '../components/ActionPanel.jsx';

function money(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '$0';
  return n < 1 ? '$' + n.toFixed(4) : '$' + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function MarketPage({ rows, account, setStatus, refresh }) {
  const { symbol } = useParams();
  const market = rows.find((row) => row.symbol === symbol);
  const [amount, setAmount] = useState('1');

  if (!market) return <main><p>Market not found</p></main>;

  async function act(kind) {
    if (!account || !window.ethereum) {
      setStatus('Connect first');
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const user = await signer.getAddress();
    const token = new Contract(market.address, erc20Abi, signer);
    const pool = new Contract(ADDRESSES.pool, poolAbi, signer);
    const parsed = parseUnits(amount || '0', market.decimals);
    setStatus('Waiting for wallet');
    if (kind === 'supply' || kind === 'repay') {
      const allowance = await token.allowance(user, ADDRESSES.pool);
      if (allowance < parsed) await (await token.approve(ADDRESSES.pool, parsed)).wait();
    }
    if (kind === 'supply') await (await pool.supply(market.address, parsed, user, 0)).wait();
    if (kind === 'withdraw') await (await pool.withdraw(market.address, parsed, user)).wait();
    if (kind === 'borrow') await (await pool.borrow(market.address, parsed, 2, 0, user)).wait();
    if (kind === 'repay') await (await pool.repay(market.address, parsed, 2, user)).wait();
    setStatus('Done');
    await refresh();
  }

  async function toggleCollateral() {
    if (!account || !window.ethereum) {
      setStatus('Connect first');
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const pool = new Contract(ADDRESSES.pool, poolAbi, signer);
    setStatus('Waiting for wallet');
    await (await pool.setUserUseReserveAsCollateral(market.address, !market.collateral)).wait();
    setStatus('Collateral updated');
    await refresh();
  }

  return (
    <main>
      <p className="crumbs"><Link to="/markets">Markets</Link> / {market.symbol}</p>
      <h1>{market.symbol}</h1>
      <p className="muted">{market.name} · {market.reference}</p>

      <section className="statgrid">
        <article className="stat"><span className="label">Price</span><strong>{money(market.price)}</strong></article>
        <article className="stat"><span className="label">Wallet</span><strong>{Number(market.wallet).toFixed(4)}</strong></article>
        <article className="stat"><span className="label">Supplied</span><strong>{Number(market.supplied).toFixed(4)}</strong></article>
        <article className="stat"><span className="label">Borrowed</span><strong>{Number(market.debt).toFixed(4)}</strong></article>
        <article className="stat"><span className="label">Supply APY</span><strong>{market.supplyApy.toFixed(2)}%</strong></article>
        <article className="stat"><span className="label">Borrow APY</span><strong>{market.borrowApy.toFixed(2)}%</strong></article>
        <article className="stat"><span className="label">Utilization</span><strong>{market.utilization.toFixed(1)}%</strong></article>
        <article className="stat"><span className="label">LTV / threshold</span><strong>{market.ltv.toFixed(0)}% / {market.liquidationThreshold.toFixed(0)}%</strong></article>
      </section>

      <section className="panel">
        <h3>Collateral</h3>
        <p className="muted">{market.collateral ? 'This asset is collateral.' : 'This asset is not collateral.'}</p>
        <button onClick={toggleCollateral} disabled={!account || Number(market.supplied) <= 0}>
          {market.collateral ? 'Disable as collateral' : 'Enable as collateral'}
        </button>
      </section>

      <div className="grid">
        <ActionPanel
          title={PROTOCOL.supply}
          amount={amount}
          onAmount={setAmount}
          primary="Supply"
          secondary="Withdraw"
          onPrimary={() => act('supply')}
          onSecondary={() => act('withdraw')}
          disabled={!account}
        />
        <ActionPanel
          title={PROTOCOL.borrow}
          amount={amount}
          onAmount={setAmount}
          primary="Borrow"
          secondary="Repay"
          onPrimary={() => act('borrow')}
          onSecondary={() => act('repay')}
          disabled={!account}
        />
      </div>
    </main>
  );
}
