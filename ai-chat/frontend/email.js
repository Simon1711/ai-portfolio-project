const openBtn = document.getElementById("open-email");
const form = document.getElementById("email-form");

openBtn.addEventListener("click", () => {
    form.classList.toggle("hidden");
});

document.getElementById("send-email-btn").addEventListener("click", async () => {

    const to = document.getElementById("email-to").value;
    const message = document.getElementById("email-message").value;

    const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem("token")
        },
        body: JSON.stringify({
            message: `send email to ${to} saying ${message}`
        })
    });

    const data = await response.json();

    alert(data.reply);
});