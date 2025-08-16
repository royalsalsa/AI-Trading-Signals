
import React, { useState, useMemo } from 'react';
import { AssetCategory, Signal } from '../types';
import { ASSETS } from '../constants';
import { generateTradingSignal } from '../services/geminiService';
import Loader from './Loader';
import SignalCard from './SignalCard';

interface SignalGeneratorPageProps {
  addSignalToHistory: (signal: Signal) => void;
}

const SignalGeneratorPage: React.FC<SignalGeneratorPageProps> = ({ addSignalToHistory }) => {
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>(AssetCategory.FOREX);
  const [selectedAsset, setSelectedAsset] = useState<string>(ASSETS.find(a => a.category === AssetCategory.FOREX)?.name || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);

  const filteredAssets = useMemo(() => ASSETS.filter(asset => asset.category === selectedCategory), [selectedCategory]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as AssetCategory;
    setSelectedCategory(newCategory);
    const firstAssetInNewCategory = ASSETS.find(a => a.category === newCategory)?.name || '';
    setSelectedAsset(firstAssetInNewCategory);
  };

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

  const selectClasses = "w-full bg-secondary border border-border-color rounded-lg p-3 text-text-primary focus:ring-accent focus:border-accent transition";

  return (
    <div className="space-y-8">
      <div className="bg-secondary p-6 rounded-xl border border-border-color shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-text-primary">Generate New Signal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-text-secondary">Asset Category</label>
            <select id="category" value={selectedCategory} onChange={handleCategoryChange} className={selectClasses}>
              {Object.values(AssetCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label htmlFor="asset" className="text-sm font-medium text-text-secondary">Select Asset</label>
            <select id="asset" value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)} className={selectClasses}>
              {filteredAssets.map(asset => (
                <option key={asset.name} value={asset.name}>{asset.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerateSignal}
            disabled={isLoading}
            className="w-full bg-accent text-white font-semibold rounded-lg p-3 h-12 flex items-center justify-center disabled:bg-opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
          >
            {isLoading ? <Loader /> : 'Get AI Signal'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-danger/20 border border-danger text-danger p-4 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {currentSignal && (
        <div className="animate-fade-in">
          <SignalCard signal={currentSignal} />
        </div>
      )}
    </div>
  );
};

export default SignalGeneratorPage;
