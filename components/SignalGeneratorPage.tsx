
import React, { useState, useMemo, useEffect } from 'react';
import { Asset, Signal, AssetCategory } from '../types';
import { ASSETS } from '../constants';
import { generateTradingSignal } from '../services/geminiService';
import Loader from './Loader';
import SignalCard from './SignalCard';

interface SignalGeneratorPageProps {
  addSignalToHistory: (signal: Signal) => void;
  watchlist: string[];
  addToWatchlist: (assetName: string) => void;
  removeFromWatchlist: (assetName: string) => void;
}

const HeroIllustration: React.FC = () => (
    <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#0A192F" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#93C5FD"/>
                <stop offset="100%" stopColor="#3B82F6"/>
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <path d="M0 100 H400 M0 200 H400 M100 0 V300 M200 0 V300 M300 0 V300" stroke="#172A46" strokeWidth="1"/>
        <circle cx="200" cy="150" r="80" fill="url(#grad1)"/>
        <circle cx="200" cy="150" r="30" fill="url(#grad2)" filter="url(#glow)"/>
        <path d="M200 150 L50 50" stroke="#233554" strokeWidth="2"/>
        <path d="M200 150 L100 250" stroke="#233554" strokeWidth="2"/>
        <path d="M200 150 L350 80" stroke="#233554" strokeWidth="2"/>
        <path d="M200 150 L320 230" stroke="#233554" strokeWidth="2"/>
        <circle cx="50" cy="50" r="8" fill="#172A46" stroke="#3B82F6" strokeWidth="2"/>
        <circle cx="100" cy="250" r="8" fill="#172A46" stroke="#3B82F6" strokeWidth="2"/>
        <circle cx="350" cy="80" r="8" fill="#172A46" stroke="#3B82F6" strokeWidth="2"/>
        <circle cx="320" cy="230" r="8" fill="#172A46" stroke="#3B82F6" strokeWidth="2"/>
        <path d="M30 200 C80 180, 120 220, 150 200" stroke="url(#grad2)" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <polyline points="250,180 270,160 290,190 310,170 330,200" stroke="url(#grad2)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7"/>
    </svg>
);


