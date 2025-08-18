
export enum View {
  SIGNALS = 'signals',
  HISTORY = 'history',
  ABOUT = 'about',
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

export interface PivotPoints {
    r3: string;
    r2: string;
    r1: string;
    pp: string;
    s1: string;
    s2: string;
    s3: string;
}

export interface RSI {
    value: number;
    interpretation: string;
}

export interface MovingAverages {
    ma50: string;
    ma200: string;
    analysis: string;
}

export interface Signal {
  assetName: string;
  timestamp: string;
  sources: SignalSource[];
  signal: 'BUY' | 'SELL';
  price: string;
  analysis: string;
  entry: string;
  stopLoss: string;
  takeProfit: string;
  pivotPoints: PivotPoints;
  rsi: RSI;
  movingAverages: MovingAverages;
}