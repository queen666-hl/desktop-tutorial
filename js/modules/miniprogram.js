/* 电商小程序 — 智能调度系统 */

/* 可编辑的组件配置 */
let COMP_CONFIG = {
  banner: '🔥 品牌日 · 满300减50，不买亏一个亿',
  cats: MINI_CATS.map(c => ({ ...c })),
  seckill: [
    { name: '蕉下防晒衣', price: 99, original: 199 },
    { name: '云南蓝莓4盒', price: 29, original: 59 },
    { name: '维达抽纸24包', price: 29, original: 49 },
  ],
  coupon: ['满300减50', '新人50元无门槛', '满99减10'],
  products: PRODUCTS.slice(0, 6).map(p => ({ name: p.name, price: p.price, img: p.img })),
};

const COMP_TITLES = {
  banner: '🎨 轮播图', cats: '🗂 分类导航', seckill: '🔥 秒杀专区',
  coupon: '🎁 优惠券', products: '📦 商品瀑布流',
};

let currentCompType = '';

function init_miniprogram() {
  if (window._mpInited) return;
  renderMiniCats();
  renderMiniProducts();
  $('#dispatchBtn').addEventListener('click', () => dispatch($('#dispatchInput').value.trim()));
  $('#dispatchInput').addEventListener('keydown', e => { if (e.key === 'Enter') dispatch(e.target.value.trim()); });
  window._mpInited = true;
}

function renderMiniCats() {
  $('#miniCats').innerHTML = MINI_CATS.map(c =>
    `<div class="mini-cat"><div class="cat-ico">${c.ico}</div><span>${c.name}</span></div>`
  ).join('');
}

function renderMiniProducts() {
  const items = PRODUCTS.slice(0, 6);
  $('#miniProducts').innerHTML = items.map(p => `
    <div class="mini-product" onclick="toast('打开 ${p.name}，看看~', 'info')">
      <div class="mp-img"><img src="${productImg(p)}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${p.img}'}))" /></div>
      <div class="mp-info">
        <div class="mp-title">${p.name}</div>
        <div class="mp-price">¥${p.price}</div>
      </div>
    </div>
  `).join('');
}

/* 快捷入口 */
function quickDispatch(text) {
  $('#dispatchInput').value = text;
  dispatch(text);
}

/* ========== 智能调度核心 ========== */
function dispatch(text) {
  if (!text) { toast('先说说你想做啥呀~', 'info'); return; }

  const ctx = analyzeContext(text);
  const route = matchRoute(text, ctx);
  const html = renderPage(route, ctx, text);
  $('#miniContent').innerHTML = html;
  $('#dispatchSummary').innerHTML = buildSummary(route, ctx, text);
}

/* 分析用户身份、时间空间、商品品类等上下文 */
function analyzeContext(text) {
  const ctx = {
    identity: 'normal',     // new/old/member/price/gift/family/enterprise/elderly
    urgency: 'normal',       // urgent/scheduled/normal
    hasLocation: false,
    product: null,
    category: null,
    keywords: [],
  };

  // 身份识别
  if (/新|第一次|首单|新人/.test(text)) ctx.identity = 'new';
  else if (/老客|回头|常买|老顾客/.test(text)) ctx.identity = 'old';
  else if (/会员|VIP|等级|积分/.test(text)) ctx.identity = 'member';
  else if (/送礼|礼物|生日|纪念日|送人/.test(text)) ctx.identity = 'gift';
  else if (/家庭|家用|大包装|全家/.test(text)) ctx.identity = 'family';
  else if (/企业|批量|对公|采购|发票/.test(text)) ctx.identity = 'enterprise';
  else if (/老年|老人|大字|简单|不会用/.test(text)) ctx.identity = 'elderly';
  else if (/便宜|划算|优惠|比价|省钱/.test(text)) ctx.identity = 'price';

  // 时间空间
  if (/急|马上|立刻|一小时|现在就要|尽快/.test(text)) ctx.urgency = 'urgent';
  else if (/以后|预约|定时|周末|下周|预定/.test(text)) ctx.urgency = 'scheduled';
  if (/附近|门店|自提|到店|楼下|周边/.test(text)) ctx.hasLocation = true;

  // 商品品类
  const catMap = {
    '生鲜': /生鲜|水果|蔬菜|蓝莓|冷链|海鲜/,
    '服饰': /衣服|鞋|防晒衣|尺码|试穿|穿搭/,
    '美妆': /美妆|护肤|口红|精华|色号|面膜/,
    '数码': /手机|电脑|耳机|数码|手表|参数/,
    '家电': /家电|冰箱|空调|炸锅|安装|吹风机/,
    '母婴': /母婴|宝宝|奶粉|尿布|婴儿/,
  };
  for (const [cat, re] of Object.entries(catMap)) {
    if (re.test(text)) { ctx.category = cat; break; }
  }

  // 匹配具体商品
  ctx.product = PRODUCTS.find(p => text.includes(p.name.replace(/\s.*/, '')) || text.split(/\s+/).some(w => p.name.includes(w)));

  return ctx;
}

