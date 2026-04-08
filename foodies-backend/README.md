# 🍔 Food Ordering App — Complete Backend

A production-ready RESTful API backend built with **Node.js**, **Express**, **MongoDB**, and **JWT authentication**.

---

## 📁 Folder Structure

```
food-ordering-backend/
│
├── config/
│   └── db.js                  # MongoDB connection
│
├── controllers/               # Business logic for each feature
│   ├── authController.js
│   ├── foodController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── reviewController.js
│   └── newsletterController.js
│
├── middleware/
│   ├── authMiddleware.js      # JWT protect + adminOnly
│   └── errorMiddleware.js     # Global 404 + error handler
│
├── models/                    # MongoDB schemas
│   ├── User.js
│   ├── FoodItem.js
│   ├── Cart.js
│   ├── Order.js
│   ├── Review.js
│   └── Subscriber.js
│
├── routes/                    # Express routers
│   ├── authRoutes.js
│   ├── foodRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── reviewRoutes.js
│   └── newsletterRoutes.js
│
├── utils/
│   └── generateToken.js       # JWT token helper
│
├── frontend-integration/
│   ├── api.js                 # All API call functions
│   └── main.js                # Frontend wiring (buttons, forms)
│
├── .env                       # Environment variables (DON'T commit)
├── .gitignore
├── package.json
├── seed.js                    # Seed DB with sample data
├── server.js                  # App entry point
└── POSTMAN_GUIDE.md           # How to test with Postman
```

---

## 🚀 Quick Start (Step by Step)

