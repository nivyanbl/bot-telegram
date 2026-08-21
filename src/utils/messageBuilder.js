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

  products.forEach((product, index) => {
    text += `<b>${index + 1}.</b> ${escapeHtml(product.name)}\n`;
  });

  return (
    `${text}\n` +
    "Silakan pilih nomor produk melalui tombol di bawah atau ketik manual.\n" +
    "Contoh: <code>1</code>"
  );
};

const buildVariantText = (productName, variants) => {
  let text = `<b>${escapeHtml(productName).toUpperCase()}</b>\n\n`;

  variants.forEach((variant) => {
    text += `╭── <b>[ ${escapeHtml(variant.name)} ]</b>\n`;
    text += `│ 💵 <b>Harga:</b> Rp ${formatPrice(variant.price)}\n`;
    text += `│ 📦 <b>Stok:</b> ${variant.stockCount} pcs\n`;
    text += `│ 📝 <b>Deskripsi:</b> ${escapeHtml(variant.description || "-")}\n`;
    text += "╰────────────────\n\n";
  });

  return text;
};

module.exports = {
  buildProductCatalogText,
  buildVariantText,
  escapeHtml,
  formatPrice,
};
