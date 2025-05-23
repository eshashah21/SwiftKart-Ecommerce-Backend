# 🛒 SwiftKart - E-commerce Backend

SwiftKart is a robust backend system powering a single-seller clothing e-commerce platform. Built with Node.js and Express.js, it provides a secure, scalable, and feature-rich RESTful API for managing products, users, orders, payments, and more.

🚀 Frontend Repository: SwiftKart - E-commerce Frontend

## 🔧 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (JSON Web Tokens), Bcrypt.js
- **Image Upload:** Cloudinary
- **Payment Integration:** Stripe
- **Environment Management:** dotenv

## 📦 Features

- 🧑‍💼 User authentication (Register, Login, Logout)
- 🔐 Secure route access with JWT
- 🛍️ Product management (CRUD)
- 🧺 Cart and checkout flow
- 💳 Stripe-based secure payments
- 📦 Order creation and tracking
- 📊 Admin routes for user, order, and product management
- ☁️ Cloudinary support for image uploads
- 📁 Organized folder structure using MVC architecture

### Prerequisites

- Node.js & npm
- MongoDB Atlas account
- Cloudinary account
- Stripe account

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/eshashah21/SwiftKart-Ecommerce-Backend.git
   cd SwiftKart-Ecommerce-Backend

   ```

2. Install dependencies:
   npm install

3. Create a .env file with the following:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key

4. Start the server:
   npm run dev

SwiftKart-Ecommerce-Backend/
├── config/             # Configuration files (DB, Cloudinary, etc.)
├── controllers/        # Route controller logic
├── middleware/         # Auth and error handling middleware
├── models/             # Mongoose schemas/models
├── routes/             # Express route handlers
├── utils/              # Utility functions
├── uploads/            # (If local image storage used)
├── .env.example        # Sample environment variables file
├── server.js           # Entry point
└── package.json
