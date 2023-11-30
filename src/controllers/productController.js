// src/controllers/productController.js
const Product = require('../models/Product');
const Store = require('../models/Store');

const createProduct = async (req, res) => {
  const { photo, name, price, description, file_psd, file_mockup } = req.body;
  const storeId = req.user.id_store; // Ambil ID toko dari pengguna yang terautentikasi

  try {
    // Cek apakah toko dengan ID tersebut ada
    const existingStore = await Store.findByPk(storeId);

    if (!existingStore) {
      return res.status(404).json({ message: 'Toko tidak ditemukan.' });
    }

    // Buat produk baru di dalam toko
    const newProduct = await Product.create({ photo, name, price, description, file_psd, file_mockup, storeId });

    res.status(201).json({ message: 'Produk berhasil ditambahkan.', product: newProduct });
  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllProducts = async (req, res) => {
  const storeId = req.user.id_store; // Ambil ID toko dari pengguna yang terautentikasi

  try {
    // Cek apakah toko dengan ID tersebut ada
    const existingStore = await Store.findByPk(storeId, {
      include: {
        model: Product,
      },
    });

    if (!existingStore) {
      return res.status(404).json({ message: 'Toko tidak ditemukan.' });
    }

    // Ambil semua produk di dalam toko
    const products = existingStore.products;

    res.json(products);
  } catch (error) {
    console.error('Error getting all products:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    // Cari produk berdasarkan ID
    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error getting product by ID:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { photo, name, price, description, file_psd, file_mockup } = req.body;

  try {
    // Cek apakah produk dengan ID tersebut ada
    const existingProduct = await Product.findByPk(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    // Perbarui informasi produk
    await existingProduct.update({ photo, name, price, description, file_psd, file_mockup });

    res.json({ message: 'Informasi produk berhasil diperbarui.' });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    // Cek apakah produk dengan ID tersebut ada
    const existingProduct = await Product.findByPk(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    // Hapus produk
    await existingProduct.destroy();

    res.json({ message: 'Produk berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
