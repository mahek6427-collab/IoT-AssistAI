/* =========================================
   IoT AssistAI – Chatbot Engine
   Simulates IBM watsonx.ai + RAG responses
   ========================================= */

const KB = {
  wifi: {
    keywords: ['wifi', 'wi-fi', 'wireless', 'network', 'internet', 'ssid', 'router', 'ip address', 'dhcp', 'signal', 'drops', 'disconnect'],
    title: 'Wi-Fi Connectivity Issue',
    category: 'Connectivity',
    steps: [
      '🔍 **Check signal strength** — Ensure your device is within 10–15 metres of the router. Obstacles like walls degrade signal significantly.',
      '🔄 **Restart the device** — Power-cycle your IoT device and router. Wait 30 seconds before reconnecting.',
      '🔑 **Verify credentials** — Re-enter your Wi-Fi password. Check for capital letters, spaces, and special characters.',
      '📡 **Check network band** — Many IoT devices only support 2.4 GHz. Ensure your router has a separate 2.4 GHz SSID.',
      '🚫 **Check IP conflicts** — Log into your router and verify no IP conflicts exist. Enable DHCP or assign a static IP.',
      '🔧 **Update router firmware** — Check your router manufacturer\'s website for firmware updates.',
      '⚙️ **Factory reset** — If the issue persists, factory reset the device and reconfigure from scratch.',
    ],
    follow_up: 'Is the device connecting to the 2.4 GHz or 5 GHz network?',
  },
  bluetooth: {
    keywords: ['bluetooth', 'ble', 'pairing', 'pair', 'blue', 'bt', 'btle'],
    title: 'Bluetooth Pairing Problem',
    category: 'Connectivity',
    steps: [
      '📴 **Forget the device** — Go to your phone Bluetooth settings, forget the problematic device, then re-pair.',
      '🔄 **Clear pairing cache** — Toggle Bluetooth off, wait 10 seconds, and toggle back on.',
      '🔋 **Check battery** — Low battery can cause intermittent Bluetooth issues. Charge the device fully.',
      '📏 **Check range** — Bluetooth range is typically 10 metres. Move devices closer during pairing.',
      '🔇 **Remove interference** — Move away from microwaves, 2.4 GHz Wi-Fi, and USB 3.0 cables.',
      '📱 **Update device firmware** — Check for BLE firmware updates that may fix compatibility issues.',
      '🔁 **Re-flash firmware** — If pairing consistently fails, re-flash the device firmware using the manufacturer\'s tool.',
    ],
    follow_up: 'What type of device are you pairing? (e.g., sensor, speaker, wearable)',
  },
  firmware: {
    keywords: ['firmware', 'update', 'ota', 'flash', 'bricked', 'version', 'upgrade', 'bootloader', 'failed update'],
    title: 'Firmware Update Issue',
    category: 'Firmware',
    steps: [
      '⚡ **Check power** — Never update firmware on a device below 50% battery. Use a power adapter if possible.',
      '📶 **Stable connection** — Ensure stable Wi-Fi/USB connection throughout the update process.',
      '📥 **Re-download firmware** — Corrupted downloads cause failed updates. Download the firmware image again.',
      '🔢 **Verify firmware version** — Check you\'re installing the correct firmware for your exact hardware revision.',
      '🔓 **Disable security software** — Temporarily disable antivirus/firewall that may block OTA update packets.',
      '💾 **Manual flash** — If OTA fails, use a USB cable and the manufacturer\'s flashing tool (e.g. esptool for ESP32).',
      '⚠️ **Recovery mode** — If bricked, hold the reset button for 10 seconds to enter recovery/bootloader mode.',
      '🏭 **Contact support** — If recovery fails, the device may need professional firmware re-flashing.',
    ],
    follow_up: 'What is the current and target firmware version?',
  },
  sensor: {
    keywords: ['sensor', 'temperature', 'humidity', 'motion', 'light', 'pressure', 'reading', 'inaccurate', 'wrong', 'data', 'calibration', 'drift'],
    title: 'Sensor Malfunction',
    category: 'Sensor',
    steps: [
      '📍 **Check placement** — Ensure the sensor is not near heat sources, direct sunlight, or air vents.',
      '🔌 **Verify power supply** — Unstable power can cause sensor misreadings. Use a regulated power source.',
      '🧹 **Clean the sensor** — Dust, moisture, or contamination on sensor elements affects accuracy.',
      '⚖️ **Recalibrate** — Use the device\'s calibration utility or compare with a known reference sensor.',
      '🔄 **Restart the sensor** — Power-cycle the sensor and wait 5 minutes for it to reach thermal equilibrium.',
      '📡 **Check communication bus** — Verify I2C/SPI addresses and wiring if building a custom setup.',
      '🔧 **Update sensor driver** — Install the latest sensor driver or firmware which may contain calibration fixes.',
      '🔁 **Replace sensor** — If readings remain erratic after calibration, the sensor element may be faulty.',
    ],
    follow_up: 'What type of sensor is malfunctioning? (temperature, humidity, motion, etc.)',
  },
  config: {
    keywords: ['config', 'configuration', 'setup', 'settings', 'mqtt', 'api', 'endpoint', 'provisioning', 'register', 'configure'],
    title: 'Configuration Error',
    category: 'Configuration',
    steps: [
      '📋 **Review device documentation** — Check the official setup guide for the exact configuration format.',
      '🔐 **Validate credentials** — API keys, tokens, and certificates must be exact — no trailing spaces.',
      '🌐 **Test MQTT broker** — Use an MQTT client (e.g. MQTT Explorer) to verify broker connectivity independently.',
      '🔒 **Check TLS/SSL** — Ensure certificates are valid and not expired. Verify the CA chain.',
      '📡 **Verify endpoints** — Double-check API endpoints, port numbers (1883 vs 8883), and protocol versions.',
      '🏷️ **Device provisioning** — Re-provision the device through the cloud platform (AWS IoT, Azure IoT, IBM IoT Platform).',
      '🔄 **Factory reset** — Reset to defaults and re-apply configuration to eliminate corrupted settings.',
    ],
    follow_up: 'Which IoT platform are you using? (AWS IoT, Azure IoT Hub, IBM Watson IoT)',
  },
  compatibility: {
    keywords: ['compatible', 'compatibility', 'protocol', 'zigbee', 'z-wave', 'matter', 'thread', 'homekit', 'alexa', 'google home', 'hub', 'gateway'],
    title: 'Compatibility Issue',
    category: 'Compatibility',
    steps: [
      '📋 **Check specifications** — Verify both devices support the same protocol version (e.g., Zigbee 3.0).',
      '🌐 **Use a hub** — If protocols differ, use a universal hub (Home Assistant, SmartThings) as a bridge.',
      '📦 **Update hub firmware** — Hub firmware often adds new device compatibility — update first.',
      '🔍 **Check device certification** — Verify the device carries official protocol certification marks.',
      '📡 **Add device manually** — Try manual pairing/inclusion instead of automatic discovery.',
      '⚙️ **Matter bridge** — Use a Matter-compatible hub to bridge older Zigbee/Z-Wave devices.',
      '🤝 **Custom integration** — Platforms like Home Assistant support custom integrations for non-standard devices.',
    ],
    follow_up: 'What protocols do both devices use? (e.g., Zigbee + Z-Wave)',
  },
};

