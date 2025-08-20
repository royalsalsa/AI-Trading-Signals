
import React, { useState, useMemo, useEffect } from 'react';
import { ASSETS } from '../constants';
import { Asset, AssetCategory } from '../types';

interface WatchlistPageProps {
    watchlist: string[];
    addToWatchlist: (assetName: string) => void;
    removeFromWatchlist: (assetName: string) => void;
}

const WatchlistPage: React.FC<WatchlistPageProps> = ({ watchlist, addToWatchlist, removeFromWatchlist }) => {
    const [assetToAdd, setAssetToAdd] = useState('');

    const availableAssets = useMemo(() => {
        return ASSETS.filter(asset => !watchlist.includes(asset.name));
    }, [watchlist]);

    const groupedAvailableAssets = useMemo(() => {
        return availableAssets.reduce((acc, asset) => {
            const category = asset.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(asset);
            return acc;
        }, {} as Record<AssetCategory, Asset[]>);
    }, [availableAssets]);

    const handleAddAsset = () => {
        if (assetToAdd) {
            addToWatchlist(assetToAdd);
            const remainingAssets = availableAssets.filter(a => a.name !== assetToAdd);
            setAssetToAdd(remainingAssets.length > 0 ? remainingAssets[0].name : '');
        }
    };
    
    useEffect(() => {
        if (availableAssets.length > 0 && !assetToAdd) {
            setAssetToAdd(availableAssets[0].name);
        }
        if(availableAssets.length === 0) {
            setAssetToAdd('');
        }
    }, [availableAssets, assetToAdd]);

    const watchlistWithDetails = useMemo(() => {
        return watchlist.map(name => ASSETS.find(asset => asset.name === name)).filter((asset): asset is Asset => !!asset);
    }, [watchlist]);
    
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary">Your Watchlist</h1>
                <p className="text-text-secondary max-w-2xl mx-auto">Manage your favorite assets for quick analysis from the AI Generator page.</p>
            </div>

            <div className="max-w-xl mx-auto bg-secondary p-4 rounded-xl border border-border-color space-y-3">
                 <h2 className="font-semibold text-text-primary">Add New Asset</h2>
                 <div className="flex gap-2">
                    <div className="relative w-full">
                        <select
                            value={assetToAdd}
                            onChange={(e) => setAssetToAdd(e.target.value)}
                            className="w-full bg-primary border-0 rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-accent appearance-none pr-8"
                            aria-label="Select asset to add to watchlist"
                            disabled={availableAssets.length === 0}
                        >
                            {availableAssets.length === 0 ? (
                                <option>All assets are on your watchlist</option>
                            ) : (
                                Object.entries(groupedAvailableAssets).map(([category, assetsInCategory]) => (
                                    <optgroup key={category} label={category}>
                                        {assetsInCategory.map(asset => (
                                            <option key={asset.name} value={asset.name}>{asset.name}</option>
                                        ))}
                                    </optgroup>
                                ))
                            )}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-secondary">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                    <button
                        onClick={handleAddAsset}
                        disabled={!assetToAdd}
                        className="bg-accent text-white font-semibold rounded-lg px-6 py-2 flex items-center justify-center disabled:bg-opacity-50 disabled:cursor-not-allowed hover:bg-accent-hover transition-colors"
                    >
                        Add
                    </button>
                 </div>
            </div>

            <div className="max-w-4xl mx-auto">
                {watchlistWithDetails.length === 0 ? (
                     <div className="text-center py-16 bg-secondary border border-border-color rounded-xl">
                        <p className="text-text-secondary">Your watchlist is empty.</p>
                        <p className="text-sm text-text-secondary">Add some assets above to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {watchlistWithDetails.map(asset => (
                            <div key={asset.name} className="bg-secondary p-4 rounded-xl border border-border-color flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-text-primary">{asset.name}</p>
                                    <p className="text-xs bg-primary text-text-secondary px-2 py-0.5 rounded-full inline-block mt-1">{asset.category}</p>
                                </div>
                                <button 
                                    onClick={() => removeFromWatchlist(asset.name)}
                                    className="text-text-secondary hover:text-danger p-2 rounded-full hover:bg-danger/10 transition-colors"
                                    aria-label={`Remove ${asset.name} from watchlist`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchlistPage;