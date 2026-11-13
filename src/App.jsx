import { useEffect, useState } from 'react';
import { BrowserProvider, Contract, formatUnits, parseUnits } from 'ethers';
import { ADDRESSES, CHAIN } from './config.js';
import { dataProviderAbi, erc20Abi, poolAbi } from './abi.js';

export default function App() {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('');
  const [amount, setAmount] = useState('1');
  const [walletBalance, setWalletBalance] = useState('0');
  const [supplied, setSupplied] = useState('0');
  const [debt, setDebt] = useState('0');
  const [liquidity, setLiquidity] = useState('0');

  async function connect() {
    if (!window.ethereum) {
      setStatus('No wallet found');
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    await provider.send('wallet_addEthereumChain', [{
      chainId: '0x' + CHAIN.id.toString(16),
      chainName: CHAIN.name,
      nativeCurrency: { name: CHAIN.symbol, symbol: CHAIN.symbol, decimals: 18 },
      rpcUrls: [CHAIN.rpc],
      blockExplorerUrls: [CHAIN.explorer],
    }]);
    await provider.send('eth_requestAccounts', []);
    const signer = await provider.getSigner();
    setAccount(await signer.getAddress());
    setStatus('Connected');
  }

  async function refresh() {
    if (!account || !window.ethereum) return;
    const provider = new BrowserProvider(window.ethereum);
    const token = new Contract(ADDRESSES.tUSD, erc20Abi, provider);
    const data = new Contract(ADDRESSES.dataProvider, dataProviderAbi, provider);
    const [bal, decimals, reserve, user] = await Promise.all([
      token.balanceOf(account),
      token.decimals(),
      data.getReserveData(ADDRESSES.tUSD),
      data.getUserReserveData(ADDRESSES.tUSD, account),
    ]);
    setWalletBalance(formatUnits(bal, decimals));
    setSupplied(formatUnits(user.currentATokenBalance, decimals));
    setDebt(formatUnits(user.currentVariableDebt, decimals));
    setLiquidity(formatUnits(reserve.totalAToken, decimals));
  }

  useEffect(() => {
    refresh().catch((err) => setStatus(err.shortMessage || err.message));
  }, [account]);

  async function withSigner(action) {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const token = new Contract(ADDRESSES.tUSD, erc20Abi, signer);
    const pool = new Contract(ADDRESSES.pool, poolAbi, signer);
    const parsed = parseUnits(amount || '0', 18);
    setStatus('Waiting for wallet');
    await action({ token, pool, parsed, user: await signer.getAddress() });
    setStatus('Done');
    await refresh();
  }

  return (
    <main>
      <header>
        <h1>Tunnel</h1>
        <button onClick={connect}>{account ? account.slice(0, 6) + '...' + account.slice(-4) : 'Connect'}</button>
      </header>
      <section>
        <p>Chain {CHAIN.id} · tUSD</p>
        <p>Wallet {walletBalance}</p>
        <p>Supplied {supplied}</p>
        <p>Borrowed {debt}</p>
        <p>Pool liquidity {liquidity}</p>
        <input value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div className="row">
          <button onClick={() => withSigner(async ({ token, pool, parsed, user }) => {
            const allowance = await token.allowance(user, ADDRESSES.pool);
            if (allowance < parsed) await (await token.approve(ADDRESSES.pool, parsed)).wait();
            await (await pool.supply(ADDRESSES.tUSD, parsed, user, 0)).wait();
          })}>Supply</button>
          <button onClick={() => withSigner(async ({ pool, parsed, user }) => {
            await (await pool.withdraw(ADDRESSES.tUSD, parsed, user)).wait();
          })}>Withdraw</button>
          <button onClick={() => withSigner(async ({ pool, parsed, user }) => {
            await (await pool.borrow(ADDRESSES.tUSD, parsed, 2, 0, user)).wait();
          })}>Borrow</button>
          <button onClick={() => withSigner(async ({ token, pool, parsed, user }) => {
            const allowance = await token.allowance(user, ADDRESSES.pool);
            if (allowance < parsed) await (await token.approve(ADDRESSES.pool, parsed)).wait();
            await (await pool.repay(ADDRESSES.tUSD, parsed, 2, user)).wait();
          })}>Repay</button>
        </div>
        <p className="status">{status}</p>
      </section>
    </main>
  );
}
