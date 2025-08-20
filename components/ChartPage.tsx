
import React from 'react';
import { Signal } from '../types';
import SignalCard from './SignalCard';

interface ChartPageProps {
  signalHistory: Signal[];
}

const ChartPage: React.FC<ChartPageProps> = ({ signalHistory }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-text-primary">Signal History</h2>
      </div>

      {signalHistory.length === 0 ? (
        <div className="text-center py-16 bg-secondary border border-border-color rounded-xl">
          <p className="text-text-secondary">No signals generated yet.</p>
          <p className="text-sm text-text-secondary">Go to the 'AI' tab to get your first signal.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {signalHistory.map((signal, index) => (
            <SignalCard key={`${signal.updateTime}-${index}`} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChartPage;
