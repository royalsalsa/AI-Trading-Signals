import React from 'react';
import { Signal, CandleDataPoint, AnalysisResult } from '../types';
import LivePrice from './LivePrice';
import { PriceChart } from './PriceChart';
import TechnicalIndicators from './TechnicalIndicators';

const SignalPriceBox: React.FC<{ label: string; value: string; color: 'green' | 'red' | 'blue' }> = ({ label, value, color }) => {
    const colors = {
        green: 'bg-success/10 text-success',
        red: 'bg-danger/10 text-danger',
        blue: 'bg-accent/10 text-accent-light',
    }
    return (
        <div className={`flex-1 p-3 rounded-lg text-center ${colors[color]}`}>
            <p className="text-sm font-semibold opacity-80">{label}</p>
            <p className="text-lg font-bold">{value}</p>
        </div>
    )
};

const ConfidenceBar: React.FC<{ score: number }> = ({ score }) => (
    <div className="bg-secondary p-4 rounded-xl border border-border-color">
        <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-text-primary">Confidence</h4>
            <span className="font-bold text-accent-light">{score}%</span>
        </div>
        <div className="w-full bg-primary rounded-full h-2.5 border border-border-color">
            <div className="bg-accent h-2 rounded-full" style={{ width: `${score}%` }}></div>
        </div>
    </div>
);

