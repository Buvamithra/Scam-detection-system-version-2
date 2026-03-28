/* ============================= */
/* START ANALYSIS FLOW */
/* ============================= */

function startAnalysis() {
  const formBox = document.getElementById("formBox");
  const loadingBox = document.getElementById("loadingBox");
  const resultBox = document.getElementById("resultBox");

  resultBox.classList.add("hidden");
  formBox.classList.add("hidden");
  loadingBox.classList.remove("hidden");

  animateSteps();

  setTimeout(runAnalysis, 3500);
}

/* ============================= */
/* LOADING STEP ANIMATION */
/* ============================= */

function animateSteps() {
  const steps = document.querySelectorAll(".analyze-steps li");
  let i = 0;

  const interval = setInterval(() => {
    steps.forEach(step => step.classList.remove("active"));

    if (i < steps.length) {
      steps[i].classList.add("active");
      i++;
    } else {
      clearInterval(interval);
    }
  }, 700);
}

/* ============================= */
/* RUN ANALYSIS (API CALL) */
/* ============================= */

function runAnalysis() {

  const formData = new FormData();

  formData.append("company", document.getElementById("company").value);
  formData.append("email", document.getElementById("email").value);
  formData.append("payment", document.getElementById("payment").value);
  formData.append("amount", document.getElementById("amount").value);

  const files = document.getElementById("docs").files;
  if (files.length > 0) {
    formData.append("docs", files[0]);
  }

  fetch("/analyze-job", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {

    document.getElementById("loadingBox").classList.add("hidden");
    document.getElementById("resultBox").classList.remove("hidden");

    showResult(data.score, data.reasons, data.status);
  })
  .catch(() => {
    alert("Analysis engine failed. Please try again.");
  });
}

/* ============================= */
/* AI TYPEWRITER EFFECT */
/* ============================= */

function typeEffect(element, text, speed = 25) {
  element.innerText = "";
  let i = 0;

  function type() {
    if (i < text.length) {
      element.innerText += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

/* ============================= */
/* RESULT DISPLAY ENGINE */
/* ============================= */

function showResult(score, reasons, status) {

  const body = document.body;
  const message = document.getElementById("riskStatus");
  const actionBox = document.getElementById("actionBox");
  const circle = document.getElementById("riskCircle");
  const value = document.getElementById("riskValue");
  const list = document.getElementById("reasonList");

  /* Reset */
  body.classList.remove("theme-safe", "theme-suspicious", "theme-scam");
  actionBox.classList.add("hidden");
  list.innerHTML = "";
  circle.style.transition = "stroke-dashoffset 1.2s ease";

  /* STATUS THEMES */
  if (status === "SAFE") {
    body.classList.add("theme-safe");
    typeEffect(message, "YOU ARE SAFE ");
  }

  if (status === "SUSPICIOUS") {
    body.classList.add("theme-suspicious");
    typeEffect(message, "⚠ THREAT LEVEL: MEDIUM ");
  }

  if (status === "SCAM") {
    body.classList.add("theme-scam");
    typeEffect(message, "🚨 DANGER STOP — SCAM");
    actionBox.classList.remove("hidden");

    // Add glitch pulse effect
    document.getElementById("resultBox").classList.add("danger-pulse");
  }

  /* SCORE CIRCLE ANIMATION */
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference;

  setTimeout(() => {
    circle.style.strokeDashoffset = offset;
  }, 200);

  /* COUNTER ANIMATION */
  let current = 0;
  const counter = setInterval(() => {
    value.innerText = current + "%";
    if (current >= score) clearInterval(counter);
    current++;
  }, 15);

  /* REASONS WITH STAGGERED ANIMATION */
  reasons.forEach((reason, index) => {
    const li = document.createElement("li");
    li.innerHTML = "<strong>⚠ " + reason + "</strong>";
    li.style.animationDelay = `${index * 0.2}s`;
    list.appendChild(li);
  });
}

/* ============================= */
/* SMOOTH PAGE FADE-IN */
/* ============================= */

document.addEventListener("DOMContentLoaded", () => {
  document.body.style.opacity = 0;

  setTimeout(() => {
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = 1;
  }, 100);
});
function speakResult(text) {
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    msg.pitch = 1.1;
    msg.rate = 1.0;
    speechSynthesis.speak(msg);
  }
}
speakResult(`Your risk score is ${score} percent. Status: ${status}.`);
