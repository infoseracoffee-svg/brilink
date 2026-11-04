export type TransactionType =
  | 'TRANSFER'
  | 'TARIK_TUNAI'
  | 'SETOR_TUNAI'
  | 'PLN_TOKEN'
  | 'PLN_TAGIHAN'
  | 'PULSA_DATA'
  | 'TOPUP_WALLET'
  | 'BPJS_PDAM'
  | 'KAS_KELUAR'
  | 'BON_UTANG';

export type TransactionStatus = 'SUCCESS' | 'PENDING' | 'BON' | 'CANCELLED';

export type PaymentMethod = 'TUNAI' | 'POTONG_FLOAT' | 'BON_HUTANG';

export interface Transaction {
  id: string;
  refNumber: string;
  timestamp: string;
  type: TransactionType;
  category: string;
  customerName: string;
  customerPhone?: string;
  targetAccount?: string;
  targetBankOrProvider?: string;
  nominal: number;
  adminFee: number;
  costPrice?: number;
  profit: number;
  totalAmount: number;
  cashTendered?: number;
  change?: number;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  tokenCode?: string;
  notes?: string;
}

export interface DebtPayment {
  id: string;
  timestamp: string;
  amount: number;
  note?: string;
}

export interface CustomerDebt {
  id: string;
  customerName: string;
  customerPhone: string;
  address?: string;
  totalDebt: number;
  paidAmount: number;
  remainingDebt: number;
  dueDate: string;
  description: string;
  status: 'UNPAID' | 'PARTIAL' | 'PAID';
  payments: DebtPayment[];
  createdAt: string;
}

export interface CashDenomination {
  k100: number; // Rp 100.000
  k50: number;  // Rp 50.000
  k20: number;  // Rp 20.000
  k10: number;  // Rp 10.000
  k5: number;   // Rp 5.000
  k2: number;   // Rp 2.000
  k1: number;   // Rp 1.000
  koin: number; // Koin / Logam
}

export interface AgentSettings {
  agentName: string;
  agentId: string;
  storeName: string;
  storeAddress: string;
  storePhone: string;
  bankFloatBalance: number;
  cashInHandBalance: number;
  defaultAdminFees: {
    transfer: number;
    tarik: number;
    setor: number;
    pln: number;
    pulsa: number;
    ewallet: number;
  };
  printerPaperWidth: '58mm' | '80mm';
}

export type ViewLayoutMode = 'mobile' | 'pos-tablet' | 'desktop';
export type ActiveTab = 'dashboard' | 'pos' | 'ledger' | 'bon' | 'reconciliation' | 'settings';
