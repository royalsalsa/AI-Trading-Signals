import React, { useState, useEffect, useCallback } from 'react';
import { getFinancialNews } from '../services/geminiService';
import { NewsArticle } from '../types';
import Loader from './Loader';

const categories = ['All', 'Forex', 'Crypto', 'Indices', 'Commodities'];

const NewsCardSkeleton: React.FC = () => (
    <div className="bg-secondary p-6 rounded-xl border border-border-color animate-pulse">
        <div className="h-4 bg-primary rounded w-3/4 mb-4"></div>
        <div className="space-y-2">
            <div className="h-3 bg-primary rounded w-full"></div>
            <div className="h-3 bg-primary rounded w-5/6"></div>
            <div className="h-3 bg-primary rounded w-full"></div>
        </div>
        <div className="h-3 bg-primary rounded w-1/4 mt-6"></div>
    </div>
);

const NewsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async (category: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedNews = await getFinancialNews(category);
            setNews(fetchedNews);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
            setNews([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNews(selectedCategory);
    }, [selectedCategory, fetchNews]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => <NewsCardSkeleton key={i} />)}
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-danger/10 border border-danger text-danger p-4 rounded-lg max-w-2xl mx-auto text-center">
                    <p className="font-semibold">Failed to Load News</p>
                    <p>{error}</p>
                </div>
            );
        }

        if (news.length === 0) {
            return (
                <div className="text-center py-16 bg-secondary border border-border-color rounded-xl">
                    <p className="text-text-secondary">No news articles found for this category.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article, index) => (
                    <a 
                        href={article.url} 
                        key={`${index}-${article.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-secondary p-6 rounded-xl border border-border-color hover:border-accent-light transition-colors group"
                        aria-label={`Read article: ${article.title}`}
                    >
                        <div className="flex flex-col h-full space-y-3">
                            <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-light transition-colors">{article.title}</h3>
                            <p className="text-sm text-text-secondary leading-relaxed flex-grow">{article.snippet}</p>
                            <p className="text-xs text-text-secondary/80 font-semibold pt-3 border-t border-border-color">{article.sourceName}</p>
                        </div>
                    </a>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-bold text-text-primary">Financial News Feed</h1>
                <p className="text-text-secondary max-w-2xl mx-auto">Your real-time source for market-moving news, powered by AI analysis of the latest web results.</p>
            </div>

            <div className="flex justify-center flex-wrap gap-2 md:gap-3">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors border ${
                            selectedCategory === category
                                ? 'bg-accent/20 text-accent-light border-accent'
                                : 'bg-secondary text-text-secondary border-transparent hover:bg-border-color hover:text-text-primary'
                        }`}
                        aria-pressed={selectedCategory === category}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default NewsPage;