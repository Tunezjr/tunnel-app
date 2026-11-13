import { useCallback, useState } from 'react';
import { BrowserProvider } from 'ethers';
import { CHAIN } from '../config.js';

export function useWallet() {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('');

  const connect = useCallback(async () => {
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
  }, []);

  return { account, status, setStatus, connect };
}
