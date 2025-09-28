import { PayrollInfo } from '../types/payrollTypes';

export const mockPayrollData: PayrollInfo = {
  payStubs: [
    {
      id: 'ps001',
      periodStart: '2025-09-01',
      periodEnd: '2025-09-15',
      payDate: '2025-09-20',
      grossPay: 2500.00,
      netPay: 1800.00,
      deductions: [
        { type: 'Health Insurance', amount: 150.00 },
        { type: '401K', amount: 200.00 },
      ],
      earnings: [
        { type: 'Regular', hours: 80, rate: 25.00, amount: 2000.00 },
        { type: 'Overtime', hours: 10, rate: 37.50, amount: 375.00 },
        { type: 'Bonus', amount: 125.00 },
      ],
      taxes: [
        { type: 'Federal Income Tax', amount: 250.00 },
        { type: 'State Income Tax', amount: 100.00 },
        { type: 'Social Security', amount: 155.00 },
        { type: 'Medicare', amount: 35.00 },
      ],
      ytdGrossPay: 45000.00,
      ytdNetPay: 32000.00,
    },
    {
      id: 'ps002',
      periodStart: '2025-08-16',
      periodEnd: '2025-08-31',
      payDate: '2025-09-05',
      grossPay: 2400.00,
      netPay: 1750.00,
      deductions: [
        { type: 'Health Insurance', amount: 150.00 },
        { type: '401K', amount: 200.00 },
      ],
      earnings: [
        { type: 'Regular', hours: 80, rate: 25.00, amount: 2000.00 },
        { type: 'Bonus', amount: 400.00 },
      ],
      taxes: [
        { type: 'Federal Income Tax', amount: 240.00 },
        { type: 'State Income Tax', amount: 90.00 },
        { type: 'Social Security', amount: 148.80 },
        { type: 'Medicare', amount: 34.80 },
      ],
      ytdGrossPay: 42500.00,
      ytdNetPay: 30200.00,
    },
  ],
  taxDocuments: [
    {
      id: 'td001',
      year: 2024,
      type: 'W2',
      documentUrl: 'https://example.com/tax_docs/w2_2024.pdf',
    },
    {
      id: 'td002',
      year: 2023,
      type: 'W2',
      documentUrl: 'https://example.com/tax_docs/w2_2023.pdf',
    },
    {
      id: 'td003',
      year: 2024,
      type: '1099',
      documentUrl: 'https://example.com/tax_docs/1099_2024.pdf',
    },
  ],
  directDeposits: [
    {
      id: 'dd001',
      bankName: 'Bank of America',
      accountNumber: '******1234',
      routingNumber: '123456789',
      amount: 1000.00,
      status: 'active',
    },
    {
      id: 'dd002',
      bankName: 'Wells Fargo',
      accountNumber: '******5678',
      routingNumber: '987654321',
      amount: 800.00,
      status: 'active',
    },
  ],
  earningsHistory: [
    {
      id: 'eh001',
      year: 2025,
      month: 9,
      grossPay: 2500.00,
      netPay: 1800.00,
    },
    {
      id: 'eh002',
      year: 2025,
      month: 8,
      grossPay: 2400.00,
      netPay: 1750.00,
    },
    {
      id: 'eh003',
      year: 2025,
      month: 7,
      grossPay: 2600.00,
      netPay: 1900.00,
    },
    {
      id: 'eh004',
      year: 2024,
      month: 12,
      grossPay: 2800.00,
      netPay: 2000.00,
    },
  ],
};