import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Send, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Zap, 
  Smartphone, 
  CreditCard, 
  HeartHandshake, 
  Receipt,
  FileDown, 
  Share2, 
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Transaction, TransactionType } from '../types';
import { formatDateTime, formatRupiah, formatTimeOnly } from '../utils/formatters';

interface TransactionLedgerProps {
  transactions: Transaction[];
  onViewReceipt: (tx: Transaction) => void;
  onOpenNewTransaction: () => void;
}

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  transactions,
  onViewReceipt,
  onOpenNewTransaction,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'TODAY' | 'YESTERDAY' | 'WEEK' | 'ALL'>('TODAY');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Search
      const q = searchQuery.toLowerCase();
      const matchSearch = 
        !q || 
        tx.customerName.toLowerCase().includes(q) ||
        tx.refNumber.toLowerCase().includes(q) ||
        (tx.targetAccount && tx.targetAccount.toLowerCase().includes(q)) ||
        (tx.targetBankOrProvider && tx.targetBankOrProvider.toLowerCase().includes(q));

      // Category
      const matchCategory = 
        selectedCategory === 'ALL' || 
        tx.type === selectedCategory;

      // Status
      const matchStatus = 
        selectedStatus === 'ALL' || 
        tx.status === selectedStatus;

      // Date
      let matchDate = true;
      const today = new Date().toISOString().split('T')[0];
      const txDate = tx.timestamp.split('T')[0];

      if (dateFilter === 'TODAY') {
        matchDate = txDate === today;
      } else if (dateFilter === 'YESTERDAY') {
        const y = new Date();
        y.setDate(y.getDate() - 1);
        const yesterday = y.toISOString().split('T')[0];
        matchDate = txDate === yesterday;
      } else if (dateFilter === 'WEEK') {
        const w = new Date();
        w.setDate(w.getDate() - 7);
        matchDate = new Date(tx.timestamp) >= w;
      }

      return matchSearch && matchCategory && matchStatus && matchDate;
    });
  }, [transactions, searchQuery, selectedCategory, selectedStatus, dateFilter]);

  // Aggregated totals of filtered view
  const totalVolume = filteredTransactions.reduce((acc, t) => acc + t.nominal, 0);
  const totalProfit = filteredTransactions.reduce((acc, t) => acc + (t.status === 'SUCCESS' ? t.profit : 0), 0);

  // Category pills list
  const categoryFilters: { id: string; label: string }[] = [
    { id: 'ALL', label: 'Semua Layanan' },
    { id: 'TRANSFER', label: 'Transfer Bank' },
    { id: 'TARIK_TUNAI', label: 'Tarik Tunai' },
    { id: 'SETOR_TUNAI', label: 'Setor Tunai' },
    { id: 'PLN_TOKEN', label: 'PLN Token' },
    { id: 'PULSA_DATA', label: 'Pulsa & Data' },
    { id: 'TOPUP_WALLET', label: 'E-Wallet' },
    { id: 'BPJS_PDAM', label: 'BPJS & PDAM' },
    { id: 'KAS_KELUAR', label: 'Kas Keluar' },
    { id: 'BON_UTANG', label: 'Bon / Utang' },
  ];

  // Helper icon by type
  const renderIcon = (type: TransactionType) => {
    switch (type) {
      case 'TRANSFER':
        return <Send className="w-4 h-4 text-[#00529C]" />;
      case 'TARIK_TUNAI':
        return <ArrowDownToLine className="w-4 h-4 text-amber-600" />;
      case 'SETOR_TUNAI':
        return <ArrowUpFromLine className="w-4 h-4 text-emerald-600" />;
      case 'PLN_TOKEN':
      case 'PLN_TAGIHAN':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      case 'PULSA_DATA':
        return <Smartphone className="w-4 h-4 text-purple-600" />;
      case 'TOPUP_WALLET':
        return <CreditCard className="w-4 h-4 text-cyan-600" />;
      case 'BPJS_PDAM':
        return <HeartHandshake className="w-4 h-4 text-teal-600" />;
      case 'KAS_KELUAR':
        return <Receipt className="w-4 h-4 text-rose-600" />;
      default:
        return <Receipt className="w-4 h-4 text-slate-600" />;
    }
  };

  // CSV Export handler
  const handleExportCSV = () => {
    const headers = ['No Ref', 'Waktu', 'Layanan', 'Nasabah', 'Tujuan / Akun', 'Nominal', 'Admin', 'Total', 'Keuntungan', 'Status', 'Metode'];
    const rows = filteredTransactions.map(t => [
      t.refNumber,
      formatDateTime(t.timestamp),
      t.category,
      `"${t.customerName}"`,
      `"${t.targetAccount || ''} (${t.targetBankOrProvider || ''})"`,
      t.nominal,
      t.adminFee,
      t.totalAmount,
      t.profit,
      t.status,
      t.paymentMethod
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekap_agro_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Jurnal Transaksi Kasir & Mutasi</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#00529C]">
              {filteredTransactions.length} Data
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Arsip lengkap aliran kas fisik, debit floating, dan komisi bersih harian
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-slate-200 cursor-pointer"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onOpenNewTransaction}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-[#00529C] hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
          >
            <span>+ Catat Baru</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
        {/* Search & Quick Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Search box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama nasabah, no. ref, rekening, ID PLN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C]"
            />
          </div>

          {/* Date quick filter */}
          <div className="sm:col-span-3 flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as 'TODAY' | 'YESTERDAY' | 'WEEK' | 'ALL')}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
            >
              <option value="TODAY">Hari Ini</option>
              <option value="YESTERDAY">Kemarin</option>
              <option value="WEEK">7 Hari Terakhir</option>
              <option value="ALL">Semua Tanggal</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="sm:col-span-3 flex items-center bg-white border border-slate-300 rounded-xl px-2 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs font-semibold text-slate-700 bg-transparent focus:outline-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="SUCCESS">Sukses / Lunas</option>
              <option value="BON">Bon / Utang</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categoryFilters.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#00529C] text-white shadow-xs'
                  : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Summary Ribbon for Current Filter */}
      <div className="bg-[#EFF4FF] px-4 py-2.5 border-b border-blue-200/80 flex flex-wrap items-center justify-between text-xs text-slate-700">
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-slate-500">Volume Transaksi:</span>{' '}
            <span className="font-extrabold text-[#003B73] tnum">{formatRupiah(totalVolume)}</span>
          </div>
          <div>
            <span className="text-slate-500">Total Margin/Profit:</span>{' '}
            <span className="font-extrabold text-emerald-700 tnum">{formatRupiah(totalProfit)}</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          Tabular Numbers (tnum) Aktif
        </div>
      </div>

      {/* Transaction Rows List */}
      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Receipt className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
            <p className="font-bold text-slate-600">Tidak ada transaksi yang cocok</p>
            <p className="text-xs">Coba ubah kata kunci pencarian atau filter layanan.</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isExpense = tx.type === 'KAS_KELUAR';
            const isBon = tx.status === 'BON';

            return (
              <div
                key={tx.id}
                onClick={() => onViewReceipt(tx)}
                className="p-3.5 sm:p-4 hover:bg-slate-50/90 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                {/* Left: Icon & Badges */}
                <div className="flex items-center space-x-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                    isExpense 
                      ? 'bg-rose-100 text-rose-700' 
                      : isBon 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-blue-50 text-[#00529C] border border-blue-100'
                  }`}>
                    {renderIcon(tx.type)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {tx.customerName}
                      </span>
                      {isBon && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                          BON
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-slate-700">{tx.category}</span>
                      {tx.targetBankOrProvider && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-600">{tx.targetBankOrProvider}</span>
                        </>
                      )}
                      {tx.targetAccount && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="font-mono text-[11px] text-slate-500 tnum">{tx.targetAccount}</span>
                        </>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center space-x-2 mt-0.5">
                      <span className="font-mono">{tx.refNumber}</span>
                      <span>•</span>
                      <span className="tnum">{formatTimeOnly(tx.timestamp)} WIB</span>
                      {tx.notes && (
                        <>
                          <span>•</span>
                          <span className="italic text-slate-500 truncate max-w-[200px]">{tx.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Amounts & Profit */}
                <div className="text-right flex-shrink-0 flex flex-col items-end">
                  <div className={`text-sm sm:text-base font-extrabold tnum ${
                    isExpense 
                      ? 'text-rose-600' 
                      : 'text-slate-900 group-hover:text-[#00529C]'
                  }`}>
                    {isExpense ? '-' : ''}{formatRupiah(tx.totalAmount)}
                  </div>

                  {!isExpense && (
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded tnum">
                        +{formatRupiah(tx.profit)} margin
                      </span>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">
                        (Admin: {formatRupiah(tx.adminFee)})
                      </span>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-1">
                    <span className="hidden sm:inline">Metode:</span>
                    <span className="font-medium text-slate-600">
                      {tx.paymentMethod === 'TUNAI' ? '💵 Tunai' : tx.paymentMethod === 'POTONG_FLOAT' ? '💳 Float' : '📝 Bon'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
