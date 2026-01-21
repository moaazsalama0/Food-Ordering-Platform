![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?logo=express)
![Vue.js](https://img.shields.io/badge/Vue.js-3-42b883?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?logo=vite)

# Food Order Delivery System

A full-stack web application for managing food orders with user authentication, menu management, shopping cart functionality, and payment processing.

## Project Overview

This project consists of a **Node.js/Express backend** and a **Vue.js/Vite frontend**, providing a complete food ordering platform with user management, order tracking, and payment integration.

## Project Structure

```
.
├── backend/                 # Node.js Express server
│   ├── config/             # Database and app configuration
│   ├── middleware/         # Authentication and error handling
│   ├── models/             # Database models (User, Order, MenuItem)
│   ├── routes/             # API endpoints (auth, cart, menu, orders, payments, users)
│   ├── scripts/            # Utility scripts (database backups, etc.)
│   ├── test/               # Backend tests
│   ├── server.js           # Main server entry point
│   ├── test.js             # Test runner
│   ├── package.json        # Backend dependencies
│   ├── README.md           # Backend documentation
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── .env                # Environment variables
│
├── frontend/               # Vue.js/Vite application
│   ├── src/                # Vue components and application code
│   ├── public/             # Static assets
│   ├── nginx.conf          # Nginx configuration for production
│   ├── Dockerfile          # Docker containerization
│   ├── vite.config.js      # Vite build configuration
│   ├── eslint.config.js    # ESLint configuration
│   ├── package.json        # Frontend dependencies
│   ├── README.md           # Frontend documentation
│   ├── index.html          # Main HTML file
│   └── .env                # Environment variables
│
├── FoodOrderDB.sql         # Database schema
├── PROJECT_SUMMARY.md      # Project overview
└── .gitignore              # Git ignore rules
```

## Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Menu Management**: Browse and manage food menu items
- **Shopping Cart**: Add/remove items and manage cart state
- **Order Management**: Create, track, and manage orders
- **Payment Processing**: Integrated payment handling
- **User Profiles**: User account management and preferences
- **Error Handling**: Comprehensive error handling middleware
- **Database**: SQL-based data persistence

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQL (MySQL/PostgreSQL)
- **Authentication**: JWT
- **Environment**: .env configuration

### Frontend
- **Framework**: Vue.js
- **Build Tool**: Vite
- **Linting**: ESLint
- **Styling**: CSS (configured in project)
- **Deployment**: Docker & Nginx

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- SQL database (MySQL/PostgreSQL)
- Docker (optional, for containerization)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and settings
   ```

4. Set up the database:
   ```bash
   # Import the database schema
   mysql -u your_user -p your_database < ../FoodOrderDB.sql
   ```

5. Start the server:
   ```bash
   npm start
   ```

   Or with nodemon for development:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   # Edit .env with your API endpoints
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

## Deployment

### Backend
Refer to [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md) for detailed deployment instructions.

### Frontend
The frontend includes a `Dockerfile` and `nginx.conf` for containerization:

```bash
docker build -t food-order-frontend .
docker run -p 80:80 food-order-frontend
```

## API Routes

- **Authentication**: `/api/auth` - Login, register, logout
- **Users**: `/api/users` - User profile management
- **Menu**: `/api/menu` - Browse menu items
- **Cart**: `/api/cart` - Manage shopping cart
- **Orders**: `/api/orders` - Create and track orders
- **Payments**: `/api/payments` - Payment processing

## Environment Variables

### Backend (.env)
```
DATABASE_URL=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
PORT=5000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Database

The database schema is defined in [FoodOrderDB.sql](FoodOrderDB.sql). It includes tables for:
- Users
- Menu Items
- Orders
- Payments

## Documentation

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [Backend Deployment Guide](backend/DEPLOYMENT.md)
- [Project Summary](PROJECT_SUMMARY.md)
