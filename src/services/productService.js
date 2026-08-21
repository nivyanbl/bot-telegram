const supabase = require("../config/supabase");

const getActiveProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
};

const getProductById = async (productId) => {
  const { data, error } = await supabase
    .from("products")
    .select("id, name")
    .eq("id", productId)
    .eq("is_active", true)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getVariantById = async (variantId) => {
  const { data, error } = await supabase
    .from("product_variants")
    .select("id, product_id, name, price, description, is_active")
    .eq("id", variantId)
    .eq("is_active", true)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const getVariantsByProductId = async (productId) => {
  const { data, error } = await supabase
    .from("product_variants")
    .select(
      `
      id,
      name,
      description,
      price,
      stocks (
        id,
        status
      )
    `,
    )
    .eq("product_id", productId)
    .eq("is_active", true);

  if (error) throw new Error(error.message);

  return (data || []).map((variant) => ({
    id: variant.id,
    name: variant.name,
    description: variant.description,
    price: variant.price,
    stockCount: (variant.stocks || []).filter((s) => s.status === "AVAILABLE")
      .length,
  }));
};

const getProductWithVariants = async (productId) => {
  const [product, variants] = await Promise.all([
    getProductById(productId),
    getVariantsByProductId(productId),
  ]);

  return { ...product, variants };
};

module.exports = {
  getActiveProducts,
  getProductById,
  getProductWithVariants,
  getVariantById,
  getVariantsByProductId,
};
