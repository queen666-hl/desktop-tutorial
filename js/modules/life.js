/* 生活服务 */
function init_life() {
  if (window._lifeInited) return;
  renderLifeSections();
  renderMerchants();
  renderBenefits();
  $('#refreshQr').addEventListener('click', () => {
    $('.qr-pattern').style.backgroundPosition = `${rand(0,20)}px ${rand(0,20)}px`;
    toast('核销码已刷新，拿去用~', 'success');
  });
  $('#merchantSort').addEventListener('change', e => renderMerchants(e.target.value));
  window._lifeInited = true;
}

function renderLifeSections() {
  const secColors = {
    home:  { grad: 'linear-gradient(135deg,#10b981,#059669)',  tag: '到家' },
    store: { grad: 'linear-gradient(135deg,#6366f1,#4f46e5)',  tag: '到店' },
    family:{ grad: 'linear-gradient(135deg,#f59e0b,#d97706)',  tag: '民生' },
    smart: { grad: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',  tag: '智能' },
  };
  $('#lifeCats').innerHTML = LIFE_SECTIONS.map(sec => {
    const c = secColors[sec.key];
    const cards = sec.items.map(it => `
      <div class="life-card" onclick="toast('进入【${it.name}】，${it.products[0]} 已就绪~','info')">
        <div class="lc-head">
          <span class="lc-ico">${it.ico}</span>
          <span class="lc-name">${it.name}</span>
        </div>
        <div class="lc-products">${it.products.map(p => `<span class="lc-product">${p}</span>`).join('')}</div>
        <div class="lc-desc">${it.desc}</div>
        <div class="lc-platform">⚙ ${it.platform}</div>
      </div>
    `).join('');
    return `
      <div class="life-section">
        <div class="life-sec-head" style="background:${c.grad}">
          <div>
            <span class="life-sec-tag">${c.tag}</span>
            <h3>${sec.name}</h3>
            <p>${sec.desc}</p>
          </div>
          <span class="life-sec-count">${sec.items.length} 项服务</span>
        </div>
        <div class="life-cards">${cards}</div>
      </div>
    `;
  }).join('');
}

function renderMerchants(sort = 'distance') {
  const list = [...MERCHANTS].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'sales') return b.sales - a.sales;
    return parseFloat(a.distance) - parseFloat(b.distance);
  });
  $('#merchantList').innerHTML = list.map(m => `
    <div class="merchant-item">
      <div class="merchant-img">${m.ico}</div>
      <div class="merchant-info">
        <div class="merchant-name">${m.name}</div>
        <div class="merchant-rating">★ ${m.rating} · 月售 ${fmt(m.sales)}</div>
        <div class="merchant-tags">${m.tags.map(t => `<span class="merchant-tag">${t}</span>`).join('')}</div>
        <div class="merchant-meta">${m.distance} · ${m.price}</div>
      </div>
      <div class="merchant-action">
        <button class="primary-btn" style="padding:6px 14px;font-size:12px" onclick="event.stopPropagation();buyMerchant('${m.name}')">抢购</button>
        <div class="merchant-distance">${m.distance}</div>
      </div>
    </div>
  `).join('');
}

function buyMerchant(name) {
  toast(`已下单【${name}】，到店出示核销码即可使用~`, 'success');
}

function renderBenefits() {
  $('#benefitList').innerHTML = BENEFITS.map(b => `
    <div class="benefit-item">
      <div class="benefit-ico">${b.ico}</div>
      <div class="benefit-info"><b>${b.name}</b><span>${b.desc}</span></div>
      <button class="ghost-btn sm" onclick="useBenefit('${b.name}')">去使用</button>
    </div>
  `).join('');
}

function useBenefit(name) {
  toast(`【${name}】权益已激活，享受你的专属福利~`, 'success');
}
