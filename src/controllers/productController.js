<<<<<<< HEAD
// src/controllers/productController.js
const Product = require('../models/Product');
const Store = require('../models/Store');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const multer = require('multer');
const { Op } = require('sequelize');
const Category = require('../models/Category');
const Style = require('../models/Style');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../config/serviceAccountKey.json'), // Replace with the path to your key file
  projectId: 'jude-406606', // Replace with your Google Cloud Project ID
});

const bucket = storage.bucket('bucket-jude-406606'); // Replace with your Google Cloud Storage bucket name

const upload = multer({storage: multer.memoryStorage()});

const createProduct = async (req, res) => {
  const { name, price, description, categoryId, styleId } = req.body;
  const storeId = req.user.id_store; // Ambil ID toko dari pengguna yang terautentikasi
  console.log(storeId);

  try {
    // Cek apakah toko dengan ID tersebut ada
    const existingStore = await Store.findByPk(storeId);

    if (!existingStore) {
      return res.status(404).json({ message: 'Toko tidak ditemukan.' });
    }

    const existingCategory = await Category.findByPk(categoryId);

    if (!existingCategory) {
      return res.status(404).json({ message: 'Category not found!' });
    }

    const existingStyle = await Style.findByPk(styleId);

    if (!existingStyle) {
      return res.status(404).json({ message: 'Style not found!' });
    }

    // Ambil file gambar dan file PSD dari request
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const psdFile = req.files['file_psd'] ? req.files['file_psd'][0] : null;
    const mockupFile = req.files['file_mockup'] ? req.files['file_mockup'][0] : null;

    // ... Validasi format dan ukuran file ...
    // Validasi format dan ukuran file untuk photo
    if (photoFile) {
      if (!photoFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk photo!' });
      }

      if (photoFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file photo melebihi batas 2 MB.' });
      }
    }

    // Validasi format dan ukuran file untuk file PSD
    if (psdFile) {
      const allowedExtensions = ['.psd'];
    
      const fileExtension = path.extname(psdFile.originalname).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: 'Hanya file PSD yang diperbolehkan untuk file PSD!' });
      }
    
      if (psdFile.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file PSD melebihi batas 10 MB.' });
      }
    }

    // Validasi format dan ukuran file untuk mockup
    if (mockupFile) {
      if (!mockupFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk mockup!' });
      }

      if (mockupFile.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file mockup melebihi batas 5 MB.' });
      }
    }

    // Buat produk baru di dalam toko
    const newProduct = await Product.create({
      name,
      price,
      description,
      categoryId,
      styleId,
      storeId,
      // ...Tambahkan atribut lain yang sesuai dengan kebutuhan model Product...
    });

    // Simpan file foto ke Google Cloud Storage
    if (photoFile) {
      const folderName = "fileproduct";
      const fileNamePhoto = `${folderName}/product_${newProduct.id}_photo_${Date.now()}${path.extname(photoFile.originalname)}`;
      const fileBufferPhoto = photoFile.buffer;

      const blobPhoto = bucket.file(fileNamePhoto);
      const blobStreamPhoto = blobPhoto.createWriteStream();

      blobStreamPhoto.on('error', (err) => {
        console.error('Error uploading photo to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading photo to Google Cloud Storage' });
      });

      blobStreamPhoto.on('finish', async () => {
        // Update data produk dengan URL foto baru
        await Product.update({ photo: fileNamePhoto }, { where: { id: newProduct.id } });
      });

      blobStreamPhoto.end(fileBufferPhoto);
    }

    // Simpan file PSD ke Google Cloud Storage
    if (psdFile) {
      const folderName = "fileproduct";
      const fileNamePSD = `${folderName}/product_${newProduct.id}_psd_${Date.now()}${path.extname(psdFile.originalname)}`;
      const fileBufferPSD = psdFile.buffer;

      const blobPSD = bucket.file(fileNamePSD);
      const blobStreamPSD = blobPSD.createWriteStream();

      blobStreamPSD.on('error', (err) => {
        console.error('Error uploading PSD to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading PSD to Google Cloud Storage' });
      });

      blobStreamPSD.on('finish', async () => {
        // Update data produk dengan URL PSD baru
        await Product.update({ file_psd: fileNamePSD }, { where: { id: newProduct.id } });
      });

      blobStreamPSD.end(fileBufferPSD);
    }

    // Simpan file mockup ke Google Cloud Storage
    if (mockupFile) {
      const folderName = "fileproduct";
      const fileNameMockup = `${folderName}/product_${newProduct.id}_mockup_${Date.now()}${path.extname(mockupFile.originalname)}`;
      const fileBufferMockup = mockupFile.buffer;

      const blobMockup = bucket.file(fileNameMockup);
      const blobStreamMockup = blobMockup.createWriteStream();

      blobStreamMockup.on('error', (err) => {
        console.error('Error uploading mockup to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading mockup to Google Cloud Storage' });
      });

      blobStreamMockup.on('finish', async () => {
        // Update data produk dengan URL mockup baru
        await Product.update({ file_mockup: fileNameMockup }, { where: { id: newProduct.id } });
      });

      blobStreamMockup.end(fileBufferMockup);
    }

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
  const { name, price, description, categoryId, styleId } = req.body;

  try {
    // Cek apakah produk dengan ID tersebut ada
    const existingProduct = await Product.findByPk(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    // Ambil file gambar, file PSD, dan file mockup dari request
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const psdFile = req.files['file_psd'] ? req.files['file_psd'][0] : null;
    const mockupFile = req.files['file_mockup'] ? req.files['file_mockup'][0] : null;

    // Validasi format dan ukuran file untuk photo
    if (photoFile) {
      if (!photoFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk photo!' });
      }

      if (photoFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file photo melebihi batas 2 MB.' });
      }
    }

    // Validasi format dan ukuran file untuk file PSD
    if (psdFile) {
      const allowedExtensions = ['.psd'];
    
      const fileExtension = path.extname(psdFile.originalname).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: 'Hanya file PSD yang diperbolehkan untuk file PSD!' });
      }

      if (psdFile.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file PSD melebihi batas 10 MB.' });
      }
    }

    // Validasi format dan ukuran file untuk mockup
    if (mockupFile) {
      if (!mockupFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk mockup!' });
      }

      if (mockupFile.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file mockup melebihi batas 5 MB.' });
      }
    }

    // Perbarui informasi produk
    await Product.update({
      name,
      price,
      description,
      categoryId,
      styleId,
      // ...Tambahkan atribut lain yang sesuai dengan kebutuhan model Product...
    }, {where: { id: productId }});

    // Simpan file foto ke Google Cloud Storage
    if (photoFile) {
      const folderName = "fileproduct";
      const fileNamePhoto = `${folderName}/product_${productId}_photo_${Date.now()}${path.extname(photoFile.originalname)}`;
      const fileBufferPhoto = photoFile.buffer;

      const blobPhoto = bucket.file(fileNamePhoto);
      const blobStreamPhoto = blobPhoto.createWriteStream();

      blobStreamPhoto.on('error', (err) => {
        console.error('Error uploading photo to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading photo to Google Cloud Storage' });
      });

      blobStreamPhoto.on('finish', async () => {
        // Update data produk dengan URL foto baru
        updatedProductData.photo = fileNamePhoto;
        await existingProduct.update(updatedProductData);
        // Jangan lupa hapus file photo lama jika perlu
        // await deleteOldFile(existingProduct.photo);
      });

      blobStreamPhoto.end(fileBufferPhoto);
    }

    // Proses serupa untuk file PSD
    if (psdFile) {
      const folderName = "fileproduct";
      const fileNamePSD = `${folderName}/product_${productId}_psd_${Date.now()}${path.extname(psdFile.originalname)}`;
      const fileBufferPSD = psdFile.buffer;

      const blobPSD = bucket.file(fileNamePSD);
      const blobStreamPSD = blobPSD.createWriteStream();

      blobStreamPSD.on('error', (err) => {
        console.error('Error uploading PSD to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading PSD to Google Cloud Storage' });
      });

      blobStreamPSD.on('finish', async () => {
        // Update data produk dengan URL file PSD baru
        updatedProductData.file_psd = fileNamePSD;
        await existingProduct.update(updatedProductData);
        // Jangan lupa hapus file PSD lama jika perlu
        // await deleteOldFile(existingProduct.file_psd);
      });

      blobStreamPSD.end(fileBufferPSD);
    }

    // Proses serupa untuk file mockup
    if (mockupFile) {
      const folderName = "fileproduct";
      const fileNameMockup = `${folderName}/product_${productId}_mockup_${Date.now()}${path.extname(mockupFile.originalname)}`;
      const fileBufferMockup = mockupFile.buffer;

      const blobMockup = bucket.file(fileNameMockup);
      const blobStreamMockup = blobMockup.createWriteStream();
a
      blobStreamMockup.on('error', (err) => {
        console.error('Error uploading mockup to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading mockup to Google Cloud Storage' });
      });

      blobStreamMockup.on('finish', async () => {
        // Update data produk dengan URL file mockup baru
        updatedProductData.file_mockup = fileNameMockup;
        await existingProduct.update(updatedProductData);
        // Jangan lupa hapus file mockup lama jika perlu
        // await deleteOldFile(existingProduct.file_mockup);
      });
      
      blobStreamMockup.end(fileBufferMockup);
    }
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
  upload,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
