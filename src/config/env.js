require(dot.env).config();

if(!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN  wajib diisi di file .env');
}

module.exports = {
    botToken: process.env.BOT_TOKEN,
};