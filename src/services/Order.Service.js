const CartService = require("../services/Cart.Service");
const Address = require("../models/Address.Model");
const Order = require("../models/Order.Model");
const OrderItem = require("../models/OrderItems.Model");

/**
 * Creates a new order for the user.
 * @param {Object} user - The user placing the order.
 * @param {Object} shipAddress - The shipping address for the order.
 * @returns {Object} - The saved order.
 * @throws {Error} - Throws an error if the address or cart is not found.
 */
const createOrder = async (user, shipAddress) => {
  let address;

  // Check if the address already exists
  if (shipAddress._id) {
    address = await Address.findById(shipAddress._id);
    if (!address) {
      throw new Error("Address not found");
    }
  } else {
    // Create a new address if it doesn't exist
    address = new Address(shipAddress);
    address.user = user._id; // Ensure user ID is set correctly
    await address.save();

    user.address.push(address);
    await user.save();
  }

  // Retrieve the user's cart
  const cart = await CartService.findUserCart(user._id);
  if (!cart) {
    throw new Error("Cart not found"); // Handle cart not found
  }

  const orderItems = [];

  // Create order items from cart items
  for (const item of cart.cartItems) {
    const orderItem = new OrderItem({
      price: item.price,
      product: item.product,
      quantity: item.quantity,
      size: item.size,
      userId: user._id,
      discountedPrice: item.discountedPrice,
    });

    const createdOrderItem = await orderItem.save();
    orderItems.push(createdOrderItem);
  }

  // Calculate GST (18% of the discounted price)
  const gstAmount = Number((cart.totalDiscountedPrice * 0.18).toFixed(2)); // ✅ Fix precision

  // Apply Delivery Charge (₹40 if total is less than ₹700)
  const deliveryCharge = cart.totalDiscountedPrice < 700 ? 40 : 0;

  // Calculate final order amount
  const finalAmount = Number((cart.totalDiscountedPrice + gstAmount + deliveryCharge).toFixed(2)); // ✅ Fix precision

  // ✅ Debugging: Ensure these values are being set before saving
  console.log("GST:", gstAmount, "Delivery Charge:", deliveryCharge, "Final Amount:", finalAmount);

  // Create the order
  const createdOrder = new Order({
    user: user._id,
    orderItems,
    totalPrice: cart.totalPrice,
    totalDiscountedPrice: cart.totalDiscountedPrice,
    discount: cart.discount,
    gstAmount, // ✅ Ensuring GST is saved
    deliveryCharge, // ✅ Ensuring delivery charge is saved
    finalAmount, // ✅ Ensuring final amount is saved
    totalItem: cart.totalItem,
    shippingAddress: address,
  });

  // Save the order
  const savedOrder = await createdOrder.save();

  return savedOrder;
};


/**
 * Places an order by updating its status and payment details.
 * @param {string} orderId - The ID of the order to place.
 * @returns {Object} - The updated order.
 */
async function placeOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "PLACED";
  order.paymentDetails.status = "COMPLETED";

  return await order.save();
}

/**
 * Confirms an order by updating its status.
 * @param {string} orderId - The ID of the order to confirm.
 * @returns {Object} - The updated order.
 */
async function confirmedOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CONFIRMED";

  return await order.save();
}

/**
 * Ships an order by updating its status.
 * @param {string} orderId - The ID of the order to ship.
 * @returns {Object} - The updated order.
 */
async function shipOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "SHIPPED";

  return await order.save();
}

/**
 * Delivers an order by updating its status.
 * @param {string} orderId - The ID of the order to deliver.
 * @returns {Object} - The updated order.
 */
async function deliverOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "DELIVERED";

  return await order.save();
}

/**
 * Cancels an order by updating its status.
 * @param {string} orderId - The ID of the order to cancel.
 * @returns {Object} - The updated order.
 */
async function cancelOrder(orderId) {
  const order = await findOrderById(orderId);

  order.orderStatus = "CANCELLED";

  return await order.save();
}

/**
 * Finds an order by its ID and populates relevant fields.
 * @param {string} orderId - The ID of the order to find.
 * @returns {Object} - The found order.
 * @throws {Error} - Throws an error if the order is not found.
 */
async function findOrderById(orderId) {
  const order = await Order.findById(orderId)
    .populate("user")
    .populate("shippingAddress")
    .populate({ path: "orderItems", populate: { path: "product" } });

  if (!order) {
    throw new Error("Order not found");
  }
  return order;
}

/**
 * Fetches the user's order history for placed orders.
 * @param {string} userId - The ID of the user.
 * @returns {Array} - The user's order history.
 * @throws {Error} - Throws an error if the user has no placed orders.
 */
async function usersOrderHistory(userId) {
  try {
    const orders = await Order.find({ user: userId, orderStatus: "PLACED" })
      .populate({ path: "orderItems", populate: { path: "product" } })
      .lean();

    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
}

/**
 * Retrieves all orders in the system.
 * @returns {Array} - The list of all orders.
 */
const getAllOrders = async () => {
  const orders = await Order.find()
    .populate({
      path: "orderItems",
      populate: { path: "product" },
    })
    .lean();

  return orders;
};

/**
 * Deletes an order by its ID.
 * @param {string} orderId - The ID of the order to delete.
 * @returns {Object} - The deleted order.
 * @throws {Error} - Throws an error if the order is not found.
 */
async function deleteOrder(orderId) {
  try {
    const result = await Order.findByIdAndDelete(orderId);
    if (!result) {
      throw new Error('Order not found');
    }
    return result;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createOrder,
  placeOrder,
  confirmedOrder,
  shipOrder,
  deliverOrder,
  cancelOrder,
  findOrderById,
  usersOrderHistory,
  getAllOrders,
  deleteOrder,
};
