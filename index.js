const { Bot, InlineKeyboard } = require("grammy");
const { botToken } = require("./src/config/env");
const handleStart = require("./src/commands/start");
const registerCatalogHandlers = require("./src/handlers/catalogHandlers");

const bot = new Bot(botToken);

bot.command("start", handleStart);

registerCatalogHandlers(bot);

// ======================================================
// START BOT
// ======================================================

bot.start();

console.log("Bot is running...");
