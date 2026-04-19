// ══════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════
const contacts = [
  { name: 'siddharth', role: 'Director', company: 'Denovate', meetings: 4 },
  { name: 'vinay', role: 'CTO', company: 'Denovate', meetings: 2 },
  { name: 'krupakar', role: 'CEO', company: 'Denovate', meetings: 1 },
  { name: 'akash', role: 'Head of Strategy', company: 'Denovate', meetings: 3 },
  { name: 'karthik', role: 'manager', company: 'Denovate', meetings: 5 },
];

let activeContact = 0;
let chatHistory = [];
let currentUser = null;

// ══════════════════════════════════════════════
//  COUNTDOWN
// ══════════════════════════════════════════════
function startCountdown() {
  const target = new Date();
  target.setHours(15, 0, 0, 0);
  if (target < new Date()) target.setDate(target.getDate() + 1);

  setInterval(() => {
    const diff = target - new Date();
    if (diff <= 0) { document.getElementById('countdown').textContent = 'NOW'; return; }
    const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
    const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    document.getElementById('countdown').textContent = `${h}:${m}:${s}`;
  }, 1000);
}

startCountdown();
document.getElementById('logDate').valueAsDate = new Date();

// ══════════════════════════════════════════════
//  USER / AUTH
// ══════════════════════════════════════════════
function updateUserUI() {
  const initials = document.getElementById('userInitials');
  const ddName = document.getElementById('ddUserName');
  const ddEmail = document.getElementById('ddUserEmail');
  const settingsName = document.getElementById('settingsUserName');
  const settingsEmail = document.getElementById('settingsUserEmail');
  const settingsAvatarText = document.getElementById('settingsAvatarText');
  const settingsAuthBtn = document.getElementById('settingsAuthBtn');

  if (currentUser) {
    const parts = currentUser.name.split(' ');
    const ini = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
    initials.textContent = ini;
    ddName.textContent = currentUser.name;
    ddEmail.textContent = currentUser.email;
    settingsName.textContent = currentUser.name;
    settingsEmail.textContent = currentUser.email;
    settingsAvatarText.textContent = ini;
    settingsAuthBtn.textContent = 'Sign Out';
    settingsAuthBtn.onclick = () => { signOut(); closeModal('settingsModal'); };
  } else {
    initials.textContent = '?';
    ddName.textContent = 'Guest';
    ddEmail.textContent = 'Not signed in';
    settingsName.textContent = 'Guest';
    settingsEmail.textContent = 'Not signed in';
    settingsAvatarText.textContent = '?';
    settingsAuthBtn.textContent = 'Sign In';
    settingsAuthBtn.onclick = () => { closeModal('settingsModal'); openLogin(); };
  }
}

function toggleUserDropdown() {
  const dd = document.getElementById('userDropdown');
  dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  if (dd.style.display === 'block') {
    if (!currentUser) {
      // Show login modal instead
      dd.style.display = 'none';
      openLogin();
    }
  }
}

document.addEventListener('click', (e) => {
  if (!document.getElementById('userWrap').contains(e.target)) {
    document.getElementById('userDropdown').style.display = 'none';
  }
});

function signOut() {
  currentUser = null;
  document.getElementById('userDropdown').style.display = 'none';
  updateUserUI();
  showToast('👋 Signed out successfully');
}

function socialAuth(provider) {
  // Simulate OAuth flow
  const mockUsers = {
    'Google': { name: 'Alex Johnson', email: 'alex@company.com' },
    'Microsoft': { name: 'Alex Johnson', email: 'alex@company.com' },
  };
  currentUser = mockUsers[provider];
  closeModal('loginModal');
  updateUserUI();
  showToast(`✅ Signed in with ${provider}`);
}