const StrategyAnalysis: React.FC<{signal: Signal}> = ({signal}) => {
    const renderTextWithCitations = (text: string) => {
        if (!text) return null;

        // Updated regex to handle single or multiple comma-separated numbers in brackets, e.g., [1], [2, 3]
        const parts = text.split(/(\[\d+(?:,\s*\d+)*\])/g);
        
        return parts.map((part, index) => {
            // Check if the part is a citation block
            if (/^\[\d+(?:,\s*\d+)*\]$/.test(part)) {
                // Extract numbers from inside the brackets
                const numbers = part.slice(1, -1).split(',').map(n => n.trim());
                
                return (
                    <span key={index}>
                        {'['}
                        {numbers.map((numStr, numIndex) => {
                            const citationNumber = parseInt(numStr, 10);
                            if (isNaN(citationNumber)) {
                                 return (
                                    <React.Fragment key={numIndex}>
                                        {numStr}
                                        {numIndex < numbers.length - 1 && ', '}
                                    </React.Fragment>
                                );
                            }

                            const sourceIndex = citationNumber - 1; // Citations are 1-based
                            const source = signal.sources && signal.sources[sourceIndex];

                            if (source) {
                                return (
                                    <React.Fragment key={numIndex}>
                                        <a 
                                            href={source.uri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={`View source: ${source.title} (opens in new tab)`}
                                            className="inline-block text-accent-light font-semibold hover:underline decoration-dotted"
                                            aria-label={`View data source ${citationNumber}: ${source.title}`}
                                        >
                                            {numStr}
                                        </a>
                                        {numIndex < numbers.length - 1 && ', '}
                                    </React.Fragment>
                                );
                            }
                            
                            // If source not found, just return the number text without a link
                            return (
                                <React.Fragment key={numIndex}>
                                    {numStr}
                                    {numIndex < numbers.length - 1 && ', '}
                                </React.Fragment>
                            );
                        })}
                        {']'}
                    </span>
                );
            }
            // Return plain text parts
            return <React.Fragment key={index}>{part}</React.Fragment>;
        });
    };
    
    return(
        <div className="bg-secondary p-4 rounded-xl border border-border-color space-y-4">
            <h3 className="font-bold text-lg text-text-primary">Strategy Analysis Description:</h3>
            
            <div className="text-text-secondary space-y-3 text-sm leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto pr-2">
                <p>{renderTextWithCitations(signal.strategyDescription)}</p>

                <h4 className="font-semibold text-text-primary pt-2">Risk Tip:</h4>
                <p>{renderTextWithCitations(signal.riskTip)}</p>
            </div>
        </div>
    );
}

interface SignalCardProps {
  signal: Signal;
  isLive?: boolean;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal, isLive = false }) => {
  const isSell = signal.direction === 'SELL';
  const updateDate = new Date(signal.updateTime).toLocaleDateString(undefined, {
      month: '2-digit', day: '2-digit', year: 'numeric'
  });
  const updateTime = new Date(signal.updateTime).toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit'
  });

  const { chartData, analysisData } = React.useMemo(() => {
    const parsePrice = (p: string | number): number => {
        if (typeof p === 'number') return p;
        if (typeof p !== 'string' || !p) return NaN;
        return parseFloat(p.replace(/[^0-9.-]+/g, ''));
    };

    const entry = parsePrice(signal.entryPrice);
    if (isNaN(entry)) {
        return { chartData: [], analysisData: null };
    }

    const analysisData: AnalysisResult = {
        currentPrice: entry,
        strategy: {
            signal: signal.direction,
            entryPrice: entry,
            takeProfit1: parsePrice(signal.tp1),
            takeProfit2: parsePrice(signal.tp2),
            stopLoss: parsePrice(signal.sl)
        }
    };

    const isBuy = signal.direction === 'BUY';
    const startPrice = entry * (isBuy ? 0.99 : 1.01);
    const numCandles = 72;
    const candles: CandleDataPoint[] = [];
    let lastClose = startPrice;
    const nowInSeconds = Math.floor(new Date(signal.updateTime).getTime() / 1000);

    for (let i = 0; i < numCandles; i++) {
        const open = lastClose;
        const volatility = open * 0.002;
        const trendForce = (entry - open) / (numCandles - i);
        const close = open + trendForce * 0.5 + (Math.random() - 0.5) * volatility;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;
        
        const time = nowInSeconds - (numCandles - 1 - i) * 3600;

        candles.push({ time, open, high, low, close });
        lastClose = close;
    }
    
    if (candles.length > 0) {
        candles[candles.length - 1].close = entry;
    }
    
    return { chartData: candles, analysisData };

  }, [signal]);


  return (
    <div className="space-y-4">
        {isLive && <LivePrice initialPrice={signal.entryPrice} />}

        <div className="bg-secondary p-4 rounded-xl border border-border-color space-y-4">
             <div>
                <p className="font-bold text-text-primary">Direction: <span className={isSell ? 'text-danger' : 'text-success'}>{signal.direction}</span></p>
                <p className="text-xs text-text-secondary">Update: (UTC+8) {updateTime} {updateDate}</p>
             </div>
             <div className="flex gap-2">
                 <SignalPriceBox label={signal.direction} value={signal.entryPrice} color={isSell ? 'red' : 'blue'} />
                 <SignalPriceBox label="TP1" value={signal.tp1} color="green" />
                 <SignalPriceBox label="TP2" value={signal.tp2} color="green" />
                 <SignalPriceBox label="SL" value={signal.sl} color="red" />
             </div>
        </div>
        
        <ConfidenceBar score={signal.confidence} />

        {signal.rsi && signal.pivotPoints && signal.sma && (
            <TechnicalIndicators
                rsi={signal.rsi}
                pivotPoints={signal.pivotPoints}
                sma={signal.sma}
            />
        )}

        {analysisData ? (
            <PriceChart data={chartData} analysis={analysisData} />
        ) : (
            <div className="bg-secondary border border-border-color p-4 rounded-xl h-[400px] w-full flex items-center justify-center">
                <p className="text-text-secondary">Chart data could not be generated.</p>
            </div>
        )}

        <StrategyAnalysis signal={signal} />
       
       {signal.sources && signal.sources.length > 0 && (
         <div className="pt-2">
            <h4 className="font-semibold text-sm mb-2 text-text-secondary">Data Sources</h4>
            <div className="flex flex-wrap gap-2">
                {signal.sources.map((source, index) => (
                    <a 
                        key={index} 
                        id={`source-${index + 1}`}
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-secondary text-accent-light px-3 py-1 rounded-full hover:bg-border-color transition-colors"
                    >
                        [{index + 1}] {source.title}
                    </a>
                ))}
            </div>
         </div>
       )}
    </div>
  );
};

export default SignalCard;