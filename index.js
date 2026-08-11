const {Bot} = require('grammy');
const {bottoken} = require('./config/env');
const {handleStart} = require('./commands/start');

const bot = new Bot(bottoken);

bot.command('start', handleStart);

bot.start();
console.log('Bot is running...');