function switchLoginTab(tab) {
  const isSignup = tab === 'signup';
  document.getElementById('signinTab').classList.toggle('active', !isSignup);
  document.getElementById('signupTab').classList.toggle('active', isSignup);
  document.getElementById('signupNameGroup').style.display = isSignup ? 'flex' : 'none';
  document.getElementById('loginSubmitBtn').textContent = isSignup ? 'Create Account' : 'Sign In';
}

function submitLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const isSignup = document.getElementById('signupTab').classList.contains('active');

  if (!email) { showToast('❌ Please enter your email'); return; }
  if (!password) { showToast('❌ Please enter your password'); return; }

  let name = 'User';
  if (isSignup) {
    name = document.getElementById('signupName').value.trim() || email.split('@')[0];
  } else {
    name = email.split('@')[0];
    // Capitalize
    name = name.charAt(0).toUpperCase() + name.slice(1);
  }

  currentUser = { name, email };
  closeModal('loginModal');
  updateUserUI();
  showToast(`✅ ${isSignup ? 'Account created' : 'Signed in'} as ${name}`);
}

function openLogin() {
  document.getElementById('loginModal').style.display = 'flex';
}

function handleSettingsAuth() {
  if (currentUser) {
    signOut();
  } else {
    closeModal('settingsModal');
    openLogin();
  }
}

updateUserUI();

// ══════════════════════════════════════════════
//  MODALS
// ══════════════════════════════════════════════
function openSettings() { document.getElementById('settingsModal').style.display = 'flex'; }
function openRecordings() { switchTab('recordings', document.querySelectorAll('.tab')[5]); }
function openUploadRecording() { document.getElementById('uploadRecModal').style.display = 'flex'; }
function openNewMeeting() { switchTab('new', document.querySelectorAll('.tab')[4]); }
function openAddContact() { showToast('👤 Add Contact — coming in v2'); }

function closeModal(id) { document.getElementById(id).style.display = 'none'; }
function closeModalOnOverlay(e, id) { if (e.target === e.currentTarget) closeModal(id); }

function saveSettings() {
  closeModal('settingsModal');
  showToast('✅ Settings saved');
}

function confirmClearMemory() {
  if (confirm('This will permanently erase all Hindsight memory. Are you sure?')) {
    showToast('🗑️ Memory cleared');
  }
}

// ══════════════════════════════════════════════
//  TABS
// ══════════════════════════════════════════════
function switchTab(name, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  ['briefing', 'memory', 'promises', 'chat', 'new', 'recordings'].forEach(t => {
    const el2 = document.getElementById('tab-' + t);
    if (el2) el2.style.display = t === name ? 'block' : 'none';
  });
}

// ══════════════════════════════════════════════
//  CONTACT SELECTION
// ══════════════════════════════════════════════
function selectContact(idx) {
  activeContact = idx;
  document.querySelectorAll('.contact-card').forEach((c, i) => c.classList.toggle('active', i === idx));
  const c = contacts[idx];
  document.getElementById('contactName').textContent = c.name;
  document.getElementById('briefingOutput').style.display = 'none';
  document.getElementById('briefingPlaceholder').style.display = 'block';
  chatHistory = [];
  const msgs = document.getElementById('chatMessages');
  msgs.innerHTML = `<div class="msg ai"><div class="msg-avatar ai">AI</div><div><div class="msg-bubble">Memory loaded for ${c.name}. I have ${c.meetings} past sessions ready. Ask me anything!</div><div class="msg-time">Just now</div></div></div>`;
}

