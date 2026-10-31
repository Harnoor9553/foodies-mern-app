// active navbar
let nav = document.querySelector(".navigation-wrap");
window.onscroll = function () {
    if(document.documentElement.scrollTop > 20){
        nav.classList.add("scroll-on");
    } else {
        nav.classList.remove("scroll-on");
    }
}


//nav hide
// nav hide
let navBar = document.querySelectorAll('.nav-link');
let navCollapse = document.querySelector('.navbar-collapse.collapse');

navBar.forEach(function(a){
    a.addEventListener("click", function(){
        navCollapse.classList.remove("show");
    })
})
const token = localStorage.getItem("token");

if (token) {
  document.getElementById("userWelcome").textContent = "WELCOME ";
}
if (token) {
  document.getElementById("login").style.display = "none";
}

//counter design
document.addEventListener("DOMContentLoaded", () => {

    function counter(id, start, end, duration){
        let obj = document.getElementById(id);
        if (!obj) return;

        let current = start;
        let range = end - start;
        let increment = range > 0 ? 1 : -1;
        let step = Math.abs(Math.floor(duration / range));

        let timer = setInterval(() => {
            current += increment;
            obj.textContent = current;

            if(current === end){
                clearInterval(timer);
            }
        }, step);
    }

    counter("count1", 0, 1287, 3000);
    counter("count2", 100, 5786, 2500);
    counter("count3", 0, 1440, 3000);
    counter("count4", 0, 7110, 3000);

});
const orderButtons = document.querySelectorAll(".order-btn");

