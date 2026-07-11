/* ===================================================
   IoT AssistAI — Core JavaScript
   =================================================== */

// ─── THEME ───────────────────────────────────────────
const themeKey = 'iot-theme';
const savedTheme = localStorage.getItem(themeKey) || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(themeKey, next);
  updateThemeIcons();
}

function updateThemeIcons() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.theme-icon').forEach(el => {
    el.textContent = isDark ? '☀️' : '🌙';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateThemeIcons();

  // Hamburger nav
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // Active nav link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  // Intersection observer for animations
  const animateEls = document.querySelectorAll('.animate-on-scroll');
  if (animateEls.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('animate-fadeup');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    animateEls.forEach(el => observer.observe(el));
  }
});

// ─── CHAT ENGINE ─────────────────────────────────────
const chatResponses = {
  wifi: [
    `I can help with Wi-Fi connectivity issues. Let me guide you through the steps:\n\n**Step 1 — Check Signal Strength**\nVerify your device is within range of the router (within 10–15 metres for most IoT devices).\n\n**Step 2 — Restart the Device**\nPower cycle your device: hold the power button for 10 seconds, wait 30 seconds, then power on.\n\n**Step 3 — Verify Wi-Fi Band**\nMost IoT devices only support 2.4 GHz. Ensure your router isn't broadcasting only 5 GHz.\n\n**Step 4 — Check SSID & Password**\nRe-enter the Wi-Fi credentials — ensure no special characters that your device may not support.\n\n**Step 5 — Factory Reset (if needed)**\nIf the above fails, perform a factory reset and re-configure the device.\n\nDo any of these steps resolve your issue?`,
    `For Wi-Fi connectivity failures, let's check the basics first:\n\n🔍 **Diagnosis Checklist:**\n- Is the router online? Try connecting another device.\n- Is DHCP enabled on your router?\n- Are there MAC address filters blocking your IoT device?\n- What is the current firmware version of your device?\n\nPlease share your device model and I can give more specific guidance.`
  ],
  bluetooth: [
    `Bluetooth pairing issues are common. Here's a systematic approach:\n\n**Step 1 — Enable Discovery Mode**\nHold the Bluetooth button on your IoT device for 5 seconds until the LED blinks rapidly.\n\n**Step 2 — Clear Paired Devices**\nOn your smartphone, forget the device from Bluetooth settings, then try pairing fresh.\n\n**Step 3 — Check Distance**\nKeep devices within 1 metre during initial pairing.\n\n**Step 4 — Disable & Re-enable Bluetooth**\nToggle Bluetooth off and on on your phone.\n\n**Step 5 — Update Firmware**\nCheck if a firmware update is available for your IoT device — older firmware can have Bluetooth stack bugs.\n\nWhich step are you stuck on?`,
  ],
  firmware: [
    `Firmware update issues can arise for several reasons. Let me help:\n\n**Common Causes & Fixes:**\n\n🔴 **Update Fails at X%**\nThis usually means interrupted power or poor network. Ensure device is plugged in and on stable Wi-Fi.\n\n🔴 **Device Bricked After Update**\nTry recovery mode: hold Reset + Power for 15 seconds while powering on. This forces the bootloader.\n\n🔴 **Update Server Unreachable**\nCheck if the manufacturer's update server is online. Try updating manually via USB.\n\n🔴 **Incompatible Firmware Version**\nNever skip major versions. Download the intermediate firmware first.\n\nWhat is your current firmware version and target version?`
  ],
  sensor: [
    `Sensor malfunctions can be hardware or software related. Here's my diagnosis:\n\n**Diagnostic Steps:**\n\n1️⃣ **Check Sensor Readings in App**\nVerify if readings show 0, null, or wildly incorrect values — each indicates a different failure mode.\n\n2️⃣ **Calibration**\nMost IoT sensors need periodic recalibration. Navigate to Settings → Sensor → Calibrate.\n\n3️⃣ **Environmental Factors**\nExtreme temperature/humidity can affect sensor accuracy. Check operating range in the manual.\n\n4️⃣ **Firmware Sensor Driver**\nSensor drivers are firmware components. Ensure latest firmware is installed.\n\n5️⃣ **Hardware Failure Test**\nIf readings remain erratic after all the above, the sensor hardware may be faulty — contact support for replacement.\n\nWhat type of sensor is malfunctioning? (temperature, motion, light, humidity, etc.)`
  ],
  config: [
    `Configuration errors can prevent your device from working correctly. Let's troubleshoot:\n\n**Configuration Reset Process:**\n\n1. Open the device management app\n2. Navigate to **Settings → Advanced → Reset Configuration**\n3. Back up your current config first if the option is available\n4. Re-enter your settings step by step\n\n**Common Misconfigurations:**\n- Wrong API endpoint URL (check for trailing slashes)\n- Incorrect timezone (affects scheduling)\n- MQTT broker credentials mismatch\n- Wrong subnet mask\n\n**Validation Tip:** After saving configuration, always tap **Test Connection** before closing.\n\nWhat configuration screen are you working with?`
  ],
  compatibility: [
    `Device compatibility issues are often solvable. Here's what to check:\n\n**Compatibility Checklist:**\n\n✅ **Protocol Support** — Does your hub support Zigbee, Z-Wave, Matter, or only Wi-Fi?\n✅ **Platform Compatibility** — Is your device certified for your smart home platform (HomeKit, Google Home, Alexa)?\n✅ **Firmware Version** — Check the minimum firmware requirement in the compatibility guide\n✅ **Third-Party Integrations** — Some devices require a cloud connector or webhook bridge\n✅ **Matter Protocol** — Upgrading to Matter-compatible firmware can resolve many cross-brand issues\n\nI can look up specific compatibility information if you tell me your device model and platform.`
  ],
  default: [
    `Hello! I'm **IoT AssistAI**, your intelligent troubleshooting assistant. I can help with:\n\n- 📡 Wi-Fi connectivity failures\n- 🔵 Bluetooth pairing problems\n- ⚙️ Configuration errors\n- 🔄 Firmware update issues\n- 📊 Sensor malfunctions\n- 🔗 Device compatibility challenges\n\nDescribe your issue and I'll guide you through a step-by-step solution using our knowledge base powered by **IBM watsonx.ai** and **RAG technology**.`,
    `I understand you're experiencing an IoT issue. To give you the most accurate troubleshooting guidance, could you please tell me:\n\n1. **What device** are you having trouble with? (brand and model)\n2. **What is happening?** (exact error message or symptom)\n3. **When did it start?** (after update, power outage, etc.)\n4. **What have you already tried?**\n\nWith this information I can retrieve relevant documentation and provide precise step-by-step instructions.`,
    `Based on your description, this could be related to several IoT issues. Let me run a quick diagnosis:\n\n🔍 **Analyzing your issue...**\n\nI've cross-referenced this with our knowledge base of 500+ IoT troubleshooting guides. The most likely cause appears to be a **network configuration mismatch**.\n\n**Recommended Actions:**\n1. Verify device firmware is up to date\n2. Check router DHCP lease table\n3. Review device logs in the manufacturer app\n\nShall I walk you through each step in detail?`
  ]
};

