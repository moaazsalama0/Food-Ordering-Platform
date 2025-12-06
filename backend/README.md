# Food Ordering Backend API

A comprehensive Node.js/Express backend API for a food ordering platform with PostgreSQL database, JWT authentication, Stripe payment integration, and full CRUD operations.

## 🚀 Features

- **Authentication & Authorization**
  - User registration and login with JWT
  - Role-based access control (Customer, Admin)
  - Password hashing with bcryptjs

- **Menu Management**
  - Full CRUD operations for menu items
  - Category-based organization
  - Search and filtering capabilities
  - Image upload support

- **Order Management**
  - Complete order lifecycle
  - Real-time order status updates
  - Order history and tracking
  - Admin order management

- **Payment Processing**
  - Stripe integration for card payments
  - Cash payment option
  - Secure payment handling
  - Refund capabilities

- **User Management**
  - User profile management
  - Password change functionality
  - Address management
  - Order history

- **Security Features**
  - Input validation and sanitization
  - Rate limiting
  - CORS protection
  - Helmet security headers
  - Error handling

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL with pg driver
- **Authentication**: JWT (jsonwebtoken)
- **Payment**: Stripe API
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: express-validator
- **Environment**: dotenv
- **Logging**: morgan

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # Database connection
├── middleware/
│   ├── auth.js             # Authentication middleware
│   ├── errorHandler.js     # Error handling middleware
│   └── notFound.js         # 404 middleware
├── models/
│   ├── User.js             # User model
│   ├── MenuItem.js         # Menu item model
│   └── Order.js            # Order model
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── menu.js             # Menu routes
│   ├── cart.js             # Cart routes
│   ├── orders.js           # Order routes
│   ├── users.js            # User routes
│   └── payments.js         # Payment routes
├── scripts/
│   └── initDatabase.js     # Database initialization
├── uploads/                # File uploads directory
├── .env.example            # Environment variables example
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md               # Documentation
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- NPM or Yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=food_ordering_db
   DB_USER=postgres
   DB_PASSWORD=your_password

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Email Configuration (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

   # CORS Configuration
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb food_ordering_db

   # Initialize database tables
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

   The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "dateOfBirth": "1990-01-01",
  "gender": "male"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Menu Endpoints

#### Get All Menu Items
```http
GET /api/menu?category=Burgers&search=classic&minPrice=10&maxPrice=20
```

#### Get Single Menu Item
```http
GET /api/menu/1
```

#### Create Menu Item (Admin)
```http
POST /api/menu
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "New Burger",
  "description": "Delicious burger description",
  "price": 14.99,
  "categoryId": 1,
  "preparationTime": 15,
  "calories": 650
}
```

### Cart Endpoints

#### Add Item to Cart
```http
POST /api/cart/add
Content-Type: application/json

{
  "itemId": 1,
  "quantity": 2
}
```

#### Calculate Cart Totals
```http
POST /api/cart/calculate-totals
Content-Type: application/json

{
  "items": [...],
  "couponCode": "FOOD10"
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "cartItems": [...],
  "total": 29.99,
  "deliveryAddress": "123 Main St",
  "deliveryCity": "New York",
  "deliveryZip": "10001",
  "paymentMethod": "card"
}
```

#### Get User Orders
```http
GET /api/orders/my-orders?status=all
Authorization: Bearer <token>
```

#### Get Single Order
```http
GET /api/orders/1
Authorization: Bearer <token>
```

#### Cancel Order
```http
PATCH /api/orders/1/cancel
Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Payment Intent
```http
POST /api/payments/create-payment-intent
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 29.99,
  "currency": "usd"
}
```

#### Confirm Payment
```http
POST /api/payments/confirm-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "pi_1234567890",
  "orderId": 1
}
```

### User Profile Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "+1234567890",
  "address": "123 Main St",
  "city": "New York",
  "zipCode": "10001"
}
```

#### Change Password
```http
PUT /api/users/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🛡️ Security Features

- **Input Validation**: All endpoints include validation middleware
- **Rate Limiting**: API requests are limited to prevent abuse
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers for production
- **Password Hashing**: bcryptjs for secure password storage
- **JWT**: Secure token-based authentication

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `name`, `email`, `password`
- `role` (customer/admin)
- `date_of_birth`, `gender`
- `phone`, `address`, `city`, `zip_code`
- `profile_image`
- `created_at`, `updated_at`

### Menu Items Table
- `id` (Primary Key)
- `name`, `description`, `price`
- `image`, `category_id`
- `is_available`, `preparation_time`
- `calories`, `allergens`
- `created_at`, `updated_at`

### Orders Table
- `id` (Primary Key)
- `order_number` (Unique)
- `user_id` (Foreign Key)
- `total_amount`, `status`
- `payment_method`, `payment_status`
- `delivery_address`, `delivery_city`, `delivery_zip`
- `notes`, `created_at`, `updated_at`

## 🧪 Testing

Run tests with:
```bash
npm test
```

## 🚀 Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   ```

2. **Database Migration**
   ```bash
   npm run seed
   ```

3. **Start Server**
   ```bash
   npm start
   ```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@foodordering.com or create an issue in the repository.

---

**Built with ❤️ for food ordering platforms**