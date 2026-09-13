/* ============================================================
   app.js — 导航 / 主题 / 数据看板 / 全局事件
   ============================================================ */

const MODULE_NAMES = {
  'dashboard': '数据看板',
  'smart-store': '智慧门店',
  'forecast': '销量预测',
  'behavior': '用户行为分析',
  'ads': '广告个性化',
  'search': '商品搜索推荐',
  'digital-employee': '数字员工',
  'service': '售前售后客服',
  'copy-design': '文案视频设计',
  'product-desc': '商品介绍生成',
  'miniprogram': '电商小程序',
  'booking': '在线预约系统',
  'life': '生活服务',
};

let charts = {};

/* ---------- 导航 ---------- */
function switchModule(id) {
  $$('.module').forEach(m => m.classList.remove('active'));
  const target = $(`#module-${id}`);
  if (target) target.classList.add('active');
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.module === id));
  $('#crumbCurrent').textContent = MODULE_NAMES[id] || '';
  $('.module-area').scrollTop = 0;
  // 触发模块初始化
  if (window[`init_${id.replace('-', '_')}`]) window[`init_${id.replace('-', '_')}`]();
}

$$('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    switchModule(item.dataset.module);
  });
});

/* ---------- 侧边栏折叠 ---------- */
$('#sidebarToggle').addEventListener('click', () => {
  $('#sidebar').classList.toggle('collapsed');
});

/* ---------- 主题切换 ---------- */
$('#themeBtn').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  // 刷新图表颜色
  Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-2').trim();
  Object.values(charts).forEach(c => c && c.update());
  toast(`已切换到${next === 'dark' ? '深色' : '浅色'}模式，护眼又好看`, 'info');
});

/* ---------- 全局搜索 ---------- */
$('#globalSearch').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (q) {
      toast(`搜索：${q}`, 'info');
      e.target.value = '';
    }
  }
});

/* ---------- 新建任务 ---------- */
$('#newTaskBtn').addEventListener('click', () => {
  toast('新建任务面板已就位，开干~', 'info');
});

/* ---------- 刷新 ---------- */
$('#refreshBtn').addEventListener('click', () => {
  toast('数据已刷新，放心看~', 'success');
  renderDashboard();
});

$('#rangeSelect').addEventListener('change', renderDashboard);

/* ============================================================
   数据看板
   ============================================================ */
function init_dashboard() {
  if (charts._inited) return;
  renderDashboard();
  renderFeed();
  charts._inited = true;
}

function renderDashboard() {
  const range = +$('#rangeSelect').value;
  // KPI
  $('#kpiGmv').textContent = '¥ ' + fmt(rand(8000000, 15000000));
  $('#kpiOrders').textContent = fmt(rand(30000, 60000));
  $('#kpiUsers').textContent = fmt(rand(90000, 160000));
  $('#kpiConv').textContent = randFloat(3, 5).toFixed(2) + '%';

  // 排行
  const max = Math.max(...RANK_CATEGORIES.map(c => c.value));
  $('#rankList').innerHTML = RANK_CATEGORIES.map((c, i) => `
    <div class="rank-row">
      <div class="rank-num">${i + 1}</div>
      <div>
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span style="font-weight:600">${c.name}</span>
          <span class="rank-val">¥${fmt(c.value)}万</span>
        </div>
        <div class="rank-bar"><i style="width:${c.value / max * 100}%"></i></div>
      </div>
      <div class="rank-val">+${rand(5, 25)}%</div>
    </div>
  `).join('');

  // GMV 图
  const labels = Array.from({ length: range }, (_, i) => `${i + 1}日`);
  const data = labels.map(() => rand(200, 600));
  drawGmvChart(labels, data);
  drawChannelChart();
}

function drawGmvChart(labels, data) {
  if (charts.gmv) charts.gmv.destroy();
  const ctx = $('#gmvChart').getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 280);
  grad.addColorStop(0, 'rgba(99,102,241,.35)');
  grad.addColorStop(1, 'rgba(99,102,241,0)');
  charts.gmv = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'GMV (万元)',
        data,
        borderColor: '#6366f1',
        backgroundColor: grad,
        fill: true,
        tension: .4,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2.5,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(148,163,184,.12)' }, beginAtZero: true }
      }
    }
  });
}

function drawChannelChart() {
  if (charts.channel) charts.channel.destroy();
  charts.channel = new Chart($('#channelChart'), {
    type: 'doughnut',
    data: {
      labels: ['小程序', 'APP', '线下门店', '第三方电商', '直播'],
      datasets: [{
        data: [32, 24, 22, 14, 8],
        backgroundColor: ['#6366f1', '#8b5cf6', '#22d3ee', '#f59e0b', '#10b981'],
        borderWidth: 0,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: '62%',
      plugins: { legend: { position: 'right', labels: { boxWidth: 12, padding: 12 } } }
    }
  });
}

function renderFeed() {
  const list = [];
  for (let i = 0; i < 7; i++) {
    const f = pick(FEED_TEMPLATES);
    const t = `${rand(1, 59)}分钟前`;
    list.push(`<li><div class="feed-ico">${f.ico}</div><div><div>${f.text}${f.amt ? ` <b style="color:var(--danger)">${f.amt}</b>` : ''}</div><div class="feed-time">${t}</div></div></li>`);
  }
  $('#feedList').innerHTML = list.join('');
}

/* ---------- 初始化入口 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // 默认看板
  init_dashboard();
});
