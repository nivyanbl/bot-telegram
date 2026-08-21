const { InlineKeyboard } = require("grammy");
const {
  getActiveProducts,
  getProductWithVariants,
} = require("../services/productService");
const {
  buildProductCatalogMessage,
  buildVariantMessage,
} = require("../utils/messageBuilder");

const pendingProductSelection = new Map();

const handleViewCatalog = async (ctx) => {
  await ctx.answerCallbackQuery();

  try {
    const products = await getActiveProducts();
    if (products.length === 0) {
      return ctx.reply("Saat ini belum ada produk yang tersedia.");
    }

    const keyboard = new InlineKeyboard();
    products.forEach((product, index) => {
      const number = index + 1;
      keyboard.text(String(number), `prod_${product.id}`);
      if (number % 5 === 0 || number === products.length) keyboard.row();
    });

    pendingProductSelection.set(ctx.chat.id, products);
    return ctx.editMessageText(buildProductCatalogMessage(products), {
      parse_mode: "HTML",
      reply_markup: keyboard,
    });
  } catch (error) {
    console.error("Error katalog:", error);
    return ctx.reply("Gagal memuat produk.");
  }
};

const handleSelectProduct = async (ctx) => {
  await ctx.answerCallbackQuery();
  return showProductVariants(ctx, ctx.match[1], true);
};

const handleProductNumber = async (ctx) => {
  const input = ctx.message.text.trim();
  if (!/^\d+$/.test(input)) return;

  const products = pendingProductSelection.get(ctx.chat.id);
  if (!products) return;

  const product = products[Number(input) - 1];
  if (!product) return ctx.reply(`Produk nomor ${input} tidak ditemukan.`);
  return showProductVariants(ctx, product.id);
};

const showProductVariants = async (ctx, productId, editMessage = false) => {
  try {
    const product = await getProductWithVariants(productId);
    const keyboard = new InlineKeyboard();

    let availableVariantCount = 0;

    product.variants.forEach((variant) => {
      if (variant.stockCount === 0) return;

      availableVariantCount += 1;
      keyboard.text(
        `${variant.name} - ${variant.price}`,
        `buy_var_${variant.id}`,
      );

      if (availableVariantCount % 2 === 0) {
        keyboard.row();
      }
    });

    if (availableVariantCount % 2 === 1) {
      keyboard.row();
    }

    if (availableVariantCount === 0) {
      keyboard.text("Stok sedang habis").row();
    }

    keyboard
      .text("🔄 Refresh", `refresh_product_${product.id}`)
      .row()
      .text("⬅️ Kembali", "view_catalog");

    const options = { parse_mode: "HTML", reply_markup: keyboard };
    const message = buildVariantMessage(product);
    return editMessage
      ? ctx.editMessageText(message, options)
      : ctx.reply(message, options);
  } catch (error) {
    if (error.description?.includes("message is not modified")) return;
    console.error("Error varian:", error);
    return ctx.reply("Gagal memuat varian produk.");
  }
};

const handleRefreshProduct = async (ctx) => {
  await ctx.answerCallbackQuery("Stok diperbarui");
  return showProductVariants(ctx, ctx.match[1], true);
};

module.exports = {
  handleProductNumber,
  handleRefreshProduct,
  handleSelectProduct,
  handleViewCatalog,
};