=======
// src/controllers/productController.js
const Product = require('../models/Product');
const Store = require('../models/Store');
const { Storage } = require('@google-cloud/storage');
const path = require('path');
const multer = require('multer');
const { Op } = require('sequelize');

const storage = new Storage({
  keyFilename: path.join(__dirname, '../config/serviceAccountKey.json'), // Replace with the path to your key file
  projectId: 'jude-406606', // Replace with your Google Cloud Project ID
});

const bucket = storage.bucket('bucket-jude-406606'); // Replace with your Google Cloud Storage bucket name

const upload = multer({storage: multer.memoryStorage()});

const createProduct = async (req, res) => {
  const { name, price, description, categoryId, styleId } = req.body;
  const storeId = req.user.id_store; // Ambil ID toko dari pengguna yang terautentikasi
  console.log(storeId);

  try {
    // Cek apakah toko dengan ID tersebut ada
    const existingStore = await Store.findByPk(storeId);

    if (!existingStore) {
      return res.status(404).json({ message: 'Toko tidak ditemukan.' });
    }

    // Ambil file gambar dan file PSD dari request
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const psdFile = req.files['file_psd'] ? req.files['file_psd'][0] : null;
    const mockupFile = req.files['file_mockup'] ? req.files['file_mockup'][0] : null;

    // ... Validasi format dan ukuran file ...
    // Validasi format dan ukuran file untuk photo
    if (photoFile) {
      if (!photoFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk photo!' });
      }

      if (photoFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file photo melebihi batas 2 MB.' });
      }
    }

    // Validasi format dan ukuran file untuk file PSD
    if (psdFile) {
      const allowedExtensions = ['.psd'];
    
      const fileExtension = path.extname(psdFile.originalname).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: 'Hanya file PSD yang diperbolehkan untuk file PSD!' });
      }
    
      if (psdFile.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file PSD melebihi batas 10 MB.' });
      }
    }

    // Validasi format dan ukuran file untuk mockup
    if (mockupFile) {
      if (!mockupFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk mockup!' });
      }

      if (mockupFile.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file mockup melebihi batas 5 MB.' });
      }
    }

    // Buat produk baru di dalam toko
    const newProduct = await Product.create({
      name,
      price,
      description,
      categoryId,
      styleId,
      storeId,
      // ...Tambahkan atribut lain yang sesuai dengan kebutuhan model Product...
    });

    // Simpan file foto ke Google Cloud Storage
    if (photoFile) {
      const folderName = "fileproduct";
      const fileNamePhoto = `${folderName}/product_${newProduct.id}_photo_${Date.now()}${path.extname(photoFile.originalname)}`;
      const fileBufferPhoto = photoFile.buffer;

      const blobPhoto = bucket.file(fileNamePhoto);
      const blobStreamPhoto = blobPhoto.createWriteStream();

      blobStreamPhoto.on('error', (err) => {
        console.error('Error uploading photo to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading photo to Google Cloud Storage' });
      });

      blobStreamPhoto.on('finish', async () => {
        // Update data produk dengan URL foto baru
        await Product.update({ photo: fileNamePhoto }, { where: { id: newProduct.id } });
      });

      blobStreamPhoto.end(fileBufferPhoto);
    }

    // Simpan file PSD ke Google Cloud Storage
    if (psdFile) {
      const folderName = "fileproduct";
      const fileNamePSD = `${folderName}/product_${newProduct.id}_psd_${Date.now()}${path.extname(psdFile.originalname)}`;
      const fileBufferPSD = psdFile.buffer;

      const blobPSD = bucket.file(fileNamePSD);
      const blobStreamPSD = blobPSD.createWriteStream();

      blobStreamPSD.on('error', (err) => {
        console.error('Error uploading PSD to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading PSD to Google Cloud Storage' });
      });

      blobStreamPSD.on('finish', async () => {
        // Update data produk dengan URL PSD baru
        await Product.update({ file_psd: fileNamePSD }, { where: { id: newProduct.id } });
      });

      blobStreamPSD.end(fileBufferPSD);
    }

    // Simpan file mockup ke Google Cloud Storage
    if (mockupFile) {
      const folderName = "fileproduct";
      const fileNameMockup = `${folderName}/product_${newProduct.id}_mockup_${Date.now()}${path.extname(mockupFile.originalname)}`;
      const fileBufferMockup = mockupFile.buffer;

      const blobMockup = bucket.file(fileNameMockup);
      const blobStreamMockup = blobMockup.createWriteStream();

      blobStreamMockup.on('error', (err) => {
        console.error('Error uploading mockup to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading mockup to Google Cloud Storage' });
      });

      blobStreamMockup.on('finish', async () => {
        // Update data produk dengan URL mockup baru
        await Product.update({ file_mockup: fileNameMockup }, { where: { id: newProduct.id } });
      });

      blobStreamMockup.end(fileBufferMockup);
    }

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
  const { name, price, description, categoryId, styleId } = req.body;

  try {
    // Cek apakah produk dengan ID tersebut ada
    const existingProduct = await Product.findByPk(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Produk tidak ditemukan.' });
    }

    // Ambil file gambar, file PSD, dan file mockup dari request
    const photoFile = req.files['photo'] ? req.files['photo'][0] : null;
    const psdFile = req.files['file_psd'] ? req.files['file_psd'][0] : null;
    const mockupFile = req.files['file_mockup'] ? req.files['file_mockup'][0] : null;

    // Validasi format dan ukuran file untuk photo
    if (photoFile) {
      if (!photoFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk photo!' });
      }

      if (photoFile.size > 2 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file photo melebihi batas 2 MB.' });
      }
    }

    // Validasi format dan ukuran file untuk file PSD
    if (psdFile) {
      const allowedExtensions = ['.psd'];
    
      const fileExtension = path.extname(psdFile.originalname).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ message: 'Hanya file PSD yang diperbolehkan untuk file PSD!' });
      }

      if (psdFile.size > 10 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file PSD melebihi batas 10 MB.' });
      }
    }

    // Validasi format dan ukuran file untuk mockup
    if (mockupFile) {
      if (!mockupFile.mimetype.startsWith('image/')) {
        return res.status(400).json({ message: 'Hanya file gambar yang diperbolehkan untuk mockup!' });
      }

      if (mockupFile.size > 5 * 1024 * 1024) {
        return res.status(400).json({ message: 'Ukuran file mockup melebihi batas 5 MB.' });
      }
    }

    // Perbarui informasi produk
    await Product.update({
      name,
      price,
      description,
      categoryId,
      styleId,
      // ...Tambahkan atribut lain yang sesuai dengan kebutuhan model Product...
    }, {where: { id: productId }});

    // Simpan file foto ke Google Cloud Storage
    if (photoFile) {
      const folderName = "fileproduct";
      const fileNamePhoto = `${folderName}/product_${productId}_photo_${Date.now()}${path.extname(photoFile.originalname)}`;
      const fileBufferPhoto = photoFile.buffer;

      const blobPhoto = bucket.file(fileNamePhoto);
      const blobStreamPhoto = blobPhoto.createWriteStream();

      blobStreamPhoto.on('error', (err) => {
        console.error('Error uploading photo to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading photo to Google Cloud Storage' });
      });

      blobStreamPhoto.on('finish', async () => {
        // Update data produk dengan URL foto baru
        updatedProductData.photo = fileNamePhoto;
        await existingProduct.update(updatedProductData);
        // Jangan lupa hapus file photo lama jika perlu
        // await deleteOldFile(existingProduct.photo);
      });

      blobStreamPhoto.end(fileBufferPhoto);
    }

    // Proses serupa untuk file PSD
    if (psdFile) {
      const folderName = "fileproduct";
      const fileNamePSD = `${folderName}/product_${productId}_psd_${Date.now()}${path.extname(psdFile.originalname)}`;
      const fileBufferPSD = psdFile.buffer;

      const blobPSD = bucket.file(fileNamePSD);
      const blobStreamPSD = blobPSD.createWriteStream();

      blobStreamPSD.on('error', (err) => {
        console.error('Error uploading PSD to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading PSD to Google Cloud Storage' });
      });

      blobStreamPSD.on('finish', async () => {
        // Update data produk dengan URL file PSD baru
        updatedProductData.file_psd = fileNamePSD;
        await existingProduct.update(updatedProductData);
        // Jangan lupa hapus file PSD lama jika perlu
        // await deleteOldFile(existingProduct.file_psd);
      });

      blobStreamPSD.end(fileBufferPSD);
    }

    // Proses serupa untuk file mockup
    if (mockupFile) {
      const folderName = "fileproduct";
      const fileNameMockup = `${folderName}/product_${productId}_mockup_${Date.now()}${path.extname(mockupFile.originalname)}`;
      const fileBufferMockup = mockupFile.buffer;

      const blobMockup = bucket.file(fileNameMockup);
      const blobStreamMockup = blobMockup.createWriteStream();

      blobStreamMockup.on('error', (err) => {
        console.error('Error uploading mockup to Google Cloud Storage:', err);
        res.status(500).json({ error: 'Error uploading mockup to Google Cloud Storage' });
      });

      blobStreamMockup.on('finish', async () => {
        // Update data produk dengan URL file mockup baru
        updatedProductData.file_mockup = fileNameMockup;
        await existingProduct.update(updatedProductData);
        // Jangan lupa hapus file mockup lama jika perlu
        // await deleteOldFile(existingProduct.file_mockup);
      });
      
      blobStreamMockup.end(fileBufferMockup);
    }
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
  upload,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
>>>>>>> a1de2a0618c3f9501131560ed1bb04cff20dd316
