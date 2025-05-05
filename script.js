
// fetch('./product.json')
// .then((response) => response.json())
// .then((jsonData) => {
// const productList = document.getElementById("product-list");
// if (productList) {
//     jsonData.products.forEach(product => {
//         const productDiv = document.createElement("div");
//         productDiv.classList.add("product");
//         productDiv.innerHTML = `
//             <img src="${product.image}" alt="${product.name}"  draggable="false">
//             <h2>${product.name}</h2>
//             <button type="button" onclick="location.href='${product.link}'">Click for More Product</button>
//         `;
//         productList.appendChild(productDiv);
//     });
// }
//   })


// fetch("http://localhost:8080/api/products/sample-images")
//   .then((response) => response.json())
//   .then((data) => {
//     const productList = document.getElementById("product-list");
//     if (productList) {
//       for (let categoryName in data) {
//         const imageUrl = data[categoryName];

//         const productDiv = document.createElement("div");
//         productDiv.classList.add("product");
//         productDiv.innerHTML = `
//           <img src="${imageUrl}" alt="${categoryName}" draggable="false">
//           <h2>${categoryName}</h2>
//           <button onclick="loadCategoryProducts('${categoryName}')">View All</button>
//         `;
//         productList.appendChild(productDiv);
//       }
//     }
//   })
//   .catch((error) => {
//     console.error("Error fetching products:", error);
//   });

// function loadCategoryProducts(categoryName) {
//   alert("Loading products under: " + categoryName);
//   // You can write logic here to fetch all products under selected category
// }




//   <p>${product.description}</p>
//           <p>Price: ₹${product.price}</p>


fetch("http://localhost:8080/api/categories")
  .then((response) => response.json())
  .then((data) => {
    const productList = document.getElementById("product-list");
    if (productList) {
      data.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
          <img src="${product.imageUrl}" alt="${product.name}" draggable="false">
          <h2>${product.categoryName}</h2>
        `;
        productDiv.style.cursor = "pointer";

        
        productDiv.addEventListener("click", () => {
          window.location.href = `./Assets/pages/html/category.html?categoryId=${product.id}`;
        });

        productList.appendChild(productDiv);
      });
    }
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });

