import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Building2, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { AgentSettings, Transaction } from '../types';
import { formatDateTime, formatRupiah, generateWhatsAppReceiptMessage } from '../utils/formatters';

interface ThermalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  settings: AgentSettings;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  settings,
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyToken = () => {
    if (transaction.tokenCode) {
      navigator.clipboard.writeText(transaction.tokenCode);
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleCopyText = () => {
    const textReceipt = `================================
${settings.storeName}
${settings.storeAddress}
ID Agen: ${settings.agentId} | Telp: ${settings.storePhone}
================================
Waktu   : ${formatDateTime(transaction.timestamp)}
No. Ref : ${transaction.refNumber}
Kasir   : ${settings.agentName}
Layanan : ${transaction.category}
--------------------------------
Nasabah : ${transaction.customerName}
Tujuan  : ${transaction.targetAccount || '-'} (${transaction.targetBankOrProvider || '-'})
Nominal : ${formatRupiah(transaction.nominal)}
Biaya   : ${formatRupiah(transaction.adminFee)}
--------------------------------
TOTAL   : ${formatRupiah(transaction.totalAmount)}
Bayar   : ${transaction.cashTendered ? formatRupiah(transaction.cashTendered) : 'Non-Tunai'}
Kembali : ${transaction.change ? formatRupiah(transaction.change) : 'Rp 0'}
Status  : ${transaction.status}
${transaction.tokenCode ? `\nKODE TOKEN PLN:\n${transaction.tokenCode}\n` : ''}
================================
SIMPAN STRUK INI SEBAGAI BUKTI
TRANSAKSI YANG SAH
Terima Kasih!`;

    navigator.clipboard.writeText(textReceipt);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?phone=${
      transaction.customerPhone ? transaction.customerPhone.replace(/[^0-9]/g, '') : ''
    }&text=${generateWhatsAppReceiptMessage(
      transaction.refNumber,
      transaction.customerName,
      transaction.category,
      transaction.nominal,
      transaction.adminFee,
      transaction.totalAmount,
      transaction.tokenCode
    )}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 duration-150 my-auto text-slate-100">
        {/* Top Control Bar */}
        <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs uppercase font-bold text-slate-200">
              Struk Transaksi Selesai
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Container */}
        <div className="p-4 sm:p-6 flex flex-col items-center">
          {/* Printable Thermal Receipt Paper */}
          <div 
            id="thermal-receipt-print"
            className="w-full max-w-[340px] bg-[#FFFFFA] text-slate-950 p-5 rounded-sm shadow-xl font-mono text-xs border border-slate-300 relative select-text"
            style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              borderBottom: '4px dashed #cbd5e1'
            }}
          >
            {/* Header */}
            <div className="text-center space-y-1 mb-3">
              <div className="flex items-center justify-center space-x-1.5 font-bold text-sm tracking-tight text-slate-900 uppercase">
                <Building2 className="w-4 h-4 text-[#00529C]" />
                <span>{settings.storeName}</span>
              </div>
              <p className="text-[10px] text-slate-600 leading-tight">
                {settings.storeAddress}
              </p>
              <p className="text-[10px] text-slate-600">
                ID Agen: <span className="font-bold">{settings.agentId}</span> • Telp: {settings.storePhone}
              </p>
            </div>

            <div className="border-b border-dashed border-slate-400 my-2"></div>

            {/* Meta */}
            <div className="space-y-0.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-600">WAKTU</span>
                <span className="tnum font-medium">{formatDateTime(transaction.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">NO. REF</span>
                <span className="font-bold">{transaction.refNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">KASIR</span>
                <span>{settings.agentName.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">LAYANAN</span>
                <span className="font-bold uppercase">{transaction.category}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-slate-400 my-2"></div>

            {/* Transaction Detail */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-600">Pelanggan:</span>
                <span className="font-bold text-right">{transaction.customerName}</span>
              </div>
              {transaction.targetBankOrProvider && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Bank/Tujuan:</span>
                  <span className="font-medium text-right">{transaction.targetBankOrProvider}</span>
                </div>
              )}
              {transaction.targetAccount && (
                <div className="flex justify-between">
                  <span className="text-slate-600">No. Rek / ID:</span>
                  <span className="font-bold text-right tnum">{transaction.targetAccount}</span>
                </div>
              )}
              <div className="flex justify-between pt-1">
                <span className="text-slate-600">Nominal Transaksi:</span>
                <span className="tnum font-medium">{formatRupiah(transaction.nominal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Biaya Admin Konter:</span>
                <span className="tnum font-medium">{formatRupiah(transaction.adminFee)}</span>
              </div>
            </div>

            <div className="border-b border-dashed border-slate-400 my-2"></div>

            {/* Total */}
            <div className="space-y-1">
              <div className="flex justify-between items-baseline font-bold text-sm">
                <span>TOTAL BAYAR:</span>
                <span className="tnum text-base font-extrabold">{formatRupiah(transaction.totalAmount)}</span>
              </div>
              {transaction.cashTendered && (
                <>
                  <div className="flex justify-between text-[11px] text-slate-700">
                    <span>Uang Tunai:</span>
                    <span className="tnum">{formatRupiah(transaction.cashTendered)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-700 font-bold">
                    <span>Kembalian:</span>
                    <span className="tnum">{formatRupiah(transaction.change || 0)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-[11px] pt-0.5">
                <span className="text-slate-600">Status Pembayaran:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                  {transaction.status === 'BON' ? 'CATAT BON / UTANG' : 'LUNAS / SUKSES'}
                </span>
              </div>
            </div>

            {/* PLN Token Code Banner if PLN */}
            {transaction.tokenCode && (
              <div className="my-3 p-2.5 bg-amber-50 border-2 border-dashed border-amber-400 rounded-sm text-center">
                <div className="text-[10px] font-bold uppercase text-amber-900 tracking-wider">
                  KODE TOKEN LISTRIK PLN (20 DIGIT)
                </div>
                <div className="text-sm font-black tracking-widest text-slate-900 mt-1 select-all font-mono">
                  {transaction.tokenCode}
                </div>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="mt-1.5 text-[10px] font-bold text-blue-700 hover:text-blue-900 flex items-center justify-center space-x-1 mx-auto cursor-pointer"
                >
                  {copiedToken ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedToken ? 'Token Disalin!' : 'Salin Nomor Token'}</span>
                </button>
              </div>
            )}

            <div className="border-b border-dashed border-slate-400 my-2"></div>

            {/* Footer */}
            <div className="text-center space-y-1 text-[10px] text-slate-500 pt-1">
              <p className="font-bold uppercase tracking-wider text-slate-700">
                BUKTI TRANSAKSI YANG SAH
              </p>
              <p>Terima kasih telah bertransaksi di Agen Agro kami</p>
              
              {/* Simulated barcode */}
              <div className="pt-2 flex flex-col items-center justify-center">
                <div className="w-44 h-8 bg-slate-900 flex items-center justify-center text-white text-[8px] font-mono tracking-widest rounded-xs">
                  || | ||| | |||| | || | ||| || ||
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5">{transaction.refNumber}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons Bar */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center space-x-1.5 bg-[#00529C] hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Struk (58/80)</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shadow-md cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim ke WhatsApp</span>
            </button>

            <button
              onClick={handleCopyText}
              className="col-span-2 sm:col-span-1 flex items-center justify-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium py-2.5 px-3 rounded-xl text-xs transition-colors border border-slate-700 cursor-pointer"
            >
              {copiedAll ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? 'Tersalin!' : 'Salin Struk'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors text-center cursor-pointer"
          >
            Selesai & Tutup Jendela
          </button>
        </div>
      </div>
    </div>
  );
};