/* 意图路由匹配 */
function matchRoute(text, ctx) {
  // 售后类（最高优先）
  if (/退|换|修|维修|保养|投诉|差评|发票|开票/.test(text)) {
    if (/维修|保养|安装/.test(text)) return 'service';
    return 'aftersales';
  }
  // 订单/物流
  if (/订单|物流|快递|催单|发货|到哪|查单/.test(text)) return 'order';
  // 会员权益
  if (/会员|积分|权益|等级|VIP/.test(text)) return 'member';
  // 附近门店/自提
  if (ctx.hasLocation) return 'store';
  // 预约服务
  if (/预约|安装|上门/.test(text)) return 'service';
  // 价格/优惠
  if (/优惠|券|便宜|划算|满减|折扣|比价|凑单/.test(text)) return 'coupon';
  // 买具体商品
  if (ctx.product || /买|下单|购买|要.*[个件条盒]/.test(text)) return 'product';
  // 逛/搜
  if (/逛|搜|看看|推荐|有什么|榜单|排行/.test(text)) return 'search';
  // 默认首页
  return 'home';
}

/* 根据路由渲染对应页面 */
function renderPage(route, ctx, text) {
  const pages = {
    home: renderHome,
    product: renderProductDetail,
    search: renderSearch,
    coupon: renderCouponCenter,
    order: renderOrderDetail,
    aftersales: renderAfterSales,
    member: renderMember,
    store: renderStore,
    service: renderService,
  };
  return (pages[route] || renderHome)(ctx, text);
}

/* 小程序通用头尾 */
function mpShell(title, content, activeTab = 0) {
  const tabs = ['🏠 首页', '🗂 分类', '🛒 购物车', '👤 我的'];
  return `
    <div class="mini-header"><span>${title}</span><span class="mini-search">⌕</span></div>
    <div class="mp-page">${content}</div>
    <div class="mini-tabbar">${tabs.map((t, i) => `<div class="mini-tab ${i === activeTab ? 'active' : ''}">${t}</div>`).join('')}</div>
  `;
}

/* 首页 */
function renderHome(ctx) {
  const c = COMP_CONFIG;
  return mpShell('优选商城', `
    <div class="mini-banner">${c.banner}</div>
    <div class="mini-cats">${c.cats.map(cat => `<div class="mini-cat"><div class="cat-ico">${cat.ico}</div><span>${cat.name}</span></div>`).join('')}</div>
    ${c.seckill.length ? `
    <div class="mp-card" style="margin-top:10px">
      <div style="font-weight:700;margin-bottom:8px">⚡ 限时秒杀</div>
      <div style="display:flex;gap:8px;overflow-x:auto">
        ${c.seckill.map(s => `<div style="flex-shrink:0;text-align:center;width:80px">
          <div style="font-size:24px">🏷</div>
          <div style="font-size:11px;color:var(--muted)">${s.name}</div>
          <div style="color:#ef4444;font-weight:700;font-size:13px">¥${s.price}</div>
          <div style="font-size:10px;color:var(--muted);text-decoration:line-through">¥${s.original}</div>
        </div>`).join('')}
      </div>
    </div>` : ''}
    ${c.coupon.length ? `
    <div class="mp-card" style="margin-top:10px">
      <div style="font-weight:700;margin-bottom:8px">🎁 优惠券</div>
      ${c.coupon.map(cp => `<div class="mp-row"><span>${cp}</span><button class="mini-btn">领取</button></div>`).join('')}
    </div>` : ''}
    <div class="mini-products">${c.products.map(p => `
      <div class="mini-product"><div class="mp-img"><img src="${productImg(p)}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${p.img}'}))" /></div>
      <div class="mp-info"><div class="mp-title">${p.name}</div><div class="mp-price">¥${p.price}</div></div></div>
    `).join('')}</div>
  `);
}

