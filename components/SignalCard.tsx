import React from 'react';
import { Signal } from '../types';

interface SignalCardProps {
  signal: Signal;
}

const timeAgo = (timestamp: string): string => {
  const now = new Date();
  const signalDate = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - signalDate.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const PriceChart: React.FC<{signal: Signal}> = ({ signal }) => {
    const { price, signal: signalDirection } = signal;

    const { yLabels, illustrativePath } = React.useMemo(() => {
        const currentPrice = parseFloat(String(price).replace(/[^0-9.-]+/g, '')) || 0;
        
        let labels: string[];
        if (isNaN(currentPrice) || currentPrice === 0) {
            labels = Array(5).fill('-');
        } else {
            const range = currentPrice * 0.1; 
            const maxPrice = currentPrice + range / 2;
            const minPrice = currentPrice - range / 2;
            const step = (maxPrice - minPrice) / 4;
            const decimals = currentPrice > 1000 ? 2 : (currentPrice > 1 ? 4 : 5);
            labels = Array.from({ length: 5 }, (_, i) => (maxPrice - i * step).toFixed(decimals));
        }

        const isBuy = signalDirection === 'BUY';
        const numPoints = 6;
        const points = [];
        const viewboxHeight = 170;
        const viewboxWidth = 350;
        const startX = 40;
        const startY = 10;

        let lastY = startY + viewboxHeight / 2;

        for (let i = 0; i < numPoints; i++) {
            const x = startX + (i * viewboxWidth / (numPoints - 1));
            let newY;
            if (i === numPoints - 1) { 
                 newY = isBuy 
                    ? startY + (Math.random() * viewboxHeight * 0.4)
                    : startY + viewboxHeight * 0.6 + (Math.random() * viewboxHeight * 0.4);
            } else {
                const change = (Math.random() - 0.5) * viewboxHeight * 0.5;
                newY = lastY + change;
            }
            newY = Math.max(startY, Math.min(startY + viewboxHeight, newY));
            points.push({ x, y: newY });
            lastY = newY;
        }

        const line = (pointA, pointB) => {
            const lengthX = pointB.x - pointA.x;
            const lengthY = pointB.y - pointA.y;
            return {
                length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
                angle: Math.atan2(lengthY, lengthX)
            };
        };
        const controlPoint = (current, previous, next, reverse) => {
            const p = previous || current;
            const n = next || current;
            const smoothing = 0.2;
            const o = line(p, n);
            const angle = o.angle + (reverse ? Math.PI : 0);
            const length = o.length * smoothing;
            const x = current.x + Math.cos(angle) * length;
            const y = current.y + Math.sin(angle) * length;
            return [x, y];
        };
        const bezierCommand = (point, i, a) => {
            const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point, false);
            const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
            return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point.x},${point.y}`;
        };
        const pathD = points.reduce((acc, point, i, a) => 
            i === 0 ? `M ${point.x},${point.y}` : `${acc} ${bezierCommand(point, i, a)}`, 
        '');

        return { yLabels: labels, illustrativePath: pathD };
    }, [price, signalDirection]);

    const lineColor = signalDirection === 'BUY' ? '#22C55E' : '#EF4444';

    return (
        <div className="bg-primary p-4 rounded-lg border border-border-color h-80">
            <h3 className="font-semibold text-text-primary mb-2">Price Action (Illustrative)</h3>
             <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet" className="text-sm">
                <line x1="40" x2="40" y1="10" y2="180" stroke="#1E293B" strokeWidth="1" />
                <line x1="40" x2="390" y1="180" stroke="#1E293B" strokeWidth="1" />
                {[0, 0.25, 0.5, 0.75, 1].map(f => (
                    <line key={f} x1="40" x2="390" y1={10 + 170 * f} stroke="#1E293B" strokeWidth="0.5" strokeDasharray="2,2" />
                ))}
                
                <text x="35" y="15" fill="#9CA3AF" textAnchor="end">{yLabels[0]}</text>
                <text x="35" y="60" fill="#9CA3AF" textAnchor="end">{yLabels[1]}</text>
                <text x="35" y="102.5" fill="#9CA3AF" textAnchor="end">{yLabels[2]}</text>
                <text x="35" y="145" fill="#9CA3AF" textAnchor="end">{yLabels[3]}</text>
                <text x="35" y="180" fill="#9CA3AF" textAnchor="end">{yLabels[4]}</text>

                {['10H', '8H', '6H', '4H', '2H', 'Now'].map((label, i) => (
                    <text key={label} x={40 + (i * 350 / 5)} y="195" fill="#9CA3AF" textAnchor="middle">{label}</text>
                ))}

                <path d={illustrativePath} stroke={lineColor} fill="none" strokeWidth="2" />
                <circle cx="160" cy="190" r="3" fill={lineColor} />
                <text x="170" y="194" fill="#9CA3AF" className="text-xs">Price</text>
            </svg>
        </div>
    );
};


const PivotPointsCard: React.FC<{pivots: Signal['pivotPoints']}> = ({ pivots }) => (
    <div className="bg-primary p-4 rounded-lg border border-border-color">
        <h4 className="font-semibold text-accent mb-3">Pivot Points</h4>
        <div className="space-y-2 text-sm">
            {Object.entries(pivots).map(([key, value]) => {
                const isResistance = key.startsWith('r');
                const isSupport = key.startsWith('s');
                const isPivot = key === 'pp';
                let color = 'text-text-primary';
                if (isResistance) color = 'text-danger';
                if (isSupport) color = 'text-success';
                
                return (
                    <div key={key} className="flex justify-between items-center">
                        <span className="text-text-secondary">{key.toUpperCase()}</span>
                        <span className={`font-mono font-semibold ${color}`}>{value}</span>
                    </div>
                );
            })}
        </div>
    </div>
);

const RsiCard: React.FC<{rsi: Signal['rsi']}> = ({ rsi }) => (
    <div className="bg-primary p-4 rounded-lg border border-border-color">
        <h4 className="font-semibold text-accent mb-3">Relative Strength Index (RSI)</h4>
        <div className="text-center">
            <p className="text-4xl font-bold text-text-primary mb-1">{rsi.value.toFixed(2)}</p>
            <p className="font-semibold text-text-secondary mb-4">{rsi.interpretation}</p>
            <div className="w-full bg-secondary rounded-full h-2.5">
                <div className="bg-accent h-2.5 rounded-full" style={{width: `${rsi.value}%`}}></div>
            </div>
            <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>Oversold (30)</span>
                <span>Overbought (70)</span>
            </div>
        </div>
    </div>
);

const MovingAveragesCard: React.FC<{ma: Signal['movingAverages']}> = ({ ma }) => (
    <div className="bg-primary p-4 rounded-lg border border-border-color">
        <h4 className="font-semibold text-accent mb-3">Moving Averages (SMA)</h4>
        <div className="space-y-3">
             <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">50-Day MA</span>
                <span className="font-mono font-semibold text-text-primary">{ma.ma50}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">200-Day MA</span>
                <span className="font-mono font-semibold text-text-primary">{ma.ma200}</span>
            </div>
            <p className="text-xs text-text-secondary pt-2 border-t border-border-color">{ma.analysis}</p>
        </div>
    </div>
);

const AiStrategyCard: React.FC<{signal: Signal}> = ({ signal }) => {
    const isSell = signal.signal === 'SELL';
    const cardColor = isSell ? 'border-danger' : 'border-success';
    const textColor = isSell ? 'text-danger' : 'text-success';

    return (
        <div className={`bg-secondary p-6 rounded-xl border ${cardColor} space-y-4 h-full flex flex-col`}>
            <h3 className="font-bold text-text-primary text-lg">AI Generated Strategy</h3>
            <div className="text-center space-y-2">
                <p className={`text-5xl font-bold ${textColor} flex items-center justify-center gap-2`}>
                     {isSell ? 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg> :
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                     }
                    {signal.signal}
                </p>
                <div>
                    <p className="text-lg text-text-secondary">Price: <span className="font-bold text-text-primary">{signal.price}</span></p>
                    <p className="text-xs text-text-secondary/80 flex items-center justify-center gap-1 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Price is indicative and may have delays.
                    </p>
                </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed flex-grow">{signal.analysis}</p>
            <div className="space-y-3 text-sm border-t border-border-color pt-4">
                <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Entry Price</span>
                    <span className="font-mono font-semibold text-text-primary">{signal.entry}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Stop Loss</span>
                    <span className="font-mono font-semibold text-danger">{signal.stopLoss}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Take Profit</span>
                    <span className="font-mono font-semibold text-success">{signal.takeProfit}</span>
                </div>
            </div>
        </div>
    );
};


const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  return (
    <div className="bg-secondary p-4 rounded-xl space-y-4">
        <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold text-text-primary">{signal.assetName}</h2>
            <p className="text-sm text-text-secondary">Generated {timeAgo(signal.timestamp)}</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
                <PriceChart signal={signal} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PivotPointsCard pivots={signal.pivotPoints} />
                    <RsiCard rsi={signal.rsi} />
                    <MovingAveragesCard ma={signal.movingAverages} />
                </div>
            </div>
            <div className="lg:col-span-4">
                <AiStrategyCard signal={signal} />
            </div>
        </div>
       
       {signal.sources && signal.sources.length > 0 && (
         <div className="pt-4 border-t border-border-color">
            <h4 className="font-semibold text-sm mb-2 text-text-secondary">Data Sources</h4>
            <div className="flex flex-wrap gap-2">
                {signal.sources.map((source, index) => (
                    <a 
                        key={index} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-primary text-accent px-2 py-1 rounded-full hover:bg-border-color transition-colors"
                    >
                        {source.title}
                    </a>
                ))}
            </div>
         </div>
       )}
    </div>
  );
};

export default SignalCard;