function detectIntent(text) {
  const t = text.toLowerCase();
  if (/wifi|wi-fi|wireless|network|internet|connect|ssid|router|signal/.test(t)) return 'wifi';
  if (/bluetooth|bt|pair|ble|bluet/.test(t)) return 'bluetooth';
  if (/firmware|update|flash|brick|boot|ota/.test(t)) return 'firmware';
  if (/sensor|temperature|humidity|motion|light|reading|calibrat/.test(t)) return 'sensor';
  if (/config|setting|setup|configure|credentials|mqtt|api/.test(t)) return 'config';
  if (/compatible|compatibility|work with|support|integrat|homekit|alexa|google/.test(t)) return 'compatibility';
  return 'default';
}

function getResponse(text) {
  const intent = detectIntent(text);
  const pool = chatResponses[intent];
  return pool[Math.floor(Math.random() * pool.length)];
}

function formatMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^(\d+)\.\s/gm, '<br><strong>$1.</strong> ')
    .replace(/^[-•]\s/gm, '<br>• ')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── CHATBOT UI ───────────────────────────────────────
class ChatBot {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.messages = this.container.querySelector('.chat-messages');
    this.textarea = this.container.querySelector('.chat-textarea');
    this.sendBtn = this.container.querySelector('.send-btn');
    this.voiceBtn = this.container.querySelector('.voice-btn');
    this.uploadBtn = this.container.querySelector('.upload-btn');
    this.fileInput = this.container.querySelector('.file-input');
    this.histCount = 0;
    this.isRecording = false;
    this.init();
  }

  init() {
    if (this.sendBtn) this.sendBtn.addEventListener('click', () => this.send());
    if (this.textarea) {
      this.textarea.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
        this.autoResize();
      });
      this.textarea.addEventListener('input', () => this.autoResize());
    }
    if (this.voiceBtn) this.voiceBtn.addEventListener('click', () => this.toggleVoice());
    if (this.uploadBtn && this.fileInput) {
      this.uploadBtn.addEventListener('click', () => this.fileInput.click());
      this.fileInput.addEventListener('change', e => this.handleUpload(e));
    }
    // Suggestion chips
    this.container.querySelectorAll('.suggestion-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (this.textarea) this.textarea.value = chip.textContent;
        this.send();
      });
    });
  }

  autoResize() {
    if (!this.textarea) return;
    this.textarea.style.height = 'auto';
    this.textarea.style.height = Math.min(this.textarea.scrollHeight, 140) + 'px';
  }

  send() {
    const text = this.textarea?.value.trim();
    if (!text) return;
    this.appendMessage('user', text);
    this.textarea.value = '';
    this.textarea.style.height = 'auto';
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      const reply = getResponse(text);
      this.appendMessage('bot', reply);
      this.addToHistory(text);
    }, 1200 + Math.random() * 800);
  }

  appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `message ${role}`;
    const isBot = role === 'bot';
    div.innerHTML = `
      <div class="message-avatar ${isBot ? 'bot-avatar' : 'user-avatar'}">${isBot ? '🤖' : 'U'}</div>
      <div>
        <div class="message-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}">${isBot ? formatMarkdown(text) : text}</div>
        <div class="message-time">${getTime()}</div>
      </div>`;
    this.messages.appendChild(div);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  showTyping() {
    const div = document.createElement('div');
    div.className = 'message bot typing-msg';
    div.innerHTML = `
      <div class="message-avatar bot-avatar">🤖</div>
      <div class="message-bubble bot-bubble">
        <div class="typing-indicator">
          <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
        </div>
      </div>`;
    this.messages.appendChild(div);
    this.messages.scrollTop = this.messages.scrollHeight;
  }

  hideTyping() {
    const t = this.messages.querySelector('.typing-msg');
    if (t) t.remove();
  }

  addToHistory(text) {
    const list = document.querySelector('.chat-history-list');
    if (!list) return;
    const item = document.createElement('div');
    item.className = 'chat-history-item';
    item.textContent = text.substring(0, 38) + (text.length > 38 ? '…' : '');
    item.addEventListener('click', () => {
      list.querySelectorAll('.chat-history-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
    list.insertBefore(item, list.firstChild);
  }

  toggleVoice() {
    if (!this.voiceBtn) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    if (this.isRecording) {
      this.recognition?.stop();
      this.isRecording = false;
      this.voiceBtn.classList.remove('active');
      return;
    }
    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.onresult = e => {
      const transcript = e.results[0][0].transcript;
      if (this.textarea) this.textarea.value = transcript;
    };
    this.recognition.onend = () => {
      this.isRecording = false;
      this.voiceBtn.classList.remove('active');
    };
    this.recognition.start();
    this.isRecording = true;
    this.voiceBtn.classList.add('active');
  }

  handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    this.appendMessage('user', `📎 Image uploaded: <strong>${file.name}</strong>`);
    setTimeout(() => {
      this.showTyping();
      setTimeout(() => {
        this.hideTyping();
        this.appendMessage('bot', `I've received the image **${file.name}**. Analyzing the device...\n\nBased on the image, I can see what appears to be an IoT device. Please describe the issue you're experiencing with it and I'll cross-reference it with our knowledge base to provide specific troubleshooting steps.`);
      }, 1500);
    }, 300);
    e.target.value = '';
  }
}

// ─── KNOWLEDGE BASE SEARCH ────────────────────────────
function initKnowledgeBase() {
  const searchInput = document.querySelector('.kb-search-input');
  const cards = document.querySelectorAll('.kb-article-card');
  const tabs = document.querySelectorAll('.kb-tab');
  const tabPanels = document.querySelectorAll('.kb-tab-panel');

  if (searchInput && cards.length) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      cards.forEach(c => {
        const match = c.textContent.toLowerCase().includes(q);
        c.style.display = match ? '' : 'none';
      });
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      tabPanels.forEach(p => {
        p.style.display = p.dataset.panel === target ? '' : 'none';
      });
    });
  });
}

