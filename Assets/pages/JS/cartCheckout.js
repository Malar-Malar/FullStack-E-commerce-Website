const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");

const cartItemsContainer = document.getElementById("checkout-cart-items");

// Load cart items
fetch(`http://localhost:8080/api/cart/${userId}`)
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("checkout-item");
      div.innerHTML = `
        <p><strong>${item.productName}</strong></p>
        <p>Price: Rs. ${item.productPrice}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Subtotal: Rs. ${(item.productPrice * item.quantity).toFixed(2)}</p>
        <hr/>
      `;
      cartItemsContainer.appendChild(div);
    });
  })
  .catch(err => console.error("Error loading cart items:", err));

// Handle form submit
document.getElementById("checkout-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const state = document.getElementById("state").value;
  const pincode = document.getElementById("pincode").value;
  const paymentMethod = document.getElementById("paymentMethod").value;

  // Send order request to backend
  fetch("http://localhost:8080/api/orders/from-cart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      name,
      phone,
      address,
      state,
      pincode,
      paymentMethod
    })
  })
  .then(res => {
    if (res.ok) {
      alert("Order placed successfully!");
      window.location.href = "../../../index.html";
    } else {
      alert("Failed to place order");
    }
  })
  .catch(err => console.error("Order error:", err));
});
