const { Bot } = require("grammy");
const { botToken } = require("./src/config/env");
const handleStart = require("./src/commands/start");
const {
  handleProductNumber,
  handleRefreshProduct,
  handleSelectProduct,
  handleViewCatalog,
} = require("./src/handlers/catalogHandler");
const {
  handleBuyVariant,
  handlePaymentSimulation,
} = require("./src/handlers/paymentHandler");

const bot = new Bot(botToken);

bot.command("start", handleStart);

bot.callbackQuery("view_catalog", handleViewCatalog);
bot.callbackQuery(/^prod_(\d+)$/, handleSelectProduct);
bot.callbackQuery(/^buy_var_(\d+)$/, handleBuyVariant);
bot.callbackQuery(/^pay_sim_(\d+)$/, handlePaymentSimulation);
bot.callbackQuery(/^refresh_product_(\d+)$/, handleRefreshProduct);
bot.on("message:text", handleProductNumber);

bot.catch((error) => {
  console.error("Terjadi error pada bot:", error.error);
});

// ======================================================
// START BOT
// ======================================================

bot.start();

console.log("Bot is running.");
