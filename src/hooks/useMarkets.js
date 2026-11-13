import { useCallback, useEffect, useState } from 'react';
import { BrowserProvider, Contract, JsonRpcProvider, formatUnits } from 'ethers';
import { ADDRESSES, CHAIN, MARKETS } from '../config.js';
import { dataProviderAbi, erc20Abi } from '../abi.js';

function publicProvider() {
  return new JsonRpcProvider(CHAIN.rpc, CHAIN.id);
}

export function useMarkets(account) {
  const [rows, setRows] = useState(MARKETS.map((m) => ({ ...m, liquidity: '0', borrowed: '0', wallet: '0', supplied: '0', debt: '0' })));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const provider = account && window.ethereum ? new BrowserProvider(window.ethereum) : publicProvider();
      const data = new Contract(ADDRESSES.dataProvider, dataProviderAbi, provider);
      const next = await Promise.all(MARKETS.map(async (market) => {
        const token = new Contract(market.address, erc20Abi, provider);
        const reserve = await data.getReserveData(market.address);
        const wallet = account ? await token.balanceOf(account) : 0n;
        const user = account ? await data.getUserReserveData(market.address, account) : null;
        return {
          ...market,
          liquidity: formatUnits(reserve.totalAToken, market.decimals),
          borrowed: formatUnits(reserve.totalVariableDebt, market.decimals),
          wallet: formatUnits(wallet, market.decimals),
          supplied: user ? formatUnits(user.currentATokenBalance, market.decimals) : '0',
          debt: user ? formatUnits(user.currentVariableDebt, market.decimals) : '0',
          collateral: user ? user.usageAsCollateralEnabled : false,
        };
      }));
      setRows(next);
    } catch (err) {
      setError(err.shortMessage || err.message || 'Could not load markets');
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, loading, error, refresh };
}
