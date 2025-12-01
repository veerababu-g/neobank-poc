export enum Role {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum TransactionType {
  WITHDRAW = 'withdraw',
  TOPUP = 'topup',
}

export enum TransactionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface Card {
  cardNumber: string;
  pinHash: string; // Stored securely as hash
  balance: number;
  customerName: string;
}

export interface Transaction {
  id: string;
  cardNumber: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  status: TransactionStatus;
  reason?: string; // Failure reason
}

export interface TransactionRequest {
  cardNumber: string;
  pin: string; // Raw PIN passed from UI, hashed before check
  amount: number;
  type: TransactionType;
}

export interface UserSession {
  role: Role;
  cardNumber?: string; // Only for customers
  name: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}