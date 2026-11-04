import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Send, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Zap, 
  Smartphone, 
  CreditCard, 
  Receipt, 
  Plus, 
  BookOpen, 
  FileSpreadsheet, 
  Lock, 
  Home, 
  Store,
  Layers,
  Sparkles,
  TrendingUp,
  Coins,
  Wallet,
  Settings
} from 'lucide-react';
import { ActiveTab, AgentSettings, CustomerDebt, Transaction, TransactionType, ViewLayoutMode } from './types';
import { initialAgentSettings, initialDebts, initialTransactions } from './utils/mockData';
import { Header } from './components/Header';
import { FinancialHero } from './components/FinancialHero';
import { POSQuickServices } from './components/POSQuickServices';
import { TransactionLedger } from './components/TransactionLedger';
import { CustomerDebtLedger } from './components/CustomerDebtLedger';
import { TransactionModal } from './components/TransactionModal';
import { ThermalReceiptModal } from './components/ThermalReceiptModal';
import { CashReconciliationModal } from './components/CashReconciliationModal';
import { FloatModal } from './components/FloatModal';
import { BottomNav } from './components/BottomNav';
import { formatRupiah, generateRefNumber } from './utils/formatters';

const STORAGE_KEYS = {
  SETTINGS: 'agro_ledger_settings_v1',
  TRANSACTIONS: 'agro_ledger_transactions_v1',
  DEBTS: 'agro_ledger_debts_v1',
  VIEW_MODE: 'agro_ledger_view_mode_v1',
};

