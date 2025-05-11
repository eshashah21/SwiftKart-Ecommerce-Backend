const mongoose = require("mongoose");

const mongodbUrl = "mongodb+srv://2004eshashah:6UB3Meaqk4ZHzHRg@cluster0.ossdr79.mongodb.net/your_database_name?retryWrites=true&w=majority&appName=Cluster0";

const connectDb = () => {
    return mongoose.connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
    });
};

module.exports = { connectDb };
