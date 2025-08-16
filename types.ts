
export enum View {
  SIGNALS = 'signals',
  HISTORY = 'history',
}

export enum AssetCategory {
  FOREX = 'Forex',
  COMMODITIES = 'Commodities',
  INDICES = 'Indices',
  CRYPTO = 'Crypto',
}

export interface Asset {
  name: string;
  category: AssetCategory;
}

export interface SignalSource {
    title: string;
    uri: string;
}

export interface Signal {
  assetName: string;
  analysis: string;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  sources: SignalSource[];
  timestamp: string;
}