// ─── DIAGNOSIS ENGINE ─────────────────────────────────
function initDiagnosis() {
  const runBtn = document.getElementById('runDiagnosis');
  const symptomInput = document.getElementById('symptomInput');
  const resultsArea = document.getElementById('diagResults');
  if (!runBtn) return;

  runBtn.addEventListener('click', () => {
    const text = symptomInput?.value.trim();
    if (!text) { alert('Please describe your device issue first.'); return; }
    runBtn.textContent = 'Analyzing…';
    runBtn.disabled = true;
    setTimeout(() => {
      const intent = detectIntent(text);
      const categories = {
        wifi: { label: 'Connectivity Issue', color: 'badge-red', icon: '📡', confidence: 94 },
        bluetooth: { label: 'Bluetooth Problem', color: 'badge-yellow', icon: '🔵', confidence: 88 },
        firmware: { label: 'Firmware Problem', color: 'badge-red', icon: '🔄', confidence: 91 },
        sensor: { label: 'Sensor Malfunction', color: 'badge-yellow', icon: '📊', confidence: 85 },
        config: { label: 'Configuration Error', color: 'badge-blue', icon: '⚙️', confidence: 89 },
        compatibility: { label: 'Compatibility Issue', color: 'badge-gray', icon: '🔗', confidence: 82 },
        default: { label: 'General Issue', color: 'badge-blue', icon: '🔍', confidence: 70 }
      };
      const cat = categories[intent];
      if (resultsArea) {
        resultsArea.style.display = 'block';
        resultsArea.innerHTML = `
          <div class="alert alert-info" style="margin-bottom:1.5rem;">
            <span>🧠</span>
            <div><strong>AI Diagnosis Complete</strong> — Confidence: ${cat.confidence}%</div>
          </div>
          <div class="card" style="margin-bottom:1rem;">
            <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;">
              <span style="font-size:2rem;">${cat.icon}</span>
              <div>
                <div style="font-weight:700;font-size:1.1rem;">Detected: ${cat.label}</div>
                <span class="badge ${cat.color}">${cat.confidence}% Confidence</span>
              </div>
            </div>
            <div class="progress-bar" style="margin-bottom:.5rem;"><div class="progress-fill" style="width:${cat.confidence}%"></div></div>
            <p style="color:var(--text-muted);font-size:.9rem;">Analysis based on symptom description and cross-referenced with 500+ known IoT issue patterns in the knowledge base.</p>
          </div>
          <div style="font-weight:600;margin-bottom:.75rem;">Recommended Steps</div>
          <div class="step-list">${getSteps(intent)}</div>`;
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      runBtn.textContent = 'Run Diagnosis';
      runBtn.disabled = false;
    }, 2000);
  });
}

function getSteps(intent) {
  const steps = {
    wifi: ['Check router is broadcasting 2.4 GHz band', 'Verify Wi-Fi credentials are correct', 'Restart device and router', 'Check for IP address conflicts in DHCP table', 'Update device firmware'],
    bluetooth: ['Enable discovery mode on device', 'Remove old pairings from phone', 'Keep devices within 1m during pairing', 'Update device firmware', 'Check for interference from other BT devices'],
    firmware: ['Ensure stable power during update', 'Check internet connection stability', 'Try manual firmware update via USB', 'Attempt recovery mode boot', 'Contact manufacturer support'],
    sensor: ['Check sensor for physical damage', 'Recalibrate sensor in app settings', 'Clean sensor surface', 'Update device firmware', 'Test in different environment conditions'],
    config: ['Back up current configuration', 'Reset configuration to factory defaults', 'Re-enter settings manually', 'Test each setting after entry', 'Check API endpoint format'],
    compatibility: ['Check device compatibility list', 'Update to latest firmware', 'Try Matter/Thread protocol', 'Install manufacturer bridge app', 'Check API version requirements'],
    default: ['Restart the device', 'Check internet connectivity', 'Review device logs', 'Update firmware', 'Contact support with device model and logs']
  };
  const list = steps[intent] || steps.default;
  return list.map((s, i) => `
    <div class="step-item ${i === 0 ? 'active' : ''}">
      <div class="step-num">${i + 1}</div>
      <div>${s}</div>
    </div>`).join('');
}

// ─── DEVICE DASHBOARD ────────────────────────────────
function initDeviceDash() {
  const addBtn = document.getElementById('addDeviceBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      document.getElementById('addDeviceModal')?.classList.toggle('show');
    });
  }
}

// ─── CONTACT FORM ─────────────────────────────────────
function initContact() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      form.innerHTML = `
        <div class="alert alert-success">
          <span>✅</span>
          <div>
            <strong>Message sent successfully!</strong><br>
            Thank you for contacting IoT AssistAI. Our team will respond within 24 hours.
          </div>
        </div>`;
    }, 1500);
  });
}

// ─── COUNTER ANIMATION ────────────────────────────────
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

// ─── INIT ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Init chatbot
  if (document.getElementById('chatApp')) {
    window.chatBot = new ChatBot('chatApp');
  }
  initKnowledgeBase();
  initDiagnosis();
  initDeviceDash();
  initContact();

  // Animate counters when visible
  const statsSection = document.querySelector('.hero-stats, .stats-section');
  if (statsSection) {
    const ob = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { animateCounters(); ob.disconnect(); }
    });
    ob.observe(statsSection);
  }
  animateCounters();
});
