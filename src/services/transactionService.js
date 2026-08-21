const crypto = require("node:crypto");
const supabase = require("../config/supabase");
const { getProductById, getVariantById } = require("./productService");

const createTransaction = async (telegramId, variantId) => {
  const variant = await getVariantById(variantId);
  const product = await getProductById(variant.product_id);

  const { count: availableStock, error: stockError } = await supabase
    .from("stocks")
    .select("id", { count: "exact", head: true })
    .eq("variant_id", variantId)
    .eq("status", "AVAILABLE");

  if (stockError) throw new Error(stockError.message);
  if (!availableStock) throw new Error("Stok varian ini sudah habis.");

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("telegram_id", telegramId)
    .single();

  if (userError) throw new Error(`User tidak ditemukan: ${userError.message}`);

  const transaction = {
    invoice_id: `INV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    user_id: user.id,
    variant_id: variant.id,
    amount: variant.price,
    status: "PENDING",
  };

  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select("id, invoice_id, user_id, variant_id, amount, status")
    .single();

  if (error) throw new Error(error.message);

  return { transaction: data, variant: { ...variant, products: product } };
};

const processPaymentSimulation = async (transactionId) => {
  const { data, error } = await supabase.rpc("claim_stock", {
    p_transaction_id: transactionId,
  });

  if (error) throw new Error(error.message);

  return { accountData: data?.account_data || data?.account || data };
};

module.exports = { createTransaction, processPaymentSimulation };