export default function App() {
  // Persistence state
  const [settings, setSettings] = useState<AgentSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : initialAgentSettings;
    } catch {
      return initialAgentSettings;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [debts, setDebts] = useState<CustomerDebt[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DEBTS);
      return saved ? JSON.parse(saved) : initialDebts;
    } catch {
      return initialDebts;
    }
  });

  const [viewMode, setViewMode] = useState<ViewLayoutMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE) as ViewLayoutMode;
      return saved || 'desktop';
    } catch {
      return 'desktop';
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState<TransactionType>('TRANSFER');
  const [activeReceiptTx, setActiveReceiptTx] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isReconciliationOpen, setIsReconciliationOpen] = useState(false);
  const [isFloatModalOpen, setIsFloatModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEBTS, JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
  }, [viewMode]);

  // Handlers
  const handleSelectService = (serviceType: TransactionType) => {
    setSelectedServiceType(serviceType);
    setIsTxModalOpen(true);
  };

  const handleOpenNewTransaction = () => {
    setSelectedServiceType('TRANSFER');
    setIsTxModalOpen(true);
  };

  const handleCreateTransaction = (
    newTx: Transaction,
    willAddDebt = false,
    debtDueDate?: string
  ) => {
    // 1. Add to transactions list
    setTransactions(prev => [newTx, ...prev]);

    // 2. Adjust balances according to transaction type and payment method
    setSettings(prev => {
      let cash = prev.cashInHandBalance;
      let float = prev.bankFloatBalance;

      if (newTx.type === 'TRANSFER' || newTx.type === 'PLN_TOKEN' || newTx.type === 'PULSA_DATA' || newTx.type === 'TOPUP_WALLET' || newTx.type === 'BPJS_PDAM') {
        // Digital float is deducted by bank nominal
        float = Math.max(0, float - newTx.nominal);
        // If customer paid in cash: Cash in hand increases by total amount
        if (newTx.paymentMethod === 'TUNAI') {
          cash += newTx.totalAmount;
        }
      } else if (newTx.type === 'TARIK_TUNAI') {
        // Cash is handed out to customer: cash decreases by nominal
        cash = Math.max(0, cash - newTx.nominal);
        // Bank transfers nominal + admin to agent float
        float += newTx.nominal + newTx.adminFee;
      } else if (newTx.type === 'SETOR_TUNAI') {
        // Cash received into drawer
        cash += newTx.totalAmount;
        // Float is deducted by deposited amount
        float = Math.max(0, float - newTx.nominal);
      } else if (newTx.type === 'KAS_KELUAR') {
        // Cash expense from drawer
        cash = Math.max(0, cash - newTx.nominal);
      }

      return {
        ...prev,
        cashInHandBalance: cash,
        bankFloatBalance: float,
      };
    });

    // 3. If Bon/Debt, register to Customer Debts
    if (willAddDebt) {
      const newDebtItem: CustomerDebt = {
        id: `debt-${Date.now()}`,
        customerName: newTx.customerName,
        customerPhone: newTx.customerPhone || '-',
        totalDebt: newTx.totalAmount,
        paidAmount: 0,
        remainingDebt: newTx.totalAmount,
        dueDate: debtDueDate || new Date().toISOString().split('T')[0],
        description: `${newTx.category} (${newTx.targetBankOrProvider || '-'})`,
        status: 'UNPAID',
        payments: [],
        createdAt: newTx.timestamp,
      };
      setDebts(prev => [newDebtItem, ...prev]);
    }

    // 4. Close transaction modal and open Thermal Receipt
    setIsTxModalOpen(false);
    setActiveReceiptTx(newTx);
    setIsReceiptModalOpen(true);
  };

  const handlePayDebt = (debtId: string, amount: number, note?: string) => {
    const targetDebt = debts.find(d => d.id === debtId);
    if (!targetDebt) return;

    const actualAmount = Math.min(amount, targetDebt.remainingDebt);
    const newPaid = targetDebt.paidAmount + actualAmount;
    const newRemaining = Math.max(0, targetDebt.totalDebt - newPaid);
    const newStatus = newRemaining === 0 ? 'PAID' : 'PARTIAL';

    // 1. Update Debts
    setDebts(prev => prev.map(d => {
      if (d.id === debtId) {
        return {
          ...d,
          paidAmount: newPaid,
          remainingDebt: newRemaining,
          status: newStatus,
          payments: [
            ...d.payments,
            {
              id: `pay-${Date.now()}`,
              timestamp: new Date().toISOString(),
              amount: actualAmount,
              note,
            },
          ],
        };
      }
      return d;
    }));

    // 2. Increase physical cash in drawer
    setSettings(prev => ({
      ...prev,
      cashInHandBalance: prev.cashInHandBalance + actualAmount,
    }));

    // 3. Log to Transaction Ledger
    const debtPaymentTx: Transaction = {
      id: `tx-pay-${Date.now()}`,
      refNumber: generateRefNumber('AGR'),
      timestamp: new Date().toISOString(),
      type: 'BON_UTANG',
      category: 'Pelunasan Bon',
      customerName: targetDebt.customerName,
      customerPhone: targetDebt.customerPhone,
      nominal: actualAmount,
      adminFee: 0,
      profit: 0,
      totalAmount: actualAmount,
      cashTendered: actualAmount,
      change: 0,
      status: 'SUCCESS',
      paymentMethod: 'TUNAI',
      notes: note || `Pembayaran cicilan bon (${targetDebt.description})`,
    };

    setTransactions(prev => [debtPaymentTx, ...prev]);

    // Show receipt
    setActiveReceiptTx(debtPaymentTx);
    setIsReceiptModalOpen(true);
  };

  const handleAddDebtManual = (newDebt: Omit<CustomerDebt, 'id' | 'createdAt' | 'payments' | 'status' | 'paidAmount' | 'remainingDebt'>) => {
    const item: CustomerDebt = {
      ...newDebt,
      id: `debt-${Date.now()}`,
      paidAmount: 0,
      remainingDebt: newDebt.totalDebt,
      status: 'UNPAID',
      payments: [],
      createdAt: new Date().toISOString(),
    };
    setDebts(prev => [item, ...prev]);
  };

  const handleUpdateBalances = (newFloat: number, newCash: number, note: string) => {
    setSettings(prev => ({
      ...prev,
      bankFloatBalance: newFloat,
      cashInHandBalance: newCash,
    }));

    // Record mutation entry
    const mutTx: Transaction = {
      id: `mut-${Date.now()}`,
      refNumber: generateRefNumber('MUT'),
      timestamp: new Date().toISOString(),
      type: 'KAS_KELUAR',
      category: 'Mutasi Modal Kas/Float',
      customerName: 'Internal Kasir Toko',
      nominal: 0,
      adminFee: 0,
      profit: 0,
      totalAmount: 0,
      status: 'SUCCESS',
      paymentMethod: 'TUNAI',
      notes: note,
    };
    setTransactions(prev => [mutTx, ...prev]);
  };

  const handleResetData = () => {
    setSettings(initialAgentSettings);
    setTransactions(initialTransactions);
    setDebts(initialDebts);
    localStorage.clear();
  };

  const unpaidDebtCount = debts.filter(d => d.remainingDebt > 0).length;

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-[#0B1C30] flex flex-col ${viewMode === 'mobile' ? 'max-w-md mx-auto shadow-2xl border-x border-slate-200' : ''}`}>
      {/* Top Header */}
      <Header
        settings={settings}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenReconciliation={() => setIsReconciliationOpen(true)}
        onOpenFloatModal={() => setIsFloatModalOpen(true)}
        onResetData={handleResetData}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 space-y-5 pb-24 md:pb-8">
        {/* Navigation Tabs (Tablet & Desktop Mode) */}
        {viewMode !== 'mobile' && (
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-[#00529C] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Beranda & Ringkasan</span>
              </button>

              <button
                onClick={() => setActiveTab('pos')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'pos'
                    ? 'bg-[#00529C] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Kasir POS (Katalog Layanan)</span>
              </button>

              <button
                onClick={() => setActiveTab('ledger')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'ledger'
                    ? 'bg-[#00529C] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Jurnal Mutasi Transaksi</span>
              </button>

              <button
                onClick={() => setActiveTab('bon')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer relative ${
                  activeTab === 'bon'
                    ? 'bg-[#00529C] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Buku Kas & Bon</span>
                {unpaidDebtCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {unpaidDebtCount}
                  </span>
                )}
              </button>
            </div>

            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={handleOpenNewTransaction}
                className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Catat Transaksi Cepat</span>
              </button>
            </div>
          </div>
        )}

        {/* View Mode Layout Rendering */}
        {viewMode === 'pos-tablet' ? (
          /* POS Tablet Split-Screen Layout: Left POS Matrix, Right Ledger Stream */
          <div className="space-y-4">
            <FinancialHero
              settings={settings}
              transactions={transactions}
              debts={debts}
              onOpenNewTransaction={handleOpenNewTransaction}
              onOpenDebtTab={() => setActiveTab('bon')}
              onOpenLedgerTab={() => setActiveTab('ledger')}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Pane: Quick Register & Product Matrix */}
              <div className="lg:col-span-6 space-y-4">
                <POSQuickServices
                  onSelectService={handleSelectService}
                  selectedService={selectedServiceType}
                />
              </div>

              {/* Right Pane: Active Ledger Stream */}
              <div className="lg:col-span-6 space-y-4">
                <TransactionLedger
                  transactions={transactions}
                  onViewReceipt={(tx) => {
                    setActiveReceiptTx(tx);
                    setIsReceiptModalOpen(true);
                  }}
                  onOpenNewTransaction={handleOpenNewTransaction}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Mobile & Desktop Default Tab Views */
          <>
            {activeTab === 'dashboard' && (
              <div className="space-y-5">
                <FinancialHero
                  settings={settings}
                  transactions={transactions}
                  debts={debts}
                  onOpenNewTransaction={handleOpenNewTransaction}
                  onOpenDebtTab={() => setActiveTab('bon')}
                  onOpenLedgerTab={() => setActiveTab('ledger')}
                />

                <POSQuickServices
                  onSelectService={handleSelectService}
                  selectedService={selectedServiceType}
                />

                <TransactionLedger
                  transactions={transactions}
                  onViewReceipt={(tx) => {
                    setActiveReceiptTx(tx);
                    setIsReceiptModalOpen(true);
                  }}
                  onOpenNewTransaction={handleOpenNewTransaction}
                />
              </div>
            )}

            {activeTab === 'pos' && (
              <div className="space-y-5">
                <POSQuickServices
                  onSelectService={handleSelectService}
                  selectedService={selectedServiceType}
                />

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Ingin mencatat transaksi umum atau lainnya?</h3>
                    <p className="text-xs text-slate-500">Gunakan formulir kasir instan untuk nominal berapapun.</p>
                  </div>
                  <button
                    onClick={handleOpenNewTransaction}
                    className="w-full sm:w-auto px-5 py-3 bg-[#00529C] hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Buka Form Kasir Transaksi</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'ledger' && (
              <div className="space-y-5">
                <TransactionLedger
                  transactions={transactions}
                  onViewReceipt={(tx) => {
                    setActiveReceiptTx(tx);
                    setIsReceiptModalOpen(true);
                  }}
                  onOpenNewTransaction={handleOpenNewTransaction}
                />
              </div>
            )}

            {activeTab === 'bon' && (
              <div className="space-y-5">
                <CustomerDebtLedger
                  debts={debts}
                  storeName={settings.storeName}
                  onPayDebt={handlePayDebt}
                  onAddDebt={handleAddDebtManual}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Action Button for Mobile or Counter Fast Access */}
      <div className="md:hidden">
        <BottomNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onOpenNewTransaction={handleOpenNewTransaction}
          unpaidDebtCount={unpaidDebtCount}
        />
      </div>

      {/* Cashier Transaction Entry Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        serviceType={selectedServiceType}
        settings={settings}
        onSubmitTransaction={handleCreateTransaction}
        soundEnabled={soundEnabled}
      />

      {/* Thermal Receipt Modal */}
      <ThermalReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        transaction={activeReceiptTx}
        settings={settings}
      />

      {/* Cash Reconciliation / Tutup Kasir Modal */}
      <CashReconciliationModal
        isOpen={isReconciliationOpen}
        onClose={() => setIsReconciliationOpen(false)}
        settings={settings}
        transactions={transactions}
        onCompleteClosing={(actualCash, diff, notes) => {
          // Adjust physical cash balance to actual counted
          setSettings(prev => ({
            ...prev,
            cashInHandBalance: actualCash,
          }));
        }}
      />

      {/* Mutasi Modal Float & Kas */}
      <FloatModal
        isOpen={isFloatModalOpen}
        onClose={() => setIsFloatModalOpen(false)}
        settings={settings}
        onUpdateBalances={handleUpdateBalances}
      />
    </div>
  );
}
