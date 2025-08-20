export enum View {
    WATCHLIST = 'WATCHLIST',
    CHART = 'CHART',
    AI = 'AI',
    EXPLORE = 'EXPLORE',
    PROFILE = 'PROFILE',
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

export interface DataSource {
    name:string;
    url: string;
}

export interface NewsArticle {
    title: string;
    snippet: string;
    url: string;
    sourceName: string;
}

export interface SignalSource {
    title: string;
    uri: string;
}

export interface PivotPoints {
  r2: string;
  r1: string;
  pivot: string;
  s1: string;
  s2:string;
}

export interface Rsi {
  value: number;
  interpretation: 'Overbought' | 'Oversold' | 'Neutral';
}

export interface Sma {
  sma20: string;
  sma50: string;
  sma100: string;
}

export interface Signal {
  assetName: string;
  updateTime: string;
  sources: SignalSource[];
  direction: 'BUY' | 'SELL';
  confidence: number;
  entryPrice: string;
  tp1: string;
  tp2: string;
  sl: string;
  strategyDescription: string;
  riskTip: string;
  pivotPoints: PivotPoints;
  rsi: Rsi;
  sma: Sma;
}

export interface CandleDataPoint {
  time: number; // UTCTimestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface AnalysisResult {
    currentPrice: number;
    strategy: {
        signal: 'BUY' | 'SELL' | 'HOLD';
        entryPrice: number;
        takeProfit1: number;
        takeProfit2: number;
        stopLoss: number;
    }
}