orderButtons.forEach(button => {
  button.addEventListener("click", async () => {
    
    const name = button.getAttribute("data-name");
    const price = button.getAttribute("data-price");
    const token = localStorage.getItem("token"); // ✅ ADD HERE

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`  // ✅ ADD HERE
        },
        body: JSON.stringify({
          deliveryAddress: {
            street: "123 Street",
            city: "Delhi",
            pincode: "110001",
            phone: "9999999999"
          },
          paymentMethod: "Cash on Delivery",
          notes: name,
          items: [
            {
              name: name,
              price: price,
              quantity: 1
            }
          ],
          totalPrice: price
        })
      });

      const data = await response.json();
      console.log(data);

      alert(`${name} ordered successfully!`);

    } catch (error) {
      console.error(error);
    alert("Something went wrong. Please try again.");
    }
  });
});

const cartModal = document.getElementById("cartModal");

let currentCart = {
  items: [],
  totalPrice: 0
};

// OPEN CART
function openCart() {
  cartModal.style.right = "0";
  loadCart();
}

// CLOSE CART
document.getElementById("closeCart").addEventListener("click", () => {
  cartModal.style.right = "-400px";
});

// FETCH CART FROM BACKEND
async function loadCart() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login to view your cart");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to load cart");
    }

    currentCart = result.data;
    renderCart();

  } catch (error) {
    console.error("Load cart error:", error);
    alert(error.message);
  }
}

// DISPLAY CART ITEMS

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";

  if (!currentCart.items || currentCart.items.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty</p>";
    cartTotal.textContent = "Total: ₹0";
    return;
  }

  currentCart.items.forEach((item) => {
    const food = item.foodItem;

    if (!food) return;

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="mb-3">
        <strong>${food.name}</strong>
        <br>
        <span>₹${item.price} × ${item.quantity}</span>

        <div class="d-flex align-items-center gap-2 mt-2">

          <button class="quantity-btn"
            data-id="${food._id}"
            data-action="decrease"
            ${item.quantity <= 1 ? "disabled" : ""}>
            −
          </button>

         <span class="cart-quantity">${item.quantity}</span>

          <button class="quantity-btn"
            data-id="${food._id}"
            data-action="increase">
            +
          </button>

          <button class="remove-cart-item"
            data-id="${food._id}">
            ❌
          </button>

        </div>
      </div>
    `;

    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: ₹${currentCart.totalPrice}`;
}

// UPDATE ITEM QUANTITY
async function updateCartQuantity(foodItemId, newQuantity) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/cart/${foodItemId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        quantity: newQuantity
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to update quantity");
    }

    await loadCart();

  } catch (error) {
    console.error("Quantity update error:", error);
    alert(error.message);
  }
}


// REMOVE ITEM FROM BACKEND
async function removeItem(foodItemId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${API_URL}/cart/${foodItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to remove item");
    }

    await loadCart();

  } catch (error) {
    console.error("Remove item error:", error);
    alert(error.message);
  }
}


document.getElementById("cartItems").addEventListener("click", (event) => {

  // REMOVE ITEM
  const removeButton = event.target.closest(".remove-cart-item");

  if (removeButton) {
    removeItem(removeButton.dataset.id);
    return;
  }

  // INCREASE OR DECREASE QUANTITY
  const quantityButton = event.target.closest(".quantity-btn");

  if (!quantityButton) return;

  const foodItemId = quantityButton.dataset.id;
  const action = quantityButton.dataset.action;

  const item = currentCart.items.find(
    item => item.foodItem && item.foodItem._id === foodItemId
  );

  if (!item) return;

  let newQuantity = item.quantity;

  if (action === "increase") {
    newQuantity++;
  } else if (action === "decrease") {
    newQuantity--;
  }

  if (newQuantity >= 1) {
    updateCartQuantity(foodItemId, newQuantity);
  }

});


// OPEN CHECKOUT FORM
document.getElementById("placeOrderBtn").addEventListener("click", () => {
  if (!currentCart.items || currentCart.items.length === 0) {
    alert("Your cart is empty");
    return;
  }

  document.getElementById("checkoutModal").style.display = "block";
  document.getElementById("placeOrderBtn").style.display = "none";
  document.getElementById("closeCart").style.display = "none";
});


// BACK TO CART
document.getElementById("backToCartBtn").addEventListener("click", () => {
  document.getElementById("checkoutModal").style.display = "none";
  document.getElementById("placeOrderBtn").style.display = "block";
  document.getElementById("closeCart").style.display = "block";
});


// CONFIRM ORDER

document.getElementById("confirmOrderBtn").addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    const street = document.getElementById("street").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const paymentMethod = document.getElementById("paymentMethod").value;

    if (!token) {
        alert("Please login first");
        return;
    }

    if (!street || !city || !pincode || !phone) {
        alert("Please fill in all delivery details");
        return;
    }

    if (!/^\d{6}$/.test(pincode)) {
        alert("Please enter a valid 6-digit pincode");
        return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        alert("Please enter a valid 10-digit Indian mobile number");
        return;
    }

    const deliveryAddress = {
        street,
        city,
        pincode,
        phone
    };

    try {
        // =====================================
        // CASE 1: CASH ON DELIVERY
        // =====================================

        if (paymentMethod === "Cash on Delivery") {

            const response = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    deliveryAddress,
                    paymentMethod
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Order placement failed");
            }

            alert("Order placed successfully!");

            await loadCart();

            document.getElementById("checkoutModal").style.display = "none";
            document.getElementById("placeOrderBtn").style.display = "block";
            document.getElementById("closeCart").style.display = "block";

            cartModal.style.right = "-400px";

            document.getElementById("street").value = "";
            document.getElementById("city").value = "";
            document.getElementById("pincode").value = "";
            document.getElementById("phone").value = "";

            return;
        }

        // =====================================
        // CASE 2: ONLINE PAYMENT WITH RAZORPAY
        // =====================================

        if (paymentMethod === "Online") {

            if (typeof window.Razorpay === "undefined") {
                throw new Error("Razorpay Checkout failed to load. Please refresh the page.");
            }

            // Step 1: Ask backend to create Razorpay order
            const response = await fetch(`${API_URL}/payments/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    deliveryAddress
                })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to create payment");
            }

            const paymentData = result.data;

            // Step 2: Configure Razorpay Checkout
            const options = {
                key: paymentData.keyId,
                amount: paymentData.amount,
                currency: paymentData.currency,
                name: "Foodies",
                description: "Food Order Payment",
                order_id: paymentData.razorpayOrderId,

                handler: async function (paymentResponse) {
                    try {
                        // Step 3: Send payment details to backend for verification
                        const verifyResponse = await fetch(`${API_URL}/payments/verify`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: paymentResponse.razorpay_order_id,
                                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                                razorpay_signature: paymentResponse.razorpay_signature
                            })
                        });

                        const verifyResult = await verifyResponse.json();

                        if (!verifyResponse.ok || !verifyResult.success) {
                            throw new Error(
                                verifyResult.message || "Payment verification failed"
                            );
                        }

                        // Step 4: Payment verified successfully!
                        alert("Payment successful! Your order has been placed.");

                        await loadCart();

                        document.getElementById("checkoutModal").style.display = "none";
                        document.getElementById("placeOrderBtn").style.display = "block";
                        document.getElementById("closeCart").style.display = "block";

                        cartModal.style.right = "-400px";

                        document.getElementById("street").value = "";
                        document.getElementById("city").value = "";
                        document.getElementById("pincode").value = "";
                        document.getElementById("phone").value = "";

                    } catch (error) {
                        console.error("Payment verification error:", error);
                        alert(error.message);
                    }
                },

                prefill: {
                    contact: phone
                },

                theme: {
                    color: "#8B0000"
                },

                modal: {
                    ondismiss: function () {
                        console.log("Razorpay checkout closed by customer");
                    }
                }
            };

            // Step 5: Open Razorpay payment window
            const razorpayInstance = new window.Razorpay(options);

            razorpayInstance.on("payment.failed", function (response) {
                console.error("Payment failed:", response.error);
                alert("Payment failed. Your cart is still saved. Please try again.");
            });

            razorpayInstance.open();
        }

    } catch (error) {
        console.error("Checkout error:", error);
        alert(error.message);
    }
});





