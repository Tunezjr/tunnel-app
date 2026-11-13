import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { BrowserProvider, Contract, parseUnits } from 'ethers';
import { ADDRESSES, PROTOCOL } from '../config.js';
import { erc20Abi, poolAbi } from '../abi.js';
import { ActionPanel } from '../components/ActionPanel.jsx';

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

  return (
    <main>
      <h1>{market.symbol}</h1>
      <p className="muted">{market.name} · wallet {Number(market.wallet).toFixed(4)}</p>
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