const GREETINGS = [
  "Hello! 👋 I'm **IoT AssistAI**, your AI troubleshooting assistant powered by IBM watsonx.ai. What IoT issue can I help you with today?",
  "Welcome back! 🤖 Describe your IoT problem and I'll retrieve the best solution from our knowledge base.",
];

const SUGGESTIONS = [
  "My device keeps disconnecting from Wi-Fi",
  "Bluetooth pairing fails every time",
  "Firmware update failed, device won't boot",
  "Temperature sensor giving wrong readings",
  "Device not connecting to MQTT broker",
  "Smart device not working with Alexa",
  "Device shows offline in the dashboard",
  "OTA update stuck at 50%",
];

function detectIntent(text) {
  const lower = text.toLowerCase();
  for (const [key, data] of Object.entries(KB)) {
    if (data.keywords.some(kw => lower.includes(kw))) return { key, ...data };
  }
  return null;
}

function formatResponse(intent) {
  if (!intent) {
    return `I couldn't pinpoint a specific category for that issue. Could you provide more detail? For example:\n\n• What is the **device model**?\n• What **symptoms** are you seeing?\n• When did the problem **start**?\n\nOr choose one of the suggested questions above.`;
  }
  let msg = `**🔎 Detected Issue: ${intent.title}** _(Category: ${intent.category})_\n\nHere are the recommended troubleshooting steps from our knowledge base:\n\n`;
  msg += intent.steps.map((s, i) => `${i + 1}. ${s}`).join('\n');
  msg += `\n\n💬 **Follow-up question:** ${intent.follow_up}`;
  return msg;
}

