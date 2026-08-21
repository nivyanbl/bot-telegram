const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatRupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(number);

const buildProductCatalogMessage = (products) => {
  let text = "<b>📋 DAFTAR PRODUK</b>\n\n";
  products.forEach((product, index) => {
    text += `<b>${index + 1}.</b> ${escapeHtml(product.name)}\n`;
  });
  return `${text}\nPilih nomor lewat tombol atau ketik manual.`;
};

const buildVariantMessage = (product) => {
  let text = `<b>${escapeHtml(product.name).toUpperCase()}</b>\n\n`;
  product.variants.forEach((variant) => {
    text += `╭── <b>[ ${escapeHtml(variant.name)} ]</b>\n`;
    text += `│ 💵 <b>Harga:</b> ${formatRupiah(variant.price)}\n`;
    text += `│ 📦 <b>Stok:</b> ${variant.stockCount} pcs\n`;
    text += `│ 📝 <b>Deskripsi:</b> ${escapeHtml(variant.description || "-")}\n`;
    text += "╰────────────────\n\n";
  });
  return text;
};

const buildInvoiceMessage = (transaction, variant) =>
  "🧾 *INVOICE PEMBELIAN*\n\n" +
  `No. Invoice: \`${transaction.invoice_id}\`\n` +
  `Produk: *${variant.products.name}*\n` +
  `Paket: *${variant.name}*\n` +
  `Total Tagihan: *${formatRupiah(transaction.amount)}*\n` +
  "Status: *MENUNGGU PEMBAYARAN*\n\n" +
  "Klik tombol di bawah untuk simulasi pembayaran.";

const buildSuccessMessage = (accountData) =>
  "✅ *PEMBAYARAN BERHASIL!*\n\n" +
  "Berikut detail akun digital Anda:\n\n" +
  `\`\`\`\n${accountData}\n\`\`\`\n\n` +
  "Simpan data akun ini baik-baik.";

module.exports = {
  buildInvoiceMessage,
  buildProductCatalogMessage,
  buildSuccessMessage,
  buildVariantMessage,
  escapeHtml,
  formatRupiah,
};
