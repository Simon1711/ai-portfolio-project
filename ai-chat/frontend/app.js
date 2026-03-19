// 1. Grab Elements
const chatSend = document.getElementById('chat-send');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatBubble = document.getElementById('chat-bubble');
const chatWidget = document.getElementById('chat-widget');

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
                    "Content-Type": "application/json"
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