/* 智慧门店 */
function init_smart_store() {
  if (window._smartStoreInited) return;
  renderHeatmap();
  renderDevices();
  renderSuggestions();
  window._smartStoreInited = true;
}

function renderHeatmap() {
  const el = $('#heatmap');
  let html = '';
  for (let i = 0; i < 96; i++) {
    const v = Math.random();
    let color;
    if (v > .75) color = '#ef4444';
    else if (v > .5) color = '#f59e0b';
    else if (v > .25) color = '#22d3ee';
    else color = '#e6e9f0';
    html += `<div class="heat-cell" style="background:${color}" title="客流指数 ${(v*100).toFixed(0)}"></div>`;
  }
  el.innerHTML = html;
}

function renderDevices() {
  $('#deviceGrid').innerHTML = DEVICES.map(d => `
    <div class="device-item">
      <div class="device-ico">${d.ico}</div>
      <div style="flex:1">
        <div class="device-name">${d.name}</div>
        <div class="device-status ${d.status}">● ${d.status === 'online' ? '在线' : '离线'} · ${d.num} 台</div>
      </div>
    </div>
  `).join('');
}

function renderSuggestions() {
  $('#suggestList').innerHTML = SUGGESTIONS.map(s => `
    <div class="suggest-item ${s.urgent ? 'urgent' : ''}">
      <div class="suggest-ico">${s.ico}</div>
      <div class="suggest-text"><b>${s.title}</b><span>${s.text}</span></div>
      <button class="ghost-btn sm">采纳</button>
    </div>
  `).join('');
}

$('#storeSelect')?.addEventListener('change', () => {
  renderHeatmap();
  toast('门店已切换，瞅瞅这家店表现~', 'info');
});
