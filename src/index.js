const express = require("express");
const cors = require("cors");

const app = express()

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    return res.status(200).send({message: "Wlecome to e-commerce api - node", status: true})
})

const authRouters = require("./routes/Auth.Routes")
app.use("/auth", authRouters);

const userRouters = require("./routes/User.Router")
app.use("/api/users", userRouters);

const productRouter = require("./routes/Product.Routes")
app.use("/api/products", productRouter);

const adminProductRouter = require("./routes/AdminProduct.Routes");
app.use("/api/admin/products", adminProductRouter);

const cartRouter = require("./routes/Cart.Routes")
app.use("/api/cart", cartRouter);

const cartItemRouter = require("./routes/CartItem.Routes")
app.use("/api/cart_items", cartItemRouter);

const orderRouter = require("./routes/Order.Routes")
app.use("/api/orders", orderRouter);

const adminOrder = require("./routes/AdminOrder.Routes")
app.use("/api/admin/orders", adminOrder)

const reviewRouter = require("./routes/Review.Routes")
app.use("/api/reviews", reviewRouter);

const ratingRouter = require("./routes/Rating.Routes")
app.use("/api/ratings", ratingRouter);

const protectedRoutes = require("./routes/Protect.Routes");
app.use("/api/protected", protectedRoutes);

const paymentRoutes = require("./routes/Payment.Routes");
app.use("/api/payments", paymentRoutes);

module.exports = app;
