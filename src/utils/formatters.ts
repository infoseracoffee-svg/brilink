export function formatRupiah(amount: number, withPrefix = true): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return withPrefix ? 'Rp 0' : '0';
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return withPrefix ? `Rp ${formatted}` : formatted;
}

export function parseRupiahInput(val: string): number {
  const clean = val.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
}

export function formatDateTime(isoOrDate: string | Date): string {
  try {
    const d = new Date(isoOrDate);
    const day = d.getDate().toString().padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${mins} WIB`;
  } catch {
    return String(isoOrDate);
  }
}

export function formatTimeOnly(isoOrDate: string | Date): string {
  try {
    const d = new Date(isoOrDate);
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}`;
  } catch {
    return '';
  }
}

export function generateRefNumber(prefix = 'AGR'): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${y}${m}${d}-${rand}`;
}

export function generatePlnToken(): string {
  const parts = [];
  for (let i = 0; i < 5; i++) {
    parts.push(Math.floor(1000 + Math.random() * 9000).toString());
  }
  return parts.join('-');
}

export function generateWhatsAppDebtMessage(
  customerName: string,
  amount: number,
  storeName: string,
  dueDate?: string
): string {
  const text = `Halo Yth. ${customerName}, salam hangat dari ${storeName}. Mengingatkan catatan kas/bon Anda sebesar ${formatRupiah(
    amount
  )}${dueDate ? ` dengan jatuh tempo ${dueDate}` : ''}. Mohon konfirmasi atau pelunasannya saat mampir ke toko. Terima kasih banyak!`;
  return encodeURIComponent(text);
}

export function generateWhatsAppReceiptMessage(
  txRef: string,
  customerName: string,
  serviceName: string,
  nominal: number,
  adminFee: number,
  total: number,
  tokenOrCode?: string
): string {
  let msg = `*BUKTI TRANSAKSI AGEN AGRO*\n` +
    `No. Ref: ${txRef}\n` +
    `Pelanggan: ${customerName}\n` +
    `Layanan: ${serviceName}\n` +
    `Nominal: ${formatRupiah(nominal)}\n` +
    `Biaya Admin: ${formatRupiah(adminFee)}\n` +
    `---------------------------\n` +
    `*TOTAL: ${formatRupiah(total)}*\n` +
    `Status: SUKSES / BERHASIL\n`;

  if (tokenOrCode) {
    msg += `*KODE TOKEN/SN:*\n${tokenOrCode}\n`;
  }
  msg += `---------------------------\nTerima kasih telah bertransaksi di Agen Agro kami!`;

  return encodeURIComponent(msg);
}
