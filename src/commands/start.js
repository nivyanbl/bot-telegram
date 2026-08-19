const { InlineKeyboard } = require('grammy');
const supabase = require('../config/supabase');

const handleStart = async (ctx) => {
  try {
    const { id: telegramId, username, first_name: firstName } = ctx.from;

    const { error } = await supabase
      .from('users')
      .upsert(
        {
          telegram_id: telegramId,
          username: username || null,
        },
        { onConflict: 'telegram_id' }
      );

    if (error) {
      console.error('Gagal menyimpan user:', error.message);
      return ctx.reply('Terjadi kendala pada database. Silakan coba lagi.');
    }

    const keyboard = new InlineKeyboard().text('🛒 Lihat Katalog Produk', 'view_catalog');

    const displayName = firstName || username || 'Pelanggan';
    return ctx.reply(
      `Halo ${displayName}! Selamat datang di Bot Auto Order.\n\n` +
      `Silakan klik tombol di bawah untuk melihat daftar produk yang tersedia.`,
      { reply_markup: keyboard }
    );
  } catch (err) {
    console.error('Error pada handler start:', err);
    return ctx.reply('Terjadi kesalahan sistem.');
  }
};

module.exports = handleStart;