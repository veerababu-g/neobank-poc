import React, { useState, useEffect } from 'react';
import { UserSession, Transaction, TransactionType } from '../types';
import { coreGetCard, coreGetCustomerTransactions } from '../services/coreSystem';
import { gatewayHandleTransaction } from '../services/gatewaySystem';
import { TransactionTable } from '../components/TransactionTable';

interface Props {
  user: UserSession;
}

export const CustomerDashboard: React.FC<Props> = ({ user }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ amount: '', pin: '' });
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  // Initial Data Fetch
  const refreshData = () => {
    if (!user.cardNumber) return;
    const card = coreGetCard(user.cardNumber);
    if (card) setBalance(card.balance);
    const txs = coreGetCustomerTransactions(user.cardNumber);
    setTransactions(txs);
  };

  useEffect(() => {
    refreshData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAction = async (type: TransactionType) => {
    setMessage(null);
    if (!formData.amount || !formData.pin) {
      setMessage({ text: 'Please enter amount and PIN', type: 'error' });
      return;
    }

    setLoading(true);
    
    // Call System 1 (Gateway)
    const response = await gatewayHandleTransaction({
      cardNumber: user.cardNumber!,
      pin: formData.pin,
      amount: parseFloat(formData.amount),
      type: type
    });

    setLoading(false);

    if (response.success) {
      setMessage({ text: 'Transaction Successful!', type: 'success' });
      setFormData({ amount: '', pin: '' });
      refreshData();
    } else {
      setMessage({ text: response.message || 'Transaction Failed', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Balance Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
           <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}</h2>
           <p className="text-gray-400">Manage your finances securely.</p>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
          <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider mb-2">Total Balance</p>
          <div className="text-4xl font-bold text-white font-mono">
             ${balance.toFixed(2)}
          </div>
          <div className="mt-4 text-xs text-indigo-300 font-mono">
            Card: •••• •••• •••• {user.cardNumber?.slice(-4)}
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Transaction Form */}
        <div className="glass-panel p-6 rounded-2xl">
           <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm text-gray-400 mb-2">Amount</label>
               <input 
                 type="number" 
                 value={formData.amount}
                 onChange={(e) => setFormData({...formData, amount: e.target.value})}
                 className="w-full glass-input p-3 rounded-lg"
                 placeholder="0.00"
               />
             </div>
             <div>
               <label className="block text-sm text-gray-400 mb-2">Confirm PIN</label>
               <input 
                 type="password" 
                 value={formData.pin}
                 onChange={(e) => setFormData({...formData, pin: e.target.value})}
                 className="w-full glass-input p-3 rounded-lg"
                 placeholder="Enter 4-digit PIN"
               />
             </div>

             {message && (
               <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                 {message.text}
               </div>
             )}

             <div className="grid grid-cols-2 gap-4 mt-4">
                <button 
                  onClick={() => handleAction(TransactionType.WITHDRAW)}
                  disabled={loading}
                  className="p-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 font-semibold border border-red-500/30 transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Withdraw'}
                </button>
                <button 
                  onClick={() => handleAction(TransactionType.TOPUP)}
                  disabled={loading}
                  className="p-3 rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-200 font-semibold border border-green-500/30 transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Top Up'}
                </button>
             </div>
           </div>
        </div>

        {/* Security Info */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
               </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-200">Secure Processing</h3>
            <p className="text-sm text-gray-400">
              Your transactions are routed through our System 1 Gateway and processed by System 2 Core Banking. 
              Your PIN is secured using <span className="text-blue-400">SHA-256</span> encryption before transmission.
            </p>
        </div>
      </div>

      {/* History */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
};