import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Role, UserSession } from '../types';
import { coreGetCard } from '../services/coreSystem';
import { hashPin } from '../utils/crypto';

interface LoginProps {
  onLogin: (session: UserSession) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<Role>(Role.CUSTOMER);
  const [formData, setFormData] = useState({ 
    cardNumber: '', 
    pin: '', 
    username: '', 
    password: '' 
  });
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (role === Role.ADMIN) {
      // Hardcoded Admin Logic as per prompt instructions
      if (formData.username === 'admin' && formData.password === 'admin') {
        onLogin({ role: Role.ADMIN, name: 'Super Administrator' });
      } else {
        setError('Invalid Admin credentials');
      }
    } else {
      // Customer Logic
      if (!formData.cardNumber || !formData.pin) {
        setError('Card number and PIN are required');
        return;
      }

      // 1. Simulate finding the card
      const card = coreGetCard(formData.cardNumber);
      
      if (!card) {
        setError('Card not found');
        return;
      }

      // 2. Validate PIN Hash (Security Check)
      const inputHash = await hashPin(formData.pin);
      if (inputHash === card.pinHash) {
        onLogin({ 
          role: Role.CUSTOMER, 
          name: card.customerName, 
          cardNumber: card.cardNumber 
        });
      } else {
        setError('Invalid PIN');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl animate-fade-in relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
             <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 mb-2">NeoBank</h1>
             <p className="text-gray-400 text-sm">Secure Banking Portal POC</p>
          </div>

          <div className="flex bg-white/5 p-1 rounded-lg mb-6">
            <button 
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === Role.CUSTOMER ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              onClick={() => { setRole(Role.CUSTOMER); setError(''); }}
            >
              Customer
            </button>
            <button 
               className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === Role.ADMIN ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
               onClick={() => { setRole(Role.ADMIN); setError(''); }}
            >
              Super Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {role === Role.CUSTOMER ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Card Number</label>
                  <input 
                    type="text" 
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    placeholder="4123..."
                    className="w-full glass-input p-3 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mt-1">Try: 4123456789012345 (Visa) or 5123... (Other)</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">PIN</label>
                  <input 
                    type="password" 
                    value={formData.pin}
                    onChange={(e) => setFormData({...formData, pin: e.target.value})}
                    placeholder="****"
                    className="w-full glass-input p-3 rounded-xl"
                  />
                  <p className="text-xs text-gray-500 mt-1">Try: 1234</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Username</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    placeholder="admin"
                    className="w-full glass-input p-3 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Password</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="admin"
                    className="w-full glass-input p-3 rounded-xl"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02]">
              Access Dashboard
            </button>
            
            {role === Role.CUSTOMER && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-400">
                  New to NeoBank?{' '}
                  <Link to="/register" className="text-blue-300 font-medium hover:text-white transition-colors">
                    Open an account
                  </Link>
                </p>
              </div>
            )}
          </form>

          {/* Demo Login Buttons */}
          <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-center text-gray-500 mb-4 uppercase tracking-widest">Demo Quick Access</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRole(Role.CUSTOMER);
                    setFormData({ ...formData, cardNumber: '4123456789012345', pin: '1234' });
                    setError('');
                  }}
                  className="py-2 px-4 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 text-xs font-medium transition-colors border border-blue-500/20"
                >
                  Fill Customer (Visa)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole(Role.ADMIN);
                    setFormData({ ...formData, username: 'admin', password: 'admin' });
                    setError('');
                  }}
                  className="py-2 px-4 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-medium transition-colors border border-purple-500/20"
                >
                  Fill Admin
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};