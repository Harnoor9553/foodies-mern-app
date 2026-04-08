// =============================================
// frontend/js/main.js
// =============================================
// This file shows you EXACTLY how to connect
// your existing frontend buttons to the backend.
// Include AFTER api.js in your HTML:
//   <script src="js/api.js"></script>
//   <script src="js/main.js"></script>

// ============================================================
// ON PAGE LOAD: Update navbar based on login status
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  updateNavbar();
  loadFoodItems();
  loadTestimonials();
});

// -------------------------------------------------------
// Update navbar: show username if logged in
// -------------------------------------------------------
function updateNavbar() {
  const user = AuthAPI.getCurrentUser();

  // Find your navbar login link (update selector to match your HTML)
  const loginLink = document.getElementById("nav-login-link");
  const logoutBtn = document.getElementById("nav-logout-btn");
  const userGreeting = document.getElementById("nav-user-greeting");

  if (user) {
    if (loginLink) loginLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userGreeting) userGreeting.textContent = `Hi, ${user.name}!`;
  } else {
    if (loginLink) loginLink.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

// ============================================================
// LOAD FOOD ITEMS — Render into the menu section
// ============================================================
async function loadFoodItems(category = "") {
  const menuContainer = document.getElementById("menu-container"); // update this ID
  if (!menuContainer) return;

  try {
    menuContainer.innerHTML = `<p>Loading menu...</p>`;
    const response = await FoodAPI.getAll(category);
    const foods = response.data;

    if (foods.length === 0) {
      menuContainer.innerHTML = `<p>No items available.</p>`;
      return;
    }

    // Build HTML cards for each food item
    menuContainer.innerHTML = foods
      .map(
        (food) => `
      <div class="col-md-4 mb-4">
        <div class="card h-100 shadow-sm">
          <img src="${food.image}" class="card-img-top" alt="${food.name}" 
               style="height:200px; object-fit:cover;"
               onerror="this.src='images/default-food.jpg'">
          <div class="card-body">
            <h5 class="card-title">${food.name}</h5>
            <p class="card-text text-muted small">${food.description}</p>
            <p class="fw-bold text-success">₹${food.price}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="badge bg-secondary">${food.category}</span>
              <button 
                class="btn btn-warning btn-sm order-now-btn" 
                data-food-id="${food._id}"
                data-food-name="${food.name}"
              >
                🛒 Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Attach click handlers to all "Order Now" buttons
    attachOrderNowHandlers();
  } catch (error) {
    menuContainer.innerHTML = `<p class="text-danger">Failed to load menu: ${error.message}</p>`;
  }
}

// -------------------------------------------------------
// "Order Now" button handler
// -------------------------------------------------------
function attachOrderNowHandlers() {
  const buttons = document.querySelectorAll(".order-now-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const foodId = btn.dataset.foodId;
      const foodName = btn.dataset.foodName;

      // Must be logged in
      if (!AuthAPI.isLoggedIn()) {
        showToast("Please login first to add items to cart!", "warning");
        // Optional: redirect to login page
        // window.location.href = "login.html";
        return;
      }

      try {
        btn.disabled = true;
        btn.textContent = "Adding...";

        await CartAPI.addToCart(foodId, 1);

        showToast(`${foodName} added to cart! 🛒`, "success");
        updateCartCount(); // update cart badge in navbar
      } catch (error) {
        showToast(error.message, "danger");
      } finally {
        btn.disabled = false;
        btn.textContent = "🛒 Order Now";
      }
    });
  });
}

// ============================================================
// UPDATE CART COUNT in navbar badge
// ============================================================
async function updateCartCount() {
  if (!AuthAPI.isLoggedIn()) return;

  try {
    const response = await CartAPI.getCart();
    const count = response.data.items
      ? response.data.items.reduce((sum, item) => sum + item.quantity, 0)
      : 0;

    const badge = document.getElementById("cart-count"); // update this ID
    if (badge) badge.textContent = count;
  } catch (error) {
    console.error("Could not update cart count:", error.message);
  }
}

// ============================================================
// NEWSLETTER FORM
// ============================================================
// In your HTML, give your form id="newsletter-form"
// and the input id="newsletter-email"

const newsletterForm = document.getElementById("newsletter-form");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent page reload

    const emailInput = document.getElementById("newsletter-email");
    const email = emailInput.value.trim();

    if (!email) {
      showToast("Please enter an email address.", "warning");
      return;
    }

    try {
      const submitBtn = newsletterForm.querySelector("button[type='submit']");
      submitBtn.disabled = true;
      submitBtn.textContent = "Subscribing...";

      await NewsletterAPI.subscribe(email);

      showToast("Thank you for subscribing! 🎉", "success");
      emailInput.value = ""; // clear the field
    } catch (error) {
      showToast(error.message, "danger");
    } finally {
      const submitBtn = newsletterForm.querySelector("button[type='submit']");
      submitBtn.disabled = false;
      submitBtn.textContent = "Subscribe";
    }
  });
}

// ============================================================
// REGISTER FORM
// ============================================================
// In your HTML, give your form id="register-form"

const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim();
    const password = document.getElementById("register-password").value;

    try {
      await AuthAPI.register(name, email, password);
      showToast("Account created! Redirecting...", "success");
      setTimeout(() => (window.location.href = "index.html"), 1500);
    } catch (error) {
      showToast(error.message, "danger");
    }
  });
}

// ============================================================
// LOGIN FORM
// ============================================================
// In your HTML, give your form id="login-form"

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;

    try {
      await AuthAPI.login(email, password);
      showToast("Login successful! Redirecting...", "success");
      setTimeout(() => (window.location.href = "index.html"), 1500);
    } catch (error) {
      showToast(error.message, "danger");
    }
  });
}

// ============================================================
// LOGOUT button
// ============================================================
const logoutBtn = document.getElementById("nav-logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    AuthAPI.logout();
  });
}

// ============================================================
// LOAD TESTIMONIALS from backend
// ============================================================
async function loadTestimonials() {
  const container = document.getElementById("testimonials-container"); // update this ID
  if (!container) return;

  try {
    const response = await ReviewAPI.getAllReviews();
    const reviews = response.data.slice(0, 6); // show latest 6

    if (reviews.length === 0) {
      container.innerHTML = `<p class="text-center">No reviews yet. Be the first!</p>`;
      return;
    }

    container.innerHTML = reviews
      .map(
        (review) => `
      <div class="col-md-4 mb-4">
        <div class="card p-3 shadow-sm">
          <div class="d-flex align-items-center mb-2">
            <div class="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center me-2"
                 style="width:40px;height:40px;font-weight:bold;">
              ${review.user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>${review.user.name}</strong>
              <div>${"⭐".repeat(review.rating)}</div>
            </div>
          </div>
          <p class="text-muted small">"${review.comment}"</p>
          <small class="text-muted">— ${review.foodItem?.name || "Menu Item"}</small>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Could not load reviews:", error.message);
  }
}

// ============================================================
// UTILITY: Show Bootstrap Toast / Alert
// ============================================================
function showToast(message, type = "success") {
  // Try Bootstrap toast if you have one set up in HTML
  // Otherwise, fall back to a simple alert div

  // Option 1: Simple alert at top of page
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  alertDiv.style.zIndex = "9999";
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  document.body.appendChild(alertDiv);

  // Auto-remove after 3 seconds
  setTimeout(() => alertDiv.remove(), 3000);
}

// ============================================================
// CATEGORY FILTER BUTTONS
// ============================================================
// Add data-category="Pizza" to your filter buttons in HTML

document.querySelectorAll(".category-filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.dataset.category || "";
    loadFoodItems(category);

    // Highlight active button
    document.querySelectorAll(".category-filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
