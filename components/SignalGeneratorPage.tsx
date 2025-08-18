
import React, { useState, useMemo } from 'react';
import { Asset, Signal, AssetCategory } from '../types';
import { ASSETS } from '../constants';
import { generateTradingSignal } from '../services/geminiService';
import Loader from './Loader';
import SignalCard from './SignalCard';

interface SignalGeneratorPageProps {
  addSignalToHistory: (signal: Signal) => void;
}

const SearchIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const WelcomeIllustration: React.FC = () => (
    <div className="relative mx-auto w-64 h-64 flex items-center justify-center">
        <div className="absolute inset-0 bg-secondary rounded-full" />
        <svg viewBox="0 0 200 200" className="relative w-full h-full">
            {/* Background Rings */}
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" className="text-border-color" fill="none" opacity="0.5" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" className="text-border-color" fill="none" opacity="0.3" strokeDasharray="4 4" />
            
            {/* Abstract financial chart representation */}
            <path d="M 50 120 C 70 140, 90 80, 110 100 S 140 130, 150 110" stroke="#3B82F6" strokeWidth="2" fill="none" />
            
            {/* Signal pulses */}
            <g fill="#3B82F6">
                <circle cx="50" cy="120" r="3" />
                <circle cx="110" cy="100" r="4" />
                <circle cx="150" cy="110" r="3" />
            </g>
            
            {/* Data bars */}
            <rect x="75" y="110" width="8" height="20" fill="#9CA3AF" opacity="0.5" rx="2" />
            <rect x="87" y="95" width="8" height="35" fill="#9CA3AF" opacity="0.5" rx="2" />
            <rect x="99" y="105" width="8" height="25" fill="#9CA3AF" opacity="0.5" rx="2" />
        </svg>
    </div>
);


const SignalGeneratorPage: React.FC<SignalGeneratorPageProps> = ({ addSignalToHistory }) => {
  const [selectedAsset, setSelectedAsset] = useState<string>('Bitcoin (BTCUSD)');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

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
  
  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20">
                <Loader />
                <p className="mt-4 text-text-secondary">Generating AI Strategy...</p>
                <p className="text-sm text-text-secondary">This may take a moment.</p>
            </div>
        );
    }

    if (error) {
         return (
            <div className="bg-danger/10 border border-danger text-danger p-4 rounded-lg max-w-2xl mx-auto">
                <p className="font-semibold">An Error Occurred</p>
                <p>{error}</p>
            </div>
        );
    }
    
    if (currentSignal) {
        return (
             <div className="animate-fade-in w-full">
                <SignalCard signal={currentSignal} />
            </div>
        )
    }

    // Welcome State
    return (
        <div className="text-center space-y-8 animate-fade-in py-12">
            <WelcomeIllustration />
            <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary">AI Strategy Generator</h2>
                <p className="text-text-secondary max-w-xl mx-auto">Select an asset and click 'Analyze' to get a real-time, AI-powered trading strategy.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8">
       <div className="bg-secondary p-2 rounded-xl border border-border-color w-full max-w-lg space-y-2">
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
            <div className="relative w-full md:flex-1">
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
            onClick={handleGenerateSignal}
            disabled={isLoading || !selectedAsset || Object.keys(filteredGroupedAssets).length === 0}
            className="w-full md:w-auto bg-accent text-white font-semibold rounded-lg px-6 py-3 h-12 flex items-center justify-center disabled:bg-opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
          >
            {isLoading ? <Loader /> : 'Analyze & Generate Strategy'}
          </button>
        </div>
      </div>
      
      <div className="w-full max-w-5xl">
        {renderContent()}
      </div>

    </div>
  );
};

export default SignalGeneratorPage;