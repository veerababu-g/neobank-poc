import { TransactionRequest, ApiResponse, Transaction } from '../types';
import { coreProcessTransaction } from './coreSystem';

// --- GATEWAY API (SYSTEM 1) ---

export const gatewayHandleTransaction = async (req: TransactionRequest): Promise<ApiResponse<Transaction>> => {
  // 1. Basic Validation
  if (!req.cardNumber || !req.pin || !req.amount || !req.type) {
    return { success: false, message: 'Missing required fields' };
  }

  if (req.amount <= 0) {
    return { success: false, message: 'Amount must be positive' };
  }

  if (req.type !== 'withdraw' && req.type !== 'topup') {
    return { success: false, message: 'Invalid transaction type' };
  }

  // 2. ROUTING LOGIC (The Core Requirement)
  // Only route if card starts with '4' (Visa-like)
  if (!req.cardNumber.startsWith('4')) {
    // Log failure at gateway level or just reject
    return { success: false, message: 'Card range not supported (Must start with 4)' };
  }

  // 3. Forward to System 2
  try {
    return await coreProcessTransaction(req);
  } catch (e) {
    return { success: false, message: 'System 2 Communication Error' };
  }
};