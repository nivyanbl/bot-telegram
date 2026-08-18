const { Bot, InlineKeyboard } = require('grammy');
const { botToken } = require('./src/config/env');
const handleStart = require('./src/commands/start');
const { getActiveProductsWithStock } = require('./src/services/productService');

const bot = new Bot(botToken);

bot.command('start', handleStart);

bot.callbackQuery('view_catalog', async (ctx) => {
  await ctx.answerCallbackQuery();

  try {
    const products = await getActiveProductsWithStock();

    if (products.length === 0) {
      return ctx.reply('Saat ini belum ada produk yang tersedia.');
    }

    const keyboard = new InlineKeyboard();
    let messageText = '📋 *KATALOG PRODUK*\n\n';

    products.forEach((item) => {
      messageText += `🔹 *${item.name}*\n`;
      messageText += `💰 Harga: Rp ${item.price.toLocaleString('id-ID')}\n`;
      messageText += `📦 Stok: ${item.stockCount} tersedia\n`;
      messageText += `📝 ${item.description}\n\n`;

      if (item.stockCount > 0) {
        keyboard.text(`Beli ${item.name}`, `buy_${item.id}`).row();
      }
    });

    return ctx.reply(messageText, {
      parse_mode: 'Markdown',
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error('Error saat memuat katalog:', err);
    return ctx.reply('Gagal memuat katalog produk.');
  }
});

bot.start();
console.log('Bot is running...');