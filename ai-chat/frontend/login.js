document.getElementById("login-btn").addEventListener("click", async () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.access_token) {
            sessionStorage.setItem("token", data.access_token);
            result.innerText = "Login successful ✅";

            // 🔥 redirect to main app
            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } else {
            result.innerText = data.error + " ❌";
        }

    } catch (error) {
        result.innerText = "Server error ❌";
    }
});