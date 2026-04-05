// This function handles the creation of the message bubbles
function appendMessage(container, text, sender = "You") {
    const messageDiv = document.createElement('div');
    
    // Add a class so we can style User vs AI differently later
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender.toLowerCase() === 'you' ? 'user-msg' : 'ai-msg');

    messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

// We can also handle the clear input logic here
function clearInput(inputElement) {
    inputElement.value = "";
}

function showTyping(container) {
    const typing = document.createElement("div");
    typing.classList.add("typing");
    typing.id = "typing-indicator";

    typing.innerText = "AI is typing...";

    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
}

function removeTyping() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
}

document.addEventListener("DOMContentLoaded", () => {
    const chatBubble = document.getElementById('chat-bubble');
    const chatWidget = document.getElementById('chat-widget');

    if (chatBubble && chatWidget) {
        chatBubble.addEventListener('click', () => {
            chatWidget.classList.toggle('hidden');
        });
    }
});