// ══════════════════════════════════════════════
//  AI BRIEFING
// ══════════════════════════════════════════════
async function generateBriefing() {
  const btn = document.getElementById('prepBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Generating...';

  const c = contacts[activeContact];

  const systemPrompt = `You are PrepSync, an AI meeting prep agent with persistent memory of past meetings.
You have memory for ${c.name} (${c.role} at ${c.company}) with ${c.meetings} past sessions.
Generate a comprehensive meeting briefing.
Return ONLY a JSON object:
{
  "relationship_summary": "2-3 sentence warm summary",
  "key_talking_points": ["point1","point2","point3"],
  "watch_outs": ["risk1","risk2"],
  "memory_highlights": ["notable thing 1","notable thing 2","notable thing 3"],
  "opening_line": "A personalized opening line for the meeting",
  "energy_level": "High/Medium/Low"
}`;

  const userMsg = `Generate a meeting briefing for my upcoming meeting with ${c.name}, ${c.role} at ${c.company}. Past meetings: ${c.meetings}. Key context: pricing concerns, Q2 budget approval incoming. Open promises: onboarding deck and API docs.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMsg }]
      })
    });
    const data = await response.json();
    const raw = data.content?.map(b => b.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    renderBriefing(parsed, c.name);
    showToast('✅ Briefing generated from memory');
  } catch (e) {
    renderBriefing({
      relationship_summary: `You've had ${c.meetings} productive sessions with ${c.name}. Relationship is warm — they've shown strong interest in the analytics module. Budget is the main friction point.`,
      key_talking_points: [
        'Follow up on the overdue onboarding deck — offer to walk them through it live',
        'Q2 budget just opened — revisit enterprise pricing with the ROI calculator',
        'Share the Q3 roadmap analytics dashboard preview they asked about',
      ],
      watch_outs: [
        'Do NOT open with pricing — let them bring it up after the value discussion',
        'Ravi (their CTO) had API concerns — confirm you sent the docs before this call',
      ],
      memory_highlights: [
        'Called our reporting module "exactly what we need" in the Feb demo',
        'Expressed frustration about manual reporting (6+ hrs/week per PM)',
        'Mentioned Nexus as a competitor but thinks our analytics beat them',
      ],
      opening_line: `"${c.name}, great to reconnect — I wanted to start by getting your team's take on the onboarding deck, let's make sure that's landing right."`,
      energy_level: 'High'
    }, c.name);
    showToast('⚡ Briefing ready (offline mode)');
  }

  btn.disabled = false;
  btn.innerHTML = '⚡ Regenerate Brief';
}

function renderBriefing(data, name) {
  const energyColor = data.energy_level === 'High' ? 'var(--accent3)' : data.energy_level === 'Medium' ? '#f59e0b' : 'var(--accent2)';
  const html = `
    <div class="briefing-card-header">
      <div>
        <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:4px;font-weight:700">AI Briefing · ${name}</div>
        <div style="font-weight:900;font-size:16px">Pre-Meeting Intelligence Report</div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        <div style="font-size:11px;color:var(--muted);font-weight:300">Relationship Energy</div>
        <div style="background:${energyColor}22;border:1px solid ${energyColor}44;color:${energyColor};padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700">${data.energy_level}</div>
      </div>
    </div>
    <div class="briefing-card-body">
      <div class="briefing-section-label">Relationship Context</div>
      <div class="briefing-text">${data.relationship_summary}</div>

      <div class="briefing-section-label">Memory Highlights</div>
      <ul class="briefing-list">
        ${data.memory_highlights.map(h => `<li class="success">🧠 ${h}</li>`).join('')}
      </ul>

      <div class="briefing-section-label">Key Talking Points</div>
      <ul class="briefing-list">
        ${data.key_talking_points.map(t => `<li>${t}</li>`).join('')}
      </ul>

      <div class="briefing-section-label">Watch Outs</div>
      <ul class="briefing-list">
        ${data.watch_outs.map(w => `<li class="warning">⚠️ ${w}</li>`).join('')}
      </ul>

      <div class="briefing-section-label">Suggested Opening</div>
      <div style="background:rgba(108,99,255,0.08);border:1px solid rgba(108,99,255,0.2);border-radius:10px;padding:14px 18px;font-size:13px;line-height:1.7;font-style:italic;color:var(--text);font-weight:300">
        ${data.opening_line}
      </div>
    </div>`;

  const out = document.getElementById('briefingOutput');
  out.innerHTML = html;
  out.style.display = 'block';
  document.getElementById('briefingPlaceholder').style.display = 'none';
}

// ══════════════════════════════════════════════
//  CHAT
// ══════════════════════════════════════════════
function fillHint(el) {
  document.getElementById('chatInput').value = el.textContent;
  document.getElementById('chatInput').focus();
  switchTab('chat', document.querySelectorAll('.tab')[3]);
}

function handleChatKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChatMessage(); }
}

function addMsg(role, text) {
  const msgs = document.getElementById('chatMessages');
  const isAI = role === 'ai';
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.innerHTML = `
    <div class="msg-avatar ${role}">${isAI ? 'AI' : 'Me'}</div>
    <div>
      <div class="msg-bubble">${text.replace(/\n/g, '<br>')}</div>
      <div class="msg-time">${time}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'msg ai';
  div.id = 'typingIndicator';
  div.innerHTML = `<div class="msg-avatar ai">AI</div><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() { document.getElementById('typingIndicator')?.remove(); }

async function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  addMsg('user', text);
  chatHistory.push({ role: 'user', content: text });

  const sendBtn = document.getElementById('sendBtn');
  sendBtn.disabled = true;
  showTyping();

  const c = contacts[activeContact];

  const systemPrompt = `You are PrepSync, a memory-powered AI meeting preparation agent.
You have loaded Hindsight memory for ${c.name} (${c.role} at ${c.company}) with ${c.meetings} past meeting sessions.

Key memory facts:
- First met Feb 10, 2026 (cold outreach converted)
- They have 12 PMs spending 6+ hours/week on manual reporting
- Strong buy signal in Feb demo — loved the reporting module
- Pricing/budget concern raised in Mar
- Open promises: onboarding deck, API docs for Ravi (their CTO)
- Competitor mentioned: Nexus (we beat them on analytics)
- Q2 budget just approved

Answer questions about past meetings concisely. Be specific, reference actual past interactions. Keep responses under 150 words.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: chatHistory.map(m => ({ role: m.role, content: m.content }))
      })
    });
    const data = await response.json();
    const reply = data.content?.map(b => b.text || '').join('').trim() || 'Memory loaded. Ask me anything!';
    removeTyping();
    addMsg('ai', reply);
    chatHistory.push({ role: 'assistant', content: reply });
  } catch (e) {
    removeTyping();
    const fallbacks = {
      'promise': "From memory: You have 2 open promises — (1) Send the revised onboarding deck (overdue since Apr 10) and (2) Share API integration docs with Ravi, their CTO (overdue since Mar 25).",
      'objection': "Arjun has raised 2 recurring objections: (1) Pricing — feels the enterprise tier is too high for their team size, and (2) Data migration risk.",
      'pricing': "Best angle: lead with ROI. Arjun mentioned 6+ hours/week per PM on manual reporting. With 12 PMs, that's 72+ hours/week. Q2 just opened — it's the right moment.",
      'email': `Here's a draft:\n\nHey ${c.name},\n\nGreat catching up today. As promised, I'm attaching the onboarding deck and the API doc for Ravi.\n\nLooking forward to moving things forward in Q2.\n\n— [Your name]`,
      'excite': `${c.name} lights up around (1) the reporting & analytics module, (2) team productivity metrics, and (3) anything with a clear ROI story.`
    };
    const lower = text.toLowerCase();
    let reply = `From memory: ${c.name} has been a warm prospect with strong engagement. ${c.meetings} sessions logged. Anything specific you want to know?`;
    for (const [key, val] of Object.entries(fallbacks)) {
      if (lower.includes(key)) { reply = val; break; }
    }
    addMsg('ai', reply);
    chatHistory.push({ role: 'assistant', content: reply });
  }

  sendBtn.disabled = false;
}

// ══════════════════════════════════════════════
//  LOG MEETING
// ══════════════════════════════════════════════
async function logMeeting() {
  const notes = document.getElementById('logNotes').value.trim();
  const title = document.getElementById('logTitle').value.trim();
  const contact = document.getElementById('logContact').value.trim();

  if (!notes || !title) { showToast('❌ Please fill in the meeting title and notes'); return; }

  const btn = document.getElementById('logBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Extracting insights...';

  const systemPrompt = `You are an AI meeting analyst. Extract structured insights from meeting notes.
Return ONLY a JSON object (no markdown, no backticks):
{"summary":"2 sentence summary","promises":["promise1","promise2"],"objections":["objection1"],"sentiment":"Positive/Neutral/Negative","key_topics":["topic1","topic2","topic3"],"next_steps":["step1","step2"]}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Meeting with ${contact}. Title: ${title}.\n\nNotes:\n${notes}` }]
      })
    });
    const data = await response.json();
    const raw = data.content?.map(b => b.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    renderInsights(parsed);
    showToast('🧠 Saved to Hindsight memory!');
  } catch (e) {
    renderInsights({
      summary: `Meeting with ${contact} about ${title}. Key discussions logged and extracted by AI.`,
      promises: ['Send follow-up materials within 48 hours', 'Schedule next check-in'],
      objections: ['Timeline concerns raised'],
      sentiment: 'Positive',
      key_topics: [title, 'Follow-ups', 'Next Steps'],
      next_steps: ['Send recap email', 'Update CRM', 'Prepare materials']
    });
    showToast('🧠 Saved to memory (offline mode)');
  }

  btn.disabled = false;
  btn.innerHTML = '🧠 Extract & Save to Memory';
}

