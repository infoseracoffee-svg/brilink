import React, { useState } from 'react';
import { 
  X, 
  ArrowUpDown, 
  Wallet, 
  Coins, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { AgentSettings } from '../types';
import { formatRupiah, parseRupiahInput } from '../utils/formatters';

interface FloatModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AgentSettings;
  onUpdateBalances: (newFloat: number, newCash: number, note: string) => void;
}

export const FloatModal: React.FC<FloatModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateBalances,
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'CASH_TO_FLOAT' | 'FLOAT_TO_CASH' | 'DIRECT_SET'>('CASH_TO_FLOAT');
  const [amountInput, setAmountInput] = useState<string>('2.000.000');
  const [notes, setNotes] = useState<string>('Setor kas fisik untuk tambah float bank');

  const amount = parseRupiahInput(amountInput);

  let projectedFloat = settings.bankFloatBalance;
  let projectedCash = settings.cashInHandBalance;

  if (mode === 'CASH_TO_FLOAT') {
    // Physical cash decreases, Digital float increases
    projectedCash = Math.max(0, settings.cashInHandBalance - amount);
    projectedFloat = settings.bankFloatBalance + amount;
  } else if (mode === 'FLOAT_TO_CASH') {
    // Digital float decreases, Physical cash increases
    projectedFloat = Math.max(0, settings.bankFloatBalance - amount);
    projectedCash = settings.cashInHandBalance + amount;
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Masukkan nominal mutasi yang valid.');
      return;
    }
    onUpdateBalances(projectedFloat, projectedCash, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-[#003B73] text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-cyan-300 font-bold border border-white/20">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-blue-200 tracking-wider">
                Mutasi Modal Agen
              </div>
              <h2 className="text-base font-bold text-white leading-tight">
                Pindah Modal Kas Laci & Float Bank
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApply} className="p-5 space-y-4">
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('CASH_TO_FLOAT');
                setNotes('Setor tunai ke rekening untuk isi saldo floating');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                mode === 'CASH_TO_FLOAT'
                  ? 'bg-white text-[#00529C] shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💵 Kas Laci ➔ 💳 Float
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('FLOAT_TO_CASH');
                setNotes('Tarik tunai dari ATM untuk isi kas fisik laci toko');
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                mode === 'FLOAT_TO_CASH'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💳 Float ➔ 💵 Kas Laci
            </button>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nominal yang Dimutasi (Rp)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-slate-500 font-bold text-sm">Rp</span>
              <input
                type="text"
                value={amountInput}
                onChange={(e) => setAmountInput(formatRupiah(parseRupiahInput(e.target.value), false))}
                className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00529C] tnum"
              />
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[1000000, 2000000, 5000000, 10000000].map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setAmountInput(formatRupiah(amt, false))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs tnum"
                >
                  +{formatRupiah(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Before & After Simulation Box */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-700">Simulasi Saldo Setelah Mutasi:</div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Saldo Float Bank:</span>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 line-through tnum">{formatRupiah(settings.bankFloatBalance)}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="font-bold text-blue-700 tnum">{formatRupiah(projectedFloat)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Kas Fisik Laci:</span>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 line-through tnum">{formatRupiah(settings.cashInHandBalance)}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
                <span className="font-bold text-emerald-700 tnum">{formatRupiah(projectedCash)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Catatan Mutasi
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-[2] py-2.5 rounded-xl bg-[#00529C] hover:bg-blue-700 text-white text-xs font-bold shadow-md"
            >
              Terapkan Perubahan Saldo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
