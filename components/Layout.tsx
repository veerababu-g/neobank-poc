import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserSession } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserSession | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar / Navbar */}
      <nav className="w-full md:w-64 glass-panel border-r-0 md:border-r border-b md:border-b-0 border-white/10 p-6 flex flex-col justify-between z-20">
        <div>
          <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-bold text-white text-lg">
              N
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              NeoBank
            </h1>
          </div>
          
          {user && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                <p className="font-semibold truncate">{user.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-200' : 'bg-blue-500/20 text-blue-200'}`}>
                  {user.role}
                </span>
              </div>
            </div>
          )}
        </div>

        {user && (
          <button 
            onClick={onLogout}
            className="mt-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Sign Out
          </button>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};