
import React, { useState, useEffect, useCallback } from 'react';
import { Signal, View } from './types';
import Header from './components/Header';
import SignalGeneratorPage from './components/SignalGeneratorPage';
import SignalHistoryPage from './components/SignalHistoryPage';
import AboutPage from './components/AboutPage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.ABOUT);
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
        {currentView === View.ABOUT && <AboutPage />}
        {currentView === View.SIGNALS && (
          <SignalGeneratorPage addSignalToHistory={addSignalToHistory} />
        )}
        {currentView === View.HISTORY && (
          <SignalHistoryPage signalHistory={signalHistory} clearHistory={clearHistory} />
        )}
      </main>
    </div>
  );
};

export default App;