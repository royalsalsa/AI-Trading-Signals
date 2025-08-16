
import React from 'react';
import { Signal } from '../types';
import SignalCard from './SignalCard';

interface SignalHistoryPageProps {
  signalHistory: Signal[];
  clearHistory: () => void;
}

const SignalHistoryPage: React.FC<SignalHistoryPageProps> = ({ signalHistory, clearHistory }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-text-primary">Signal History</h2>
        {signalHistory.length > 0 && (
          <button 
            onClick={clearHistory}
            className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
          >
            Clear History
          </button>
        )}
      </div>

      {signalHistory.length === 0 ? (
        <div className="text-center py-16 bg-secondary border border-border-color rounded-xl">
          <p className="text-text-secondary">No signals generated yet.</p>
          <p className="text-sm text-text-secondary">Go to the 'Real-time' tab to get your first AI signal.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {signalHistory.map((signal, index) => (
            <SignalCard key={`${signal.timestamp}-${index}`} signal={signal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SignalHistoryPage;
