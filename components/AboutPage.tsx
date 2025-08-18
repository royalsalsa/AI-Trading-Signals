
import React from 'react';

const AboutPill: React.FC = () => (
    <div className="inline-flex items-center gap-2 bg-secondary border border-border-color px-3 py-1 rounded-full text-sm text-text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        About Us
    </div>
);

const FeaturedLogo: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="text-2xl font-semibold text-text-secondary opacity-70 hover:opacity-100 transition-opacity">
        {children}
    </div>
);

const AboutPage: React.FC = () => {
    return (
        <div className="relative text-center py-20 md:py-32 px-4 space-y-12 animate-fade-in">
             <div 
                className="absolute inset-0 -z-10" 
                style={{
                    backgroundImage: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, rgba(5, 7, 15, 0) 60%)'
                }}
            />

            <div className="space-y-6">
                <AboutPill />
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-text-primary">
                    Discover AI Signals
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-text-secondary">
                    Explore our core principles, mission, vision, and team.
                </p>
            </div>

            <div className="space-y-8">
                <p className="text-sm text-text-secondary tracking-widest uppercase">As featured in</p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                    <FeaturedLogo>Nasdaq</FeaturedLogo>
                    <FeaturedLogo>CoinDesk</FeaturedLogo>
                    <FeaturedLogo>Forbes</FeaturedLogo>
                    <FeaturedLogo>Medium</FeaturedLogo>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
