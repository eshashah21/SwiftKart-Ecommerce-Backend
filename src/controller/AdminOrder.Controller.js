const orderService = require("../services/Order.Service");

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const confirmedOrders = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const orders = await orderService.confirmedOrder(orderId);
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const shippedOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const orders = await orderService.shipOrder(orderId);
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deliveredOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const orders = await orderService.deliverOrder(orderId);
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const cancelledOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    const orders = await orderService.cancelOrder(orderId);
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

const deletesOrder = async (req, res) => {
  const orderId = req.params.orderId;
  try {
    const orders = await orderService.deleteOrder(orderId);
    return res.status(200).send(orders);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
};

module.exports = {
  getAllOrders,
  confirmedOrders,
  shippedOrder,
  deliveredOrder,
  cancelledOrder,
  deletesOrder,
};
