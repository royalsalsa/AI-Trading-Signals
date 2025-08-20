import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-8 px-4 text-xs text-text-secondary space-y-4">
      <div className="space-y-1">
        <p className="font-semibold text-text-primary">Ai Signals Intelligent Risk Control Center</p>
        <p>Global intelligent trading ecosystem, help you rationally deal with every fluctuation in the market!</p>
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-text-primary">Disclaimer:</p>
        <p className="max-w-3xl mx-auto">
          All content provided in this app is for learning and reference purposes only and does not constitute any investment advice or trading guidelines. Users should make their own judgement and bear the risks arising from the use of the content.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
