document.addEventListener("DOMContentLoaded", () => {

    // 1. Grab Elements
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatWidget = document.getElementById('chat-widget');

    const modal = document.getElementById("email-modal");
    const closeBtn = document.getElementById("close-modal");
    const sendBtn = document.getElementById("send-email-btn");
    const result = document.getElementById("email-result");
    const token = sessionStorage.getItem("token");
    const logoutBtn = document.getElementById("logout-btn");
    const loginNav = document.getElementById("login-btn-nav");
    const registerNav = document.getElementById("register-btn-nav");
    const openNavBtn = document.getElementById("open-email-nav");

    // NAV BUTTONS
    if (openNavBtn) {
        openNavBtn.addEventListener("click", () => {
            console.log("OPEN MODAL");
            modal.classList.remove("hidden");
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    }

    if (loginNav) {
        loginNav.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    if (registerNav) {
        registerNav.addEventListener("click", () => {
            window.location.href = "register.html";
        });
    }

    console.log("USER TOKEN:", token);

    if (!token) {
        console.log("User NOT logged in");

        if (logoutBtn) logoutBtn.style.display = "none";

        if (loginNav) loginNav.style.display = "inline-block";
        if (registerNav) registerNav.style.display = "inline-block";

    } else {
        console.log("User logged in");

        if (logoutBtn) logoutBtn.style.display = "inline-block";

        if (loginNav) loginNav.style.display = "none";
        if (registerNav) registerNav.style.display = "none";
    }

    // 2. Logic using the component functions
    async function handleAction() {
        console.log("HANDLE ACTION TRIGGERED");
        const text = chatInput.value.trim();
        const token = sessionStorage.getItem("token");

        if (text !== "") {
            appendMessage(chatMessages, text, "You");
            clearInput(chatInput);

            showTyping(chatMessages);

            try {
                console.log("Sending request...");
                const response = await fetch("http://localhost:8000/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": "Bearer " + token })
                    },
                    body: JSON.stringify({ message: text })
                });
                console.log("Response received");
                console.log("RAW RESPONSE:", response);

                const data = await response.json();

                console.log("DATA RECEIVED FROM BACKEND:", data);

                removeTyping();

                appendMessage(chatMessages, data.reply, "AI");

            } catch (error) {
                console.error("FETCH ERROR:", error);

                removeTyping();
                appendMessage(chatMessages, "Error connecting to server", "AI");
            }
        }
    }

    // 3. Listeners
    if (chatSend) {
        chatSend.addEventListener('click', handleAction);
    }

    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleAction();
        });
    }
 

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            if (modal) modal.classList.add("hidden");
        });
    }

    // Optional: close when clicking outside
    window.addEventListener("click", (e) => {
        if (e.target === modal && modal) {
            modal.classList.add("hidden");
        }
    });

    if (sendBtn) {
        sendBtn.addEventListener("click", async () => {
            const to = document.getElementById("email-to").value;
            const message = document.getElementById("email-message").value;
            const token = sessionStorage.getItem("token");

            if (!token) {
                alert("You must be logged in!");
                return;
            }

            try {
                console.log("Token:", token);
                const res = await fetch("http://127.0.0.1:8000/send-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": "Bearer " + token })
                    },
                    body: JSON.stringify({
                        to: to,
                        message: message
                    })
                });

                const data = await res.json();

                if (data.error) {
                    alert(data.error);
                } else {
                    result.innerText = "Email sent ✅";
                    result.style.color = "green";
                }

            } catch (err) {
                console.error(err);
                alert("Server error ❌");
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("token");
            alert("Logged out successfully");
            window.location.href = "login.html";
        });
    }

});