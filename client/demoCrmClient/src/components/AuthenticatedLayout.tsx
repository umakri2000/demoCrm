import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Users, Menu, X } from 'lucide-react';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'customers';
  onNavigate: (view: 'dashboard' | 'customers') => void;
}

export var AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ children, currentView, onNavigate }) => {
  var { user, logout } = useAuth();
  var [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  var handleNavClick = (view: 'dashboard' | 'customers') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex items-end gap-1.5 h-6">
                <span className="w-1.5 h-3.5 bg-blue-600 rounded-[1px]"></span>
                <span className="w-1.5 h-5 bg-blue-600 rounded-[1px]"></span>
                <span className="w-1.5 h-4 bg-blue-600 rounded-[1px]"></span>
              </div>
              <span className="text-[18px] font-bold text-slate-900 tracking-tight hidden sm:block">CRM</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'dashboard'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('customers')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'customers'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <Users className="w-4 h-4" />
                Customers
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg py-1.5 px-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-950">{user?.name}</p>
                <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>

            <button
              onClick={logout}
              type="button"
              className="hidden md:flex items-center gap-2 py-2 px-3 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 rounded-lg text-sm transition-colors cursor-pointer font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white absolute w-full shadow-lg">
            <nav className="flex flex-col p-4 gap-2">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`p-3 rounded-lg text-sm font-medium flex items-center gap-3 text-left ${currentView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                  }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
              </button>
              <button
                onClick={() => handleNavClick('customers')}
                className={`p-3 rounded-lg text-sm font-medium flex items-center gap-3 text-left ${currentView === 'customers' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                  }`}
              >
                <Users className="w-5 h-5" />
                Customers
              </button>
              <div className="h-px bg-slate-100 my-2"></div>
              <button
                onClick={logout}
                className="p-3 rounded-lg text-sm font-medium flex items-center gap-3 text-left text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </div>
  );
};
