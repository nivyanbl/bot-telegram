const supabase = require('../config/supabase');

const getActiveProductsWithStock = async () => {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      price,
      description,
      stocks (
        id,
        status
      )
    `)
    .eq('is_active', true);

  if (error) {
    throw new Error(`Gagal mengambil produk: ${error.message}`);
  }

  // Hitung jumlah stok berstatus AVAILABLE untuk tiap produk
  return products.map((product) => {
    const availableStock = product.stocks.filter((s) => s.status === 'AVAILABLE').length;
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      stockCount: availableStock,
    };
  });
};

module.exports = {
  getActiveProductsWithStock,
};