### Step 1 — Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org/) (v16 or later) — `node --version`
- [MongoDB](https://www.mongodb.com/try/download/community) (local) OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud account
- [Postman](https://www.postman.com/downloads/) for testing

---

### Step 2 — Install Dependencies

```bash
cd food-ordering-backend
npm install
```

This installs: express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv, nodemon

---

### Step 3 — Configure Environment Variables

Open the `.env` file and update:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/food_ordering_db
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://127.0.0.1:5500
```

> **MongoDB Atlas users:** Replace `MONGO_URI` with your Atlas connection string.

---

### Step 4 — Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

---

### Step 5 — Seed the Database

```bash
node seed.js
```

This adds 8 sample food items and creates an admin account:
- **Email:** admin@food.com
- **Password:** admin123

---

### Step 6 — Start the Server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running in development mode on port 5000
📡 API available at: http://localhost:5000
```

---

## 🌐 API Endpoints Reference

### Auth — `/api/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Create new account |
| POST | `/login` | Public | Login & get token |
| GET | `/profile` | Private | Get own profile |
| PUT | `/profile` | Private | Update profile |

### Food Items — `/api/food`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | Get all food items |
| GET | `/?category=Pizza` | Public | Filter by category |
| GET | `/:id` | Public | Get single item |
| POST | `/` | Admin | Add food item |
| PUT | `/:id` | Admin | Update food item |
| DELETE | `/:id` | Admin | Delete food item |

### Cart — `/api/cart`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Private | Get user's cart |
| POST | `/` | Private | Add item to cart |
| PUT | `/:foodItemId` | Private | Update quantity |
| DELETE | `/:foodItemId` | Private | Remove item |
| DELETE | `/clear` | Private | Clear entire cart |

### Orders — `/api/orders`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Place order |
| GET | `/` | Private | Get my orders |
| GET | `/:id` | Private | Get single order |
| PUT | `/:id/cancel` | Private | Cancel order |
| GET | `/admin/all` | Admin | All orders |
| PUT | `/:id/status` | Admin | Update status |

### Reviews — `/api/reviews`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/` | Public | All reviews |
| GET | `/food/:foodItemId` | Public | Reviews for an item |
| POST | `/` | Private | Add review |
| DELETE | `/:id` | Private | Delete review |

### Newsletter — `/api/newsletter`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/subscribe` | Public | Subscribe |
| GET | `/subscribers` | Admin | All subscribers |

---

## 🔗 Frontend Integration

1. Copy `frontend-integration/api.js` and `frontend-integration/main.js` into your frontend `js/` folder.
2. Add these script tags to your HTML **before `</body>`**:

```html
<script src="js/api.js"></script>
<script src="js/main.js"></script>
```

3. Update your HTML element IDs to match:

| Element | Expected ID |
|---------|------------|
| Food menu container | `menu-container` |
| Testimonials container | `testimonials-container` |
| Newsletter form | `newsletter-form` |
| Newsletter email input | `newsletter-email` |
| Login form | `login-form` |
| Register form | `register-form` |
| Cart count badge | `cart-count` |
| Logout button | `nav-logout-btn` |
| Login nav link | `nav-login-link` |
| User greeting in nav | `nav-user-greeting` |

---

## 🧪 Testing

See `POSTMAN_GUIDE.md` for full Postman testing instructions.

---

## ✅ Progress Checklist

### Backend Setup
- [ ] Node.js and npm installed
- [ ] MongoDB installed and running
- [ ] `npm install` completed
- [ ] `.env` file configured with correct MONGO_URI and JWT_SECRET
- [ ] Server starts without errors (`npm run dev`)
- [ ] MongoDB connects successfully
- [ ] `node seed.js` ran — food items visible in DB

### API Testing (via Postman)
- [ ] GET `/` returns health check message
- [ ] POST `/api/auth/register` creates a user
- [ ] POST `/api/auth/login` returns a token
- [ ] GET `/api/auth/profile` returns user data (with token)
- [ ] GET `/api/food` returns list of food items
- [ ] POST `/api/cart` adds item to cart (with token)
- [ ] GET `/api/cart` returns cart (with token)
- [ ] POST `/api/orders` places order (with token)
- [ ] GET `/api/orders` returns order history (with token)
- [ ] PUT `/api/orders/:id/cancel` cancels an order
- [ ] POST `/api/newsletter/subscribe` saves email
- [ ] POST `/api/reviews` adds a review (with token)
- [ ] GET `/api/reviews` returns all reviews

### Frontend Integration
- [ ] `api.js` copied into frontend `js/` folder
- [ ] `main.js` copied into frontend `js/` folder
- [ ] Both scripts added to HTML before `</body>`
- [ ] HTML element IDs updated to match `main.js`
- [ ] "Order Now" buttons add items to cart
- [ ] Newsletter form submits and shows success message
- [ ] Login form logs in and saves token
- [ ] Register form creates account
- [ ] Navbar shows username after login
- [ ] Food items load dynamically from backend
- [ ] Testimonials load from backend reviews
- [ ] Logout clears token and redirects

### Security Checklist
- [ ] `.env` added to `.gitignore`
- [ ] JWT_SECRET is a long random string (not "secret123")
- [ ] Passwords are hashed (bcrypt) — confirmed in MongoDB
- [ ] Protected routes return 401 without token
- [ ] Admin routes return 403 for regular users

### Deployment (when ready)
- [ ] MongoDB Atlas cluster created
- [ ] `MONGO_URI` updated to Atlas connection string
- [ ] Backend deployed to Render / Railway / Heroku
- [ ] `FRONTEND_URL` updated to production frontend URL
- [ ] Frontend deployed to Vercel / Netlify / GitHub Pages
- [ ] `API_BASE_URL` in `api.js` updated to production backend URL

---

## 🛠️ Troubleshooting

| Problem | Solution |
|---------|----------|
| `Cannot connect to MongoDB` | Make sure MongoDB service is running |
| `JWT malformed` | Token expired or invalid — login again |
| `CORS error in browser` | Check `FRONTEND_URL` in `.env` matches your frontend URL exactly |
| `Route not found` | Check the URL — all routes start with `/api/` |
| `Cast to ObjectId failed` | You passed an invalid ID format |
| `Email already registered` | Use a different email or login |
| `nodemon not found` | Run `npm install` again |
