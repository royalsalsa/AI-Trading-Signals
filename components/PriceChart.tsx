import React, { useEffect, useRef } from 'react';
import {
    createChart,
    CrosshairMode,
    LineStyle,
    type IChartApi,
    type ISeriesApi,
    type IPriceLine,
    type CandlestickData,
} from 'lightweight-charts';
import type { CandleDataPoint, AnalysisResult } from '../types';

interface PriceChartProps {
    data: CandleDataPoint[];
    analysis: AnalysisResult;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, analysis }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<{ 
        chart: IChartApi; 
        series: ISeriesApi<'Candlestick'>; 
        resizeObserver: ResizeObserver;
        priceLines: IPriceLine[];
    } | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current || data.length === 0) {
            return;
        }

        const container = chartContainerRef.current;

        if (!chartInstanceRef.current) {
            const chart = createChart(container, {
                width: container.clientWidth,
                height: container.clientHeight,
                layout: {
                    background: { color: 'transparent' },
                    textColor: '#8892B0', // theme text-secondary
                },
                grid: {
                    vertLines: { color: '#233554' }, // theme border-color
                    horzLines: { color: '#233554' }, // theme border-color
                },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                    borderColor: '#233554', // theme border-color
                },
                crosshair: {
                    mode: CrosshairMode.Normal,
                },
                rightPriceScale: {
                    borderColor: '#233554', // theme border-color
                },
            });
            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#22C55E',       // theme success
                downColor: '#EF4444',     // theme danger
                borderDownColor: '#EF4444',
                borderUpColor: '#22C55E',
                wickDownColor: '#EF4444',
                wickUpColor: '#22C55E',
            });
            
            const resizeObserver = new ResizeObserver(() => {
                 if (container.clientWidth > 0 && container.clientHeight > 0) {
                    chart.resize(container.clientWidth, container.clientHeight);
                 }
            });
            resizeObserver.observe(container);

            chartInstanceRef.current = { chart, series: candlestickSeries, resizeObserver, priceLines: [] };
        }
        
        const { chart, series } = chartInstanceRef.current;

        chartInstanceRef.current.priceLines.forEach(line => series.removePriceLine(line));
        chartInstanceRef.current.priceLines = [];
        
        // Ensure data is sorted by time (which should be a numeric timestamp)
        const sortedData = [...data].sort((a, b) => a.time - b.time);

        series.setData(sortedData as CandlestickData[]);
        chart.timeScale().fitContent();

        const newPriceLines: IPriceLine[] = [];
        const { strategy } = analysis;
        
        const createPriceLine = (value: number, title: string, color: string) => {
             if (value === undefined || value === null || isNaN(value)) return;
             const priceLine = series.createPriceLine({
                price: value,
                color: color,
                lineWidth: 2,
                lineStyle: LineStyle.Dashed,
                axisLabelVisible: true,
                title: title,
            });
            newPriceLines.push(priceLine);
        };
        
        if (strategy.signal !== 'HOLD') {
            createPriceLine(strategy.takeProfit1, 'TP1', '#22c55e');
            createPriceLine(strategy.takeProfit2, 'TP2', '#22c55e');
            createPriceLine(strategy.entryPrice, 'Entry', '#3b82f6');
            createPriceLine(strategy.stopLoss, 'SL', '#ef4444');
        } else {
            createPriceLine(analysis.currentPrice, 'Price', '#93C5FD');
        }
        
        chartInstanceRef.current.priceLines = newPriceLines;
        
    }, [data, analysis]); 

    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                const { chart, resizeObserver } = chartInstanceRef.current;
                resizeObserver.disconnect();
                chart.remove();
                chartInstanceRef.current = null;
            }
        }
    }, []);

    return (
        <div className="bg-secondary border border-border-color p-4 rounded-xl h-[400px] w-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-lg text-text-primary">Price Chart</h3>
                <span className="text-sm font-semibold text-text-secondary bg-primary px-2 py-1 rounded-md border border-border-color">1-Hour Timeframe</span>
            </div>
            <div ref={chartContainerRef} className="flex-1 w-full" />
        </div>
    );
};
