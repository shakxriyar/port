const CONFIG = {
    BOT_TOKEN: "YOUR_BOT_TOKEN_HERE",       // O'zgarishsiz qolishi mumkin
    CHAT_ID: "YOUR_CHAT_ID_HERE",           // O'zgarishsiz qolishi mumkin
    ADMIN_PASSWORD: "your_password_here",   
    OWNER_NAME: "Shahriyor",                 // <--- Shuni "Shahriyor" qiling
    OWNER_ROLE: "Frontend Developer",       
    OWNER_EMAIL: "shakxriyarr@gmail.com",    // <--- O'z emailingizni yozing
    OWNER_TELEGRAM: "@shaxriiyor",           // <--- O'z telegramingizni yozing
    OWNER_GITHUB: "github.com/shahriyor",    // <--- GitHub manzilingiz
    OWNER_INITIALS: "SH",                   // <--- "SH" qilib o'zgartiring
  };

  // LocalStorage kaliti
  const MESSAGES_KEY = "portfolio_messages";

  function saveMessage(data) {
    const messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
    messages.unshift({ ...data, id: Date.now(), read: false, date: new Date().toISOString() });
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }

  async function sendToTelegram(data) {
    const text = `
🔔 *Yangi xabar — Portfolio*

👤 *Ism:* ${data.name}
📧 *Email:* ${data.email}
📱 *Telefon:* ${data.phone}
📝 *Mavzu:* ${data.subject}

💬 *Xabar:*
${data.message}

🕐 ${new Date().toLocaleString('uz-UZ')}
    `.trim();

    const url = `https://api.telegram.org/bot${CONFIG.BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CONFIG.CHAT_ID, text, parse_mode: "Markdown" })
    });
    return res.ok;
  }

function showToast(msg, type = "success") {
    const t = document.getElementById("toast");
    t.textContent = (type === "success" ? "✓ " : "✗ ") + msg;
    t.className = `toast ${type}`;
    t.style.display = "flex";
    setTimeout(() => t.style.display = "none", 4000);
  }
   // CONFIG dan ma'lumotlarni sahifaga qo'yish
 document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('nav-name').textContent = CONFIG.OWNER_NAME.toLowerCase().replace(' ', '');
    document.getElementById('hero-name').textContent = CONFIG.OWNER_NAME + '.';
    document.getElementById('about-name').textContent = CONFIG.OWNER_NAME;
    document.getElementById('about-initials').textContent = CONFIG.OWNER_INITIALS;
    document.getElementById('about-email').textContent = CONFIG.OWNER_EMAIL;
    document.getElementById('c-email').textContent = CONFIG.OWNER_EMAIL;
    document.getElementById('c-telegram').textContent = CONFIG.OWNER_TELEGRAM;
    document.getElementById('c-github').textContent = CONFIG.OWNER_GITHUB;
    document.getElementById('f-name-owner').textContent = CONFIG.OWNER_NAME;
  });
  // Forma yuborish
  document.getElementById('contactForm').addEventListener('submit', async (e) => {
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
    };

    // LocalStoragega saqlash
    saveMessage(data);

    // Telegramga yuborish
    try {
      const ok = await sendToTelegram(data);
      if (ok) {
        showToast("Xabar muvaffaqiyatli yuborildi! 🎉");
        document.getElementById('contactForm').reset();
      } else {
        showToast("Yuborildi. Xabar saqlandi.", "error");
      }
    } catch (err) {
      showToast("Tarmoq xatosi. Xabar saqlandi.", "error");
    }

    btn.textContent = 'Xabar yuborish →';
    btn.classList.remove('btn-sending');
    btn.disabled = false;
  });

  // Scroll animatsiyalar
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        const bar = e.target.querySelector('.skill-bar');
        if (bar) bar.style.width = bar.dataset.width;
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
