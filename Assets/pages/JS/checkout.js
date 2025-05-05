import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, doc, setDoc, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGtCmw3QskPI9jyB-BB5LHN3IkqhwPerk",
  authDomain: "bakery-shop-59e3c.firebaseapp.com",
  projectId: "bakery-shop-59e3c",
  storageBucket: "bakery-shop-59e3c.appspot.com",
  messagingSenderId: "144499188515",
  appId: "1:144499188515:web:53ea8d9b0eb845a45a6296",
  measurementId: "G-KEVGH6JRX7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to normalize email
function normalizeEmail(email) {
  return email.replace(/\./g, "_");
}

// Function to load the order from the cart
function loadOrderFromCart() {
  const productsList = document.getElementById("products-list");
  productsList.innerHTML = ""; // Clear previous content

  const cartData = JSON.parse(localStorage.getItem("currentOrder"));

  if (!cartData || cartData.length === 0) {
    alert("No items in the cart. Redirecting to the cart page.");
    location.href = "../../../Assets/pages/html/cart.html";
    return;
  }

  let totalAmount = 0;

  cartData.forEach((item) => {
    const itemPrice = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
    const itemTotal = itemPrice * item.quantity;
    totalAmount += itemTotal;

    // Render product details
    productsList.innerHTML += ` 
      <div class="product-item">
        <img src="${item.img}" alt="${item.name}" style="width: 50px; height: 50px;">
        <p><strong>${item.name}</strong></p>
        <p>Price: ₹${itemPrice.toFixed(2)}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Total: ₹${itemTotal.toFixed(2)}</p>
      </div>
    `;
  });

  // Display total amount
  const totalPriceElement = document.createElement("div");
  totalPriceElement.innerHTML = `<h3>Total Amount: ₹${totalAmount.toFixed(2)}</h3>`;
  productsList.appendChild(totalPriceElement);

  setupBillingForm(cartData, totalAmount);
}

// Function to handle the billing form submission
async function setupBillingForm(cartData, totalAmount) {
  const paymentForm = document.getElementById("payment-form");

  paymentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const pincode = document.getElementById("pincode").value;
    const phone = document.getElementById("phone").value;
    const paymentMethod = document.getElementById("payment-method").value;

    const products=cartData.map(item => ({
      productName: item.name,
      productPrice: item.price,
      productQuantity: item.quantity,
      productImage: item.img,
    }));
    const orderDetails = {
      products: cartData.map(item => ({
        productName: item.name,
        productPrice: item.price,
        productQuantity: item.quantity,
        productImage: item.img,
      })),
      totalAmount: totalAmount, 
      billingInfo: { firstName, lastName, address, city, state, pincode, phone, email },
      paymentInfo: { method: paymentMethod },
      date: new Date().toISOString(), 
    };

    // Log orderDetails for debugging
    console.log("Order Details:", orderDetails);

    // Add payment details if credit/debit card
    if (paymentMethod === "credit-card" || paymentMethod === "debit-card") {
      orderDetails.paymentInfo.cardNumber = document.getElementById("card-number").value;
      orderDetails.paymentInfo.expiryDate = document.getElementById("expiry-date").value;
      orderDetails.paymentInfo.cvv = document.getElementById("cvv").value;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please log in to place the order.");
        return;
      }

      const userEmail = normalizeEmail(user.email);
      const ordersKey = `purchases_${userEmail}`;
      let orderHistory = JSON.parse(localStorage.getItem(ordersKey)) || [];

      // Check if the orderDetails are valid before saving
      if (orderDetails && Object.keys(orderDetails).length > 0) {
        orderHistory.push(orderDetails);
        localStorage.setItem(ordersKey, JSON.stringify(orderHistory));
      } else {
        console.error("Invalid order details:", orderDetails);
      }

      // Save order to Firestore
      await addDoc(collection(db, "orders"), orderDetails);

      localStorage.removeItem("currentOrder");
      localStorage.removeItem(userEmail)

      showMessage("Order placed successfully!", "success");
      setTimeout(() => {
        location.href = "../../../index.html";
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      showMessage("Failed to place the order. Please try again.", "error");
    }
  });

  document.getElementById("payment-method").addEventListener("change", function () {
    const cardDetails = document.getElementById("card-details");
    if (this.value === "credit-card" || this.value === "debit-card") {
      cardDetails.style.display = "block";
    } else {
      cardDetails.style.display = "none";
    }
  });

  document.getElementById("card-details").style.display = "none";
}

// Show success or error message
function showMessage(message, type) {
  const container = document.getElementById("message-container");
  if (!container) {
    console.error("Message container not found");
    return;
  }

  container.textContent = message;
  container.className = `message ${type}`;
  container.style.display = "block";

  setTimeout(() => {
    container.style.display = "none";
  }, 3000);
}

// On page load
window.onload = function () {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      alert("Please log in to proceed to checkout.");
      location.href = "../../../Assets/pages/html/login.html";
      return;
    }
    loadOrderFromCart();
  });
};