function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
}

function openSignup() {
  document.getElementById("signupModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("signupModal").style.display = "none";
}
async function loginUser() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log("LOGIN RESPONSE:", data);

    if (!data.token) {
      alert(data.message || "Login failed");
      return;
    }

    // FIRST store data
    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.name || data.user?.name || "User");

    // THEN update UI
    updateGreeting();

    document.getElementById("loginMessage").textContent = "Login successful!";
    closeModal();

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    document.getElementById("loginMessage").textContent = data.message || "Login failed";
  }
}
async function signupUser() {
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    console.log("SIGNUP RESPONSE:", data);

    if (!data.success) {
     document.getElementById("signupMessage").textContent = data.message || "Signup failed";
      return;
    }

    //  store AFTER success
    localStorage.setItem("username", name);

    document.getElementById("signupMessage").textContent = "Signup successful! Please login.";
    closeModal();

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    alert("Signup error");
  }
}function updateGreeting() {
  const username = localStorage.getItem("username");
  const heading = document.getElementById("mainHeading");

  if (username && heading) {
    const formatted =
      username.charAt(0).toUpperCase() + username.slice(1);

    heading.textContent = `Hey ${formatted}, what would you like to eat today?`;
  }
}
function openLogin() {
  document.getElementById("loginModal").style.display = "flex";
  document.getElementById("loginMessage").textContent = ""; // ✅clear
}

function openSignup() {
  document.getElementById("signupModal").style.display = "flex";
  document.getElementById("signupMessage").textContent = ""; //  clear
}
//loadOrders
async function loadOrders() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/orders", {
  headers: {
    "Authorization": `Bearer ${token}`
  }
});

const response = await res.json();
console.log("ORDERS RESPONSE:", response);

// REMOVE generic failure
// alert("Failed to load orders");

if (!res.ok || !response.success) {
  alert(response.message || "Failed to load orders");
  return;
}

