/* 在线预约系统 */
let calYear, calMonth, selectedDate = null, selectedService = null, selectedSlot = null;
let pendingCancelOrderNo = null;

const BK_STORE = 'TONI&GUY 美发沙龙(静安店)';

function init_booking() {
  if (window._bkInited) return;
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar();
  renderServices();
  renderSlots();
  renderBookings();
  $('#prevMonth').addEventListener('click', () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); });
  $('#nextMonth').addEventListener('click', () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); });
  $('#confirmBooking').addEventListener('click', confirmBooking);
  $('#bkConfirmCancel').addEventListener('click', doCancelBooking);
  window._bkInited = true;
}

function renderCalendar() {
  $('#calTitle').textContent = `${calYear}年 ${calMonth + 1}月`;
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  let html = '<div class="cal-head">日</div><div class="cal-head">一</div><div class="cal-head">二</div><div class="cal-head">三</div><div class="cal-head">四</div><div class="cal-head">五</div><div class="cal-head">六</div>';
  for (let i = 0; i < firstDay; i++) html += '<div class="cal-day other"></div>';
  for (let d = 1; d <= daysInMonth; d++) {
    const cls = [];
    const curStr = `${calYear}-${calMonth}-${d}`;
    if (curStr === todayStr) cls.push('today');
    if (selectedDate === curStr) cls.push('selected');
    if (d % 5 === 0) cls.push('has-booking');
    html += `<div class="cal-day ${cls.join(' ')}" onclick="selectDate('${curStr}', ${d})">${d}</div>`;
  }
  $('#calendar').innerHTML = html;
}

function selectDate(str, day) {
  selectedDate = str;
  $('#selectedDate').textContent = `已选择 ${calMonth + 1}月${day}日`;
  renderCalendar();
  renderSlots();
}

function renderServices() {
  $('#servicePicker').innerHTML = SERVICES.map((s, i) => `
    <div class="service-option ${i === 0 ? 'active' : ''}" onclick="selectService(this, ${i})">
      <div style="flex:1"><div class="svc-name">${s.name}</div><div class="muted">时长 ${s.duration}</div></div>
      <div class="svc-price">¥${s.price}</div>
    </div>
  `).join('');
  selectedService = SERVICES[0];
}

function selectService(el, i) {
  $$('.service-option').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  selectedService = SERVICES[i];
}

function renderSlots() {
  const slots = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30', '19:00', '20:30'];
  $('#slotGrid').innerHTML = slots.map(s => {
    const full = Math.random() > .7;
    const sel = selectedSlot === s;
    return `<div class="slot ${full ? 'full' : 'available'} ${sel ? 'selected' : ''}" onclick="${full ? '' : `selectSlot('${s}', this)`}">${s}${full ? ' 满' : ''}</div>`;
  }).join('');
}

function selectSlot(s, el) {
  $$('.slot').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
  selectedSlot = s;
}

/* 生成唯一预约单号 YY + YYYYMMDD + 3位序号 */
function genOrderNo() {
  const d = new Date();
  const pad = n => String(n).padStart(2, '0');
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const seq = String(BOOKINGS.length + 1).padStart(3, '0');
  return `YY${stamp}${seq}`;
}

function confirmBooking() {
  if (!selectedDate) { toast('先选个日子呗~', 'error'); return; }
  if (!selectedSlot) { toast('再挑个时间段', 'error'); return; }

  const orderNo = genOrderNo();
  const [y, m, d] = selectedDate.split('-').map(Number);
  const newBooking = {
    orderNo,
    store: BK_STORE,
    service: selectedService.name,
    date: selectedDate,
    time: selectedSlot,
    day: d,
    month: `${m + 1}月`,
    status: '待履约',
    customer: '张女士',
    phone: '138****8888',
  };
  BOOKINGS.unshift(newBooking);

  showSuccessModal(newBooking);
  renderBookings();

  selectedSlot = null;
  renderSlots();
}

function showSuccessModal(b) {
  const detail = [
    { label: '预约单号', value: `<span class="mono">${b.orderNo}</span>` },
    { label: '预约门店', value: b.store },
    { label: '预约时间', value: `${b.date} ${b.time}` },
    { label: '服务项目', value: b.service },
    { label: '预约人', value: `${b.customer} · ${b.phone}` },
    { label: '预约状态', value: `<span class="status-badge pending">${b.status}</span>` },
  ];
  $('#bkSuccessDetail').innerHTML = detail.map(r =>
    `<div class="bk-detail-row"><span class="bk-detail-label">${r.label}</span><span class="bk-detail-value">${r.value}</span></div>`
  ).join('');
  $('#bkSuccessModal').classList.add('show');
}

function closeBkSuccess() { $('#bkSuccessModal').classList.remove('show'); }
function closeBkCancel() { $('#bkCancelModal').classList.remove('show'); pendingCancelOrderNo = null; }

function scrollToBooking() {
  document.getElementById('module-booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* 最近预约列表 — 按时间倒序 */
function renderBookings() {
  const sorted = [...BOOKINGS].sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
  $('#bookingList').innerHTML = sorted.map(b => {
    const statusClass = b.status === '待履约' ? 'pending' : b.status === '已完成' ? 'done' : 'canceled';
    const canCancel = b.status === '待履约';
    return `
    <div class="booking-item">
      <div class="booking-date"><div class="bd-day">${b.day}</div><div class="bd-month">${b.month}</div></div>
      <div class="booking-info">
        <div class="bi-title">${b.service}</div>
        <div class="bi-meta">${b.store} · ${b.time}</div>
        <div class="bi-order">单号 <span class="mono">${b.orderNo}</span></div>
      </div>
      <div class="booking-right">
        <span class="status-badge ${statusClass}">${b.status}</span>
        ${canCancel ? `<button class="danger-btn sm" onclick="openCancelModal('${b.orderNo}')">取消预约</button>` : ''}
      </div>
    </div>`;
  }).join('');
}

/* 取消预约 — 二次确认 */
function openCancelModal(orderNo) {
  pendingCancelOrderNo = orderNo;
  const b = BOOKINGS.find(x => x.orderNo === orderNo);
  if (!b) return;
  $('#bkCancelTarget').innerHTML = `将取消：<b>${b.service}</b> · ${b.date} ${b.time}`;
  $('#bkCancelModal').classList.add('show');
}

function doCancelBooking() {
  if (!pendingCancelOrderNo) return;
  const b = BOOKINGS.find(x => x.orderNo === pendingCancelOrderNo);
  if (!b) return;

  // 校验 2 小时规则
  const now = new Date();
  const bookingTime = new Date(`${b.date}T${b.time}`);
  const diffHours = (bookingTime - now) / (1000 * 60 * 60);
  if (diffHours < 2) {
    toast('距预约开始不足 2 小时，无法线上取消，请联系门店', 'error');
    closeBkCancel();
    return;
  }

  b.status = '已取消';
  closeBkCancel();
  renderBookings();
  toast(`已取消预约 ${b.orderNo}，门店档期已释放，取消通知已推送`, 'success');
}
