async function sendMessage(event) {
    event.preventDefault();

    const messageInput = document.getElementById('userMessage');
    const message = messageInput.value;
    if (!message) return;

    // Display the user's message
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML += `<div class="message user"><p>${message}</p></div>`;

    // Send the message to the server
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    const reply = data.reply;

    // Display the bot's reply
    messagesDiv.innerHTML += `<div class="message bot"><p>${reply}</p></div>`;

    // Clear the input field
    messageInput.value = '';

    // Scroll to the bottom of the chat
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
