/* 销量预测 */
function init_forecast() {
  if (window._forecastInited) return;
  drawForecastChart();
  renderFactors();
  window._forecastInited = true;
}

function drawForecastChart() {
  const labels = Array.from({ length: 30 }, (_, i) => `${i + 1}日`);
  const actual = labels.map(() => rand(3000, 6000));
  const forecast = labels.map((_, i) => {
    const base = i < 24 ? actual[i] + rand(-300, 500) : actual[23] + rand(-200, 800);
    return Math.max(2000, base);
  });
  // 后段实际置空
  for (let i = 24; i < 30; i++) actual[i] = null;

  if (window._fcChart) window._fcChart.destroy();
  window._fcChart = new Chart($('#forecastChart'), {
    type: 'line',
    data: {
      labels,
      datasets: [
        { label: '实际销量', data: actual, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,.1)', fill: true, tension: .4, pointRadius: 0, borderWidth: 2.5, spanGaps: false },
        { label: '预测销量', data: forecast, borderColor: '#22d3ee', backgroundColor: 'rgba(34,211,238,.08)', fill: true, tension: .4, pointRadius: 0, borderWidth: 2.5, borderDash: [6, 4] },
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: 'rgba(148,163,184,.12)' } }
      }
    }
  });
}

function renderFactors() {
  $('#factorBars').innerHTML = FACTORS.map(f => `
    <div class="factor-row">
      <span>${f.name}</span>
      <div class="factor-track"><i style="width:${f.value * 2.5}%"></i></div>
      <span class="factor-val">${f.value}%</span>
    </div>
  `).join('');
}

$('#forecastSku')?.addEventListener('change', () => {
  drawForecastChart();
  toast('品类预测已更新，准不准看 AI 心情', 'info');
});
