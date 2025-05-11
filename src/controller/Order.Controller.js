const orderService = require("../services/Order.Service");

const createOrder = async(req, res) => {
    const user = await req.user;
    console.log("Creating order for user:", user); // Log to check if this is reached
    try {
        let createdOrder = await orderService.createOrder(user, req.body);
        return res.status(201).send(createdOrder);
    } catch (error) {
        console.error("Error creating order:", error); // Log the error for debugging
        return res.status(500).send({ error: error.message });
    }
}

const findOrderById = async(req, res) => {
    const user = await req.user; // Ensure user is correctly retrieved
    try {
        let findingOrder = await orderService.findOrderById(req.params.id);
        if (!findingOrder) {
            return res.status(404).send({ error: "Order not found" }); // Handle case where order is not found
        }
        return res.status(200).send(findingOrder); // Return the found order
    } catch (error) {
        console.error("Error finding order by ID:", error); // Log the error for debugging
        return res.status(500).send({ error: error.message });
    }
}

const orderHistory = async(req, res) => {
    const user = await req.user;
    try{
        let history = await orderService.usersOrderHistory(user._id);
        return res.status(201).send(history);
    }catch(error){
        return res.status(500).send({ error: error.message });
    }
}

const getAllOrders = async (req, res) => {
    try {
      const orders = await orderService.getAllOrders(); // Fetch all orders from the service
      console.log('Fetched Orders:', orders); // Log the fetched orders
      return res.status(200).send(orders); // Send the orders as a response
    } catch (error) {
      console.error('Error fetching orders:', error); // Log any errors
      return res.status(500).send({ error: error.message }); // Send an error response
    }
  };

module.exports = { createOrder, findOrderById, orderHistory, getAllOrders }