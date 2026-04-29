const CONFIG = {
    BOT_TOKEN: "8355674438:AAHeX0scFb1aaLplYxUE3cUSeCTh8VB_PUc",       // @BotFather dan olingan token
    CHAT_ID: "6457425447",           // @userinfobot dan olingan ID
    ADMIN_PASSWORD: "admin_parolingiz",   // Admin panel paroli (xohlagan parolingizni yozing)
    OWNER_NAME: "Shahriyor",                 // Sizning ismingiz
    OWNER_ROLE: "Frontend Developer & Bot Creator",       // Lavozimingiz
    OWNER_EMAIL: "shakxriyarr@gmail.com",      // Emailingiz
    OWNER_TELEGRAM: "@shaxriiyor",            // Telegramingiz
    OWNER_GITHUB: "github.com/shaxriiyor",    // GitHubingiz
    OWNER_INITIALS: "SH",                   // Initsiallaringiz
  };

  // LocalStorage kaliti
  const MESSAGES_KEY = "portfolio_messages";

  function saveMessage(data) {
    const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
    messages.unshift({ ...data, id: Date.now(), read: false, date: new Date().toISOString() });
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }


  // Firebase SDK ulanishi (Modular CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Sening Firebase konfigiratsiyang
const firebaseConfig = {
  apiKey: "AIzaSyDJVrSYuWF5Xgj2hoRSil-IaR9lYknBHM0",
  authDomain: "portfolio-2c967.firebaseapp.com",
  databaseURL: "https://portfolio-2c967-default-rtdb.firebaseio.com",
  projectId: "portfolio-2c967",
  storageBucket: "portfolio-2c967.firebasestorage.app",
  messagingSenderId: "205928792319",
  appId: "1:205928792319:web:6f570dc374276bb25dccca",
  measurementId: "G-JVVVRJGKF0"
};

// Firebase-ni ishga tushirish
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Kontakt formasi logikasi
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Yuborilmoqda...';
    btn.classList.add('btn-sending');
    btn.disabled = true;

    const data = {
      name: document.getElementById('f-name').value,
      email: document.getElementById('f-email').value,
      phone: document.getElementById('f-phone').value || 'Kiritilmagan',
      subject: document.getElementById('f-subject').value,
      message: document.getElementById('f-message').value,
      date: new Date().toISOString(),
      read: false
    };

    try {
      // 1. Firebase Realtime Database'ga saqlash
      const messagesRef = ref(db, 'messages');
      const newMessageRef = push(messagesRef);
      await set(newMessageRef, { ...data, id: newMessageRef.key });

      // 2. Telegram'ga yuborish (Sening avvalgi funksiyang)
      await sendToTelegram(data);

      showToast("Xabar muvaffaqiyatli yuborildi! 🎉");
      contactForm.reset();
    } catch (err) {
      console.error(err);
      showToast("Xatolik yuz berdi. Iltimos qaytadan urining.", "error");
    }

    btn.textContent = 'Xabar yuborish →';
    btn.classList.remove('btn-sending');
    btn.disabled = false;
  });
}

// Telegram funksiyasi
async function sendToTelegram(data) {
  const BOT_TOKEN = "8355674438:AAHeX0scFb1aaLplYxUE3cUSeCTh8VB_PUc";
  const CHAT_ID = "6457425447";
  const text = `
🔔 *Yangi xabar — Portfolio*

👤 *Ism:* ${data.name}
📧 *Email:* ${data.email}
📞 *Tel:* ${data.phone}
📝 *Mavzu:* ${data.subject}
💬 *Xabar:* ${data.message}
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// Toast funksiyasi
function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = (type === 'success' ? '✓ ' : '✕ ') + msg;
  t.className = `toast ${type}`;
  t.style.display = 'flex';
  setTimeout(() => t.style.display = 'none', 3500);
}

// Scroll animatsiyalari (Fade-up)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
