import React from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  Coins, 
  AlertCircle, 
  PlusCircle, 
  FileText, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { AgentSettings, CustomerDebt, Transaction } from '../types';
import { formatRupiah } from '../utils/formatters';

interface FinancialHeroProps {
  settings: AgentSettings;
  transactions: Transaction[];
  debts: CustomerDebt[];
  onOpenNewTransaction: () => void;
  onOpenDebtTab: () => void;
  onOpenLedgerTab: () => void;
}

export const FinancialHero: React.FC<FinancialHeroProps> = ({
  settings,
  transactions,
  debts,
  onOpenNewTransaction,
  onOpenDebtTab,
  onOpenLedgerTab,
}) => {
  // Calculate today's metrics
  const todayDateString = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.timestamp.startsWith(todayDateString));

  const todayProfit = todayTransactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? t.profit : 0), 0);
  const todayTxCount = todayTransactions.filter(t => t.status === 'SUCCESS').length;
  const todayVolume = todayTransactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? t.nominal : 0), 0);

  // Active customer debts
  const activeDebts = debts.filter(d => d.remainingDebt > 0);
  const totalOutstandingDebt = activeDebts.reduce((acc, d) => acc + d.remainingDebt, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Primary Hero Card: Midnight Navy */}
      <div className="lg:col-span-8 bg-gradient-to-br from-[#003B73] to-[#0B2046] rounded-2xl p-5 sm:p-6 text-white shadow-lg border border-blue-800/80 relative overflow-hidden">
        {/* Subtle decorative background watermark */}
        <div className="absolute right-[-20px] bottom-[-20px] text-white/5 font-black text-9xl select-none pointer-events-none">
          AGRO
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full space-y-5">
          {/* Top Label & Quick Date */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-700/50 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs uppercase font-bold tracking-wider text-blue-200">
                Ringkasan Finansial Konter Hari Ini
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs bg-blue-900/60 px-2.5 py-1 rounded-full border border-blue-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-blue-100 font-medium">{todayTxCount} Transaksi Sukses</span>
            </div>
          </div>

          {/* Primary Split: Profit vs Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Keuntungan Bersih Hari Ini (Net Profit) */}
            <div className="bg-[#002B54]/70 p-4 rounded-xl border border-blue-700/60 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center justify-between mb-1">
                  <span>Keuntungan Bersih Hari Ini</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    +18.4%
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tnum text-white tracking-tight flex items-baseline">
                  {formatRupiah(todayProfit)}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-blue-700/40 flex items-center justify-between text-xs text-blue-200">
                <span>Omzet Transaksi:</span>
                <span className="font-semibold text-white tnum">{formatRupiah(todayVolume)}</span>
              </div>
            </div>

            {/* Split Balances: Floating Bank vs Kas di Laci */}
            <div className="grid grid-cols-2 gap-3">
              {/* Saldo Kas Tunai di Laci */}
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 flex flex-col justify-between">
                <div className="flex items-center space-x-1.5 text-emerald-300 text-xs font-semibold">
                  <Coins className="w-4 h-4" />
                  <span>Kas Fisik Laci</span>
                </div>
                <div className="mt-2">
                  <div className="text-lg sm:text-xl font-bold tnum text-white leading-tight">
                    {formatRupiah(settings.cashInHandBalance)}
                  </div>
                  <div className="text-[10px] text-blue-200 mt-0.5">Uang tunai siap edar</div>
                </div>
              </div>

              {/* Saldo Floating Bank */}
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/10 flex flex-col justify-between">
                <div className="flex items-center space-x-1.5 text-cyan-300 text-xs font-semibold">
                  <Wallet className="w-4 h-4" />
                  <span>Float Digital</span>
                </div>
                <div className="mt-2">
                  <div className="text-lg sm:text-xl font-bold tnum text-white leading-tight">
                    {formatRupiah(settings.bankFloatBalance)}
                  </div>
                  <div className="text-[10px] text-blue-200 mt-0.5">Bank Agro / Rekening</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewTransaction}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold px-5 py-3 rounded-xl transition-all shadow-md text-sm cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Catat Transaksi Baru</span>
            </button>

            <button
              onClick={onOpenLedgerTab}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 bg-blue-800/80 hover:bg-blue-700 text-blue-100 font-semibold px-4 py-3 rounded-xl transition-all border border-blue-600/50 text-sm cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Lihat Jurnal Mutasi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Card: Receivables & Customer Credit (Bon/Utang) */}
      <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800 leading-tight">Buku Bon & Utang</h3>
                <p className="text-[11px] text-slate-500">Piutang pelanggan berjalan</p>
              </div>
            </div>
            <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {activeDebts.length} Orang
            </span>
          </div>

          <div className="my-4">
            <div className="text-xs uppercase font-semibold text-slate-500">Total Piutang Belum Lunas</div>
            <div className="text-2xl sm:text-3xl font-extrabold tnum text-rose-600 mt-0.5">
              {formatRupiah(totalOutstandingDebt)}
            </div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span>Jatuh tempo terdekat:</span>
              <span className="font-semibold text-slate-700">Hari ini & besok</span>
            </div>
          </div>

          {/* Quick preview of top debtor customers */}
          <div className="space-y-2 mb-4">
            {activeDebts.slice(0, 3).map(debt => (
              <div 
                key={debt.id}
                onClick={onOpenDebtTab}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-100"
              >
                <div className="truncate mr-2">
                  <div className="text-xs font-semibold text-slate-800 truncate">{debt.customerName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{debt.description}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-bold text-rose-600 tnum">{formatRupiah(debt.remainingDebt)}</div>
                  <div className="text-[10px] text-amber-600 font-medium">Tempo: {debt.dueDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onOpenDebtTab}
          className="w-full flex items-center justify-center space-x-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold py-2.5 rounded-xl transition-colors text-xs border border-slate-200"
        >
          <Users className="w-3.5 h-3.5 text-slate-600" />
          <span>Buka Buku Bon & Tagih ({activeDebts.length})</span>
        </button>
      </div>
    </div>
  );
};
