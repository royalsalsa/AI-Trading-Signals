import React, { useState, useEffect } from 'react';

interface LivePriceProps {
  initialPrice: string;
}

const LivePrice: React.FC<LivePriceProps> = ({ initialPrice }) => {
  const [price, setPrice] = useState<number | null>(null);
  const [direction, setDirection] = useState<'up' | 'down' | 'none'>('none');

  useEffect(() => {
    const parsedPrice = parseFloat(initialPrice.replace(/[^0-9.-]+/g, ''));
    if (!isNaN(parsedPrice)) {
      setPrice(parsedPrice);
    }
  }, [initialPrice]);

  useEffect(() => {
    if (price === null) return;

    const interval = setInterval(() => {
      setPrice(prevPrice => {
        if (prevPrice === null) return null;
        
        // Simulate a realistic tick size
        const volatility = prevPrice * 0.00005; 
        const change = (Math.random() - 0.5) * volatility * 2;
        const newPrice = prevPrice + change;

        if (newPrice > prevPrice) {
          setDirection('up');
        } else if (newPrice < prevPrice) {
          setDirection('down');
        } else {
          setDirection('none');
        }
        
        return newPrice;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [price]);
  
  const getDecimals = (p: number) => {
    if (p > 1000) return 2; // e.g., Indices
    if (p > 10) return 3; // e.g., Commodities
    return 5; // e.g., Forex
  }

  const colorClass = direction === 'up' ? 'text-success' : direction === 'down' ? 'text-danger' : 'text-text-primary';
  const priceDisplay = price !== null ? price.toFixed(getDecimals(price)) : '...';

  return (
    <div className="bg-primary p-4 rounded-xl border border-border-color animate-pulse-bg">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-text-secondary">Live Price</span>
        <div className={`text-2xl font-bold transition-colors duration-300 ${colorClass}`}>
          {priceDisplay}
        </div>
      </div>
    </div>
  );
};

export default LivePrice;
