const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

const getAllFavorite = async (req, res) => {
   try {
      const userId = req.user.id; // Mengambil ID user dari pengguna yang login

      // Dapatkan semua favorit user berdasarkan ID user
      const favorites = await Favorite.findAll({
         where: { userId: userId },
         include: [
         {
            model: Product,
            attributes: ['id', 'photo', 'name', 'price', 'description', 'file_psd', 'file_mockup'],
         },
         ],
      });

      res.json(favorites);
   } catch (error) {
      console.error('Error fetching favorites:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
   }
};

const createFavorite = async (req, res) => {
   try {
      const userId = req.user.id;
      const { id_product } = req.body;

      const existingFavoriteItem = await Favorite.findOne({
         where: { userId: userId, productId: id_product },
       });
   
       if (existingFavoriteItem) {
         return res.status(400).json({ message: 'Product is already in the favorite.' });
       }

      // Cek apakah produk dengan ID tersebut ada
      const existingProduct = await Product.findByPk(id_product);

      if (!existingProduct) {
         return res.status(404).json({ message: 'Product not found.' });
      }

      // Cek apakah produk sudah ada dalam daftar favorit user
      const existingFavorite = await Favorite.findOne({
         where: { userId: userId, productId: id_product }
      });

      if (existingFavorite) {
         return res.status(400).json({ message: 'Product is already in favorites.' });
      }

      // Tambahkan produk ke daftar favorit user
      await Favorite.create({
         userId: userId,
         productId: id_product
      });

      res.status(201).json({ message: 'Product added to favorites.' });
   } catch (error) {
      console.error('Error creating favorite:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
   }
};

const deleteFavorite = async (req, res) => {
   try {
     const userId = req.user.id;
     const { id_product } = req.body;
 
     // Hapus produk dari daftar favorit user
     const deletedFavorite = await Favorite.destroy({
       where: { userId: userId, productId: id_product }
     });
 
     if (deletedFavorite === 0) {
       return res.status(404).json({ message: 'Favorite not found.' });
     }
 
     res.json({ message: 'Favorite deleted successfully.' });
   } catch (error) {
     console.error('Error deleting favorite:', error.message);
     res.status(500).json({ message: 'Internal Server Error' });
   }
};
module.exports = {
   getAllFavorite,
   createFavorite,
   deleteFavorite,
};
