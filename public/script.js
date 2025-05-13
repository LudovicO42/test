const chatBox = document.getElementById('chat-box');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

const toggleEditorBtn = document.getElementById('toggle-editor');
const editorPanel = document.getElementById('editor-panel');

const bgColorInput = document.getElementById('bg-color');
const textColorInput = document.getElementById('text-color');
const userBubbleColorInput = document.getElementById('user-bubble-color');
const botBubbleColorInput = document.getElementById('bot-bubble-color');
const chatWidthInput = document.getElementById('chat-width');
const chatHeightInput = document.getElementById('chat-height');
const resetBtn = document.getElementById('reset-btn');
const applyBtn = document.getElementById('apply-btn');

let editorMode = false;

function appendMessage(message, sender) {
  const messageElem = document.createElement('div');
  messageElem.classList.add('message', sender);
  messageElem.textContent = message;
  chatBox.appendChild(messageElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage(message, 'user');
  userInput.value = '';
  userInput.disabled = true;

  try {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      appendMessage('Error: Failed to get response from server.', 'bot');
      userInput.disabled = false;
      return;
    }

    const data = await response.json();
    appendMessage(data.reply, 'bot');
  } catch (error) {
    appendMessage('Error: Network error or server is down.', 'bot');
  } finally {
    userInput.disabled = false;
    userInput.focus();
  }
});

toggleEditorBtn.addEventListener('click', () => {
  editorMode = !editorMode;
  if (editorMode) {
    editorPanel.classList.remove('hidden');
    toggleEditorBtn.textContent = 'Exit Editor Mode';
  } else {
    editorPanel.classList.add('hidden');
    toggleEditorBtn.textContent = 'Editor Mode';
  }
});

function applyCustomizations() {
  document.documentElement.style.setProperty('--bg-color', bgColorInput.value);
  document.documentElement.style.setProperty('--text-color', textColorInput.value);
  document.documentElement.style.setProperty('--user-bubble-color', userBubbleColorInput.value);
  document.documentElement.style.setProperty('--bot-bubble-color', botBubbleColorInput.value);
  document.documentElement.style.setProperty('--chat-width', chatWidthInput.value + 'px');
  document.documentElement.style.setProperty('--chat-height', chatHeightInput.value + 'px');
}

applyBtn.addEventListener('click', (e) => {
  e.preventDefault();
  applyCustomizations();
});

resetBtn.addEventListener('click', (e) => {
  e.preventDefault();
  bgColorInput.value = '#343541';
  textColorInput.value = '#e6e6e6';
  userBubbleColorInput.value = '#10a37f';
  botBubbleColorInput.value = '#444654';
  chatWidthInput.value = 600;
  chatHeightInput.value = 540;
  applyCustomizations();
});

// Initialize with default values
applyCustomizations();
