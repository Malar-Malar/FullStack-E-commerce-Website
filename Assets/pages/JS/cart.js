


const userId = localStorage.getItem("userId");

fetch(`http://localhost:8080/api/cart/${userId}`)
  .then(res => res.json())
  .then(data => {
    const cartList = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
    let grandTotal = 0;

    data.forEach(item => {
      const totalPrice = item.quantity * item.productPrice;
      grandTotal += totalPrice;

      const cartItem = document.createElement("div");
      cartItem.classList.add("cart-item");

      cartItem.innerHTML = `
        <img src="${item.productImageUrl}" alt="${item.productName}">
        <div class="item-details">
          <h4>${item.productName}</h4>
          <p>Price: Rs. ${item.productPrice.toFixed(2)}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>Subtotal: Rs. ${totalPrice.toFixed(2)}</p>
        </div>
        <button class="delete-btn" data-id="${item.id}">Delete</button>
      `;

      // Add event listener to delete button
      const deleteButton = cartItem.querySelector(".delete-btn");
      deleteButton.addEventListener("click", () => {
        const cartItemId = deleteButton.getAttribute("data-id");
        deleteCartItem(cartItemId);
      });

      cartList.appendChild(cartItem);
    });

    totalElement.textContent = `Total: Rs. ${grandTotal.toFixed(2)}`;
  })
  .catch(err => {
    console.error("Error fetching cart:", err);
  });

// Function to delete the cart item
function deleteCartItem(cartItemId) {
  fetch(`http://localhost:8080/api/cart/items/${cartItemId}`, {
    method: "DELETE",
  })
  .then(response => {
    if (response.ok) {
      // Remove the deleted item from the DOM
      const itemElement = document.querySelector(`button[data-id="${cartItemId}"]`).parentElement;
      itemElement.remove();

      // Update the total
      updateCartTotal();
    } else {
      alert("Failed to delete item.");
    }
  })
  .catch(err => {
    console.error("Error deleting item:", err);
  });
}

// after delete cart item 
function updateCartTotal() {
  const cartItems = document.querySelectorAll(".cart-item");
  let grandTotal = 0;
  
  cartItems.forEach(item => {
    const price = parseFloat(item.querySelector(".item-details p:nth-child(2)").textContent.replace("Price: Rs. ", ""));
    const quantity = parseInt(item.querySelector(".item-details p:nth-child(3)").textContent.replace("Quantity: ", ""));
    grandTotal += price * quantity;
  });

  document.getElementById("cart-total").textContent = `Total: Rs. ${grandTotal.toFixed(2)}`;
}


document.querySelector(".place-order-btn").addEventListener("click", () => {
  const userId = localStorage.getItem("userId");

  fetch(`http://localhost:8080/api/cart/${userId}`)
    .then(res => res.json())
    .then(cartItems => {
      localStorage.setItem("cartCheckoutItems", JSON.stringify(cartItems));
      window.location.href = "../../../Assets/pages/HTML/checkout.html?fromCart=true";
    });
});

