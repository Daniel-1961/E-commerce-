import { Cart, CartItem, Product } from '../models/index.js';

// Get current user's cart
export const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
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

  // sanitize quantity
  const qty = Number.isInteger(Number(quantity)) && Number(quantity) > 0 ? Number(quantity) : 1;

  try {
    // Ensure product exists to avoid FK constraint errors
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
    }

    let item = await CartItem.findOne({ where: { cart_id: cart.id, product_id: productId } });

    if (item) {
      item.quantity = (Number(item.quantity) || 0) + qty;
      await item.save();
    } else {
      await CartItem.create({ cart_id: cart.id, product_id: productId, quantity: qty });
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await CartItem.findByPk(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Ensure the cart belongs to the requesting user or the user is admin
    const cart = await Cart.findByPk(item.cart_id || item.cartId);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const cartUserId = cart.user_id || cart.userId;
    if (String(cartUserId) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await item.destroy();
    res.json({ message: 'Item removed' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

