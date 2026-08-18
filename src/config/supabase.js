const { createClient } = require("@supabase/supabase-js");
const { supabaseUrl, supabaseKey } = require("./env");

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
