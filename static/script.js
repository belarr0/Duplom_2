function toggleTheme() {
  document.documentElement.classList.toggle('dark');
}

function clearHistory() {
  document.getElementById("chat-box").innerHTML = "";
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

function scrollToBottom() {
  const chatBox = document.getElementById("chat-box");
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createMessageBubble(content, isUser = true, isTyping = false) {
  const bubble = document.createElement("div");
  bubble.className = `flex ${isUser ? 'justify-end' : 'justify-start'} animate-bubble`;

  const wrapper = document.createElement("div");
  wrapper.className = `${isUser ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-black dark:text-white'} px-4 py-2 rounded-2xl max-w-[70%] shadow`;

  if (isTyping) {
    wrapper.innerHTML = `<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>`;
  } else {
    wrapper.textContent = content;
  }

  bubble.appendChild(wrapper);
  return bubble;
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  console.log(text)
  if (!text) return;

  const chatBox = document.getElementById("chat-box");
  chatBox.appendChild(createMessageBubble(text, true));
  input.value = "";
  scrollToBottom();

  const typingIndicator = createMessageBubble("", false, true);
  chatBox.appendChild(typingIndicator);
  scrollToBottom();

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: text })
    });
    const data = await res.json();

    chatBox.removeChild(typingIndicator);
    chatBox.appendChild(createMessageBubble(data.response, false));
    scrollToBottom();
  } catch (err) {
    chatBox.removeChild(typingIndicator);
    chatBox.appendChild(createMessageBubble("⚠️ Помилка при отриманні відповіді від бота", false));
  }


}

document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
document.getElementById("clear-history").addEventListener("click", clearHistory);
document.getElementById("send-button").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", handleKeyPress);
