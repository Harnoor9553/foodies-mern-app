# 🧪 Postman Testing Guide — Food Ordering API

## Setup

1. Download Postman from https://www.postman.com/downloads/
2. Create a **New Collection** called `Food Ordering API`
3. Set a **Collection Variable**: `base_url = http://localhost:5000/api`
4. Set another variable: `token = ` (leave empty for now — you'll fill it after login)

---

## Step 1: Test Server is Running

| Field  | Value |
|--------|-------|
| Method | GET |
| URL    | `http://localhost:5000` |

✅ Expected: `{ "message": "🍔 Food Ordering API is running!" }`

---

## Step 2: Auth Routes

### Register
| Field  | Value |
|--------|-------|
| Method | POST |
| URL    | `{{base_url}}/auth/register` |
| Body (JSON) | `{ "name": "Test User", "email": "test@test.com", "password": "test123" }` |

✅ Expected: `{ "success": true, "token": "eyJ..." }`

> **Copy the token** and paste it into your Collection Variable `token`

---

### Login
| Field  | Value |
|--------|-------|
| Method | POST |
| URL    | `{{base_url}}/auth/login` |
| Body (JSON) | `{ "email": "test@test.com", "password": "test123" }` |

---

### Get Profile (Protected)
| Field  | Value |
|--------|-------|
| Method | GET |
| URL    | `{{base_url}}/auth/profile` |
| Auth   | Type: Bearer Token → Token: `{{token}}` |

---

## Step 3: Food Items

### Get All Food Items
| Field  | Value |
|--------|-------|
| Method | GET |
| URL    | `{{base_url}}/food` |

### Filter by Category
| Field  | Value |
|--------|-------|
| Method | GET |
| URL    | `{{base_url}}/food?category=Pizza` |

### Add Food Item (Admin only)
| Field  | Value |
|--------|-------|
| Method | POST |
| URL    | `{{base_url}}/food` |
| Auth   | Bearer Token → `{{token}}` (must be admin) |
| Body (JSON) | `{ "name": "Test Burger", "description": "Tasty!", "price": 199, "category": "Burgers" }` |

---

## Step 4: Cart

### Add to Cart
| Field  | Value |
|--------|-------|
| Method | POST |
| URL    | `{{base_url}}/cart` |
| Auth   | Bearer Token → `{{token}}` |
| Body (JSON) | `{ "foodItemId": "<paste a food _id here>", "quantity": 2 }` |

> Get a food `_id` from the Get All Food Items response

### Get My Cart
| Field  | Value |
|--------|-------|
| Method | GET |
| URL    | `{{base_url}}/cart` |
| Auth   | Bearer Token → `{{token}}` |

### Update Item Quantity
| Field  | Value |
|--------|-------|
| Method | PUT |
| URL    | `{{base_url}}/cart/<foodItemId>` |
| Auth   | Bearer Token → `{{token}}` |
| Body (JSON) | `{ "quantity": 3 }` |

### Remove Item from Cart
| Field  | Value |
|--------|-------|
| Method | DELETE |
| URL    | `{{base_url}}/cart/<foodItemId>` |
| Auth   | Bearer Token → `{{token}}` |

---

## Step 5: Orders

### Place Order
| Field  | Value |
|--------|-------|
| Method | POST |
| URL    | `{{base_url}}/orders` |
| Auth   | Bearer Token → `{{token}}` |
| Body (JSON) | See below |

```json
{
  "deliveryAddress": {
    "street": "123 MG Road",
    "city": "Bangalore",
    "pincode": "560001",
    "phone": "9876543210"
  },
  "paymentMethod": "Cash on Delivery",
  "notes": "Extra spicy please"
}
```

### Get My Orders
| Field  | Value |
|--------|-------|
| Method | GET |
| URL    | `{{base_url}}/orders` |
| Auth   | Bearer Token → `{{token}}` |

### Cancel Order
| Field  | Value |
|--------|-------|
| Method | PUT |
| URL    | `{{base_url}}/orders/<orderId>/cancel` |
| Auth   | Bearer Token → `{{token}}` |

---

## Step 6: Newsletter

### Subscribe
| Field  | Value |
|--------|-------|
| Method | POST |
| URL    | `{{base_url}}/newsletter/subscribe` |
| Body (JSON) | `{ "email": "newsletter@test.com" }` |

---

## Step 7: Reviews

### Add Review
| Field  | Value |
|--------|-------|
| Method | POST |
| URL    | `{{base_url}}/reviews` |
| Auth   | Bearer Token → `{{token}}` |
| Body (JSON) | `{ "foodItemId": "<food _id>", "rating": 5, "comment": "Absolutely delicious!" }` |

### Get All Reviews
| Field  | Value |
|--------|-------|
| Method | GET |
| URL    | `{{base_url}}/reviews` |

---

## Common Error Codes

| Code | Meaning |
|------|---------|
| 400  | Bad request — missing or invalid fields |
| 401  | Unauthorized — no token or invalid token |
| 403  | Forbidden — not admin |
| 404  | Not found — wrong ID or route |
| 500  | Server error — check terminal logs |

---

## Admin Login Credentials (after running seed.js)

- **Email:** admin@food.com
- **Password:** admin123
