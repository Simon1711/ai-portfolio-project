// 1. Grab Elements
const chatSend = document.getElementById('chat-send');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatBubble = document.getElementById('chat-bubble');
const chatWidget = document.getElementById('chat-widget');

// 2. Logic using the component functions
function handleAction() {
    const text = chatInput.value.trim();
    if (text !== "") {
        appendMessage(chatMessages, text, "You");
        clearInput(chatInput);
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