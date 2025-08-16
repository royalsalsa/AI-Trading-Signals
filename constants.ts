import { Asset, AssetCategory } from './types';

export const ASSETS: Asset[] = [
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
  // Indices
  { name: 'Nasdaq 100', category: AssetCategory.INDICES },
  { name: 'Dow Jones 30', category: AssetCategory.INDICES },
  { name: 'U.S. Dollar Index (DXY)', category: AssetCategory.INDICES },
  { name: 'S&P 500', category: AssetCategory.INDICES },
  // Crypto
  { name: 'Bitcoin (BTC/USD)', category: AssetCategory.CRYPTO },
  { name: 'Ethereum (ETH/USD)', category: AssetCategory.CRYPTO },
  { name: 'Solana (SOL/USD)', category: AssetCategory.CRYPTO },
  { name: 'XRP (XRP/USD)', category: AssetCategory.CRYPTO },
  { name: 'Litecoin (LTC/USD)', category: AssetCategory.CRYPTO },
  { name: 'Bitcoin Cash (BCH/USD)', category: AssetCategory.CRYPTO },
  { name: 'Dogecoin (DOGE/USD)', category: AssetCategory.CRYPTO },
  { name: 'BNB (BNB/USD)', category: AssetCategory.CRYPTO },
];