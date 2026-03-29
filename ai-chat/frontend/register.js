document.getElementById("register-btn").addEventListener("click", async () => {
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    console.log("Registering:", email, password);

    try {
        const response = await fetch("http://127.0.0.1:8000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        console.log("Response:", data);

        const result = document.getElementById("result");

        if (data.error) {
            result.innerText = data.error + " ❌";
        } else {
            result.innerText = "Account created ✅";

            // 🔥 redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        }

    } catch (error) {
        console.error(error);
        document.getElementById("result").innerText = "Server error ❌";
    }
});