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
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ADD TO CART
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.getAttribute("data-name");
    const price = parseFloat(btn.getAttribute("data-price"));

    cart.push({ name, price, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${name} added to cart`);
    openCart();
    renderCart();
  });
});
const cartModal = document.getElementById("cartModal");

function openCart() {
  cartModal.style.right = "0";
}

document.getElementById("closeCart").addEventListener("click", () => {
  cartModal.style.right = "-400px";
});function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty</p>";
    cartTotal.textContent = "Total: ₹0";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}
      <button onclick="removeItem(${index})">❌</button>
    `;
    cartItems.appendChild(li);
  });

  cartTotal.textContent = `Total: ₹${total}`;
}
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}
document.getElementById("placeOrderBtn").addEventListener("click", async () => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first to place an order");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        deliveryAddress: {
          street: "123 Street",
          city: "Delhi",
          pincode: "110001",
          phone: "9999999999"
        },
        paymentMethod: "Cash on Delivery",
        items: cart,
        totalPrice: cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      })
    });

    const data = await response.json();
    console.log(data);

    alert("Order placed successfully!");

    cart = [];
    localStorage.removeItem("cart");
    renderCart();

  } catch (error) {
    console.error(error);
    alert("Order failed");
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

  } catch (error) {
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