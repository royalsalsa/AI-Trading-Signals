import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const AILogo: React.FC<{className?: string}> = ({className}) => (
    <div className={`flex items-center gap-2 ${className}`}>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="url(#logo-gradient)"/>
            {/* A */}
            <path d="M14 9 L10 23 H12.5 L13.25 21 H14.75 L15.5 23 H18 Z" fill="white"/>
            {/* I */}
            <path d="M19 23 V9 H22 V23 H19 Z" fill="white"/>
            <defs>
                <linearGradient id="logo-gradient" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3B82F6"/>
                    <stop offset="1" stopColor="#6366F1"/>
                </linearGradient>
            </defs>
        </svg>
        <span className="text-2xl font-bold text-text-primary">signals</span>
    </div>
);


const NavItem: React.FC<{label: string; isActive: boolean; onClick: () => void}> = ({ label, isActive, onClick }) => {
    return (
        <button onClick={onClick} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
            {label}
        </button>
    )
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-primary/80 backdrop-blur-sm border-b border-border-color sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <AILogo />
          
          <div className="flex items-center gap-2">
             <nav className="hidden md:flex items-center gap-2">
                <NavItem label="About Us" isActive={currentView === View.ABOUT} onClick={() => setCurrentView(View.ABOUT)} />
                <span className="text-text-secondary">&#183;</span>
                <NavItem label="Signals" isActive={currentView === View.SIGNALS} onClick={() => setCurrentView(View.SIGNALS)} />
                <span className="text-text-secondary">&#183;</span>
                <NavItem label="History" isActive={currentView === View.HISTORY} onClick={() => setCurrentView(View.HISTORY)} />
             </nav>
             <div className="md:hidden">
                <select 
                    onChange={(e) => setCurrentView(e.target.value as View)} 
                    value={currentView}
                    className="bg-secondary border border-border-color rounded-md px-2 py-1 text-sm"
                >
                    <option value={View.ABOUT}>About Us</option>
                    <option value={View.SIGNALS}>Signals</option>
                    <option value={View.HISTORY}>History</option>
                </select>
             </div>
             <button className="ml-4 px-4 py-2 text-sm font-semibold text-text-primary bg-secondary hover:bg-border-color border border-border-color rounded-lg transition-colors">
                Get access
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;