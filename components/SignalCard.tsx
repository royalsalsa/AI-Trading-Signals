
import React from 'react';
import { Signal } from '../types';

interface SignalCardProps {
  signal: Signal;
}

const TrendUpIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const TrendDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
);

const ShieldCheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.917l9 3 9-3a12.02 12.02 0 00-3.382-11.975z" />
    </svg>
);


const SignalCard: React.FC<SignalCardProps> = ({ signal }) => {
  return (
    <div className="bg-secondary border border-border-color rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-accent">{signal.assetName}</h3>
          <p className="text-xs text-text-secondary">{new Date(signal.timestamp).toLocaleString()}</p>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-lg mb-2 text-text-primary">AI Analysis</h4>
        <p className="text-text-secondary text-sm leading-relaxed">{signal.analysis}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-primary p-4 rounded-lg border border-border-color">
            <div className="flex items-center justify-center text-success mb-2">
                <TrendUpIcon className="w-6 h-6 mr-2" />
                <h5 className="font-semibold text-sm text-text-secondary uppercase tracking-wider">Take Profit</h5>
            </div>
            <p className="text-2xl font-bold text-success">{signal.takeProfit}</p>
        </div>
        <div className="bg-primary p-4 rounded-lg border-2 border-accent">
            <h5 className="font-semibold text-sm text-text-secondary uppercase tracking-wider mb-2">Entry Price</h5>
            <p className="text-2xl font-bold text-text-primary">{signal.entry}</p>
        </div>
        <div className="bg-primary p-4 rounded-lg border border-border-color">
            <div className="flex items-center justify-center text-danger mb-2">
                <TrendDownIcon className="w-6 h-6 mr-2" />
                <h5 className="font-semibold text-sm text-text-secondary uppercase tracking-wider">Stop Loss</h5>
            </div>
            <p className="text-2xl font-bold text-danger">{signal.stopLoss}</p>
        </div>
      </div>
       
       {signal.sources && signal.sources.length > 0 && (
         <div>
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
