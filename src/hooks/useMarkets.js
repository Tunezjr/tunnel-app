import { useCallback, useEffect, useState } from 'react';
import { BrowserProvider, Contract, JsonRpcProvider, formatUnits } from 'ethers';
import { ADDRESSES, CHAIN, MARKETS } from '../config.js';
import { dataProviderAbi, erc20Abi, oracleAbi, poolAbi } from '../abi.js';

function publicProvider() {
  return new JsonRpcProvider(CHAIN.rpc, CHAIN.id);
}

function rayToApy(ray) {
  const n = Number(formatUnits(ray, 27));
  return n * 100;
}

function emptyAccount() {
  return {
    collateral: '0',
    debt: '0',
    available: '0',
    ltv: '0',
    threshold: '0',
    health: '0',
  };
}

export function useMarkets(account) {
  const [rows, setRows] = useState(MARKETS.map((m) => ({
    ...m,
    liquidity: '0',
    borrowed: '0',
    wallet: '0',
    supplied: '0',
    debt: '0',
    price: '0',
    supplyApy: 0,
    borrowApy: 0,
    utilization: 0,
    ltv: 0,
    liquidationThreshold: 0,
    collateral: false,
    borrowingEnabled: false,
  })));
  const [accountData, setAccountData] = useState(emptyAccount());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const provider = account && window.ethereum ? new BrowserProvider(window.ethereum) : publicProvider();
      const data = new Contract(ADDRESSES.dataProvider, dataProviderAbi, provider);
      const oracle = new Contract(ADDRESSES.oracle, oracleAbi, provider);
      const pool = new Contract(ADDRESSES.pool, poolAbi, provider);

      const next = await Promise.all(MARKETS.map(async (market) => {
        const token = new Contract(market.address, erc20Abi, provider);
        const [reserve, config, price, wallet, user] = await Promise.all([
          data.getReserveData(market.address),
          data.getReserveConfigurationData(market.address),
          oracle.getAssetPrice(market.address),
          account ? token.balanceOf(account) : 0n,
          account ? data.getUserReserveData(market.address, account) : null,
        ]);
        const liquidity = Number(formatUnits(reserve.totalAToken, market.decimals));
        const borrowed = Number(formatUnits(reserve.totalVariableDebt, market.decimals));
        const utilization = liquidity + borrowed > 0 ? (borrowed / (liquidity + borrowed)) * 100 : 0;
        return {
          ...market,
          liquidity: String(liquidity),
          borrowed: String(borrowed),
          wallet: formatUnits(wallet, market.decimals),
          supplied: user ? formatUnits(user.currentATokenBalance, market.decimals) : '0',
          debt: user ? formatUnits(user.currentVariableDebt, market.decimals) : '0',
          collateral: user ? user.usageAsCollateralEnabled : false,
          price: formatUnits(price, 8),
          supplyApy: rayToApy(reserve.liquidityRate),
          borrowApy: rayToApy(reserve.variableBorrowRate),
          utilization,
          ltv: Number(config.ltv) / 100,
          liquidationThreshold: Number(config.liquidationThreshold) / 100,
          borrowingEnabled: config.borrowingEnabled,
        };
      }));
      setRows(next);

      if (account) {
        const raw = await pool.getUserAccountData(account);
        setAccountData({
          collateral: formatUnits(raw.totalCollateralBase, 8),
          debt: formatUnits(raw.totalDebtBase, 8),
          available: formatUnits(raw.availableBorrowsBase, 8),
          ltv: String(Number(raw.ltv) / 100),
          threshold: String(Number(raw.currentLiquidationThreshold) / 100),
          health: raw.healthFactor > 10n ** 30n ? 'inf' : formatUnits(raw.healthFactor, 18),
        });
      } else {
        setAccountData(emptyAccount());
      }
    } catch (err) {
      setError(err.shortMessage || err.message || 'Could not load markets');
    } finally {
      setLoading(false);
    }
  }, [account]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { rows, accountData, loading, error, refresh };
}