/* 商品详情页 */
function renderProductDetail(ctx) {
  const p = ctx.product || PRODUCTS[1];
  const identityTips = {
    new: '<div class="mp-row"><span>🎁 新人礼</span><span>首单立减30元</span></div>',
    old: '<div class="mp-row"><span>👑 老客专享</span><span>复购价 ¥' + (p.price - 20) + '</span></div>',
    member: '<div class="mp-row"><span>💎 会员价</span><span>¥' + (p.price * 0.85).toFixed(0) + '（省¥' + (p.price * 0.15).toFixed(0) + '）</span></div>',
    price: '<div class="mp-row"><span>💰 凑单立减</span><span>满300减50，还差¥' + Math.max(0, 300 - p.price) + '</span></div>',
    gift: '<div class="mp-row"><span>🎀 送礼包装</span><span>免费礼盒+贺卡+定时达</span></div>',
    family: '<div class="mp-row"><span>👨‍👩‍👧 家庭装</span><span>3件8折，周期购更省</span></div>',
    enterprise: '<div class="mp-row"><span>🏢 企业采购</span><span>批量协议价+专票</span></div>',
    elderly: '<div class="mp-row"><span>📞 一键人工</span><span>操作不熟？点我转客服</span></div>',
    normal: '',
  };
  const stock = ctx.urgency === 'urgent' ? '附近门店有货，可自提' : '现货充足，48小时发货';
  return mpShell(p.name, `
    <div style="text-align:center;padding:12px 0"><img src="${productImg(p)}" alt="${p.name}" style="width:100%;max-height:240px;object-fit:cover;border-radius:12px" onerror="this.replaceWith(Object.assign(document.createElement('div'),{style:'font-size:60px;padding:20px 0',textContent:'${p.img}'}))" /></div>
    <div style="font-size:15px;font-weight:700">${p.name}</div>
    <div style="color:#ef4444;font-size:22px;font-weight:800;margin:8px 0">¥${p.price}
      <span class="mp-tag hot">${p.tag}</span></div>
    ${identityTips[ctx.identity] || ''}
    <div class="mp-card">
      <div class="mp-row"><span>📦 库存</span><span>${stock}</span></div>
      <div class="mp-row"><span>🚚 配送</span><span>${ctx.urgency === 'urgent' ? '即时配送·1小时达' : '顺丰·次日达'}</span></div>
      <div class="mp-row"><span>⭐ 评价</span><span>好评率96%（${p.sales}人已购）</span></div>
    </div>
    <button class="mp-btn">立即购买</button>
    <button class="mp-btn secondary">加入购物车</button>
  `);
}

/* 搜索/分类页 */
function renderSearch(ctx, text) {
  const items = PRODUCTS.slice(0, 8);
  return mpShell('搜索', `
    <div class="mini-banner">🔍 "${text}" 的搜索结果</div>
    <div class="mini-products">${items.map(p => `
      <div class="mini-product"><div class="mp-img"><img src="${productImg(p)}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${p.img}'}))" /></div>
      <div class="mp-info"><div class="mp-title">${p.name}</div><div class="mp-price">¥${p.price}</div></div></div>
    `).join('')}</div>
  `);
}

/* 优惠中心 */
function renderCouponCenter(ctx) {
  return mpShell('优惠中心', `
    <div class="mp-page-title">🎁 今日可领优惠券</div>
    <div class="mp-card"><div class="mp-row"><span>满300减50</span><button class="mini-btn">领取</button></div></div>
    <div class="mp-card"><div class="mp-row"><span>新人50元无门槛</span><button class="mini-btn">领取</button></div></div>
    <div class="mp-card"><div class="mp-row"><span>满99减10</span><button class="mini-btn">领取</button></div></div>
    <div class="mp-page-title" style="margin-top:16px">💡 凑单推荐</div>
    <div class="mini-products">${PRODUCTS.slice(0, 3).map(p => `
      <div class="mini-product"><div class="mp-img"><img src="${productImg(p)}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${p.img}'}))" /></div>
      <div class="mp-info"><div class="mp-title">${p.name}</div><div class="mp-price">¥${p.price}</div></div></div>
    `).join('')}</div>
  `);
}

