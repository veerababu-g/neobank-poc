import { Card, Transaction, TransactionRequest, TransactionStatus, ApiResponse } from '../types';
import { hashPin } from '../utils/crypto';

// --- IN-MEMORY DATABASE SIMULATION ---

// Initial Seed Data
const initialCards: Card[] = [
  {
    cardNumber: '4123456789012345', // Valid Visa-like
    pinHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // Hash of '1234'
    balance: 1000.00,
    customerName: 'John Doe',
  },
  {
    cardNumber: '5123456789012345', // Starts with 5 (Should fail gateway routing)
    pinHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', // Hash of '1234'
    balance: 500.00,
    customerName: 'Jane Smith',
  }
];

let cardsDB: Card[] = [...initialCards];
let transactionsDB: Transaction[] = [];

// --- CORE BANKING OPERATIONS (SYSTEM 2) ---

export const coreRegisterCustomer = async (name: string, pin: string): Promise<ApiResponse<Card>> => {
  // Generate random 15 digits
  const randomDigits = Array.from({ length: 15 }, () => Math.floor(Math.random() * 10)).join('');
  const cardNumber = `4${randomDigits}`; // Ensure it starts with 4 for Visa routing

  // Check collision (highly unlikely in POC, but good practice)
  if (cardsDB.find(c => c.cardNumber === cardNumber)) {
    return coreRegisterCustomer(name, pin); // Retry recursively
  }

  const pinHash = await hashPin(pin);

  const newCard: Card = {
    cardNumber,
    pinHash,
    balance: 0, // Initial balance is 0
    customerName: name,
  };

  cardsDB.push(newCard);
  
  return { success: true, data: newCard, message: 'Account created successfully' };
};

export const coreProcessTransaction = async (req: TransactionRequest): Promise<ApiResponse<Transaction>> => {
  const { cardNumber, pin, amount, type } = req;
  
  // 1. Find Card
  const cardIndex = cardsDB.findIndex(c => c.cardNumber === cardNumber);
  
  const transactionLog: Transaction = {
    id: crypto.randomUUID(),
    cardNumber,
    type,
    amount,
    timestamp: new Date().toISOString(),
    status: TransactionStatus.FAILED,
    reason: ''
  };

  if (cardIndex === -1) {
    transactionLog.reason = 'Invalid Card Number';
    transactionsDB.unshift(transactionLog);
    return { success: false, message: transactionLog.reason, data: transactionLog };
  }

  const card = cardsDB[cardIndex];

  // 2. Validate PIN (Compare Hash)
  const inputHash = await hashPin(pin);
  if (inputHash !== card.pinHash) {
    transactionLog.reason = 'Invalid PIN';
    transactionsDB.unshift(transactionLog);
    return { success: false, message: transactionLog.reason, data: transactionLog };
  }

  // 3. Business Logic (Balance Check)
  if (type === 'withdraw' && card.balance < amount) {
    transactionLog.reason = 'Insufficient Balance';
    transactionsDB.unshift(transactionLog);
    return { success: false, message: transactionLog.reason, data: transactionLog };
  }

  // 4. Update Balance
  const newBalance = type === 'topup' ? card.balance + amount : card.balance - amount;
  
  // Update DB safely
  cardsDB[cardIndex] = { ...card, balance: newBalance };
  
  // 5. Success Log
  transactionLog.status = TransactionStatus.SUCCESS;
  transactionLog.reason = 'Processed Successfully';
  transactionsDB.unshift(transactionLog);

  return { success: true, data: transactionLog };
};

export const coreGetCard = (cardNumber: string): Card | undefined => {
  return cardsDB.find(c => c.cardNumber === cardNumber);
};

export const coreGetAllTransactions = (): Transaction[] => {
  return transactionsDB;
};

export const coreGetCustomerTransactions = (cardNumber: string): Transaction[] => {
  return transactionsDB.filter(t => t.cardNumber === cardNumber);
};