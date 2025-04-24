// script.js
const html = document.documentElement;
const chatBox = document.getElementById("chat-box");
const localKey = "chatHistory";
const avatarIndexKey = "userAvatarIndex";

const userAvatars = [
  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
];
const botAvatar = "https://cdn-icons-png.flaticon.com/512/4712/4712035.png";

function getUserAvatar() {
  const index = parseInt(localStorage.getItem(avatarIndexKey) || "0");
  return userAvatars[index] || userAvatars[0];
}

function setUserAvatar(index) {
  localStorage.setItem(avatarIndexKey, index);
  toggleAvatarMenu();
  clearChatDisplay();
  loadHistory();
}

function toggleAvatarMenu() {
  const menu = document.getElementById("avatar-menu");
  menu.classList.toggle("hidden");
}

function toggleTheme() {
  const isDark = html.classList.contains("dark");
  html.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "light" : "dark");
}

function clearChatDisplay() {
  chatBox.innerHTML = "";
}

function clearHistory() {
  localStorage.removeItem(localKey);
  clearChatDisplay();
}

function appendMessage(content, isUser = false, isTemp = false) {
  const avatar = isUser ? getUserAvatar() : botAvatar;
  const align = isUser ? "justify-end" : "justify-start";
  const bubbleStyle = isUser
    ? "bg-blue-500 text-white rounded-br-none"
    : "bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-bl-none";
  const id = isTemp ? temp-${Date.now()} : "";
  const wrapper =
    <div id="${id}" class="flex ${align} items-start gap-2 animate-fade-in">
      ${!isUser ? <img src="${avatar}" class="w-8 h-8 rounded-full"> : ""}
      <div class="px-4 py-2 rounded-2xl max-w-[70%] ${bubbleStyle}">${content}</div>
      ${isUser ? <img src="${avatar}" class="w-8 h-8 rounded-full"> : ""}
    </div>
  ;
  chatBox.innerHTML += wrapper;
  chatBox.scrollTop = chatBox.scrollHeight;
  return id;
}

function saveMessageToHistory(content, isUser) {
  const history = JSON.parse(localStorage.getItem(localKey)) || [];
  history.push({ content, isUser });
  localStorage.setItem(localKey, JSON.stringify(history.slice(-50)));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem(localKey)) || [];
  history.forEach(msg => appendMessage(msg.content, msg.isUser));
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const userText = input.value.trim();
  if (!userText) return;

  appendMessage(userText, true);
  saveMessageToHistory(userText, true);
  input.value = "";

  const typingId = appendMessage("Бот набирає...", false, true);

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userText })
    });

    if (!response.ok) throw new Error(HTTP error! Status: ${response.status});

    const data = await response.json();
    document.getElementById(typingId)?.remove();
    appendMessage(data.response, false);
    saveMessageToHistory(data.response, false);
  } catch (error) {
    console.error("Помилка запиту:", error);
    document.getElementById(typingId)?.remove();
    appendMessage("Помилка отримання відповіді.", false);
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
}

if (localStorage.getItem("theme") === "dark") {
  html.classList.add("dark");
}
loadHistory();