/* 订单详情/物流 */
function renderOrderDetail(ctx, text) {
  return mpShell('订单详情', `
    <div class="mp-card">
      <div style="font-weight:700;margin-bottom:8px">订单号：20240913001</div>
      <div class="mp-row"><span>商品</span><span>${PRODUCTS[1].name}</span></div>
      <div class="mp-row"><span>数量</span><span>1件</span></div>
      <div class="mp-row"><span>金额</span><span>¥${PRODUCTS[1].price}</span></div>
      <div class="mp-row"><span>状态</span><span style="color:#16a34a">已发货</span></div>
    </div>
    <div class="mp-page-title">📦 物流跟踪</div>
    <div class="mp-card">
      <div class="mp-row"><span>09-13 14:20</span><span>【运输中】到达杭州转运中心</span></div>
      <div class="mp-row"><span>09-13 08:00</span><span>已揽收</span></div>
      <div class="mp-row"><span>预计明天送达</span><span>顺丰速运</span></div>
    </div>
    <button class="mp-btn">催单</button>
    <button class="mp-btn secondary">联系客服</button>
  `);
}

/* 售后页 */
function renderAfterSales(ctx, text) {
  const type = /退/.test(text) ? '退货退款' : /换/.test(text) ? '换货' : /投诉|差评/.test(text) ? '投诉' : '维修';
  return mpShell('售后中心', `
    <div class="mp-page-title">🛠 选择售后类型</div>
    <div class="mp-card">
      <div class="mp-row"><span>关联订单</span><span>#20240913001</span></div>
      <div class="mp-row"><span>商品</span><span>${PRODUCTS[1].name}</span></div>
    </div>
    <div class="mp-card">
      <div class="mp-row"><span>当前选择</span><span style="color:var(--primary);font-weight:700">${type}</span></div>
      <div class="mp-row"><span>处理时效</span><span>1-3个工作日</span></div>
      <div class="mp-row"><span>运费</span><span>质量问题商家承担</span></div>
    </div>
    <button class="mp-btn">提交${type}申请</button>
    <button class="mp-btn secondary">转人工客服</button>
  `);
}

/* 会员权益页 */
function renderMember(ctx) {
  return mpShell('会员中心', `
    <div class="mp-card" style="background:linear-gradient(135deg,#a78bfa,#6366f1);color:#fff">
      <div style="font-size:14px;opacity:.8">黄金会员</div>
      <div style="font-size:24px;font-weight:800;margin:4px 0">2,580 积分</div>
      <div style="font-size:12px;opacity:.8">再消费¥420升级铂金</div>
    </div>
    <div class="mp-page-title">💎 我的权益</div>
    <div class="mp-card">
      <div class="mp-row"><span>会员价</span><span>全场8.5折起</span></div>
      <div class="mp-row"><span>免邮</span><span>每月3次</span></div>
      <div class="mp-row"><span>优先客服</span><span>已开通</span></div>
      <div class="mp-row"><span>生日礼</span><span>¥50券待领</span></div>
    </div>
    <button class="mp-btn">积分兑换好礼</button>
  `);
}

/* 附近门店/自提 */
function renderStore(ctx) {
  return mpShell('附近门店', `
    <div class="mp-page-title">📍 距离最近的门店</div>
    <div class="mp-card">
      <div style="font-weight:700">优选商城·西湖店</div>
      <div style="color:var(--muted);font-size:12px;margin:4px 0">距您 0.8km · 步行10分钟</div>
      <div class="mp-row"><span>营业时间</span><span>09:00 - 22:00</span></div>
      <div class="mp-row"><span>库存状态</span><span style="color:#16a34a">有货，可自提</span></div>
      <div class="mp-row"><span>备货时间</span><span>约15分钟</span></div>
    </div>
    <div class="mp-card">
      <div style="font-weight:700">优选商城·滨江店</div>
      <div style="color:var(--muted);font-size:12px;margin:4px 0">距您 2.3km · 驾车8分钟</div>
      <div class="mp-row"><span>库存状态</span><span style="color:#16a34a">有货</span></div>
    </div>
    <button class="mp-btn">导航去门店</button>
    <button class="mp-btn secondary">线上下单·到店自提</button>
  `);
}

