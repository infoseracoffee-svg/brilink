import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Share2, 
  CreditCard, 
  Phone, 
  MapPin, 
  Calendar,
  X,
  FileText
} from 'lucide-react';
import { CustomerDebt } from '../types';
import { formatDateTime, formatRupiah, generateWhatsAppDebtMessage, parseRupiahInput } from '../utils/formatters';

interface CustomerDebtLedgerProps {
  debts: CustomerDebt[];
  storeName: string;
  onPayDebt: (debtId: string, amount: number, note?: string) => void;
  onAddDebt: (newDebt: Omit<CustomerDebt, 'id' | 'createdAt' | 'payments' | 'status' | 'paidAmount' | 'remainingDebt'>) => void;
}

export const CustomerDebtLedger: React.FC<CustomerDebtLedgerProps> = ({
  debts,
  storeName,
  onPayDebt,
  onAddDebt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'UNPAID' | 'PAID'>('UNPAID');

  // Modal states
  const [payModalDebt, setPayModalDebt] = useState<CustomerDebt | null>(null);
  const [payAmountInput, setPayAmountInput] = useState<string>('');
  const [payNote, setPayNote] = useState<string>('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newDebtAmount, setNewDebtAmount] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Filtered debts
  const filteredDebts = debts.filter(d => {
    const q = searchQuery.toLowerCase();
    const matchSearch = 
      !q ||
      d.customerName.toLowerCase().includes(q) ||
      d.customerPhone.includes(q) ||
      d.description.toLowerCase().includes(q);

    let matchStatus = true;
    if (filterStatus === 'UNPAID') matchStatus = d.remainingDebt > 0;
    if (filterStatus === 'PAID') matchStatus = d.remainingDebt === 0;

    return matchSearch && matchStatus;
  });

  // Overall totals
  const totalOutstanding = debts.reduce((acc, d) => acc + d.remainingDebt, 0);
  const totalPaid = debts.reduce((acc, d) => acc + d.paidAmount, 0);
  const activeDebtorsCount = debts.filter(d => d.remainingDebt > 0).length;

  const handleOpenPayModal = (debt: CustomerDebt) => {
    setPayModalDebt(debt);
    setPayAmountInput(formatRupiah(debt.remainingDebt, false));
    setPayNote('Pembayaran tunai di konter');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payModalDebt) return;
    const amount = parseRupiahInput(payAmountInput);
    if (amount <= 0) {
      alert('Masukkan jumlah pembayaran yang valid.');
      return;
    }
    onPayDebt(payModalDebt.id, amount, payNote);
    setPayModalDebt(null);
  };

  const handleOpenAddModal = () => {
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewDebtAmount('');
    setNewDescription('');
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setNewDueDate(d.toISOString().split('T')[0]);
    setIsAddModalOpen(true);
  };

  const handleConfirmAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseRupiahInput(newDebtAmount);
    if (!newCustName.trim() || amount <= 0) {
      alert('Mohon lengkapi nama pelanggan dan nominal bon.');
      return;
    }

    onAddDebt({
      customerName: newCustName.trim(),
      customerPhone: newCustPhone.trim() || '-',
      address: newCustAddress.trim() || undefined,
      totalDebt: amount,
      dueDate: newDueDate || new Date().toISOString().split('T')[0],
      description: newDescription.trim() || 'Bon Pulsa / Layanan Konter',
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-semibold text-slate-500">Total Piutang Belum Lunas</div>
            <div className="text-2xl font-extrabold tnum text-rose-600 mt-0.5">
              {formatRupiah(totalOutstanding)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">{activeDebtorsCount} Pelanggan Berjalan</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-semibold text-slate-500">Total Telah Tertagih / Lunas</div>
            <div className="text-2xl font-extrabold tnum text-emerald-600 mt-0.5">
              {formatRupiah(totalPaid)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Berhasil masuk ke laci</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#003B73] to-[#00529C] p-4 rounded-2xl text-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs uppercase font-semibold text-blue-200">Manajemen Bon Kasir</div>
            <div className="text-base font-bold mt-0.5">Tambah Catatan Piutang</div>
            <div className="text-[11px] text-blue-200 mt-0.5">Kirim pengingat WA instan</div>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="p-3 bg-white hover:bg-slate-100 text-[#003B73] rounded-xl font-bold transition-all shadow-md cursor-pointer flex items-center space-x-1"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-bold hidden sm:inline">Tambah Bon</span>
          </button>
        </div>
      </div>

      {/* Main Table / List Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header and Search */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Buku Kas Bon Pelanggan (Receivables)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Catat pinjaman pulsa, token darurat, atau sembako dengan pelacakan cicilan transparan
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterStatus('UNPAID')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterStatus === 'UNPAID' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Belum Lunas ({activeDebtorsCount})
            </button>
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterStatus === 'ALL' 
                  ? 'bg-[#00529C] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua Data
            </button>
            <button
              onClick={() => setFilterStatus('PAID')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filterStatus === 'PAID' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sudah Lunas
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Cari nama pelanggan bon, no. telepon, atau catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C]"
            />
          </div>
        </div>

        {/* Debtor Cards / Rows */}
        <div className="divide-y divide-slate-100 overflow-y-auto max-h-[600px]">
          {filteredDebts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Users className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="font-bold text-slate-600">Tidak ada data catatan bon</p>
              <p className="text-xs">Semua piutang pelanggan beres atau sesuaikan filter pencarian.</p>
            </div>
          ) : (
            filteredDebts.map((debt) => {
              const isPaid = debt.remainingDebt === 0;
              const percentPaid = Math.round((debt.paidAmount / debt.totalDebt) * 100);

              const waReminderLink = `https://api.whatsapp.com/send?phone=${debt.customerPhone.replace(
                /[^0-9]/g,
                ''
              )}&text=${generateWhatsAppDebtMessage(
                debt.customerName,
                debt.remainingDebt,
                storeName,
                debt.dueDate
              )}`;

              return (
                <div key={debt.id} className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Customer Info */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm sm:text-base text-slate-900">
                          {debt.customerName}
                        </span>
                        {isPaid ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            LUNAS
                          </span>
                        ) : debt.paidAmount > 0 ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            DICICIL ({percentPaid}%)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                            BELUM BAYAR
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                        <span className="flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{debt.customerPhone}</span>
                        </span>
                        {debt.address && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center space-x-1 text-slate-500">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{debt.address}</span>
                            </span>
                          </>
                        )}
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center space-x-1 text-slate-500">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Jatuh Tempo: <b className="text-slate-700">{debt.dueDate}</b></span>
                        </span>
                      </div>

                      <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                        <b>Rincian Barang/Layanan:</b> {debt.description}
                      </div>
                    </div>

                    {/* Balances & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="text-right sm:mr-3">
                        <div className="text-xs text-slate-400">Sisa Utang:</div>
                        <div className={`text-base sm:text-lg font-extrabold tnum ${
                          isPaid ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {formatRupiah(debt.remainingDebt)}
                        </div>
                        <div className="text-[11px] text-slate-400 tnum">
                          Total Bon: {formatRupiah(debt.totalDebt)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!isPaid && (
                          <>
                            <button
                              onClick={() => handleOpenPayModal(debt)}
                              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center space-x-1 cursor-pointer"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Bayar / Cicil</span>
                            </button>

                            <a
                              href={waReminderLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition-colors border border-slate-200 flex items-center space-x-1 cursor-pointer"
                              title="Kirim pengingat pesan WhatsApp"
                            >
                              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Tagih WA</span>
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Payment history strip if any */}
                  {debt.payments.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-slate-700">Riwayat Pembayaran:</span>
                      {debt.payments.map((p) => (
                        <span key={p.id} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 tnum">
                          {formatDateTime(p.timestamp)}: <b>{formatRupiah(p.amount)}</b> {p.note && `(${p.note})`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Pay Debt Modal */}
      {payModalDebt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#003B73] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Terima Pembayaran Bon / Utang</h3>
              <button 
                onClick={() => setPayModalDebt(null)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPayment} className="p-5 space-y-4">
              <div>
                <div className="text-xs text-slate-500">Nama Pelanggan:</div>
                <div className="font-bold text-slate-900 text-base">{payModalDebt.customerName}</div>
                <div className="text-xs text-rose-600 font-semibold tnum mt-0.5">
                  Sisa Utang: {formatRupiah(payModalDebt.remainingDebt)}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jumlah yang Dibayarkan (Tunai)
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-500 font-bold text-sm">Rp</span>
                  <input
                    type="text"
                    value={payAmountInput}
                    onChange={(e) => setPayAmountInput(formatRupiah(parseRupiahInput(e.target.value), false))}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 tnum"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Pembayaran
                </label>
                <input
                  type="text"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  placeholder="Misal: Titip lewat saudaranya"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                💡 Uang yang dibayarkan akan langsung otomatis menambah <b>Saldo Kas Fisik di Laci</b> dan dicatat ke Jurnal Transaksi.
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayModalDebt(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Debt Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#003B73] text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Catat Piutang / Bon Baru</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-blue-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAddDebt} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pelanggan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Mas Agus (Tukang Kayu)"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00529C]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Nominal Bon (Rp) *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-500 font-bold text-sm">Rp</span>
                  <input
                    type="text"
                    required
                    placeholder="0"
                    value={newDebtAmount}
                    onChange={(e) => setNewDebtAmount(formatRupiah(parseRupiahInput(e.target.value), false))}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00529C] tnum"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rincian Barang / Layanan Konter
                </label>
                <textarea
                  rows={2}
                  placeholder="Misal: Token PLN 50k + Beras 5kg + Rokok 1 bungkus"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat / Keterangan Rumah
                </label>
                <input
                  type="text"
                  placeholder="Misal: RT 03 samping musholla"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-2.5 rounded-xl bg-[#00529C] hover:bg-blue-700 text-white text-xs font-bold shadow-md"
                >
                  Simpan Catatan Bon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
