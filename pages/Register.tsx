import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { coreRegisterCustomer } from '../services/coreSystem';
import { Card } from '../types';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', pin: '', confirmPin: '' });
  const [error, setError] = useState('');
  const [successCard, setSuccessCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.pin || !formData.confirmPin) {
      setError('All fields are required');
      return;
    }

    if (formData.pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      setError('PINs do not match');
      return;
    }

    setLoading(true);
    // Simulate network delay for effect
    await new Promise(r => setTimeout(r, 800));

    const response = await coreRegisterCustomer(formData.name, formData.pin);
    
    setLoading(false);

    if (response.success && response.data) {
      setSuccessCard(response.data);
    } else {
      setError(response.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl animate-fade-in relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
             <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200 mb-2">Join NeoBank</h1>
             <p className="text-gray-400 text-sm">Create your secure digital account</p>
          </div>

          {successCard ? (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Account Created!</h3>
                <p className="text-sm text-gray-300">Welcome, {successCard.customerName}</p>
              </div>

              <div className="text-left bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4v10h16V8H4z"/></svg>
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">NeoBank Platinum</p>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400">Card Number</p>
                  <p className="text-xl md:text-2xl font-mono font-bold text-white tracking-wider drop-shadow-md select-all">
                    {successCard.cardNumber}
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-end">
                   <div>
                      <p className="text-xs text-gray-400">Card Holder</p>
                      <p className="text-sm font-medium uppercase">{successCard.customerName}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs text-gray-400">Balance</p>
                      <p className="text-sm font-medium">$0.00</p>
                   </div>
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-200 text-xs text-left">
                <strong>Important:</strong> Please save your Card Number. You will need it along with your PIN to log in.
              </div>

              <Link to="/login" className="block w-full py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Alex Morgan"
                  className="w-full glass-input p-3 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Create PIN (4 Digits)</label>
                <input 
                  type="password" 
                  value={formData.pin}
                  onChange={(e) => setFormData({...formData, pin: e.target.value})}
                  placeholder="****"
                  maxLength={4}
                  className="w-full glass-input p-3 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Confirm PIN</label>
                <input 
                  type="password" 
                  value={formData.confirmPin}
                  onChange={(e) => setFormData({...formData, confirmPin: e.target.value})}
                  placeholder="****"
                  maxLength={4}
                  className="w-full glass-input p-3 rounded-xl"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>

              <div className="text-center mt-6">
                <p className="text-sm text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-white font-medium hover:underline">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};