/* 服务预约 */
function renderService(ctx, text) {
  const type = /安装/.test(text) ? '上门安装' : /维修/.test(text) ? '维修' : '保养';
  return mpShell('服务预约', `
    <div class="mp-page-title">🔧 ${type}预约</div>
    <div class="mp-card">
      <div class="mp-row"><span>服务类型</span><span>${type}</span></div>
      <div class="mp-row"><span>服务商品</span><span>${ctx.product ? ctx.product.name : '家电'}</span></div>
      <div class="mp-row"><span>服务师傅</span><span>张师傅（五星·328单）</span></div>
      <div class="mp-row"><span>上门时间</span><span>${ctx.urgency === 'urgent' ? '今天 18:00-20:00' : '明天 09:00-11:00'}</span></div>
      <div class="mp-row"><span>服务费用</span><span>¥0（含在商品价内）</span></div>
      <div class="mp-row"><span>保障</span><span>30天质保</span></div>
    </div>
    <button class="mp-btn">确认预约</button>
    <button class="mp-btn secondary">换个时间</button>
  `);
}

/* 生成调度摘要（自然语言告诉用户打开了什么、为什么） */
function buildSummary(route, ctx, text) {
  const routeNames = {
    home: '首页', product: '商品详情', search: '搜索结果', coupon: '优惠中心',
    order: '订单详情', aftersales: '售后中心', member: '会员中心',
    store: '附近门店', service: '服务预约',
  };
  const identityNames = {
    new: '新客', old: '老客', member: '会员', price: '价格敏感型',
    gift: '送礼', family: '家庭', enterprise: '企业采购', elderly: '需要简化操作', normal: '',
  };
  const urgencyNames = { urgent: '急用', scheduled: '预约/定时', normal: '' };

  let reason = `我按你的需求，直接打开了<strong>${routeNames[route]}</strong>`;
  const details = [];
  if (ctx.product) details.push(`关联商品「${ctx.product.name}」`);
  if (ctx.category) details.push(`品类：${ctx.category}`);
  if (identityNames[ctx.identity]) details.push(`身份：${identityNames[ctx.identity]}`);
  if (urgencyNames[ctx.urgency]) details.push(`时效：${urgencyNames[ctx.urgency]}`);

  if (details.length) reason += '，' + details.join('，');

  const actions = {
    product: '你现在可以选规格、看评价，直接下单',
    search: '你现在可以浏览搜索结果，挑喜欢的',
    coupon: '你现在可以领券、凑单，到手价更划算',
    order: '你现在可以看物流进度、催单或联系客服',
    aftersales: '已关联你的订单，现在可以提交售后申请',
    member: '你现在可以看积分、领权益、兑换好礼',
    store: '你现在可以导航去门店或下单自提',
    service: '你现在可以确认时间，预约师傅上门',
    home: '你可以随便逛逛',
  };

  return `${reason}。${actions[route] || ''}`;
}

