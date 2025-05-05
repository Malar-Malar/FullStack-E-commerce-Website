
    // Get the login form element
    const loginForm = document.getElementById('loginForm');
    const responseMessage = document.getElementById('responseMessage');

    // Add submit event to the form
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent form from submitting the traditional way

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Create the payload for login API
        const credentials = {
            email: email,
            password: password
        };

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });

            const result = await response.json();

            if (response.ok) {
                // Handle successful login
                // You can store user data in localStorage or sessionStorage
                localStorage.setItem('userId', result.id);
                localStorage.setItem('username', result.username);

                responseMessage.innerHTML = `<p>Welcome, ${result.username}!</p>`;

                // Reset the form
                loginForm.reset();
                
                // Optionally, redirect or update the UI as needed
                // window.location.href = "/home"; // Example of redirect
            } else {
                // Show error message
                responseMessage.innerHTML = `<p style="color: red;">${result.error}</p>`;
            }
        } catch (error) {
            console.error('Error logging in:', error);
            responseMessage.innerHTML = `<p style="color: red;">An error occurred. Please try again later.</p>`;
        }
    });

