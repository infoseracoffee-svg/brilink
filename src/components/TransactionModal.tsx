import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Zap, 
  Smartphone, 
  CreditCard, 
  HeartHandshake, 
  Receipt,
  User, 
  Phone, 
  Coins, 
  Calculator, 
  AlertTriangle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { AgentSettings, PaymentMethod, Transaction, TransactionType } from '../types';
import { formatRupiah, generatePlnToken, generateRefNumber, parseRupiahInput } from '../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: TransactionType;
  settings: AgentSettings;
  onSubmitTransaction: (tx: Transaction, willAddDebt?: boolean, debtDueDate?: string) => void;
  soundEnabled: boolean;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  settings,
  onSubmitTransaction,
  soundEnabled,
}) => {
  if (!isOpen) return null;

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [targetBankOrProvider, setTargetBankOrProvider] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [nominal, setNominal] = useState<number>(100000);
  const [nominalInput, setNominalInput] = useState<string>('100.000');
  const [adminFee, setAdminFee] = useState<number>(5000);
  const [adminFeeInput, setAdminFeeInput] = useState<string>('5.000');
  const [cashTendered, setCashTendered] = useState<number>(0);
  const [cashTenderedInput, setCashTenderedInput] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TUNAI');
  const [debtDueDate, setDebtDueDate] = useState<string>('');
  const [notes, setNotes] = useState('');

  // Initial defaults by serviceType
  useEffect(() => {
    let fee = 5000;
    let defBank = 'Bank BRI';
    let defNominal = 100000;

    if (serviceType === 'TRANSFER') {
      fee = settings.defaultAdminFees.transfer || 5000;
      defBank = 'Bank BRI';
      defNominal = 500000;
    } else if (serviceType === 'TARIK_TUNAI') {
      fee = settings.defaultAdminFees.tarik || 5000;
      defBank = 'Bank BRI (Kartu ATM)';
      defNominal = 200000;
    } else if (serviceType === 'SETOR_TUNAI') {
      fee = settings.defaultAdminFees.setor || 5000;
      defBank = 'Bank BRI';
      defNominal = 1000000;
    } else if (serviceType === 'PLN_TOKEN') {
      fee = settings.defaultAdminFees.pln || 3000;
      defBank = 'PLN Prepaid (Prabayar)';
      defNominal = 50000;
    } else if (serviceType === 'PULSA_DATA') {
      fee = settings.defaultAdminFees.pulsa || 2500;
      defBank = 'Telkomsel';
      defNominal = 25000;
    } else if (serviceType === 'TOPUP_WALLET') {
      fee = settings.defaultAdminFees.ewallet || 3000;
      defBank = 'DANA Saldo';
      defNominal = 100000;
    } else if (serviceType === 'BPJS_PDAM') {
      fee = 3500;
      defBank = 'BPJS Kesehatan';
      defNominal = 105000;
    } else if (serviceType === 'KAS_KELUAR') {
      fee = 0;
      defBank = 'Operasional Toko';
      defNominal = 20000;
    }

    setAdminFee(fee);
    setAdminFeeInput(formatRupiah(fee, false));
    setTargetBankOrProvider(defBank);
    setNominal(defNominal);
    setNominalInput(formatRupiah(defNominal, false));

    const total = defNominal + (serviceType === 'KAS_KELUAR' ? 0 : fee);
    setCashTendered(total);
    setCashTenderedInput(formatRupiah(total, false));

    // Default due date: 3 days ahead
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setDebtDueDate(d.toISOString().split('T')[0]);
  }, [serviceType, settings]);

  // Derived totals
  const totalAmount = serviceType === 'KAS_KELUAR' ? nominal : nominal + adminFee;
  const profit = serviceType === 'KAS_KELUAR' ? -nominal : adminFee;
  const change = Math.max(0, cashTendered - totalAmount);

  // Quick nominal buttons
  const quickNominals = serviceType === 'PLN_TOKEN'
    ? [20000, 50000, 100000, 200000, 500000, 1000000]
    : serviceType === 'PULSA_DATA'
    ? [10000, 25000, 50000, 100000, 150000, 200000]
    : [50000, 100000, 200000, 500000, 1000000, 2000000];

  const handleNominalSelect = (val: number) => {
    setNominal(val);
    setNominalInput(formatRupiah(val, false));
    const newTotal = serviceType === 'KAS_KELUAR' ? val : val + adminFee;
    setCashTendered(newTotal);
    setCashTenderedInput(formatRupiah(newTotal, false));
  };

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseRupiahInput(e.target.value);
    setNominal(val);
    setNominalInput(formatRupiah(val, false));
    const newTotal = serviceType === 'KAS_KELUAR' ? val : val + adminFee;
    setCashTendered(newTotal);
    setCashTenderedInput(formatRupiah(newTotal, false));
  };

  const handleAdminFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseRupiahInput(e.target.value);
    setAdminFee(val);
    setAdminFeeInput(formatRupiah(val, false));
    const newTotal = serviceType === 'KAS_KELUAR' ? nominal : nominal + val;
    setCashTendered(newTotal);
    setCashTenderedInput(formatRupiah(newTotal, false));
  };

  const handleCashTenderedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseRupiahInput(e.target.value);
    setCashTendered(val);
    setCashTenderedInput(formatRupiah(val, false));
  };

  const playCashRegisterSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // AudioContext fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nominal <= 0) {
      alert('Masukkan nominal transaksi yang valid.');
      return;
    }

    playCashRegisterSound();

    let category = 'Transfer Bank';
    if (serviceType === 'TARIK_TUNAI') category = 'Tarik Tunai';
    if (serviceType === 'SETOR_TUNAI') category = 'Setor Tunai';
    if (serviceType === 'PLN_TOKEN') category = 'PLN Listrik';
    if (serviceType === 'PULSA_DATA') category = 'Pulsa & Data';
    if (serviceType === 'TOPUP_WALLET') category = 'Top-Up E-Wallet';
    if (serviceType === 'BPJS_PDAM') category = 'Tagihan BPJS/PDAM';
    if (serviceType === 'KAS_KELUAR') category = 'Operasional Toko';

    const tokenCode = serviceType === 'PLN_TOKEN' ? generatePlnToken() : undefined;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      refNumber: generateRefNumber('AGR'),
      timestamp: new Date().toISOString(),
      type: serviceType,
      category,
      customerName: customerName.trim() || (serviceType === 'KAS_KELUAR' ? 'Kas Konter Toko' : 'Pelanggan Umum'),
      customerPhone: customerPhone.trim() || undefined,
      targetBankOrProvider: targetBankOrProvider || undefined,
      targetAccount: targetAccount.trim() || undefined,
      nominal,
      adminFee: serviceType === 'KAS_KELUAR' ? 0 : adminFee,
      profit,
      totalAmount,
      cashTendered: paymentMethod === 'TUNAI' ? cashTendered : undefined,
      change: paymentMethod === 'TUNAI' ? change : undefined,
      status: paymentMethod === 'BON_HUTANG' ? 'BON' : 'SUCCESS',
      paymentMethod,
      tokenCode,
      notes: notes.trim() || undefined,
    };

    onSubmitTransaction(
      newTx, 
      paymentMethod === 'BON_HUTANG', 
      paymentMethod === 'BON_HUTANG' ? debtDueDate : undefined
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="bg-[#003B73] text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold border border-white/20">
              {serviceType === 'TRANSFER' && <Send className="w-5 h-5 text-cyan-300" />}
              {serviceType === 'TARIK_TUNAI' && <ArrowDownToLine className="w-5 h-5 text-amber-300" />}
              {serviceType === 'SETOR_TUNAI' && <ArrowUpFromLine className="w-5 h-5 text-emerald-300" />}
              {serviceType === 'PLN_TOKEN' && <Zap className="w-5 h-5 text-yellow-300" />}
              {serviceType === 'PULSA_DATA' && <Smartphone className="w-5 h-5 text-purple-300" />}
              {serviceType === 'TOPUP_WALLET' && <CreditCard className="w-5 h-5 text-cyan-300" />}
              {serviceType === 'BPJS_PDAM' && <HeartHandshake className="w-5 h-5 text-teal-300" />}
              {serviceType === 'KAS_KELUAR' && <Receipt className="w-5 h-5 text-rose-300" />}
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-blue-200 tracking-wider">
                Transaksi Kasir Baru
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">
                {serviceType === 'TRANSFER' && 'Transfer Uang Antar Bank'}
                {serviceType === 'TARIK_TUNAI' && 'Tarik Tunai Kas Nasabah'}
                {serviceType === 'SETOR_TUNAI' && 'Setor Tunai ke Rekening'}
                {serviceType === 'PLN_TOKEN' && 'Beli Token Listrik PLN'}
                {serviceType === 'PULSA_DATA' && 'Isi Pulsa & Paket Data'}
                {serviceType === 'TOPUP_WALLET' && 'Top-Up Saldo E-Wallet'}
                {serviceType === 'BPJS_PDAM' && 'Bayar Tagihan BPJS / PDAM'}
                {serviceType === 'KAS_KELUAR' && 'Catat Kas Keluar Operasional'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Customer Name & Phone */}
          {serviceType !== 'KAS_KELUAR' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pelanggan / Nasabah
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    placeholder="Contoh: Pak Budi Hartono"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C] focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  No. WhatsApp / HP (Kirim Struk)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C] focus:bg-white text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Service Provider & Account Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {serviceType === 'TRANSFER' && 'Bank Tujuan'}
                {serviceType === 'TARIK_TUNAI' && 'Metode / Bank Penarik'}
                {serviceType === 'SETOR_TUNAI' && 'Bank Rekening Tujuan'}
                {serviceType === 'PLN_TOKEN' && 'Jenis Layanan PLN'}
                {serviceType === 'PULSA_DATA' && 'Operator Seluler'}
                {serviceType === 'TOPUP_WALLET' && 'Pilihan E-Wallet'}
                {serviceType === 'BPJS_PDAM' && 'Jenis Tagihan'}
                {serviceType === 'KAS_KELUAR' && 'Kategori Biaya Operasional'}
              </label>
              <select
                value={targetBankOrProvider}
                onChange={(e) => setTargetBankOrProvider(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C] focus:bg-white text-slate-900 font-medium"
              >
                {serviceType === 'TRANSFER' && (
                  <>
                    <option value="Bank BRI">Bank BRI</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="Bank BCA">Bank BCA</option>
                    <option value="Bank BNI">Bank BNI</option>
                    <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI)</option>
                    <option value="Bank Raya / BRI Agro">Bank Raya / BRI Agro</option>
                    <option value="Bank CIMB Niaga">Bank CIMB Niaga</option>
                    <option value="Bank Danamon">Bank Danamon</option>
                    <option value="Bank Jago">Bank Jago</option>
                    <option value="SeaBank">SeaBank</option>
                  </>
                )}
                {serviceType === 'TARIK_TUNAI' && (
                  <>
                    <option value="Bank BRI (Kartu ATM)">Bank BRI (Kartu ATM)</option>
                    <option value="Bank Mandiri (Kartu ATM)">Bank Mandiri (Kartu ATM)</option>
                    <option value="Bank BCA (Kartu ATM)">Bank BCA (Kartu ATM)</option>
                    <option value="Tarik Tunai via QRIS">Tarik Tunai via QRIS</option>
                    <option value="Bank Lainnya (GPN)">Bank Lainnya (GPN)</option>
                  </>
                )}
                {serviceType === 'SETOR_TUNAI' && (
                  <>
                    <option value="Bank BRI">Bank BRI</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="Bank BCA">Bank BCA</option>
                    <option value="Bank BNI">Bank BNI</option>
                    <option value="Bank BSI">Bank BSI</option>
                  </>
                )}
                {serviceType === 'PLN_TOKEN' && (
                  <>
                    <option value="PLN Prepaid (Prabayar)">PLN Prabayar (Token 20 Digit)</option>
                    <option value="PLN Postpaid (Tagihan Bulanan)">PLN Pascabayar (Tagihan Bulanan)</option>
                  </>
                )}
                {serviceType === 'PULSA_DATA' && (
                  <>
                    <option value="Telkomsel">Telkomsel (SimPATI / Halo)</option>
                    <option value="Indosat Ooredoo">Indosat Ooredoo (IM3)</option>
                    <option value="XL Axiata">XL Axiata</option>
                    <option value="Tri (3)">Tri (3)</option>
                    <option value="Smartfren">Smartfren</option>
                  </>
                )}
                {serviceType === 'TOPUP_WALLET' && (
                  <>
                    <option value="DANA Saldo">DANA Saldo</option>
                    <option value="GoPay Customer">GoPay Customer</option>
                    <option value="GoPay Driver">GoPay Driver</option>
                    <option value="OVO Saldo">OVO Cash</option>
                    <option value="ShopeePay">ShopeePay</option>
                    <option value="LinkAja">LinkAja</option>
                    <option value="Maxim Driver">Maxim Driver</option>
                  </>
                )}
                {serviceType === 'BPJS_PDAM' && (
                  <>
                    <option value="BPJS Kesehatan">BPJS Kesehatan Mandiri</option>
                    <option value="PDAM Air Minum">PDAM Air Minum Daerah</option>
                    <option value="Telkom Indihome">Telkom / Indihome</option>
                    <option value="PBB Pajak Bumi & Bangunan">PBB Pajak Daerah</option>
                  </>
                )}
                {serviceType === 'KAS_KELUAR' && (
                  <>
                    <option value="Kertas Thermal Kasir">Kertas Thermal Kasir & ATK</option>
                    <option value="Listrik & Air Toko">Listrik & Air Toko</option>
                    <option value="Bensin / Transport Kas">Bensin / Transport Ambil Uang</option>
                    <option value="Konsumsi Kasir / Minum">Konsumsi Kasir / Galon Air Toko</option>
                    <option value="Biaya Operasional Lainnya">Biaya Operasional Lainnya</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {serviceType === 'TRANSFER' && 'Nomor Rekening Tujuan'}
                {serviceType === 'TARIK_TUNAI' && 'Nomor Kartu / Ref Nasabah'}
                {serviceType === 'SETOR_TUNAI' && 'Nomor Rekening Tujuan'}
                {serviceType === 'PLN_TOKEN' && 'Nomor Meter / ID Pelanggan (11-12 Digit)'}
                {serviceType === 'PULSA_DATA' && 'Nomor HP Tujuan'}
                {serviceType === 'TOPUP_WALLET' && 'Nomor HP Akun E-Wallet'}
                {serviceType === 'BPJS_PDAM' && 'Nomor Pelanggan / ID Tagihan'}
                {serviceType === 'KAS_KELUAR' && 'Keterangan Pengeluaran'}
              </label>
              <input
                type="text"
                placeholder={
                  serviceType === 'PLN_TOKEN' 
                    ? 'Contoh: 1420 9938 1209' 
                    : serviceType === 'PULSA_DATA' || serviceType === 'TOPUP_WALLET'
                    ? '08xxxxxxxxxx'
                    : 'Nomor referensi / rekening...'
                }
                value={targetAccount}
                onChange={(e) => setTargetAccount(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00529C] focus:bg-white text-slate-900 tnum font-medium"
              />
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Pilih Nominal Cepat
              </label>
              <span className="text-[11px] text-slate-400">Tekan untuk isi otomatis</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {quickNominals.map((q) => (
                <button
                  type="button"
                  key={q}
                  onClick={() => handleNominalSelect(q)}
                  className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all text-center tnum cursor-pointer ${
                    nominal === q
                      ? 'bg-[#00529C] text-white border-[#00529C] shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {formatRupiah(q)}
                </button>
              ))}
            </div>
          </div>

          {/* Manual Currency & Fee Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Nominal input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nominal Transaksi
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-500 font-bold text-sm">Rp</span>
                <input
                  type="text"
                  value={nominalInput}
                  onChange={handleNominalChange}
                  className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00529C] tnum"
                />
              </div>
            </div>

            {/* Admin Fee Input */}
            {serviceType !== 'KAS_KELUAR' ? (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Biaya Admin Konter (Komisi)
                  </label>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                    Keuntungan Anda
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-slate-500 font-bold text-sm">Rp</span>
                  <input
                    type="text"
                    value={adminFeeInput}
                    onChange={handleAdminFeeChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 tnum"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Pengeluaran
                </label>
                <input
                  type="text"
                  placeholder="Misal: Nota Toko No. 49"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-900"
                />
              </div>
            )}
          </div>

          {/* Settlement / Payment Method Selection */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Metode Pembayaran Pelanggan
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('TUNAI')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'TUNAI'
                    ? 'border-[#00529C] bg-blue-50 text-[#00529C] font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">💵 Kas Tunai</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Uang masuk laci</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('POTONG_FLOAT')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'POTONG_FLOAT'
                    ? 'border-[#00529C] bg-blue-50 text-[#00529C] font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">💳 Potong Float</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Debit / Saldo Bank</div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('BON_HUTANG')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  paymentMethod === 'BON_HUTANG'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">📝 Bon / Utang</div>
                <div className="text-[10px] text-amber-700 mt-0.5">Bayar nanti (Cicil)</div>
              </button>
            </div>

            {/* Bon/Utang due date if selected */}
            {paymentMethod === 'BON_HUTANG' && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Transaksi ini akan dicatat ke Buku Bon Piutang Pelanggan</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700">Tanggal Jatuh Tempo</label>
                    <input
                      type="date"
                      value={debtDueDate}
                      onChange={(e) => setDebtDueDate(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700">Catatan Pelanggan</label>
                    <input
                      type="text"
                      placeholder="Misal: Janji bayar sabtu sore"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cash Tendered & Change Calculator (When Cash) */}
          {paymentMethod === 'TUNAI' && serviceType !== 'KAS_KELUAR' && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-slate-500" />
                  Kalkulator Uang Diterima & Kembalian
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  Hitung uang pas / kembalian
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Uang Diterima (Tunai)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-slate-500 font-bold text-sm">Rp</span>
                    <input
                      type="text"
                      value={cashTenderedInput}
                      onChange={handleCashTenderedChange}
                      className="w-full pl-10 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold tnum text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Uang Kembalian Kasir
                  </label>
                  <div className={`py-2 px-3 rounded-lg border text-base font-extrabold tnum ${
                    change > 0 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
                      : 'bg-white border-slate-200 text-slate-500'
                  }`}>
                    {formatRupiah(change)}
                  </div>
                </div>
              </div>

              {/* Quick Cash Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-500">Uang Cepat:</span>
                <button
                  type="button"
                  onClick={() => {
                    setCashTendered(totalAmount);
                    setCashTenderedInput(formatRupiah(totalAmount, false));
                  }}
                  className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700"
                >
                  Uang Pas
                </button>
                {[50000, 100000, 200000, 500000].map(amt => (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => {
                      setCashTendered(amt);
                      setCashTenderedInput(formatRupiah(amt, false));
                    }}
                    className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-xs font-semibold text-slate-700 tnum"
                  >
                    {formatRupiah(amt)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grand Total Summary Box */}
          <div className="bg-[#0B2046] text-white p-4 rounded-xl flex items-center justify-between shadow-inner">
            <div>
              <div className="text-xs text-blue-200 uppercase font-semibold">
                Total Tagihan ke Pelanggan
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold tnum text-white leading-tight mt-0.5">
                {formatRupiah(totalAmount)}
              </div>
              {serviceType !== 'KAS_KELUAR' && (
                <div className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <span>Margin Bersih:</span>
                  <span className="tnum font-bold">{formatRupiah(profit)}</span>
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-xs text-blue-200">Ref. Transaksi:</div>
              <div className="font-mono text-xs text-amber-300 font-semibold mt-0.5">
                {generateRefNumber('AGR')}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition-colors text-sm cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              className="flex-[2] py-3 px-5 rounded-xl bg-[#00529C] hover:bg-blue-700 active:bg-blue-800 text-white font-extrabold text-sm sm:text-base transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Selesaikan & Buat Struk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
