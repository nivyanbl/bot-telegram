const { InlineKeyboard } = require("grammy");
const {
  createTransaction,
  processPaymentSimulation,
} = require("../services/transactionService");
const {
  buildInvoiceMessage,
  buildSuccessMessage,
} = require("../utils/messageBuilder");

const handleBuyVariant = async (ctx) => {
  await ctx.answerCallbackQuery();

  try {
    const { transaction, variant } = await createTransaction(
      ctx.from.id,
      ctx.match[1],
    );
    const keyboard = new InlineKeyboard()
      .text("⚡ Bayar Sekarang (Sandbox)", `pay_sim_${transaction.id}`)
      .row()
      .text("❌ Batalkan", "view_catalog");

    return ctx.editMessageText(buildInvoiceMessage(transaction, variant), {
      parse_mode: "Markdown",
      reply_markup: keyboard,
    });
  } catch (error) {
    console.error("Error checkout:", error);
    return ctx.reply(`Gagal membuat invoice: ${error.message}`);
  }
};

const handlePaymentSimulation = async (ctx) => {
  await ctx.answerCallbackQuery("Memproses pembayaran...");

  try {
    const result = await processPaymentSimulation(ctx.match[1]);

    return ctx.editMessageText(buildSuccessMessage(result.accountData), {
      parse_mode: "Markdown",
    });
  } catch (error) {
    console.error("Error proses bayar:", error);
    return ctx.reply(`Gagal memproses pembayaran: ${error.message}`);
  }
};

module.exports = {
  handleBuyVariant,
  handlePaymentSimulation,
};
