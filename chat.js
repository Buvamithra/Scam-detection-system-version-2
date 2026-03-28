// ===== CHAT ELEMENTS =====
const chatBox = document.getElementById("chat-box");
const inputField = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// ===== ADD MESSAGE FUNCTION =====
function addMessage(text, sender = "bot", type = "normal") {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);

  if (type === "warning") msg.classList.add("warning");
  if (type === "safe") msg.classList.add("safe");

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (sender === "bot") {
    typeEffect(msg, text);
  } else {
    msg.textContent = text;
  }
}

// ===== TYPING EFFECT FOR ROBOT =====
function typeEffect(element, text) {
  let index = 0;
  element.textContent = "";

  const typing = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(typing);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 35);
}

// ===== BOT THINKING DELAY =====
function botReply(userText) {
  setTimeout(() => {
    const lowerText = userText.toLowerCase();

    if (
      lowerText.includes("pay") ||
      lowerText.includes("upi") ||
      lowerText.includes("fee") ||
      lowerText.includes("offer")
    ) {
      addMessage(
        "⚠️ Warning! This looks like a JOB SCAM.\nNever pay fees for a job.",
        "bot",
        "warning"
      );
    } else {
      addMessage(
        "✅ This looks safe for now. Still verify the company details.",
        "bot",
        "safe"
      );
    }
  }, 900);
}

// ===== SEND MESSAGE =====
function sendMessage() {
  const userText = inputField.value.trim();
  if (!userText) return;

  addMessage(userText, "user");
  inputField.value = "";

  botReply(userText);
}

// ===== BUTTON + ENTER KEY =====
sendBtn.addEventListener("click", sendMessage);

inputField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});

// ===== INITIAL ROBOT MESSAGE =====
window.onload = () => {
  addMessage(
    "Hi 👋 I’m ScamGuard AI 🤖\nTell me what happened, I’ll check if it’s a scam.",
    "bot"
  );
};
function selectScam(type) {
  if (type === 'job') {
    document.getElementById('jobPanel').classList.add('open');
  }
}

function closePanel() {
  document.getElementById('jobPanel').classList.remove('open');
}
function analyzeJobScam() {
  let score = 0;
  let reasons = [];

  const email = document.getElementById("email").value;
  const payment = document.getElementById("payment").value;

  if (email.includes("gmail") || email.includes("yahoo")) {
    score += 25;
    reasons.push("Recruiter email uses free domain");
  }

  if (payment === "yes") {
    score += 30;
    reasons.push("Asked for payment to proceed");
  }

  if (document.getElementById("amount").value) {
    score += 10;
    reasons.push("Payment amount mentioned");
  }

  showResult(score, reasons);
}
function showResult(score, reasons) {
  document.getElementById("resultBox").classList.remove("hidden");

  let color = "green";
  let status = "SAFE";

  if (score >= 70) {
    color = "red";
    status = "SCAM";
  } else if (score >= 40) {
    color = "orange";
    status = "SUSPICIOUS";
  }

  document.querySelector(".circle").style.borderColor = color;
  document.getElementById("statusText").innerText = status;

  let i = 0;
  let interval = setInterval(() => {
    document.getElementById("scoreText").innerText = i + "%";
    if (i++ >= score) clearInterval(interval);
  }, 15);

  const list = document.getElementById("reasonList");
  list.innerHTML = "";
  reasons.forEach(r => {
    list.innerHTML += `<li>⚠ ${r}</li>`;
  });
}
