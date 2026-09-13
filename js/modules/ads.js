/* 广告个性化 */
function init_ads() {
  if (window._adsInited) return;
  renderCampaigns();
  drawAdsChart();
  $('#createCampaign')?.addEventListener('click', () => toast('广告计划向导已就位，准备烧钱~', 'info'));
  window._adsInited = true;
}

function renderCampaigns() {
  $('#campaignGrid').innerHTML = CAMPAIGNS.map(c => `
    <div class="campaign-card">
      <div class="camp-cover">${c.cover}<span style="font-size:32px;bottom:12px;left:16px">${c.cover}</span></div>
      <div class="camp-title">${c.title}</div>
      <div class="camp-meta">${c.meta}</div>
      <div class="campaign-stats">
        ${Object.entries(c.stats).map(([k, v]) => `<div class="campaign-stat"><div class="num">${v}</div><div class="lbl">${k}</div></div>`).join('')}
      </div>
      <div class="progress"><i style="width:${c.progress}%"></i></div>
    </div>
  `).join('');
}

function drawAdsChart() {
  const labels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  if (window._adsChart) window._adsChart.destroy();
  window._adsChart = new Chart($('#adsChart'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: '曝光(万)', data: [12, 15, 14, 18, 22, 28, 26], backgroundColor: 'rgba(99,102,241,.7)', borderRadius: 6 },
        { label: '点击(千)', data: [3.2, 4.1, 3.8, 5.2, 6.8, 8.4, 7.9], backgroundColor: 'rgba(34,211,238,.7)', borderRadius: 6 },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'top' } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(148,163,184,.12)' } }
      }
    }
  });
}
