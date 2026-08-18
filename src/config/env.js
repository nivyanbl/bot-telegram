require('dotenv').config();

if(!process.env.BOT_TOKEN) {
    throw new Error('BOT_TOKEN  wajib diisi di file .env');
}
if(!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL wajib diisi di file .env');
}
if(!process.env.SUPABASE_KEY) {
    throw new Error('SUPABASE_KEY wajib diisi di file .env');
}

module.exports = {
    botToken: process.env.BOT_TOKEN,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY
};