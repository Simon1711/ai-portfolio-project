// 1. Grab Elements
const chatSend = document.getElementById('chat-send');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatBubble = document.getElementById('chat-bubble');
const chatWidget = document.getElementById('chat-widget');
const openBtn = document.getElementById("open-email");
const modal = document.getElementById("email-modal");
const closeBtn = document.getElementById("close-modal");
const sendBtn = document.getElementById("send-email-btn");
const result = document.getElementById("email-result");


//Protect page
const token = sessionStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

// 2. Logic using the component functions
async function handleAction() {
    const text = chatInput.value.trim();

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
                    "Authorization": "Bearer " + localStorage.getItem("token")
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
chatSend.addEventListener('click', handleAction);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAction();
});


chatBubble.addEventListener('click', () => {
    chatWidget.classList.toggle('hidden');
});

openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
});

closeBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
});

// Optional: close when clicking outside
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
});

sendBtn.addEventListener("click", async () => {
    const to = document.getElementById("email-to").value;
    const message = document.getElementById("email-message").value;

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
                "Authorization": "Bearer " + token
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