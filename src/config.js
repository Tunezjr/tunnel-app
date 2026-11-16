export const CHAIN = {
  id: 936485,
  name: 'Zenith EVM Testnet',
  rpc: 'https://rpc.testnet.zenith.network/',
  explorer: 'https://explorer.testnet.zenith.network',
  symbol: 'ZTH',
};

export const ADDRESSES = {
  pool: '0xcDeBCee788b239E82F4da926E42e1ce62bc9E966',
  dataProvider: '0x9B77808035D3298D5FBd0ab7E4237Cce1E48fb86',
  oracle: '0x7e34256e34e3761F0c3a98DD2d8213bEF2899670',
  tUSD: '0x7a17CCDFb69d9bDfDf52ef588028C75Ae5E42db8',
};

export const MARKETS = [
  { symbol: 'tUSD', address: '0x7a17CCDFb69d9bDfDf52ef588028C75Ae5E42db8', decimals: 18, name: 'Test USD', reference: 'USD peg' },
  { symbol: 'ZTH', address: '0x5DFd2e508720df6BC0F58874B5a7d99274Ef93Dc', decimals: 18, name: 'Zenith', reference: 'ZTH/USD' },
  { symbol: 'sZTH', address: '0xc3afCD6bd82460c5A49759Fdf35F6Cc7e84D7dC0', decimals: 18, name: 'Kintsu sZTH', reference: 'ZTH + staking premium' },
  { symbol: 'shZTH', address: '0x764eEC1fDc94347E360a67749510D88ecA13A237', decimals: 18, name: 'FastLane shZTH', reference: 'ZTH + staking premium' },
  { symbol: 'zmETH', address: '0x25F6fA3DB38cC200Df8459b680EaA578E59DcEda', decimals: 18, name: 'Zenith mock ETH', reference: 'ETH/USD' },
];

export const PROTOCOL = {
  app: 'Tunnel',
  markets: 'Bikini Bottom Markets',
  supply: 'Krusty Krab',
  borrow: 'Boating School',
  position: 'Pineapple',
  health: 'How safe is your pineapple',
};
