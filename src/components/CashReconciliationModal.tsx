import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Coins, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import { AgentSettings, CashDenomination, Transaction } from '../types';
import { formatDateTime, formatRupiah } from '../utils/formatters';

interface CashReconciliationModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AgentSettings;
  transactions: Transaction[];
  onCompleteClosing: (actualCash: number, difference: number, notes: string) => void;
}

export const CashReconciliationModal: React.FC<CashReconciliationModalProps> = ({
  isOpen,
  onClose,
  settings,
  transactions,
  onCompleteClosing,
}) => {
  if (!isOpen) return null;

  // Denominations count state
  const [denoms, setDenoms] = useState<CashDenomination>({
    k100: Math.floor(settings.cashInHandBalance * 0.6 / 100000),
    k50: Math.floor((settings.cashInHandBalance * 0.25) / 50000),
    k20: Math.floor((settings.cashInHandBalance * 0.1) / 20000),
    k10: 10,
    k5: 10,
    k2: 15,
    k1: 10,
    koin: 0,
  });

  const [closingNotes, setClosingNotes] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  // Calculate actual total from counted banknotes
  const actualCashCalculated = 
    (denoms.k100 * 100000) +
    (denoms.k50 * 50000) +
    (denoms.k20 * 20000) +
    (denoms.k10 * 10000) +
    (denoms.k5 * 5000) +
    (denoms.k2 * 2000) +
    (denoms.k1 * 1000) +
    denoms.koin;

  const expectedCash = settings.cashInHandBalance;
  const difference = actualCashCalculated - expectedCash;

  const handleDenomChange = (key: keyof CashDenomination, val: string) => {
    const num = parseInt(val.replace(/[^0-9]/g, ''), 10) || 0;
    setDenoms(prev => ({ ...prev, [key]: num }));
  };

  const handleFillExact = () => {
    // Helper to calculate exact denominations matching expected cash
    let rem = expectedCash;
    const k100 = Math.floor(rem / 100000);
    rem %= 100000;
    const k50 = Math.floor(rem / 50000);
    rem %= 50000;
    const k20 = Math.floor(rem / 20000);
    rem %= 20000;
    const k10 = Math.floor(rem / 10000);
    rem %= 10000;
    const k5 = Math.floor(rem / 5000);
    rem %= 5000;
    const k2 = Math.floor(rem / 2000);
    rem %= 2000;
    const k1 = Math.floor(rem / 1000);
    rem %= 1000;
    setDenoms({
      k100,
      k50,
      k20,
      k10,
      k5,
      k2,
      k1,
      koin: rem,
    });
  };

  const handleFinalize = () => {
    onCompleteClosing(actualCashCalculated, difference, closingNotes);
    setIsCompleted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="bg-[#072448] text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Rekonsiliasi & Tutup Kas Akhir Shift
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Penghitungan Kas Fisik di Laci ({settings.agentName.split(' ')[0]})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {!isCompleted ? (
          <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Balance Comparison Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="text-[11px] uppercase font-semibold text-slate-500">
                  Saldo Kas Sistem
                </div>
                <div className="text-lg font-extrabold tnum text-slate-900 mt-0.5">
                  {formatRupiah(expectedCash)}
                </div>
                <div className="text-[10px] text-slate-400">Total catatan buku jurnal</div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="text-[11px] uppercase font-semibold text-[#00529C]">
                  Kas Fisik Terhitung
                </div>
                <div className="text-lg font-extrabold tnum text-[#003B73] mt-0.5">
                  {formatRupiah(actualCashCalculated)}
                </div>
                <div className="text-[10px] text-blue-600">Hasil hitung lembaran</div>
              </div>

              <div className={`p-3 rounded-xl border ${
                difference === 0 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : difference > 0 
                  ? 'bg-amber-50 border-amber-200 text-amber-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <div className="text-[11px] uppercase font-semibold flex items-center justify-between">
                  <span>Selisih (Difference)</span>
                  {difference === 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <div className="text-lg font-extrabold tnum mt-0.5">
                  {difference > 0 ? `+${formatRupiah(difference)}` : formatRupiah(difference)}
                </div>
                <div className="text-[10px] font-medium">
                  {difference === 0 ? 'SEIMBANG (MATCH)' : difference > 0 ? 'KAS LEBIH' : 'KAS KURANG'}
                </div>
              </div>
            </div>

            {/* Denomination Counter Assistant */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <Calculator className="w-4 h-4 text-[#00529C]" />
                  <span>Kalkulator Pecahan Uang Kertas & Logam</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillExact}
                  className="text-xs font-semibold text-[#00529C] hover:text-blue-800 flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Isi Otomatis Pas</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                {/* 100k */}
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-bold text-rose-700 block">Rp 100.000</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="number"
                      min={0}
                      value={denoms.k100}
                      onChange={(e) => handleDenomChange('k100', e.target.value)}
                      className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold tnum text-slate-900"
                    />
                    <span className="text-slate-400">lbr</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 tnum">
                    = {formatRupiah(denoms.k100 * 100000)}
                  </div>
                </div>

                {/* 50k */}
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-bold text-blue-700 block">Rp 50.000</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="number"
                      min={0}
                      value={denoms.k50}
                      onChange={(e) => handleDenomChange('k50', e.target.value)}
                      className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold tnum text-slate-900"
                    />
                    <span className="text-slate-400">lbr</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 tnum">
                    = {formatRupiah(denoms.k50 * 50000)}
                  </div>
                </div>

                {/* 20k */}
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-bold text-emerald-700 block">Rp 20.000</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="number"
                      min={0}
                      value={denoms.k20}
                      onChange={(e) => handleDenomChange('k20', e.target.value)}
                      className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold tnum text-slate-900"
                    />
                    <span className="text-slate-400">lbr</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 tnum">
                    = {formatRupiah(denoms.k20 * 20000)}
                  </div>
                </div>

                {/* 10k */}
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-bold text-purple-700 block">Rp 10.000</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="number"
                      min={0}
                      value={denoms.k10}
                      onChange={(e) => handleDenomChange('k10', e.target.value)}
                      className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold tnum text-slate-900"
                    />
                    <span className="text-slate-400">lbr</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 tnum">
                    = {formatRupiah(denoms.k10 * 10000)}
                  </div>
                </div>

                {/* 5k */}
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-bold text-amber-700 block">Rp 5.000</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="number"
                      min={0}
                      value={denoms.k5}
                      onChange={(e) => handleDenomChange('k5', e.target.value)}
                      className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold tnum text-slate-900"
                    />
                    <span className="text-slate-400">lbr</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 tnum">
                    = {formatRupiah(denoms.k5 * 5000)}
                  </div>
                </div>

                {/* 2k */}
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block">Rp 2.000</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="number"
                      min={0}
                      value={denoms.k2}
                      onChange={(e) => handleDenomChange('k2', e.target.value)}
                      className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold tnum text-slate-900"
                    />
                    <span className="text-slate-400">lbr</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 tnum">
                    = {formatRupiah(denoms.k2 * 2000)}
                  </div>
                </div>

                {/* 1k */}
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-700 block">Rp 1.000</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="number"
                      min={0}
                      value={denoms.k1}
                      onChange={(e) => handleDenomChange('k1', e.target.value)}
                      className="w-16 px-1.5 py-1 border border-slate-300 rounded text-center font-bold tnum text-slate-900"
                    />
                    <span className="text-slate-400">lbr</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 tnum">
                    = {formatRupiah(denoms.k1 * 1000)}
                  </div>
                </div>

                {/* Coins */}
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="font-bold text-cyan-800 block">Total Koin (Rp)</span>
                  <div className="flex items-center space-x-1 mt-1">
                    <input
                      type="number"
                      min={0}
                      step={500}
                      value={denoms.koin}
                      onChange={(e) => handleDenomChange('koin', e.target.value)}
                      className="w-full px-1.5 py-1 border border-slate-300 rounded text-center font-bold tnum text-slate-900"
                    />
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 tnum">
                    = {formatRupiah(denoms.koin)}
                  </div>
                </div>
              </div>
            </div>

            {/* Closing Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Penutupan Kas / Keterangan Selisih
              </label>
              <textarea
                rows={2}
                placeholder="Misal: Uang fisik seimbang. Shift ditutup rapi untuk diserahkan ke kasir malam."
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00529C]"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 text-xs"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleFinalize}
                className="flex-[2] py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Simpan & Selesaikan Tutup Kas</span>
              </button>
            </div>
          </div>
        ) : (
          /* Success Closing Summary */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Tutup Kasir Berhasil Disimpan!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Berita acara rekonsiliasi kas telah diarsipkan ke buku besar agen.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Waktu Tutup:</span>
                <span className="font-semibold text-slate-800">{formatDateTime(new Date())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kasir Bertugas:</span>
                <span className="font-semibold text-slate-800">{settings.agentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kas Fisik Akhir:</span>
                <span className="font-bold text-slate-900 tnum">{formatRupiah(actualCashCalculated)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status Selisih:</span>
                <span className={`font-bold tnum ${difference === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {difference === 0 ? 'SEIMBANG (Rp 0)' : formatRupiah(difference)}
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Rekap Kasir</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#00529C] hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Selesai & Keluar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
