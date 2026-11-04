import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wallet, 
  Coins, 
  RefreshCw, 
  Lock, 
  Volume2, 
  VolumeX, 
  HelpCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { AgentSettings, ViewLayoutMode } from '../types';
import { formatRupiah } from '../utils/formatters';

interface HeaderProps {
  settings: AgentSettings;
  viewMode: ViewLayoutMode;
  onViewModeChange: (mode: ViewLayoutMode) => void;
  onOpenReconciliation: () => void;
  onOpenFloatModal: () => void;
  onResetData: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  viewMode,
  onViewModeChange,
  onOpenReconciliation,
  onOpenFloatModal,
  onResetData,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const dayName = days[now.getDay()];
      const date = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      const secs = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${dayName}, ${date} ${month} ${year} • ${hours}:${mins}:${secs} WIB`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-[#003B73] text-white border-b border-[#00529C] sticky top-0 z-30 shadow-md">
      {/* Top Utility Bar */}
      <div className="bg-[#072448] text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-blue-900/50">
        <div className="flex items-center space-x-3 text-blue-200">
          <div className="flex items-center space-x-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SERVER AGRO ONLINE</span>
          </div>
          <span className="hidden sm:inline text-blue-400/40">|</span>
          <div className="hidden sm:flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-blue-300" />
            <span className="tnum text-slate-200">{currentTime}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-1 bg-blue-950/60 px-2 py-0.5 rounded text-blue-200 border border-blue-800/40">
            <span>Shift:</span>
            <span className="font-semibold text-white">Pagi (07:00 - 15:00)</span>
          </div>
          
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Matikan Suara Kasir' : 'Aktifkan Suara Kasir'}
            className="text-blue-300 hover:text-white transition-colors p-1"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
          </button>

          <button
            onClick={() => {
              if (confirm('Muat ulang data demo transaksi default? Data saat ini akan diganti dengan data contoh.')) {
                onResetData();
              }
            }}
            title="Reset data demo transaksi"
            className="flex items-center space-x-1 text-blue-300 hover:text-white transition-colors px-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Agency Header */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Brand & Agency ID */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-white flex items-center justify-center shadow-inner text-[#003B73] font-black text-xl border-2 border-amber-400">
              <Building2 className="w-6 h-6 text-[#00529C]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg sm:text-xl tracking-tight leading-none text-white flex items-center gap-1.5">
                  AGRO LEDGER
                  <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-white tracking-wider">
                    PRO POS
                  </span>
                </h1>
              </div>
              <p className="text-xs text-blue-200 flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-amber-300">{settings.storeName}</span>
                <span className="text-blue-400">•</span>
                <span className="text-blue-200">{settings.agentId}</span>
              </p>
            </div>
          </div>

          {/* Mobile Quick Mode Selector */}
          <div className="flex md:hidden items-center bg-[#00284F] p-1 rounded-lg border border-blue-800">
            <button
              onClick={() => onViewModeChange('mobile')}
              className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-[#00529C] text-white shadow' : 'text-blue-300'}`}
              title="Tampilan HP"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('pos-tablet')}
              className={`p-1.5 rounded ${viewMode === 'pos-tablet' ? 'bg-[#00529C] text-white shadow' : 'text-blue-300'}`}
              title="Tampilan POS Tablet"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('desktop')}
              className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-[#00529C] text-white shadow' : 'text-blue-300'}`}
              title="Tampilan Desktop"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Balance Status & Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Digital Float Balance Card */}
          <div className="flex items-center space-x-2.5 bg-[#002A54] px-3 py-1.5 rounded-lg border border-blue-700/60 shadow-sm flex-1 sm:flex-initial">
            <div className="p-1.5 rounded-md bg-blue-600/40 text-blue-300">
              <Wallet className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-blue-300 leading-tight">
                Saldo Float Bank
              </div>
              <div className="text-sm font-bold tnum text-white leading-tight">
                {formatRupiah(settings.bankFloatBalance)}
              </div>
            </div>
          </div>

          {/* Cash Drawer Balance Card */}
          <div className="flex items-center space-x-2.5 bg-[#002A54] px-3 py-1.5 rounded-lg border border-blue-700/60 shadow-sm flex-1 sm:flex-initial">
            <div className="p-1.5 rounded-md bg-emerald-600/30 text-emerald-300">
              <Coins className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold text-emerald-300 leading-tight">
                Kas Fisik di Laci
              </div>
              <div className="text-sm font-bold tnum text-white leading-tight">
                {formatRupiah(settings.cashInHandBalance)}
              </div>
            </div>
          </div>

          {/* Action: Tarik/Setor Float Modal */}
          <button
            onClick={onOpenFloatModal}
            className="flex items-center space-x-1.5 bg-[#00529C] hover:bg-blue-600 active:bg-blue-700 text-white px-2.5 py-2 rounded-lg text-xs font-semibold border border-blue-400/40 transition-colors shadow-sm"
            title="Kelola Saldo Kas & Float"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mutasi Kas/Float</span>
          </button>

          {/* Action: Tutup Kas / Rekonsiliasi */}
          <button
            onClick={onOpenReconciliation}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 px-3 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Tutup Kasir</span>
          </button>

          {/* Desktop Layout Mode Switcher */}
          <div className="hidden md:flex items-center bg-[#072448] p-1 rounded-lg border border-blue-800">
            <button
              onClick={() => onViewModeChange('mobile')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'mobile' ? 'bg-[#00529C] text-white shadow' : 'text-blue-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>HP</span>
            </button>
            <button
              onClick={() => onViewModeChange('pos-tablet')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'pos-tablet' ? 'bg-[#00529C] text-white shadow' : 'text-blue-300 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>POS Kasir</span>
            </button>
            <button
              onClick={() => onViewModeChange('desktop')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewMode === 'desktop' ? 'bg-[#00529C] text-white shadow' : 'text-blue-300 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
