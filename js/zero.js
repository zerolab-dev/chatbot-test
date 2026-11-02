const app = document.querySelector(".zero-app");
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const conversation = document.getElementById("conversation");

loadKnowledge();

form.addEventListener("submit", event => {
    event.preventDefault();
    sendMessage();
});

input.addEventListener("keydown", event => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});

input.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 150) + "px";
});

function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    app.classList.add("chat-active");
    addTextMessage(text, "user");

    input.value = "";
    input.style.height = "auto";

    const result = findKnowledge(text);

    setTimeout(() => addZeroMessage(result), 300);
}

function addTextMessage(text, sender) {
    const message = document.createElement("div");
    message.className = `message ${sender}`;

    const content = document.createElement("div");
    content.className = "message-content";
    content.textContent = text;

    message.appendChild(content);
    conversation.appendChild(message);
    scrollConversation();
}

function addZeroMessage(result) {
    const message = document.createElement("div");
    message.className = "message zero";

    const content = document.createElement("div");
    content.className = "message-content";

    const text = document.createElement("div");
    text.textContent = result.response;
    content.appendChild(text);

    if (result.action) {
        const button = document.createElement("a");
        button.className = "zero-action";
        button.textContent = result.action.label;
        button.href = result.action.target;
        content.appendChild(button);
    }

    message.appendChild(content);
    conversation.appendChild(message);
    scrollConversation();
}

function scrollConversation() {
    const messages = conversation.querySelectorAll(".message");
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "end" });
    }
}
