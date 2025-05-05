document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signup-form");
    signupForm.addEventListener("submit", signup); // Attach submit event
  });
  
  function signup(event) {
    event.preventDefault();  // Prevent page reload on form submission
  
    const user = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };
  
    console.log(user); // Log user object to see what is being captured
  
    fetch("http://localhost:8080/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Signup failed");
      }
      return response.json();
    })
    .then(data => {
        // Save to localStorage
        localStorage.setItem("userId", data.id);
        localStorage.setItem("username", data.username);
        alert("Signup successful!");
        window.location.href = "index.html"; // optional redirect
      })
      .catch(error => {
        console.error("Error:", error);
        alert("Signup failed");
      });
  }



