export interface PayStub {
  id: string;
  periodStart: string;
  periodEnd: string;
  payDate: string;
  grossPay: number;
  netPay: number;
  deductions: {
    type: string;
    amount: number;
  }[];
  earnings: {
    type: string;
    hours?: number;
    rate?: number;
    amount: number;
  }[];
  taxes: {
    type: string;
    amount: number;
  }[];
  ytdGrossPay: number;
  ytdNetPay: number;
}

export interface TaxDocument {
  id: string;
  year: number;
  type: 'W2' | '1099' | 'W4';
  documentUrl: string;
}

export interface DirectDeposit {
  id: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  amount: number;
  status: 'active' | 'inactive';
}

export interface EarningsHistoryEntry {
  id: string;
  year: number;
  month: number;
  grossPay: number;
  netPay: number;
}

export interface PayrollInfo {
  payStubs: PayStub[];
  taxDocuments: TaxDocument[];
  directDeposits: DirectDeposit[];
  earningsHistory: EarningsHistoryEntry[];
}