const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const SignalGeneratorPage: React.FC<SignalGeneratorPageProps> = ({ addSignalToHistory, watchlist, addToWatchlist, removeFromWatchlist }) => {
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (!selectedAsset) {
        if (watchlist.length > 0) {
            setSelectedAsset(watchlist[0]);
        } else {
            setSelectedAsset('Bitcoin (BTCUSD)'); // Fallback
        }
    }
  }, [watchlist, selectedAsset]);

  const assets: Asset[] = useMemo(() => ASSETS, []);

  const groupedAssets = useMemo(() => {
    return assets.reduce((acc, asset) => {
        const category = asset.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(asset);
        return acc;
    }, {} as Record<AssetCategory, Asset[]>);
  }, [assets]);

  const filteredGroupedAssets = useMemo(() => {
    if (!searchTerm) {
      return groupedAssets;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    const filtered = {} as Record<AssetCategory, Asset[]>;

    for (const category in groupedAssets) {
      const assetsInCategory = groupedAssets[category as AssetCategory];
      const filteredAssets = assetsInCategory.filter(asset =>
        asset.name.toLowerCase().includes(lowercasedFilter)
      );

      if (filteredAssets.length > 0) {
        filtered[category as AssetCategory] = filteredAssets;
      }
    }
    return filtered;
  }, [searchTerm, groupedAssets]);

  const handleGenerateSignal = async () => {
    if (!selectedAsset) return;
    setIsLoading(true);
    setError(null);
    setCurrentSignal(null);

    try {
      const signal = await generateTradingSignal(selectedAsset);
      setCurrentSignal(signal);
      addSignalToHistory(signal);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const isWatchlisted = useMemo(() => watchlist.includes(selectedAsset), [watchlist, selectedAsset]);
  
  const toggleWatchlist = () => {
    if (isWatchlisted) {
        removeFromWatchlist(selectedAsset);
    } else {
        addToWatchlist(selectedAsset);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
       <div className="w-full flex flex-col-reverse md:flex-row items-center justify-between gap-8 text-center md:text-left animate-fade-in mb-6">
          <div className="md:w-1/2 space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">AI-Powered Trading Analysis</h1>
              <p className="text-lg text-text-secondary max-w-lg mx-auto md:mx-0">
                  Select an asset from the controls below to generate a real-time technical analysis and an actionable trading strategy.
              </p>
          </div>
          <div className="md:w-1/2 w-full max-w-sm md:max-w-none">
              <HeroIllustration />
          </div>
      </div>

       {watchlist.length > 0 && (
        <div className="w-full max-w-2xl">
            <h4 className="text-sm font-semibold text-text-secondary mb-2 text-left">Quick Access Watchlist</h4>
            <div className="flex flex-wrap gap-2">
                {watchlist.map(assetName => (
                    <button 
                        key={assetName}
                        onClick={() => setSelectedAsset(assetName)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${selectedAsset === assetName ? 'bg-accent/20 text-accent-light border-accent' : 'bg-secondary text-text-secondary border-border-color hover:border-accent-light'}`}
                    >
                        {assetName}
                    </button>
                ))}
            </div>
        </div>
      )}


       <div className="bg-secondary/50 p-2 rounded-xl border border-border-color w-full max-w-2xl space-y-2">
         <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-text-secondary" />
            </div>
            <input
                type="text"
                placeholder="Search for an asset..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-primary border-0 rounded-lg p-3 pl-10 text-text-primary focus:ring-2 focus:ring-accent"
                aria-label="Search for an asset"
            />
         </div>
         <div className="flex flex-col md:flex-row gap-2 items-center">
            <div className="relative w-full md:flex-1 flex items-center gap-2">
                <div className="relative flex-grow">
                    <select 
                        id="asset" 
                        value={selectedAsset} 
                        onChange={e => setSelectedAsset(e.target.value)} 
                        className="w-full bg-primary border-0 rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-accent appearance-none pr-8"
                        aria-label="Select asset"
                    >
                      {Object.keys(filteredGroupedAssets).length > 0 ? (
                        Object.entries(filteredGroupedAssets).map(([category, assetsInCategory]) => (
                            <optgroup key={category} label={category}>
                                {assetsInCategory.map(asset => (
                                    <option key={asset.name} value={asset.name}>{asset.name}</option>
                                ))}
                            </optgroup>
                        ))
                      ) : (
                        <option disabled>No assets found</option>
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
                 <button
                    onClick={toggleWatchlist}
                    className="p-3 bg-primary rounded-lg text-text-secondary hover:text-accent-light focus:ring-2 focus:ring-accent transition-colors"
                    aria-label={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                    title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isWatchlisted ? '#8AB4F8' : 'currentColor'}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </button>
            </div>
          <button
            onClick={handleGenerateSignal}
            disabled={isLoading || !selectedAsset || Object.keys(filteredGroupedAssets).length === 0}
            className="w-full md:w-auto bg-accent text-white font-semibold rounded-lg px-6 py-3 h-12 flex items-center justify-center disabled:bg-opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors"
          >
            {isLoading ? <Loader /> : 'Generate'}
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-5xl mt-8 min-h-[400px] flex items-center justify-center">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <Loader />
                <p className="mt-4 text-text-secondary">Generating AI Strategy...</p>
                <p className="text-sm text-text-secondary">This may take a moment.</p>
            </div>
        ) : error ? (
            <div className="bg-danger/10 border border-danger text-danger p-4 rounded-lg max-w-2xl mx-auto">
                <p className="font-semibold">An Error Occurred</p>
                <p>{error}</p>
            </div>
        ) : currentSignal ? (
            <div className="animate-fade-in w-full">
                <SignalCard signal={currentSignal} isLive={true} />
            </div>
        ) : null}
      </div>
    </div>
  );
};

export default SignalGeneratorPage;