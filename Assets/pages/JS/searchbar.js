// Function to fetch and display products based on the search input
function searchProducts() {
  const searchBar = document.getElementById("searchBar");
  const searchTerm = searchBar.value.trim();

  
  if (!searchTerm) {
      document.getElementById("items").innerHTML = "";
      return;
  }

  // Fetch products from the backend using the search term
  fetch(`http://localhost:8080/api/products/search?name=${encodeURIComponent(searchTerm)}`)
      .then(response => response.json())
      .then(data => {
          
          const itemsContainer = document.getElementById("items");
          itemsContainer.innerHTML = "";

         
          if (data.length === 0) {
              itemsContainer.innerHTML = "<p>No products found</p>";
              return;
          }

          // Loop through the fetched data and display the products
          data.forEach(product => {
              const productDiv = document.createElement("div");
              productDiv.classList.add("product");

              productDiv.innerHTML = `
                  <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                  <h3 class="product-name">${product.name}</h3>
                  <p class="product-price">₹${product.price}</p>
                  <a href="detail.html?id=${product.id}" class="product-link">View Details</a>
              `;

              itemsContainer.appendChild(productDiv);
          });
      })
      .catch(error => {
          console.error("Error fetching products:", error);
      });
}
