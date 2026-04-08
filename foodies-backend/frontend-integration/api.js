// =============================================
// frontend/js/api.js
// =============================================
// Copy this file into your frontend project.
// It centralizes all API calls in one place.
// Include it in your HTML: <script src="js/api.js"></script>

const API_BASE_URL = "http://localhost:5000/api";

// -------------------------------------------------------
// HELPER: Get token from localStorage
// -------------------------------------------------------
const getToken = () => localStorage.getItem("token");

// -------------------------------------------------------
// HELPER: Build headers (with or without auth token)
// -------------------------------------------------------
const getHeaders = (requiresAuth = false) => {
  const headers = { "Content-Type": "application/json" };
  if (requiresAuth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// -------------------------------------------------------
// HELPER: Handle fetch response — throws on error
// -------------------------------------------------------
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }
  return data;
};

// ============================================================
// AUTH API
// ============================================================

const AuthAPI = {
  // Register a new user
  register: async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ name, email, password }),
    });
    const data = await handleResponse(response);
    // Save token to localStorage for future requests
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  // Login existing user
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  },

  // Logout — just clear localStorage
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html"; // redirect to home
  },

  // Get logged-in user's profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Check if user is logged in
  isLoggedIn: () => !!getToken(),

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

// ============================================================
// FOOD ITEMS API
// ============================================================

const FoodAPI = {
  // Get all food items (optionally filtered by category)
  getAll: async (category = "") => {
    const url = category
      ? `${API_BASE_URL}/food?category=${category}`
      : `${API_BASE_URL}/food`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Get single food item
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/food/${id}`);
    return handleResponse(response);
  },
};

// ============================================================
// CART API
// ============================================================

const CartAPI = {
  // Get current user's cart
  getCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Add item to cart
  addToCart: async (foodItemId, quantity = 1) => {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ foodItemId, quantity }),
    });
    return handleResponse(response);
  },

  // Update item quantity
  updateQuantity: async (foodItemId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/cart/${foodItemId}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify({ quantity }),
    });
    return handleResponse(response);
  },

  // Remove single item from cart
  removeItem: async (foodItemId) => {
    const response = await fetch(`${API_BASE_URL}/cart/${foodItemId}`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: "DELETE",
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },
};

// ============================================================
// ORDER API
// ============================================================

const OrderAPI = {
  // Place a new order
  placeOrder: async (deliveryAddress, paymentMethod = "Cash on Delivery", notes = "") => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ deliveryAddress, paymentMethod, notes }),
    });
    return handleResponse(response);
  },

  // Get all orders for logged-in user
  getMyOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Get single order by ID
  getOrderById: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/cancel`, {
      method: "PUT",
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },
};

// ============================================================
// REVIEW API
// ============================================================

const ReviewAPI = {
  // Get all reviews (for testimonials section)
  getAllReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews`);
    return handleResponse(response);
  },

  // Add a review
  addReview: async (foodItemId, rating, comment) => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({ foodItemId, rating, comment }),
    });
    return handleResponse(response);
  },
};

// ============================================================
// NEWSLETTER API
// ============================================================

const NewsletterAPI = {
  subscribe: async (email) => {
    const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },
};
