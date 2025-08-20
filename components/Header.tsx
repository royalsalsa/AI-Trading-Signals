import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

interface NavLinkProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ label, isActive, onClick }) => {
    const baseClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
    const activeClasses = "bg-accent/20 text-accent-light";
    const inactiveClasses = "text-text-secondary hover:text-text-primary hover:bg-secondary";

    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {label}
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-primary/80 backdrop-blur-sm border-b border-border-color sticky top-0 z-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView(View.AI)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.5L13.84 8.16L19.5 10L13.84 11.84L12 17.5L10.16 11.84L4.5 10L10.16 8.16L12 2.5Z" fill="#8AB4F8"/>
                    <path d="M20.5 15.5L19.66 17.66L17.5 18.5L19.66 19.34L20.5 21.5L21.34 19.34L23.5 18.5L21.34 17.66L20.5 15.5Z" fill="#8AB4F8"/>
                </svg>
                <span className="text-xl font-medium text-text-primary">AI Signals</span>
            </div>
            <nav className="hidden md:flex items-center gap-2">
                 <NavLink 
                    label="AI Generator"
                    isActive={currentView === View.AI} 
                    onClick={() => setCurrentView(View.AI)}
                />
                <NavLink 
                    label="History" 
                    isActive={currentView === View.CHART} 
                    onClick={() => setCurrentView(View.CHART)}
                />
                <NavLink 
                    label="News" 
                    isActive={currentView === View.EXPLORE} 
                    onClick={() => setCurrentView(View.EXPLORE)}
                />
                 <NavLink 
                    label="Watchlist" 
                    isActive={currentView === View.WATCHLIST} 
                    onClick={() => setCurrentView(View.WATCHLIST)}
                />
                <NavLink 
                    label="About" 
                    isActive={currentView === View.PROFILE} 
                    onClick={() => setCurrentView(View.PROFILE)}
                />
            </nav>
             <div className="md:hidden">
                 <select 
                    onChange={(e) => setCurrentView(e.target.value as View)} 
                    value={currentView}
                    className="bg-secondary border border-border-color rounded-md px-3 py-2 text-text-primary focus:ring-2 focus:ring-accent appearance-none"
                    aria-label="Navigation"
                >
                    <option value={View.AI}>AI Generator</option>
                    <option value={View.CHART}>History</option>
                    <option value={View.EXPLORE}>News</option>
                    <option value={View.WATCHLIST}>Watchlist</option>
                    <option value={View.PROFILE}>About</option>
                </select>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;