function renderMarkdown(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

class IoTChatbot {
  constructor(config) {
    this.messagesEl  = document.getElementById(config.messagesId);
    this.inputEl     = document.getElementById(config.inputId);
    this.sendBtn     = document.getElementById(config.sendBtnId);
    this.suggestEl   = document.getElementById(config.suggestId);
    this.typingEl    = document.getElementById(config.typingId);
    this.voiceBtn    = document.getElementById(config.voiceBtnId);
    this.uploadBtn   = document.getElementById(config.uploadBtnId);
    this.clearBtn    = document.getElementById(config.clearBtnId);
    this.history     = [];
    this.isTyping    = false;
    this.init();
  }

  init() {
    // Greeting
    setTimeout(() => this.addMessage('bot', GREETINGS[0]), 400);

    // Suggestions
    if (this.suggestEl) {
      this.suggestEl.innerHTML = SUGGESTIONS.map(s =>
        `<button class="suggest-chip" data-q="${s}">${s}</button>`
      ).join('');
      this.suggestEl.addEventListener('click', e => {
        const chip = e.target.closest('.suggest-chip');
        if (chip) { this.inputEl.value = chip.dataset.q; this.send(); }
      });
    }

    // Send
    this.sendBtn?.addEventListener('click', () => this.send());
    this.inputEl?.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.send(); }
    });

    // Clear
    this.clearBtn?.addEventListener('click', () => this.clear());

    // Voice
    this.voiceBtn?.addEventListener('click', () => this.startVoice());

    // Upload
    this.uploadBtn?.addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file'; inp.accept = 'image/*';
      inp.onchange = () => {
        if (inp.files[0]) {
          this.addMessage('user', `📷 [Image uploaded: ${inp.files[0].name}]`);
          setTimeout(() => {
            this.addMessage('bot', '📸 Image received! I\'ve noted the device image. Please describe the issue you\'re experiencing with this device and I\'ll help diagnose it.');
          }, 800);
        }
      };
      inp.click();
    });
  }

  send() {
    const text = this.inputEl?.value.trim();
    if (!text || this.isTyping) return;
    this.inputEl.value = '';
    this.addMessage('user', text);
    this.history.push({ role: 'user', content: text });
    this.showTyping();
    const delay = 900 + Math.random() * 700;
    setTimeout(() => {
      this.hideTyping();
      const intent = detectIntent(text);
      const response = formatResponse(intent);
      this.addMessage('bot', response, intent?.category);
      this.history.push({ role: 'bot', content: response });
    }, delay);
  }

  addMessage(role, text, category) {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-msg chat-msg-${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.innerHTML = renderMarkdown(text);
    if (category) {
      const tag = document.createElement('div');
      tag.className = 'chat-category';
      tag.textContent = '📂 ' + category;
      bubble.appendChild(tag);
    }
    const time = document.createElement('div');
    time.className = 'chat-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    wrapper.appendChild(role === 'bot' ? this._botAvatar() : document.createElement('span'));
    wrapper.appendChild(bubble);
    wrapper.appendChild(time);
    this.messagesEl.appendChild(wrapper);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  _botAvatar() {
    const av = document.createElement('div');
    av.className = 'bot-avatar';
    av.textContent = '🤖';
    return av;
  }

  showTyping() {
    this.isTyping = true;
    if (this.typingEl) this.typingEl.style.display = 'flex';
  }

  hideTyping() {
    this.isTyping = false;
    if (this.typingEl) this.typingEl.style.display = 'none';
  }

  clear() {
    this.messagesEl.innerHTML = '';
    this.history = [];
    setTimeout(() => this.addMessage('bot', GREETINGS[1]), 300);
  }

  startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { showToast('Voice input not supported in this browser.', 'warning'); return; }
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.onstart  = () => { this.voiceBtn.textContent = '🔴'; showToast('Listening…', 'info', 2000); };
    recognition.onresult = e => { this.inputEl.value = e.results[0][0].transcript; this.voiceBtn.textContent = '🎤'; this.send(); };
    recognition.onerror  = () => { this.voiceBtn.textContent = '🎤'; showToast('Voice recognition error.', 'danger'); };
    recognition.start();
  }
}

// Auto-init on page load
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('chatMessages')) {
    window.chatbot = new IoTChatbot({
      messagesId: 'chatMessages',
      inputId:    'chatInput',
      sendBtnId:  'sendBtn',
      suggestId:  'suggestions',
      typingId:   'typingIndicator',
      voiceBtnId: 'voiceBtn',
      uploadBtnId:'uploadBtn',
      clearBtnId: 'clearBtn',
    });
  }
});
