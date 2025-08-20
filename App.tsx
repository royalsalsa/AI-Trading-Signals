
import React, { useState, useEffect, useCallback } from 'react';
import { Signal, DataSource, View } from './types';
import SignalGeneratorPage from './components/SignalGeneratorPage';
import ChartPage from './components/ChartPage';
import AboutPage from './components/AboutPage';
import NewsPage from './components/NewsPage';
import WatchlistPage from './components/WatchlistPage';
import Header from './components/Header';
import Footer from './components/Footer';
import { INITIAL_WATCHLIST_ASSETS } from './constants';

const App: React.FC = () => {
  const [signalHistory, setSignalHistory] = useState<Signal[]>([]);
  const [featuredSites, setFeaturedSites] = useState<DataSource[]>([]);
  const [currentView, setCurrentView] = useState<View>(View.AI);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('signalHistory');
      if (storedHistory) {
        setSignalHistory(JSON.parse(storedHistory));
      }
      const storedSites = localStorage.getItem('featuredSites');
      if (storedSites) {
        setFeaturedSites(JSON.parse(storedSites));
      }
      const storedWatchlist = localStorage.getItem('watchlist');
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      } else {
        setWatchlist(INITIAL_WATCHLIST_ASSETS);
        localStorage.setItem('watchlist', JSON.stringify(INITIAL_WATCHLIST_ASSETS));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
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

    setFeaturedSites(prevSites => {
        const excludedHosts = ['vertexaisearch.cloud.google.com'];
        const newSources: DataSource[] = signal.sources
            .map(source => {
                try {
                    const url = new URL(source.uri);
                     if (excludedHosts.includes(url.hostname)) {
                        return null;
                    }
                    return {
                        name: source.title,
                        url: source.uri,
                    };
                } catch {
                    return null;
                }
            })
            .filter((source): source is DataSource => source !== null);

        const combinedSources = [...prevSites, ...newSources];
        
        const uniqueSourcesMap = new Map<string, DataSource>();
        combinedSources.forEach(source => {
            try {
                const hostname = new URL(source.url).hostname.replace(/^www\./, '');
                if (!uniqueSourcesMap.has(hostname)) {
                    uniqueSourcesMap.set(hostname, source);
                }
            } catch {}
        });
        
        const uniqueNewSources = Array.from(uniqueSourcesMap.values());

        if (uniqueNewSources.length > prevSites.length) {
            try {
                localStorage.setItem('featuredSites', JSON.stringify(uniqueNewSources));
            } catch (error) {
                console.error("Failed to save featured sites to localStorage", error);
            }
            return uniqueNewSources;
        }

        return prevSites;
    });
  }, []);

  const addToWatchlist = useCallback((assetName: string) => {
    setWatchlist(prev => {
        if (prev.includes(assetName)) return prev;
        const newWatchlist = [...prev, assetName];
        try {
            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
        } catch (error) {
            console.error("Failed to save watchlist to localStorage", error);
        }
        return newWatchlist;
    });
  }, []);

  const removeFromWatchlist = useCallback((assetName: string) => {
    setWatchlist(prev => {
        const newWatchlist = prev.filter(name => name !== assetName);
        try {
            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
        } catch (error) {
            console.error("Failed to save watchlist to localStorage", error);
        }
        return newWatchlist;
    });
  }, []);


  const renderContent = () => {
    switch (currentView) {
        case View.AI:
            return <SignalGeneratorPage 
                addSignalToHistory={addSignalToHistory} 
                watchlist={watchlist}
                addToWatchlist={addToWatchlist}
                removeFromWatchlist={removeFromWatchlist}
            />;
        case View.CHART:
            return <ChartPage signalHistory={signalHistory} />;
        case View.EXPLORE:
            return <NewsPage />;
        case View.WATCHLIST:
            return <WatchlistPage 
                watchlist={watchlist}
                addToWatchlist={addToWatchlist}
                removeFromWatchlist={removeFromWatchlist}
            />;
        case View.PROFILE:
            return <AboutPage featuredSites={featuredSites} />;
        default:
            return <SignalGeneratorPage 
                addSignalToHistory={addSignalToHistory}
                watchlist={watchlist}
                addToWatchlist={addToWatchlist}
                removeFromWatchlist={removeFromWatchlist}
             />;
    }
  };
  
  return (
    <div 
      className="min-h-screen bg-primary font-sans flex flex-col"
      style={{
        backgroundImage: 'linear-gradient(to bottom, #0A192F, #000000)',
      }}
    >
      <Header currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
