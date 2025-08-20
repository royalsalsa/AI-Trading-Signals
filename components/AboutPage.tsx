import React, { useMemo } from 'react';
import { DataSource } from '../types';
import { INITIAL_DATA_SOURCES } from '../constants';

const AboutPill: React.FC = () => (
    <div className="inline-flex items-center gap-2 bg-secondary border border-border-color px-3 py-1 rounded-full text-sm text-text-secondary">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Profile & About
    </div>
);

const FeaturedLogo: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <div className="text-base font-semibold text-text-secondary opacity-70 hover:opacity-100 transition-opacity">
        {children}
    </div>
);

const SectionTitle: React.FC<{children: React.ReactNode}> = ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight">{children}</h2>
);

const FeatureCard: React.FC<{icon: React.ReactNode; title: string; children: React.ReactNode}> = ({ icon, title, children }) => (
    <div className="bg-secondary p-6 rounded-xl border border-border-color text-left space-y-3">
        <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg border border-border-color">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        </div>
        <p className="text-text-secondary">{children}</p>
    </div>
);

const TeamMemberCard: React.FC<{name: string; role: string; imageUrl: string; children: React.ReactNode}> = ({ name, role, imageUrl, children }) => (
     <div className="bg-secondary p-6 rounded-xl border border-border-color text-center space-y-3">
        <img src={imageUrl} alt={`Photo of ${name}`} className="w-24 h-24 rounded-full mx-auto border-2 border-border-color object-cover" />
        <div>
            <h4 className="text-lg font-bold text-text-primary">{name}</h4>
            <p className="text-accent-light font-medium">{role}</p>
        </div>
        <p className="text-sm text-text-secondary">{children}</p>
    </div>
);

const formatHostname = (hostname: string): string => {
    let name = hostname.replace(/^www\./, '');
    const parts = name.split('.');
    if (parts.length > 1) {
        name = parts.slice(0, -1).join('.');
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
};

interface AboutPageProps {
    featuredSites: DataSource[];
}

const AboutPage: React.FC<AboutPageProps> = ({ featuredSites }) => {
    const allFeaturedSites = useMemo(() => {
        const siteMap = new Map<string, {name: string, url: string}>();

        INITIAL_DATA_SOURCES.forEach(site => {
            try {
                const hostname = new URL(site.url).hostname.replace(/^www\./, '');
                siteMap.set(hostname, site);
            } catch {}
        });

        featuredSites.forEach(site => {
            try {
                const hostname = new URL(site.url).hostname.replace(/^www\./, '');
                if (!siteMap.has(hostname)) {
                    const name = (site.name && site.name !== 'Unknown Source') ? site.name : formatHostname(hostname);
                    siteMap.set(hostname, { name, url: site.url });
                }
            } catch {}
        });

        return Array.from(siteMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [featuredSites]);

    return (
        <div className="max-w-5xl mx-auto py-16 md:py-24 px-4 space-y-24 animate-fade-in">
            {/* Hero Section */}
            <div className="relative text-center space-y-6">
                <AboutPill />
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-text-primary">
                    Powering Smarter Trading
                </h1>
                <p className="max-w-2xl mx-auto text-lg text-text-secondary">
                    AI Signals is a premium AI-powered trading analysis tool providing real-time market analysis and trading signals for Forex, Commodities, Indices, and Crypto.
                </p>
            </div>

            {/* Core Principles */}
            <div className="space-y-8 text-center">
                <SectionTitle>Our Core Principles</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M12 12l-2 2-2-2m4 4l2-2 2 2" /></svg>}
                        title="Data-Driven Decisions"
                    >
                        We harness the power of Google's latest AI models to analyze vast amounts of real-time market data, ensuring our signals are based on comprehensive analysis, not speculation.
                    </FeatureCard>
                    <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        title="Cutting-Edge Technology"
                    >
                        Our platform is built on state-of-the-art technology, providing fast, reliable, and actionable insights. We are committed to continuous innovation to keep our users ahead of the curve.
                    </FeatureCard>
                     <FeatureCard
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent-light" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                        title="User Empowerment"
                    >
                        We believe in empowering traders of all levels. Our intuitive interface and detailed analysis provide the clarity needed to make informed trading decisions with confidence.
                    </FeatureCard>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div className="space-y-4">
                    <SectionTitle>Our Mission</SectionTitle>
                    <p className="text-text-secondary text-lg leading-relaxed">
                        To democratize access to advanced financial market analysis. We strive to provide retail and institutional traders with powerful, AI-driven tools that were once only available to large financial institutions, leveling the playing field for all market participants.
                    </p>
                </div>
                <div className="space-y-4">
                    <SectionTitle>Our Vision</SectionTitle>
                     <p className="text-text-secondary text-lg leading-relaxed">
                        To become the most trusted and indispensable AI co-pilot for traders worldwide. We envision a future where technology and human intuition work in harmony to unlock new opportunities and navigate the complexities of global markets with unparalleled precision.
                    </p>
                </div>
            </div>

            {/* Team Section */}
             <div className="space-y-8 text-center">
                <SectionTitle>Meet the Team</SectionTitle>
                <p className="max-w-2xl mx-auto text-text-secondary">
                    We are a passionate team of developers, data scientists, and financial experts dedicated to revolutionizing the trading landscape.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    <TeamMemberCard name="Osama Salsa" role="Founder & CEO" imageUrl="https://randomuser.me/api/portraits/men/75.jpg">
                        A former quantitative analyst with a vision to make institutional-grade tools accessible to everyone.
                    </TeamMemberCard>
                    <TeamMemberCard name="Maria Garcia" role="Lead AI Engineer" imageUrl="https://randomuser.me/api/portraits/women/75.jpg">
                        The architect behind our predictive models, with a Ph.D. in machine learning and a passion for financial markets.
                    </TeamMemberCard>
                    <TeamMemberCard name="David Chen" role="Head of Product" imageUrl="https://randomuser.me/api/portraits/men/76.jpg">
                        Ensures our platform is intuitive, powerful, and constantly evolving to meet the needs of our users.
                    </TeamMemberCard>
                    <TeamMemberCard name="Sophia Lee" role="Market Analyst" imageUrl="https://randomuser.me/api/portraits/women/76.jpg">
                       Bridges the gap between AI insights and real-world trading strategies, providing expert commentary.
                    </TeamMemberCard>
                </div>
            </div>


            {/* As Featured In Section */}
            <div className="space-y-8 text-center">
                <p className="text-sm text-text-secondary tracking-widest uppercase">As featured in</p>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    {allFeaturedSites.map(site => (
                        <a key={site.url} href={site.url} target="_blank" rel="noopener noreferrer">
                            <FeaturedLogo>{site.name}</FeaturedLogo>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;