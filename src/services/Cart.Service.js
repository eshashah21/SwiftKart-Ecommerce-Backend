const Cart = require("../models/Cart.Model");
const CartItem = require("../models/CartItem.Model");
const Product = require("../models/Product.Model");

/**
 * Creates a new cart for the user.
 * @param {ObjectId} user - The user's ID.
 * @returns {Object} The created cart.
 */
async function createCart(user) {
  try {
    const cart = new Cart({ user });
    const createdCart = await cart.save();
    return createdCart;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Finds the cart of a specific user and calculates totals.
 * @param {ObjectId} userId - The user's ID.
 * @returns {Object} The user's cart with items and totals.
 */
async function findUserCart(userId) {
  try {
    let cart = await Cart.findOne({ user: userId });
    let cartItems = await CartItem.find({ cart: cart._id }).populate("product");
    cart.cartItems = cartItems;

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    for (let cartItem of cart.cartItems) {
      totalPrice += cartItem.price;
      totalDiscountedPrice += cartItem.discountedPrice;
      totalItem += cartItem.quantity;
    }

    cart.totalPrice = totalPrice;
    cart.totalDiscountedPrice = totalDiscountedPrice;
    cart.discount = totalPrice - totalDiscountedPrice;
    cart.totalItem = totalItem;

    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Adds an item to the user's cart.
 * @param {ObjectId} userId - The user's ID.
 * @param {Object} req - The request object containing product details.
 * @returns {String} Success message.
 */
async function addCartItem(userId, req) {
  try {
    const cart = await Cart.findOne({ user: userId });
    const product = await Product.findById(req.productId);

    const isPresent = await CartItem.findOne({
      cart: cart._id,
      product: product._id,
      userId,
    });

    if (!isPresent) {
      const cartItem = new CartItem({
        product: product._id,
        cart: cart._id,
        quantity: 1,
        userId,
        price: product.price,
        size: req.size,
        discountedPrice: product.discountedPrice,
      });

      const createdCartItem = await cartItem.save();
      cart.cartItems.push(createdCartItem);
      await cart.save();
      return "Item added to cart";
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = { createCart, findUserCart, addCartItem };
