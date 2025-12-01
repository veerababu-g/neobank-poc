import React from 'react';
import { Transaction, TransactionStatus } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  showCardNumber?: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, showCardNumber = false }) => {
  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 glass-panel rounded-2xl">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto glass-panel rounded-2xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-gray-400 text-sm">
            <th className="p-4 font-medium">Type</th>
            <th className="p-4 font-medium">Amount</th>
            <th className="p-4 font-medium">Status</th>
            <th className="p-4 font-medium">Date</th>
            {showCardNumber && <th className="p-4 font-medium">Card Number</th>}
            <th className="p-4 font-medium">Details</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {transactions.map((tx) => (
            <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
              <td className="p-4 capitalize flex items-center gap-2">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === 'topup' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {tx.type === 'topup' ? '+' : '-'}
                 </div>
                 {tx.type}
              </td>
              <td className="p-4 font-mono font-semibold">
                ${tx.amount.toFixed(2)}
              </td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  tx.status === TransactionStatus.SUCCESS 
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  {tx.status}
                </span>
              </td>
              <td className="p-4 text-gray-400">
                {new Date(tx.timestamp).toLocaleString()}
              </td>
              {showCardNumber && <td className="p-4 font-mono text-xs">{tx.cardNumber}</td>}
              <td className="p-4 text-gray-400 text-xs italic">
                {tx.reason || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};