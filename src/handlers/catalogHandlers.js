const { InlineKeyboard } = require("grammy");
const {
  getActiveProducts,
  getVariantsByProductId,
} = require("../services/productService");
const {
  buildProductCatalogText,
  buildVariantText,
  formatPrice,
} = require("../utils/messageBuilder");

const pendingProductSelection = new Map();

const formatProductButtonLabel = (index, name) => {
  const safeName = String(name).slice(0, 28);
  return `${index}. ${safeName}`;
};

const showProductVariants = async (ctx, productId) => {
  try {
    const variants = await getVariantsByProductId(productId);

    if (variants.length === 0) {
      return ctx.reply("Belum ada pilihan durasi untuk produk ini.");
    }

    const keyboard = new InlineKeyboard();

    variants.forEach((variant) => {
      if (variant.stockCount > 0) {
        keyboard
          .text(
            `Beli ${variant.name} (Rp ${formatPrice(variant.price)})`,
            `buy_var_${variant.id}`,
          )
          .row();
      }
    });

    keyboard.text("⬅️ Kembali ke Daftar Produk", "view_catalog");

    pendingProductSelection.delete(ctx.chat?.id);

    return ctx.reply(buildVariantText(variants), {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  } catch (error) {
    console.error(error);
    return ctx.reply("Gagal memuat rincian paket produk.");
  }
};

const registerCatalogHandlers = (bot) => {
  bot.callbackQuery("view_catalog", async (ctx) => {
    await ctx.answerCallbackQuery();

    try {
      const products = await getActiveProducts();

      if (products.length === 0) {
        return ctx.reply("Saat ini belum ada produk yang tersedia.");
      }

      const keyboard = new InlineKeyboard();

      products.forEach((product, index) => {
        const number = index + 1;
        keyboard
          .text(
            formatProductButtonLabel(number, product.name),
            `prod_${product.id}`,
          )
          .row();
      });

      pendingProductSelection.set(ctx.chat?.id, products);

      return ctx.editMessageText(buildProductCatalogText(products), {
        parse_mode: "HTML",
        reply_markup: keyboard,
      });
    } catch (error) {
      console.error(error);
      return ctx.reply("Gagal memuat daftar produk.");
    }
  });

  bot.callbackQuery(/^prod_(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();

    const productId = ctx.match[1];

    await showProductVariants(ctx, productId);
  });

  bot.on("message:text", async (ctx) => {
    const input = ctx.message.text.trim();

    if (!/^\d+$/.test(input)) {
      return;
    }

    const products = pendingProductSelection.get(ctx.chat?.id);

    if (!products || products.length === 0) {
      return;
    }

    const productNumber = Number(input);
    const product = products[productNumber - 1];

    if (!product) {
      return ctx.reply(
        `Produk nomor ${productNumber} tidak ditemukan.\n\n` +
          `Silakan pilih nomor 1 sampai ${products.length}.`,
      );
    }

    await showProductVariants(ctx, product.id);
  });

  bot.callbackQuery(/^buy_var_(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();

    const variantId = ctx.match[1];

    return ctx.reply(
      `Anda memilih varian ID: ${variantId}.\nLanjut ke pembayaran.`,
    );
  });
};

module.exports = registerCatalogHandlers;
