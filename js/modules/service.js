/* 售前售后客服 */
function init_service() {
  if (window._svcInited) return;
  renderTickets();
  renderQuickReplies();
  // 默认会话
  $('#serviceChat').innerHTML = `
    <div class="msg"><div class="avatar">王</div><div class="bubble">你们这耳机降噪也太拉了吧！我要退货！😡</div></div>
    <div class="msg me"><div class="avatar">我</div><div class="bubble">实在抱歉给您添堵了！马上给您安排退货，请问订单号是多少呀？</div></div>
    <div class="msg"><div class="avatar">王</div><div class="bubble">#2026091388，快点的啊</div></div>
  `;
  window._svcInited = true;
}

function renderTickets() {
  $('#ticketList').innerHTML = TICKETS.map((t, i) => `
    <div class="ticket-item ${i === 0 ? 'active' : ''}" onclick="selectTicket(this, ${i})">
      <div class="ticket-avatar">${t.avatar}</div>
      <div class="ticket-info">
        <div class="ticket-name">${t.name}<span class="ticket-time">${t.time}</span></div>
        <div class="ticket-preview">${t.preview}</div>
      </div>
    </div>
  `).join('');
}

function renderQuickReplies() {
  $('#quickReplies').innerHTML = QUICK_REPLIES.map(q =>
    `<button class="qr-btn" onclick="quickReply(this)">${q}</button>`
  ).join('');
}

function selectTicket(el, i) {
  $$('.ticket-item').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  const t = TICKETS[i];
  const chat = $('#serviceChat');
  chat.innerHTML = `<div class="msg"><div class="avatar">${t.avatar}</div><div class="bubble">${t.preview}</div></div>`;
  const head = el.closest('.grid-2').querySelector('.chat-head .persona-name');
  // 更新头部
  const panel = el.closest('.panel').parentElement.querySelector('.chat-panel');
  const nameEl = panel.querySelector('.persona-name');
  if (nameEl) nameEl.textContent = t.name;
}

function quickReply(btn) {
  const chat = $('#serviceChat');
  const me = document.createElement('div');
  me.className = 'msg me';
  me.innerHTML = `<div class="avatar">我</div><div class="bubble">${btn.textContent}</div>`;
  chat.appendChild(me);
  chat.scrollTop = chat.scrollHeight;
  setTimeout(() => {
    const ai = document.createElement('div');
    ai.className = 'msg';
    ai.innerHTML = `<div class="avatar">王</div><div class="bubble">行吧，算你们识相~</div>`;
    chat.appendChild(ai);
    chat.scrollTop = chat.scrollHeight;
    toast('客户情绪已稳定，这波稳了 😎', 'success');
  }, 800);
}