/* ========== 装修组件编辑器 ========== */
function openCompEditor(type) {
  currentCompType = type;
  $('#compEditorTitle').textContent = `编辑 · ${COMP_TITLES[type]}`;
  $('#compEditorBody').innerHTML = buildCompForm(type);
  $('#compEditorModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCompEditor() {
  $('#compEditorModal').classList.remove('show');
  document.body.style.overflow = '';
}

/* 根据组件类型生成编辑表单 */
function buildCompForm(type) {
  const c = COMP_CONFIG;
  if (type === 'banner') {
    return `<div class="comp-field">
      <label>轮播文案</label>
      <input class="input" id="f_banner" value="${c.banner}" />
    </div>`;
  }
  if (type === 'cats') {
    return `<div class="comp-item-list" id="f_cats">${c.cats.map((cat, i) => `
      <div class="comp-item-row">
        <input class="input" data-field="ico" value="${cat.ico}" style="width:60px;text-align:center" />
        <input class="input" data-field="name" value="${cat.name}" />
        <button class="ghost-btn sm" onclick="this.parentElement.remove()">删除</button>
      </div>`).join('')}</div>
      <button class="comp-add-btn" onclick="addCatRow()">+ 添加分类</button>`;
  }
  if (type === 'seckill') {
    return `<div class="comp-item-list" id="f_seckill">${c.seckill.map(s => `
      <div class="comp-item-row">
        <input class="input" data-field="name" value="${s.name}" placeholder="商品名" />
        <input class="input" data-field="price" value="${s.price}" placeholder="秒杀价" style="width:80px" />
        <input class="input" data-field="original" value="${s.original}" placeholder="原价" style="width:80px" />
        <button class="ghost-btn sm" onclick="this.parentElement.remove()">删除</button>
      </div>`).join('')}</div>
      <button class="comp-add-btn" onclick="addSeckillRow()">+ 添加秒杀商品</button>`;
  }
  if (type === 'coupon') {
    return `<div class="comp-item-list" id="f_coupon">${c.coupon.map(cp => `
      <div class="comp-item-row">
        <input class="input" data-field="title" value="${cp}" placeholder="如：满300减50" />
        <button class="ghost-btn sm" onclick="this.parentElement.remove()">删除</button>
      </div>`).join('')}</div>
      <button class="comp-add-btn" onclick="addCouponRow()">+ 添加优惠券</button>`;
  }
  if (type === 'products') {
    return `<div class="comp-item-list" id="f_products">${c.products.map(p => `
      <div class="comp-item-row">
        <input class="input" data-field="img" value="${p.img}" style="width:60px;text-align:center" />
        <input class="input" data-field="name" value="${p.name}" placeholder="商品名" />
        <input class="input" data-field="price" value="${p.price}" placeholder="价格" style="width:80px" />
        <button class="ghost-btn sm" onclick="this.parentElement.remove()">删除</button>
      </div>`).join('')}</div>
      <button class="comp-add-btn" onclick="addProductRow()">+ 添加商品</button>`;
  }
  return '';
}

function addCatRow() {
  $('#f_cats').insertAdjacentHTML('beforeend',
    `<div class="comp-item-row"><input class="input" data-field="ico" value="🏷" style="width:60px;text-align:center" /><input class="input" data-field="name" value="新分类" /><button class="ghost-btn sm" onclick="this.parentElement.remove()">删除</button></div>`);
}
function addSeckillRow() {
  $('#f_seckill').insertAdjacentHTML('beforeend',
    `<div class="comp-item-row"><input class="input" data-field="name" value="新商品" placeholder="商品名" /><input class="input" data-field="price" value="99" placeholder="秒杀价" style="width:80px" /><input class="input" data-field="original" value="199" placeholder="原价" style="width:80px" /><button class="ghost-btn sm" onclick="this.parentElement.remove()">删除</button></div>`);
}
function addCouponRow() {
  $('#f_coupon').insertAdjacentHTML('beforeend',
    `<div class="comp-item-row"><input class="input" data-field="title" value="新优惠券" placeholder="如：满300减50" /><button class="ghost-btn sm" onclick="this.parentElement.remove()">删除</button></div>`);
}
function addProductRow() {
  $('#f_products').insertAdjacentHTML('beforeend',
    `<div class="comp-item-row"><input class="input" data-field="img" value="📦" style="width:60px;text-align:center" /><input class="input" data-field="name" value="新商品" placeholder="商品名" /><input class="input" data-field="price" value="99" placeholder="价格" style="width:80px" /><button class="ghost-btn sm" onclick="this.parentElement.remove()">删除</button></div>`);
}

/* 保存编辑并刷新首页预览 */
function saveCompEditor() {
  const type = currentCompType;
  if (type === 'banner') {
    COMP_CONFIG.banner = $('#f_banner').value || '🔥 欢迎光临';
  } else if (type === 'cats') {
    COMP_CONFIG.cats = [...$$('#f_cats .comp-item-row')].map(row => ({
      ico: row.querySelector('[data-field="ico"]').value || '🏷',
      name: row.querySelector('[data-field="name"]').value || '分类',
    }));
  } else if (type === 'seckill') {
    COMP_CONFIG.seckill = [...$$('#f_seckill .comp-item-row')].map(row => ({
      name: row.querySelector('[data-field="name"]').value || '商品',
      price: row.querySelector('[data-field="price"]').value || 0,
      original: row.querySelector('[data-field="original"]').value || 0,
    }));
  } else if (type === 'coupon') {
    COMP_CONFIG.coupon = [...$$('#f_coupon .comp-item-row')].map(row =>
      row.querySelector('[data-field="title"]').value || '优惠券'
    );
  } else if (type === 'products') {
    COMP_CONFIG.products = [...$$('#f_products .comp-item-row')].map(row => ({
      img: row.querySelector('[data-field="img"]').value || '📦',
      name: row.querySelector('[data-field="name"]').value || '商品',
      price: row.querySelector('[data-field="price"]').value || 0,
    }));
  }
  closeCompEditor();
  // 刷新首页预览
  $('#miniContent').innerHTML = renderHome({});
  toast('已保存，预览已更新~', 'success');
}