function renderInsights(data) {
  const sentColor = data.sentiment === 'Positive' ? 'var(--accent3)' : data.sentiment === 'Negative' ? 'var(--accent2)' : '#f59e0b';
  const html = `
    <div class="briefing-card" style="margin-bottom:0">
      <div class="briefing-card-header">
        <div style="font-weight:900;font-size:15px">Extraction Complete</div>
        <div style="background:${sentColor}22;border:1px solid ${sentColor}44;color:${sentColor};padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700">
          ${data.sentiment} Sentiment
        </div>
      </div>
      <div class="briefing-card-body">
        <div class="briefing-section-label">Summary</div>
        <div class="briefing-text">${data.summary}</div>

        <div class="briefing-section-label">Promises Extracted (→ added to tracker)</div>
        <ul class="briefing-list">
          ${data.promises.map(p => `<li>📌 ${p}</li>`).join('')}
        </ul>

        ${data.objections?.length ? `<div class="briefing-section-label">Objections Noted</div>
        <ul class="briefing-list">
          ${data.objections.map(o => `<li class="warning">⚠️ ${o}</li>`).join('')}
        </ul>` : ''}

        <div class="briefing-section-label">Key Topics</div>
        <div class="timeline-tags" style="margin-top:0">
          ${data.key_topics.map(t => `<div class="tag highlight">${t}</div>`).join('')}
        </div>

        <div class="briefing-section-label">Next Steps</div>
        <ul class="briefing-list">
          ${data.next_steps.map(s => `<li class="success">→ ${s}</li>`).join('')}
        </ul>
      </div>
    </div>`;

  const el = document.getElementById('extractedInsights');
  document.getElementById('insightsContent').innerHTML = html;
  el.style.display = 'block';
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ══════════════════════════════════════════════
//  PROMISES
// ══════════════════════════════════════════════
function togglePromise(el) {
  el.classList.toggle('done');
  const textEl = el.closest('.promise-item').querySelector('.promise-text');
  const statusEl = el.closest('.promise-item').querySelector('.promise-status');
  const isDone = el.classList.contains('done');
  textEl.classList.toggle('done', isDone);
  if (isDone) {
    statusEl.className = 'promise-status done-s';
    statusEl.textContent = 'Done';
    el.closest('.promise-item').style.opacity = '0.6';
  } else {
    statusEl.className = 'promise-status pending';
    statusEl.textContent = 'Pending';
    el.closest('.promise-item').style.opacity = '1';
  }
}

function addPromiseManually() {
  const text = prompt('Enter the commitment:');
  if (!text) return;
  const list = document.getElementById('promisesList');
  const div = document.createElement('div');
  div.className = 'promise-item';
  div.innerHTML = `
    <div class="promise-check" onclick="togglePromise(this)"></div>
    <div class="promise-info">
      <div class="promise-text">${text}</div>
      <div class="promise-meta">Added manually · Today</div>
    </div>
    <div class="promise-status pending">Pending</div>`;
  list.prepend(div);
  showToast('✅ Commitment added');
}

// ══════════════════════════════════════════════
//  RECORDINGS
// ══════════════════════════════════════════════
let activeWave = null;
let waveInterval = null;

function playRecording(btn, title) {
  const isPlaying = btn.textContent === '⏸';
  if (isPlaying) {
    btn.textContent = '▶';
    if (waveInterval) clearInterval(waveInterval);
    return;
  }
  // Reset all
  document.querySelectorAll('.rec-play-btn').forEach(b => b.textContent = '▶');
  if (waveInterval) clearInterval(waveInterval);

  btn.textContent = '⏸';
  showToast(`🎙 Playing: ${title}`);

  // Animate wave bars for the parent item
  const item = btn.closest('.recording-item');
  const bars = item.querySelectorAll('.audio-bar');
  waveInterval = setInterval(() => {
    bars.forEach(bar => {
      bar.style.height = (Math.random() * 18 + 4) + 'px';
      bar.style.opacity = 0.4 + Math.random() * 0.6;
    });
  }, 120);

  // Auto-stop after a bit (demo)
  setTimeout(() => {
    btn.textContent = '▶';
    clearInterval(waveInterval);
    bars.forEach(bar => { bar.style.height = '10px'; bar.style.opacity = 0.5; });
  }, 8000);
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) updateDropZone(file.name);
}

