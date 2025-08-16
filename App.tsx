
import React, { useState, useEffect, useCallback } from 'react';
import { Signal, View } from './types';
import Header from './components/Header';
import SignalGeneratorPage from './components/SignalGeneratorPage';
import SignalHistoryPage from './components/SignalHistoryPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.SIGNALS);
  const [signalHistory, setSignalHistory] = useState<Signal[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('signalHistory');
      if (storedHistory) {
        setSignalHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load signal history from localStorage", error);
    }
  }, []);

  const addSignalToHistory = useCallback((signal: Signal) => {
    setSignalHistory(prevHistory => {
      const newHistory = [signal, ...prevHistory];
      try {
        localStorage.setItem('signalHistory', JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save signal history to localStorage", error);
      }
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSignalHistory([]);
    try {
      localStorage.removeItem('signalHistory');
    } catch (error) {
      console.error("Failed to clear signal history from localStorage", error);
    }
  }, []);


  return (
    <div className="min-h-screen bg-primary font-sans">
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="container mx-auto p-4 md:p-8">
        {currentView === View.SIGNALS && (
          <SignalGeneratorPage addSignalToHistory={addSignalToHistory} />
        )}
        {currentView === View.HISTORY && (
          <SignalHistoryPage signalHistory={signalHistory} clearHistory={clearHistory} />
        )}
      </main>
       <footer className="text-center p-4 text-text-secondary text-sm">
        <p>Disclaimer: This tool is for informational purposes only and not financial advice. Trading involves risk.</p>
      </footer>
    </div>
  );
};

export default App;
