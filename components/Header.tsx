// Implementing the Header component with navigation.
import React from 'react';

interface HeaderProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const NavItem: React.FC<{
  viewName: string;
  activeView: string;
  setActiveView: (view: string) => void;
  children: React.ReactNode;
}> = ({ viewName, activeView, setActiveView, children }) => (
  <button
    onClick={() => setActiveView(viewName)}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      activeView === viewName
        ? 'bg-blue-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`}
  >
    {children}
  </button>
);

export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  return (
    <header className="bg-white shadow-md text-right">
      <div className="container mx-auto px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">سیستەمی بەڕێوەبردنی کلینیک</h1>
        <nav className="flex items-center gap-4">
          <NavItem viewName="statistics" activeView={activeView} setActiveView={setActiveView}>ئامارەکان</NavItem>
          <NavItem viewName="patients" activeView={activeView} setActiveView={setActiveView}>نەخۆشەکان</NavItem>
          <NavItem viewName="doctors" activeView={activeView} setActiveView={setActiveView}>دکتۆرەکان</NavItem>
          <NavItem viewName="visits" activeView={activeView} setActiveView={setActiveView}>سەردانەکان</NavItem>
          <NavItem viewName="medicines" activeView={activeView} setActiveView={setActiveView}>دەرمانەکان</NavItem>
          <NavItem viewName="rooms" activeView={activeView} setActiveView={setActiveView}>ژوورەکان</NavItem>
        </nav>
      </div>
    </header>
  );
};
