const CartItem = require("../models/CartItem.Model");
const userService = require("../services/User.Service");

/**
 * Updates a cart item based on user input.
 * @param {string} userId - The ID of the user making the request.
 * @param {string} cartItemId - The ID of the cart item to update.
 * @param {object} cartItemData - The data to update the cart item with.
 * @returns {object} - The updated cart item.
 * @throws {Error} - Throws an error if the cart item or user is not found, or if the user is unauthorized.
 */
async function updateCartItem(userId, cartItemId, cartItemData) {
  try {
    const item = await findCartItemById(cartItemId);

    if (!item) {
      throw new Error("Item not found with ID: " + cartItemId);
    }

    const user = await userService.findUserById(item.userId);
    if (!user) {
      throw new Error("User not found with ID: " + userId);
    }

    // Ensure the user is authorized to update the cart item
    if (user._id.toString() === userId.toString()) {
      item.quantity = cartItemData.quantity;
      item.price = item.quantity * item.product.price;
      item.discountedPrice = item.quantity * item.product.discountedPrice;

      // Save the updated cart item
      const updatedCartItem = await item.save();
      return updatedCartItem;
    } else {
      throw new Error("You can't update this cart item");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Removes a cart item for a specific user.
 * @param {string} userId - The ID of the user making the request.
 * @param {string} cartItemId - The ID of the cart item to remove.
 * @returns {object} - The deleted cart item.
 * @throws {Error} - Throws an error if the user is not authorized to remove the item.
 */
async function removeCartItem(userId, cartItemId) {
  const cartItem = await findCartItemById(cartItemId);
  const user = await userService.findUserById(userId);

  // Ensure the user is authorized to remove the cart item
  if (user._id.toString() === cartItem.userId.toString()) {
    return await CartItem.findByIdAndDelete(cartItemId);
  }
  throw new Error("Can't remove another user's item");
}

/**
 * Finds a cart item by its ID and populates its associated product.
 * @param {string} cartItemId - The ID of the cart item to find.
 * @returns {object} - The found cart item.
 * @throws {Error} - Throws an error if the cart item is not found.
 */
async function findCartItemById(cartItemId) {
  const cartItem = await CartItem.findById(cartItemId).populate("product");

  if (cartItem) {
    return cartItem;
  } else {
    throw new Error("Cart item not found with ID: " + cartItemId);
  }
}

module.exports = { updateCartItem, removeCartItem, findCartItemById };
