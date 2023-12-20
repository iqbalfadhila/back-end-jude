const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id_product } = req.body;

    const existingCartItem = await Cart.findOne({
      where: { userId: userId, productId: id_product },
    });

    if (existingCartItem) {
      return res.status(400).json({ message: 'Product is already in the cart.' });
    }

    const existingProduct = await Product.findByPk(id_product);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    await Cart.create({
      userId: userId,
      productId: id_product,
      // quantity: quantity || 1, // Default kuantitas menjadi 1 jika tidak disediakan
    });

    res.status(201).json({ message: 'Product added to cart.' });
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id_product } = req.body;

    const deletedCartItem = await Cart.destroy({
      where: { userId: userId, productId: id_product },
    });

    if (deletedCartItem === 0) {
      return res.status(404).json({ message: 'Item not found in the cart.' });
    }

    res.json({ message: 'Item deleted from cart successfully.' });
  } catch (error) {
    console.error('Error deleting from cart:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getAllCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { userId: userId },
      include: [
        {
          model: Product,
          attributes: ['id', 'photo', 'name', 'price', 'description', 'file_psd', 'file_mockup'],
        },
      ],
    });

    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { addToCart, deleteFromCart, getAllCart };
