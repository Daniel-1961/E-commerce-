import { Cart, CartItem, Product } from '../models/index.js';

// Get current user's cart
export const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [{ model: CartItem, include: [Product] }],
    });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add an item to the cart
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id });
    }

    let item = await CartItem.findOne({ where: { cartId: cart.id, productId } });

    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      await CartItem.create({ cartId: cart.id, productId, quantity });
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const { itemId } = req.params;

  try {
    const item = await CartItem.findByPk(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.destroy();
    res.json({ message: 'Item removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
