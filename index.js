const { Bot, InlineKeyboard } = require('grammy');
const { botToken } = require('./src/config/env');
const handleStart = require('./src/commands/start');
const { getActiveProducts, getVariantsByProductId } = require('./src/services/productService');

const bot = new Bot(botToken);

bot.command('start', handleStart);

// 1. Tampilkan Daftar Produk Induk
bot.callbackQuery('view_catalog', async (ctx) => {
  await ctx.answerCallbackQuery();
  try {
    const products = await getActiveProducts();

    if (products.length === 0) {
      return ctx.reply('Saat ini belum ada produk yang tersedia.');
    }

    const keyboard = new InlineKeyboard();
    products.forEach((prod) => {
      keyboard.text(`📱 ${prod.name}`, `prod_${prod.id}`).row();
    });

    return ctx.editMessageText('Silakan pilih produk yang Anda inginkan:', {
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error(err);
    return ctx.reply('Gagal memuat daftar produk.');
  }
});

// 2. Tampilkan Varian Lengkap (Durasi, Deskripsi, Harga, Stok)
bot.callbackQuery(/^prod_(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const productId = ctx.match[1];

  try {
    const variants = await getVariantsByProductId(productId);

    if (variants.length === 0) {
      return ctx.reply('Belum ada pilihan durasi untuk produk ini.');
    }

    const keyboard = new InlineKeyboard();
    let text = '📋 *PILIHAN PAKET & DURASI*\n\n';

    variants.forEach((v) => {
      text += `🔹 *Paket:* ${v.name}\n`;
      text += `📝 *Keterangan:* ${v.description || '-'}\n`;
      text += `💰 *Harga:* Rp ${v.price.toLocaleString('id-ID')}\n`;
      text += `📦 *Stok:* ${v.stockCount} tersedia\n\n`;

      if (v.stockCount > 0) {
        keyboard.text(`Beli ${v.name} (Rp ${v.price.toLocaleString('id-ID')})`, `buy_var_${v.id}`).row();
      }
    });

    keyboard.text('⬅️ Kembali ke Daftar Produk', 'view_catalog');

    return ctx.editMessageText(text, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error(err);
    return ctx.reply('Gagal memuat rincian paket produk.');
  }
});

// 3. Tombol Beli Varian
bot.callbackQuery(/^buy_var_(\d+)$/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const variantId = ctx.match[1];
  return ctx.reply(`Anda memilih varian ID: ${variantId}. Lanjut ke pembayaran.`);
});

bot.start();
console.log('Bot is running...');