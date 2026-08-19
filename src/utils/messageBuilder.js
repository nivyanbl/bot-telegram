const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatPrice = (value) => value.toLocaleString("id-ID");

const buildProductCatalogText = (products) => {
  let text = "<b>📋 DAFTAR PRODUK</b>\n\n";

  products.forEach((prod, index) => {
    const number = index + 1;
    text += `<b>${number}.</b> ${escapeHtml(prod.name)}\n`;
  });

  text += "\nSilakan klik produk atau ketik nomornya.";
  text += "\nContoh: <code>1</code>";

  return text;
};

const buildVariantText = (variants) => {
  let text = "<b>📋 PILIHAN PAKET & DURASI</b>\n\n";

  variants.forEach((variant) => {
    text += `🔹 <b>Paket:</b> ${escapeHtml(variant.name)}\n`;
    text += `📝 <b>Keterangan:</b> ${escapeHtml(variant.description || "-")}\n`;
    text += `💰 <b>Harga:</b> Rp ${formatPrice(variant.price)}\n`;
    text += `📦 <b>Stok:</b> ${variant.stockCount} tersedia\n\n`;
  });

  return text;
};

module.exports = {
  buildProductCatalogText,
  buildVariantText,
  escapeHtml,
  formatPrice,
};
