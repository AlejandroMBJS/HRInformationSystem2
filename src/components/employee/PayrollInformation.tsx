import React, { useState, useEffect, useMemo } from 'react';
import { mockPayrollData } from '../mockData/payrollMockData';
import { PayrollInfo, PayStub, TaxDocument, DirectDeposit, EarningsHistoryEntry } from '../types/payrollTypes';

// Radix UI Imports
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Select from '@radix-ui/react-select';
import * as Tooltip from '@radix-ui/react-tooltip';
import { MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, PlusIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons';

interface PayrollInformationProps {
  // Props can be added here if needed, e.g., userId
}

const PayrollInformation: React.FC<PayrollInformationProps> = () => {
  const [payrollData, setPayrollData] = useState<PayrollInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for Pay Stubs filtering and sorting
  const [payStubSearchTerm, setPayStubSearchTerm] = useState<string>('');
  const [payStubSortKey, setPayStubSortKey] = useState<keyof PayStub>('payDate');
  const [payStubSortDirection, setPayStubSortDirection] = useState<'asc' | 'desc'>('desc');

  // State for Direct Deposit CRUD
  const [isDirectDepositModalOpen, setIsDirectDepositModalOpen] = useState<boolean>(false);
  const [editingDirectDeposit, setEditingDirectDeposit] = useState<DirectDeposit | null>(null);
  const [newDirectDeposit, setNewDirectDeposit] = useState<Omit<DirectDeposit, 'id' | 'status'>>({
    bankName: '',
    accountNumber: '',
    routingNumber: '',
    amount: 0,
  });

  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        setLoading(true);
        setError(null);
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        setPayrollData(mockPayrollData);
      } catch (err) {
        setError('Failed to load payroll data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, []);

  // Filtered and sorted Pay Stubs
  const filteredAndSortedPayStubs = useMemo(() => {
    if (!payrollData?.payStubs) return [];

    let filtered = payrollData.payStubs.filter(stub =>
      stub.periodStart.includes(payStubSearchTerm) ||
      stub.periodEnd.includes(payStubSearchTerm) ||
      stub.payDate.includes(payStubSearchTerm) ||
      stub.grossPay.toFixed(2).includes(payStubSearchTerm) ||
      stub.netPay.toFixed(2).includes(payStubSearchTerm)
    );

    return filtered.sort((a, b) => {
      const aValue = a[payStubSortKey];
      const bValue = b[payStubSortKey];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return payStubSortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return payStubSortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [payrollData?.payStubs, payStubSearchTerm, payStubSortKey, payStubSortDirection]);

  // Direct Deposit CRUD operations
  const handleAddDirectDeposit = () => {
    const newId = `dd${(payrollData?.directDeposits.length || 0) + 1}`;
    const depositToAdd: DirectDeposit = { ...newDirectDeposit, id: newId, status: 'active' };
    setPayrollData(prev => prev ? { ...prev, directDeposits: [...prev.directDeposits, depositToAdd] } : null);
    setNewDirectDeposit({ bankName: '', accountNumber: '', routingNumber: '', amount: 0 });
    setIsDirectDepositModalOpen(false);
  };

  const handleEditDirectDeposit = () => {
    if (!editingDirectDeposit) return;
    setPayrollData(prev => prev ? {
      ...prev,
      directDeposits: prev.directDeposits.map(dd =>
        dd.id === editingDirectDeposit.id ? editingDirectDeposit : dd
      ),
    } : null);
    setEditingDirectDeposit(null);
    setIsDirectDepositModalOpen(false);
  };

  const handleDeleteDirectDeposit = (id: string) => {
    setPayrollData(prev => prev ? {
      ...prev,
      directDeposits: prev.directDeposits.filter(dd => dd.id !== id),
    } : null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
        <p className="text-lg text-gray-600">Loading payroll information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600" role="alert" aria-live="assertive">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  if (!payrollData) {
    return (
      <div className="flex items-center justify-center h-64" role="status" aria-live="polite">
        <p className="text-lg text-gray-600">No payroll data available.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Payroll Information</h1>

      <Tabs.Root className="flex flex-col w-full" defaultValue="paystubs">
        <Tabs.List className="flex border-b border-gray-200" aria-label="Manage your payroll information">
          <Tabs.Trigger
            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-gray-500 select-none first:rounded-tl-md last:rounded-tr-md hover:text-gray-700 data-[state=active]:text-blue-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative outline-none cursor-default"
            value="paystubs"
          >
            Pay Stubs
          </Tabs.Trigger>
          <Tabs.Trigger
            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-gray-500 select-none first:rounded-tl-md last:rounded-tr-md hover:text-gray-700 data-[state=active]:text-blue-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative outline-none cursor-default"
            value="taxdocuments"
          >
            Tax Documents
          </Tabs.Trigger>
          <Tabs.Trigger
            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-gray-500 select-none first:rounded-tl-md last:rounded-tr-md hover:text-gray-700 data-[state=active]:text-blue-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative outline-none cursor-default"
            value="directdeposit"
          >
            Direct Deposit
          </Tabs.Trigger>
          <Tabs.Trigger
            className="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-gray-500 select-none first:rounded-tl-md last:rounded-tr-md hover:text-gray-700 data-[state=active]:text-blue-600 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative outline-none cursor-default"
            value="earningshistory"
          >
            Earnings History
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content className="bg-white p-6 rounded-b-md shadow-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="paystubs">
          <h2 className="text-2xl font-semibold mb-4">Pay Stubs</h2>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search pay stubs..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={payStubSearchTerm}
                onChange={(e) => setPayStubSearchTerm(e.target.value)}
                aria-label="Search pay stubs"
              />
            </div>
            <Select.Root value={payStubSortKey} onValueChange={(value: keyof PayStub) => setPayStubSortKey(value)}>
              <Select.Trigger
                className="flex items-center justify-between gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Sort by"
              >
                <Select.Value placeholder="Sort by..." />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white rounded-md shadow-lg z-10">
                  <Select.Viewport className="p-2">
                    <Select.Item value="payDate" className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md">
                      <Select.ItemText>Pay Date</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="grossPay" className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md">
                      <Select.ItemText>Gross Pay</Select.ItemText>
                    </Select.Item>
                    <Select.Item value="netPay" className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md">
                      <Select.ItemText>Net Pay</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            <button
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
              onClick={() => setPayStubSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              aria-label={`Sort direction: ${payStubSortDirection === 'asc' ? 'ascending' : 'descending'}`}
            >
              {payStubSortDirection === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {payStubSortDirection === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedPayStubs.map((stub) => (
                  <tr key={stub.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stub.periodStart} - {stub.periodEnd}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stub.payDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${stub.grossPay.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${stub.netPay.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4" aria-label={`View pay stub for period ${stub.periodStart} to ${stub.periodEnd}`}>View</button>
                      <button className="text-indigo-600 hover:text-indigo-900" aria-label={`Download pay stub for period ${stub.periodStart} to ${stub.periodEnd}`}>Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        <Tabs.Content className="bg-white p-6 rounded-b-md shadow-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="taxdocuments">
          <h2 className="text-2xl font-semibold mb-4">Tax Documents</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollData.taxDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doc.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900" aria-label={`View or download ${doc.type} for ${doc.year}`}>View/Download</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        <Tabs.Content className="bg-white p-6 rounded-b-md shadow-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="directdeposit">
          <h2 className="text-2xl font-semibold mb-4">Direct Deposit</h2>
          <button
            className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => { setEditingDirectDeposit(null); setNewDirectDeposit({ bankName: '', accountNumber: '', routingNumber: '', amount: 0 }); setIsDirectDepositModalOpen(true); }}
            aria-label="Add new direct deposit account"
          >
            <PlusIcon className="mr-2" /> Add New Direct Deposit
          </button>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Routing Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollData.directDeposits.map((dd) => (
                  <tr key={dd.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dd.bankName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dd.accountNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dd.routingNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${dd.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${dd.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {dd.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        onClick={() => { setEditingDirectDeposit(dd); setIsDirectDepositModalOpen(true); }}
                        aria-label={`Edit direct deposit for ${dd.bankName}`}
                      >
                        <Pencil1Icon className="inline-block mr-1" /> Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteDirectDeposit(dd.id)}
                        aria-label={`Delete direct deposit for ${dd.bankName}`}
                      >
                        <TrashIcon className="inline-block mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Direct Deposit Add/Edit Modal */}
          <Dialog.Root open={isDirectDepositModalOpen} onOpenChange={setIsDirectDepositModalOpen}>
            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0" />
              <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                  {editingDirectDeposit ? 'Edit Direct Deposit' : 'Add New Direct Deposit'}
                </Dialog.Title>
                <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                  {editingDirectDeposit ? 'Make changes to your direct deposit account here.' : 'Add a new direct deposit account.'}
                </Dialog.Description>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="bankName">
                    Bank Name
                  </label>
                  <input
                    className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                    id="bankName"
                    value={editingDirectDeposit?.bankName || newDirectDeposit.bankName}
                    onChange={(e) => editingDirectDeposit ? setEditingDirectDeposit({ ...editingDirectDeposit, bankName: e.target.value }) : setNewDirectDeposit({ ...newDirectDeposit, bankName: e.target.value })}
                    aria-label="Bank Name"
                  />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="accountNumber">
                    Account Number
                  </label>
                  <input
                    className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                    id="accountNumber"
                    value={editingDirectDeposit?.accountNumber || newDirectDeposit.accountNumber}
                    onChange={(e) => editingDirectDeposit ? setEditingDirectDeposit({ ...editingDirectDeposit, accountNumber: e.target.value }) : setNewDirectDeposit({ ...newDirectDeposit, accountNumber: e.target.value })}
                    aria-label="Account Number"
                  />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="routingNumber">
                    Routing Number
                  </label>
                  <input
                    className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                    id="routingNumber"
                    value={editingDirectDeposit?.routingNumber || newDirectDeposit.routingNumber}
                    onChange={(e) => editingDirectDeposit ? setEditingDirectDeposit({ ...editingDirectDeposit, routingNumber: e.target.value }) : setNewDirectDeposit({ ...newDirectDeposit, routingNumber: e.target.value })}
                    aria-label="Routing Number"
                  />
                </fieldset>
                <fieldset className="mb-[15px] flex items-center gap-5">
                  <label className="text-mauve11 w-[90px] text-right text-[15px]" htmlFor="amount">
                    Amount
                  </label>
                  <input
                    className="text-violet11 shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
                    id="amount"
                    type="number"
                    value={editingDirectDeposit?.amount || newDirectDeposit.amount}
                    onChange={(e) => editingDirectDeposit ? setEditingDirectDeposit({ ...editingDirectDeposit, amount: parseFloat(e.target.value) }) : setNewDirectDeposit({ ...newDirectDeposit, amount: parseFloat(e.target.value) })}
                    aria-label="Amount"
                  />
                </fieldset>
                <div className="mt-[25px] flex justify-end">
                  <Dialog.Close asChild>
                    <button
                      className="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none"
                      onClick={editingDirectDeposit ? handleEditDirectDeposit : handleAddDirectDeposit}
                    >
                      {editingDirectDeposit ? 'Save Changes' : 'Add Direct Deposit'}
                    </button>
                  </Dialog.Close>
                </div>
                <Dialog.Close asChild>
                  <button
                    className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                    aria-label="Close"
                  >
                    X
                  </button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </Tabs.Content>

        <Tabs.Content className="bg-white p-6 rounded-b-md shadow-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black" value="earningshistory">
          <h2 className="text-2xl font-semibold mb-4">Earnings History</h2>
          {/* Earnings History List/Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Pay</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Pay</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollData.earningsHistory.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.year}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.grossPay.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.netPay.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};

export default PayrollInformation;