
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const ChartBarIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
);


const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  const navItemClasses = "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out";
  const activeClasses = "bg-accent text-white";
  const inactiveClasses = "text-text-secondary hover:bg-secondary hover:text-text-primary";

  return (
    <header className="bg-secondary border-b border-border-color sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-accent" />
            <h1 className="text-xl font-bold ml-3 text-text-primary">AI Trading Signals</h1>
          </div>
          <nav className="flex space-x-2 bg-primary p-1 rounded-lg">
            <button
              onClick={() => setCurrentView(View.SIGNALS)}
              className={`${navItemClasses} ${currentView === View.SIGNALS ? activeClasses : inactiveClasses}`}
            >
              Real-time
            </button>
            <button
              onClick={() => setCurrentView(View.HISTORY)}
              className={`${navItemClasses} ${currentView === View.HISTORY ? activeClasses : inactiveClasses}`}
            >
              History
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
