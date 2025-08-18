import { Asset, AssetCategory } from './types';

export const ASSETS: Asset[] = [
  // Crypto
  { name: 'Bitcoin (BTCUSD)', category: AssetCategory.CRYPTO },
  { name: 'Ethereum (ETHUSD)', category: AssetCategory.CRYPTO },
  { name: 'Solana (SOLUSD)', category: AssetCategory.CRYPTO },
  { name: 'XRP (XRPUSD)', category: AssetCategory.CRYPTO },
  { name: 'Litecoin (LTCUSD)', category: AssetCategory.CRYPTO },
  { name: 'Bitcoin Cash (BCHUSD)', category: AssetCategory.CRYPTO },
  { name: 'Dogecoin (DOGEUSD)', category: AssetCategory.CRYPTO },
  { name: 'BNB (BNBUSD)', category: AssetCategory.CRYPTO },
  { name: 'Tether (USDTUSD)', category: AssetCategory.CRYPTO },
  // Indices
  { name: 'Nasdaq (IXIC)', category: AssetCategory.INDICES },
  { name: 'Dow Jones (DJI)', category: AssetCategory.INDICES },
  { name: 'S&P 500 (INX)', category: AssetCategory.INDICES },
  { name: 'U.S. Dollar Index (DXY)', category: AssetCategory.INDICES },
  { name: 'NASDAQ 100 (NDX)', category: AssetCategory.INDICES },
  { name: 'Hang Seng (HK50)', category: AssetCategory.INDICES },
  { name: 'Nikkei 225 (JPN225)', category: AssetCategory.INDICES },
  { name: 'DAX (GER40)', category: AssetCategory.INDICES },
  // Forex
  { name: 'EUR/USD', category: AssetCategory.FOREX },
  { name: 'GBP/USD', category: AssetCategory.FOREX },
  { name: 'USD/JPY', category: AssetCategory.FOREX },
  { name: 'USD/CHF', category: AssetCategory.FOREX },
  { name: 'AUD/USD', category: AssetCategory.FOREX },
  { name: 'USD/CAD', category: AssetCategory.FOREX },
  { name: 'NZD/USD', category: AssetCategory.FOREX },
  { name: 'EUR/JPY', category: AssetCategory.FOREX },
  { name: 'GBP/JPY', category: AssetCategory.FOREX },
  { name: 'EUR/GBP', category: AssetCategory.FOREX },
  // Commodities
  { name: 'Gold (XAU/USD)', category: AssetCategory.COMMODITIES },
  { name: 'Silver (XAG/USD)', category: AssetCategory.COMMODITIES },
  { name: 'WTI Crude Oil', category: AssetCategory.COMMODITIES },
];