const orders = response.data;
    const container = document.getElementById("ordersList");
    container.innerHTML = "";

  if (orders.length === 0) {
  container.innerHTML = "<p class='text-center'>No orders yet</p>";

  document.getElementById("ordersSection").style.display = "block";

 

  return;
}

    orders.forEach(order => {

      const items = order.items
        .map(item => `${item.name} (x${item.quantity})`)
        .join(", ");

      const card = document.createElement("div");
      card.className = "col-md-6 mb-4";

      card.innerHTML = `
        <div class="card p-3 shadow-sm">
          <h5>Order ID: ${order._id.slice(-6)}</h5>
          
          <p><strong>Items:</strong> ${items}</p>
          <p><strong>Total:</strong> ₹${order.totalPrice}</p>
          
          <p>
            <strong>Status:</strong> 
            <span class="badge bg-${getStatusColor(order.status)}">
              ${order.status}
            </span>
          </p>

          ${
            order.status !== "cancelled"
              ? `<button class="btn btn-danger btn-sm" onclick="cancelOrder('${order._id}')">
                   Cancel Order
                 </button>`
              : ""
          }
        </div>
      `;

      container.appendChild(card);
    });

    document.getElementById("ordersSection").style.display = "block";

  document.getElementById("ordersSection").scrollIntoView({
  behavior: "smooth"
});
}catch (error) {
    console.error(error);
    alert("Failed to load orders");
  }
}
async function cancelOrder(orderId) {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(
      `http://localhost:5000/api/orders/${orderId}/cancel`,
      {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const data = await res.json();
    console.log(data);

    alert("Order cancelled");
    loadOrders(); // refresh UI

  } catch (err) {
    console.error(err);
    alert("Failed to cancel order");
  }
}
function getStatusColor(status) {
  if (status === "pending") return "warning";
  if (status === "cancelled") return "danger";
  if (status === "delivered") return "success";
  return "secondary";
}
async function updateProfile() {
  const token = localStorage.getItem("token");
  const name = document.getElementById("newName").value;

  const res = await fetch("http://localhost:5000/api/auth/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });

  const data = await res.json();

  localStorage.setItem("username", data.name);
  updateGreeting();

  alert("Profile updated");
}

// API URL
const API_URL = "http://localhost:5000/api";

// Store food items fetched from backend
let foodItems = [];

// Fetch food items from MongoDB through backend
async function loadFoods() {
  const foodContainer = document.getElementById("foodContainer");

  try {
    const response = await fetch(`${API_URL}/food`);
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to load food");
    }

    foodItems = result.data;

    foodContainer.innerHTML = foodItems
      .filter(food => food.isAvailable)
      .map(food => `
        <div class="col-lg-4 col-md-6 mb-5">
          <div class="card">
            <img
              src="${food.image}"
              class="img-fluid"
              alt="${food.name}"
            >

            <div class="pt-3">
              <h4>${food.name}</h4>
              <p>${food.description}</p>
              <span>₹${food.price}</span>

              <button
                class="mt-2 main-btn add-to-cart-btn"
                data-id="${food._id}">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      `).join("");

  } catch (error) {
    console.error("Food loading error:", error);
    foodContainer.innerHTML =
      "<p>Unable to load food. Please try again.</p>";
  }
}


// =============================================
// LOAD FOOD WHEN PAGE OPENS
// =============================================

document.addEventListener("DOMContentLoaded", loadFoods);


// =============================================
// ADD ITEM TO CART
// =============================================

async function addToCart(foodItemId) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login before adding items to cart.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        foodItemId: foodItemId,
        quantity: 1
      })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Unable to add item");
    }

    console.log("Updated cart:", result.data);

    // Open cart and fetch latest items
    openCart();

  } catch (error) {
    console.error("Add to cart error:", error);
    alert(error.message);
  }
}


// =============================================
// ADD TO CART BUTTON CLICK LISTENER
// =============================================

document.getElementById("foodContainer").addEventListener("click", (event) => {

  const button = event.target.closest(".add-to-cart-btn");

  if (!button) return;

  const foodItemId = button.dataset.id;

  addToCart(foodItemId);

});
