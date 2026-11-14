# 🍔 Foodies — Full-Stack Food Ordering Web Application

## Overview

A full-stack food ordering web application built using **HTML, CSS, Bootstrap, JavaScript, Node.js, Express.js and MongoDB**.

Foodies allows users to browse food items, manage their shopping carts, authenticate securely, place orders and make online payments through **Razorpay Test Mode**.

---

## Features

### 1. User Authentication
- User registration and login functionality
- Password hashing using **bcrypt**
- **JWT-based authentication**
- Protected API routes using authentication middleware
- User profile retrieval and management
- Conditional UI rendering based on authentication state

### 2. Food Catalogue
- Retrieve food items dynamically through REST APIs
- Display food details and pricing
- Organize food items by category

### 3. Shopping Cart
- Add food items to the cart
- Update item quantities
- Remove individual items
- Retrieve authenticated users' cart data
- Dynamic total price calculation
- Clear cart after successful order processing

### 4. Order Management
- Place **Cash on Delivery (COD)** orders
- Retrieve order history
- View individual order details
- Cancel eligible orders
- Validate authentication and cart data before order placement

### 5. Online Payment Integration
- **Razorpay Standard Checkout** integration
- Payment order creation through the backend
- Payment signature verification
- Razorpay **Test Mode** integration

### 6. Additional Features
- Review API
- Newsletter subscription API
- Responsive user interface using **Bootstrap**
- Inline feedback messages for user interactions

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Payment Gateway | Razorpay |
| API Testing | Postman |
| Version Control | Git, GitHub |

---

## Project Structure

```text
foodies-mern-app/
│
├── foodies-backend/
│   ├── config/
│   │   ├── db.js
│   │   └── razorpay.js
│   │
│   ├── controllers/
│   │   └── paymentController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   └── Payment.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── newsletterRoutes.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── foodies-frontend/
│   └── bootstrap/
│       ├── css/
│       │   └── style.css
│       ├── js/
│       │   └── main.js
│       ├── index.html
│       └── orders.html
│
├── .gitignore
└── README.md
```

---

## Installation and Setup

### Prerequisites

Make sure you have the following installed:

- **Node.js and npm**
- **MongoDB Atlas** account or local MongoDB instance
- **Git**
- **Visual Studio Code**
- **Postman** (for API testing)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Harnoor9553/foodies-mern-app.git
```

### Step 2: Navigate to the Project Directory

```bash
cd foodies-mern-app
```

### Step 3: Backend Setup

Navigate to the backend directory:

```bash
cd foodies-backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `foodies-backend` directory.

Configure the required environment variables:

- MongoDB connection URI
- JWT secret
- Razorpay Key ID
- Razorpay Key Secret
- Server port

> **Security Note:** Never commit your `.env` file or expose private credentials on GitHub.

Start the backend development server:

```bash
npm run dev
```

The backend runs on port `5000` by default, unless configured otherwise.

### Step 4: Frontend Setup

Navigate to the frontend directory:

```text
foodies-frontend/bootstrap/
```

Open `index.html` using the **Live Server** extension in Visual Studio Code.

Make sure the backend server is running before testing frontend functionality.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/food` | Retrieve food items |
| `GET` | `/api/cart` | Retrieve user cart |
| `POST` | `/api/cart` | Add item to cart |
| `PUT` | `/api/cart/:foodItemId` | Update cart quantity |
| `DELETE` | `/api/cart/:foodItemId` | Remove cart item |
| `DELETE` | `/api/cart/clear` | Clear cart |
| `POST` | `/api/orders` | Place COD order |
| `GET` | `/api/orders` | Retrieve order history |
| `GET` | `/api/orders/:id` | Retrieve individual order |
| `PUT` | `/api/orders/:id/cancel` | Cancel eligible order |
| `POST` | `/api/payments/create-order` | Create Razorpay payment order |
| `POST` | `/api/payments/verify` | Verify payment |

**Authentication:** Protected endpoints require JWT Bearer authentication.

---

## Security Considerations

- Passwords are hashed using **bcrypt**
- JWT authentication protects authorized resources
- Sensitive configuration is maintained through environment variables
- Payment verification is handled by the backend
- API requests are validated before processing

---

## Future Improvements

- Implement automated unit and integration tests
- Strengthen payment verification and duplicate-order protection
- Add an administrator dashboard for food and order management
- Implement pagination, search and sorting
- Improve frontend loading states and error handling
- Deploy the application with HTTPS and production environment configuration
- Complete end-to-end payment testing and reconciliation

---

## Learning Outcomes

Through this project, I explored and implemented:

- Full-stack web application architecture
- RESTful API development using Express.js
- MongoDB database integration using Mongoose
- JWT authentication and middleware
- Frontend-backend communication using Fetch API
- Shopping cart and order management
- Third-party payment gateway integration
- Git and GitHub version control workflows

---

## Project Status

**Actively Developed**

The application provides a foundation for a full-stack food ordering system. Production-readiness improvements, automated testing and complete payment workflow verification remain areas for further development.

---

**Developed as a Full-Stack Web Development Project.**

[GitHub Repository](https://github.com/Harnoor9553/foodies-mern-app)
