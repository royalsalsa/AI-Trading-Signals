import React from 'react';
import { PivotPoints, Rsi, Sma } from '../types';

interface TechnicalIndicatorsProps {
    pivotPoints: PivotPoints;
    rsi: Rsi;
    sma: Sma;
}

const IndicatorBox: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="flex-1 bg-primary p-4 rounded-lg border border-border-color min-w-[200px]">
        <h4 className="font-semibold text-text-secondary mb-3 text-sm">{title}</h4>
        {children}
    </div>
);

const RsiDisplay: React.FC<{ rsi: Rsi }> = ({ rsi }) => {
    const colorClasses: { [key in Rsi['interpretation']]: string } = {
        'Overbought': 'bg-danger/20 text-danger',
        'Oversold': 'bg-success/20 text-success',
        'Neutral': 'bg-accent/20 text-accent-light',
    };
    const interpretationText = rsi.interpretation || 'Neutral';
    const badgeClass = colorClasses[interpretationText] || colorClasses['Neutral'];

    return (
        <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-text-primary">{rsi.value?.toFixed(2)}</span>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}>
                {interpretationText}
            </span>
        </div>
    );
};

const PivotPointsDisplay: React.FC<{ pivots: PivotPoints }> = ({ pivots }) => (
    <div className="space-y-1 text-sm">
        <div className="flex justify-between text-danger/80"><span>Resistance 2 (R2)</span><span>{pivots.r2}</span></div>
        <div className="flex justify-between text-danger/80"><span>Resistance 1 (R1)</span><span>{pivots.r1}</span></div>
        <div className="flex justify-between font-bold text-text-primary"><span>Pivot</span><span>{pivots.pivot}</span></div>
        <div className="flex justify-between text-success/80"><span>Support 1 (S1)</span><span>{pivots.s1}</span></div>
        <div className="flex justify-between text-success/80"><span>Support 2 (S2)</span><span>{pivots.s2}</span></div>
    </div>
);

const SmaDisplay: React.FC<{ sma: Sma }> = ({ sma }) => (
    <div className="space-y-1 text-sm text-text-primary">
        <div className="flex justify-between"><span>SMA 20</span><span>{sma.sma20}</span></div>
        <div className="flex justify-between"><span>SMA 50</span><span>{sma.sma50}</span></div>
        <div className="flex justify-between"><span>SMA 100</span><span>{sma.sma100}</span></div>
    </div>
);


const TechnicalIndicators: React.FC<TechnicalIndicatorsProps> = ({ pivotPoints, rsi, sma }) => {
    return (
        <div className="bg-secondary p-4 rounded-xl border border-border-color space-y-4">
            <h3 className="font-bold text-lg text-text-primary">Technical Indicators</h3>
            <div className="flex flex-col md:flex-row gap-4">
                {rsi && <IndicatorBox title="Relative Strength Index (14)"><RsiDisplay rsi={rsi} /></IndicatorBox>}
                {pivotPoints && <IndicatorBox title="Pivot Points"><PivotPointsDisplay pivots={pivotPoints} /></IndicatorBox>}
                {sma && <IndicatorBox title="Simple Moving Averages"><SmaDisplay sma={sma} /></IndicatorBox>}
            </div>
        </div>
    );
};

export default TechnicalIndicators;
