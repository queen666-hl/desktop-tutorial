/* 用户行为分析 */
function init_behavior() {
  if (window._behaviorInited) return;
  renderFunnel();
  renderJourney();
  drawPersonaChart();
  window._behaviorInited = true;
}

const FUNNEL = [
  { name: '浏览商品', value: 100000, width: 100, color: '#6366f1' },
  { name: '加入购物车', value: 38000, width: 76, color: '#8b5cf6' },
  { name: '进入结算', value: 22000, width: 58, color: '#a78bfa' },
  { name: '提交订单', value: 12800, width: 42, color: '#22d3ee' },
  { name: '支付成功', value: 10200, width: 32, color: '#10b981' },
];

function renderFunnel() {
  $('#funnel').innerHTML = FUNNEL.map((s, i) => {
    const rate = i === 0 ? '100%' : ((s.value / FUNNEL[i - 1].value) * 100).toFixed(1) + '%';
    return `<div class="funnel-step" style="width:${s.width}%;background:${s.color}">
      <span>${s.name}</span><span class="rate">${fmt(s.value)} · 转化 ${rate}</span>
    </div>`;
  }).join('');
}

const JOURNEY = [
  { name: '首页曝光', num: '100K', drop: '—' },
  { name: '商品详情', num: '62K', drop: '流失 38%' },
  { name: '加购', num: '24K', drop: '流失 61%' },
  { name: '结算', num: '15K', drop: '流失 38%' },
  { name: '支付', num: '12K', drop: '流失 20%' },
  { name: '复购', num: '5.4K', drop: '留存 45%' },
];

function renderJourney() {
  $('#journey').innerHTML = JOURNEY.map(j => `
    <div class="journey-node">
      <div class="node-name">${j.name}</div>
      <div class="node-num">${j.num}</div>
      <div class="node-drop">${j.drop}</div>
    </div>
  `).join('');
}

function drawPersonaChart() {
  if (window._personaChart) window._personaChart.destroy();
  window._personaChart = new Chart($('#personaChart'), {
    type: 'radar',
    data: {
      labels: ['消费力', '活跃度', '忠诚度', '价格敏感度', '社交分享', '新品偏好'],
      datasets: [{
        data: [85, 72, 90, 45, 60, 78],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,.2)',
        pointBackgroundColor: '#6366f1',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: { beginAtZero: true, max: 100, ticks: { display: false }, grid: { color: 'rgba(148,163,184,.15)' } }
      }
    }
  });
}
