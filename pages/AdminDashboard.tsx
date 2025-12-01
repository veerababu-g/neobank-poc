import React, { useState, useEffect } from 'react';
import { Transaction } from '../types';
import { coreGetAllTransactions } from '../services/coreSystem';
import { TransactionTable } from '../components/TransactionTable';

export const AdminDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const refreshData = () => {
    setTransactions([...coreGetAllTransactions()]);
  };

  useEffect(() => {
    refreshData();
    // Simulate real-time updates
    const interval = setInterval(refreshData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Global Monitoring</h2>
          <p className="text-gray-400">Super Admin access to Core Banking logs.</p>
        </div>
        <button 
          onClick={refreshData}
          className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Logs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="glass-panel p-6 rounded-2xl border-t-4 border-blue-500">
            <h4 className="text-gray-400 text-sm uppercase">Total Transactions</h4>
            <div className="text-3xl font-bold mt-2">{transactions.length}</div>
         </div>
         <div className="glass-panel p-6 rounded-2xl border-t-4 border-green-500">
            <h4 className="text-gray-400 text-sm uppercase">Success Rate</h4>
            <div className="text-3xl font-bold mt-2">
              {transactions.length > 0 
                ? ((transactions.filter(t => t.status === 'SUCCESS').length / transactions.length) * 100).toFixed(1)
                : 0}%
            </div>
         </div>
         <div className="glass-panel p-6 rounded-2xl border-t-4 border-red-500">
            <h4 className="text-gray-400 text-sm uppercase">Failed Attempts</h4>
            <div className="text-3xl font-bold mt-2">
              {transactions.filter(t => t.status === 'FAILED').length}
            </div>
         </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Live Transaction Log</h3>
        <TransactionTable transactions={transactions} showCardNumber={true} />
      </div>
    </div>
  );
};