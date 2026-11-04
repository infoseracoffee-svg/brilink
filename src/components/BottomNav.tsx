import React from 'react';
import { 
  Home, 
  Store, 
  Plus, 
  BookOpen, 
  FileSpreadsheet, 
  Lock 
} from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onOpenNewTransaction: () => void;
  unpaidDebtCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenNewTransaction,
  unpaidDebtCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-2xl px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around relative">
        {/* Beranda */}
        <button
          onClick={() => onChangeTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'dashboard'
              ? 'text-[#00529C] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Beranda</span>
        </button>

        {/* POS Quick Catalog */}
        <button
          onClick={() => onChangeTab('pos')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'pos'
              ? 'text-[#00529C] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Store className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Kasir POS</span>
        </button>

        {/* Elevated Center Button: Catat Transaksi */}
        <div className="relative -top-4">
          <button
            onClick={onOpenNewTransaction}
            className="w-13 h-13 rounded-full bg-[#00529C] hover:bg-blue-700 active:bg-blue-800 text-white flex items-center justify-center shadow-lg border-4 border-white transition-transform active:scale-95 cursor-pointer"
            title="Catat Transaksi Baru"
          >
            <Plus className="w-7 h-7 stroke-[2.5]" />
          </button>
        </div>

        {/* Buku Kas & Bon */}
        <button
          onClick={() => onChangeTab('bon')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
            activeTab === 'bon'
              ? 'text-[#00529C] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {unpaidDebtCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
              {unpaidDebtCount}
            </span>
          )}
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Buku Bon</span>
        </button>

        {/* Jurnal Mutasi */}
        <button
          onClick={() => onChangeTab('ledger')}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            activeTab === 'ledger'
              ? 'text-[#00529C] font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Jurnal</span>
        </button>
      </div>
    </div>
  );
};
