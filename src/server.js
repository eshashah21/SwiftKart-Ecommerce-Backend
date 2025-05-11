const app = require(".");
const { connectDb } = require("./config/db");

const PORT = 5000;

app.listen(PORT, async() => {
    await connectDb();
    console.log("e-commerce api listening on PORT: " , PORT);
})