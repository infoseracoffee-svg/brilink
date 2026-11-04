import React from 'react';
import { 
  Send, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Zap, 
  Smartphone, 
  CreditCard, 
  HeartHandshake, 
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { TransactionType } from '../types';

interface POSQuickServicesProps {
  onSelectService: (serviceType: TransactionType) => void;
  selectedService?: TransactionType | null;
}

interface ServiceCardItem {
  type: TransactionType;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  badge?: string;
  badgeColor?: string;
  colorBg: string;
  colorBorder: string;
  iconColor: string;
  defaultAdminHint: string;
}

export const POSQuickServices: React.FC<POSQuickServicesProps> = ({
  onSelectService,
  selectedService,
}) => {
  const services: ServiceCardItem[] = [
    {
      type: 'TRANSFER',
      title: 'Transfer Uang',
      subtitle: 'Antar Bank (BRI, Mandiri, BCA, dll)',
      icon: Send,
      badge: 'Admin Rp 5rb - 10rb',
      badgeColor: 'bg-blue-100 text-[#00529C]',
      colorBg: 'bg-blue-50/60 hover:bg-blue-100/70',
      colorBorder: 'border-blue-200',
      iconColor: 'text-[#00529C] bg-blue-100',
      defaultAdminHint: 'Admin konter rata-rata Rp 5.000',
    },
    {
      type: 'TARIK_TUNAI',
      title: 'Tarik Tunai',
      subtitle: 'Pencairan Kas Nasabah / QRIS',
      icon: ArrowDownToLine,
      badge: 'Kas Laci Berkurang',
      badgeColor: 'bg-amber-100 text-amber-800',
      colorBg: 'bg-amber-50/60 hover:bg-amber-100/70',
      colorBorder: 'border-amber-200',
      iconColor: 'text-amber-700 bg-amber-100',
      defaultAdminHint: 'Diserahkan uang kas fisik dari laci',
    },
    {
      type: 'SETOR_TUNAI',
      title: 'Setor Tunai',
      subtitle: 'Terima Tunai & Kirim ke Rekening',
      icon: ArrowUpFromLine,
      badge: 'Kas Laci Bertambah',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      colorBg: 'bg-emerald-50/60 hover:bg-emerald-100/70',
      colorBorder: 'border-emerald-200',
      iconColor: 'text-emerald-700 bg-emerald-100',
      defaultAdminHint: 'Kas masuk laci, float berkurang',
    },
    {
      type: 'PLN_TOKEN',
      title: 'PLN Token Listrik',
      subtitle: 'Token 20k - 1jt & Tagihan Listrik',
      icon: Zap,
      badge: 'Auto Token 20 Digit',
      badgeColor: 'bg-yellow-100 text-yellow-900',
      colorBg: 'bg-yellow-50/60 hover:bg-yellow-100/70',
      colorBorder: 'border-yellow-200',
      iconColor: 'text-yellow-700 bg-yellow-100',
      defaultAdminHint: 'Cetak nomor token langsung di struk',
    },
    {
      type: 'PULSA_DATA',
      title: 'Pulsa & Paket Data',
      subtitle: 'Telkomsel, Indosat, XL, Tri',
      icon: Smartphone,
      badge: 'Semua Operator',
      badgeColor: 'bg-purple-100 text-purple-800',
      colorBg: 'bg-purple-50/60 hover:bg-purple-100/70',
      colorBorder: 'border-purple-200',
      iconColor: 'text-purple-700 bg-purple-100',
      defaultAdminHint: 'Proses detik langsung masuk ke HP',
    },
    {
      type: 'TOPUP_WALLET',
      title: 'Top-Up E-Wallet',
      subtitle: 'DANA, GoPay, OVO, ShopeePay',
      icon: CreditCard,
      badge: 'Admin Rp 2.500 - 3.500',
      badgeColor: 'bg-cyan-100 text-cyan-800',
      colorBg: 'bg-cyan-50/60 hover:bg-cyan-100/70',
      colorBorder: 'border-cyan-200',
      iconColor: 'text-cyan-700 bg-cyan-100',
      defaultAdminHint: 'Top-up saldo dompet digital instan',
    },
    {
      type: 'BPJS_PDAM',
      title: 'BPJS & PDAM Air',
      subtitle: 'Tagihan Rutin Bulanan & WiFi',
      icon: HeartHandshake,
      badge: 'PPOB Bulanan',
      badgeColor: 'bg-teal-100 text-teal-800',
      colorBg: 'bg-teal-50/60 hover:bg-teal-100/70',
      colorBorder: 'border-teal-200',
      iconColor: 'text-teal-700 bg-teal-100',
      defaultAdminHint: 'Bayar iuran BPJS & tagihan air resmi',
    },
    {
      type: 'KAS_KELUAR',
      title: 'Kas Keluar Operasional',
      subtitle: 'Beli Kertas Roll, Bensin, dll',
      icon: Receipt,
      badge: 'Biaya Toko',
      badgeColor: 'bg-rose-100 text-rose-800',
      colorBg: 'bg-rose-50/60 hover:bg-rose-100/70',
      colorBorder: 'border-rose-200',
      iconColor: 'text-rose-700 bg-rose-100',
      defaultAdminHint: 'Catat pengeluaran toko agar kas seimbang',
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Katalog Layanan Konter Kasir</span>
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">
              (Pilih layanan untuk membuka transaksi)
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Pencatatan cepat perbankan agen & PPOB dengan hitungan komisi otomatis
          </p>
        </div>
        <div className="flex items-center space-x-1 text-xs text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>8 Layanan Aktif</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {services.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedService === item.type;
          return (
            <button
              key={item.type}
              onClick={() => onSelectService(item.type)}
              className={`text-left p-3.5 rounded-xl border-2 transition-all flex flex-col justify-between group min-h-[110px] cursor-pointer ${
                isSelected 
                  ? 'border-[#00529C] bg-blue-50/90 shadow-md ring-2 ring-blue-500/20' 
                  : `${item.colorBorder} ${item.colorBg} hover:shadow-md`
              }`}
            >
              <div className="flex items-start justify-between w-full mb-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold ${item.iconColor} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-tight ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug group-hover:text-[#00529C] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