function handleFileDrop(e) {
  e.preventDefault();
  document.getElementById('dropZone').style.borderColor = 'var(--border)';
  const file = e.dataTransfer.files[0];
  if (file) updateDropZone(file.name);
}

function updateDropZone(name) {
  document.getElementById('dropIcon').textContent = '✅';
  document.getElementById('dropTitle').textContent = name;
  document.getElementById('dropSub').textContent = 'File ready to process';
}

async function processRecording() {
  const btn = document.getElementById('processRecBtn');
  const contact = document.getElementById('recContact').value.trim() || 'Unknown';
  const title = document.getElementById('recTitle').value.trim() || 'New Recording';

  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Processing...';

  // Simulate AI transcription + insight extraction
  await new Promise(r => setTimeout(r, 2200));

  // Add to recordings list
  const list = document.getElementById('recordingsList');
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const div = document.createElement('div');
  div.className = 'recording-item';
  div.innerHTML = `
    <div class="rec-play-btn" onclick="playRecording(this, '${title}')">▶</div>
    <div class="rec-info">
      <div class="rec-title">${title}</div>
      <div class="rec-meta">${today} · with ${contact}</div>
    </div>
    <div class="audio-wave">
      ${[...Array(7)].map(() => `<div class="audio-bar" style="height:${Math.floor(Math.random() * 14 + 6)}px"></div>`).join('')}
    </div>
    <div class="rec-duration">--:--</div>
    <div class="rec-badge new">New</div>`;
  list.prepend(div);

  btn.disabled = false;
  btn.innerHTML = '🧠 Process with AI';
  closeModal('uploadRecModal');
  showToast('✅ Recording processed and added to memory');
  switchTab('recordings', document.querySelectorAll('.tab')[5]);
}

// ══════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════
function showToast(msg) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}