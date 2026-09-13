/* 商品搜索推荐 */
function init_search() {
  if (window._searchInited) return;
  renderRecommend();
  // 默认展示跨品类精选，不全是数码
  const defaultList = [PRODUCTS[0], PRODUCTS[2], PRODUCTS[18], PRODUCTS[24], PRODUCTS[30], PRODUCTS[41]];
  renderProducts(defaultList);
  $('#doSearch').addEventListener('click', doSearch);
  $('#productSearch').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  $$('.hot-word').forEach(w => w.addEventListener('click', () => {
    $('#productSearch').value = w.textContent;
    doSearch();
  }));
  window._searchInited = true;
}

function doSearch() {
  const q = $('#productSearch').value.trim().toLowerCase();
  let results;
  if (!q) {
    results = PRODUCTS;
  } else {
    // ===== 第一层：商品名精确匹配 =====
    let exact = PRODUCTS.filter(p => p.name.toLowerCase().includes(q));

    // ===== 第二层：完整关键词命中商品名（用完整词，不用单字，避免误匹配） =====
    const phoneBrands = ['iPhone','华为','小米','三星','OPPO','vivo','一加'];
    const keywordHits = [
      '耳机','防晒衣','运动鞋','跑步鞋','口红','牛奶','奶粉','奶瓶','湿巾',
      '蓝莓','车厘子','芒果','苹果','牛排','大闸蟹',
      '抽纸','纸巾','洗衣液','牙膏','沐浴露','保鲜膜',
      '空气炸锅','空调','冰箱','扫地机器人','吹风机','电动牙刷',
      '平板','手表','相机','充电器','鼠标',
      '精华','眼霜','粉底液','神仙水',
      '坚果','气泡水','凤爪','咖啡',
      '四件套','收纳箱','落地灯','沙发','连衣裙','外套'
    ];
    let kwMatch = PRODUCTS.filter(p => keywordHits.some(k => q.includes(k) && p.name.toLowerCase().includes(k)));
    // 搜"手机"时匹配所有手机品牌商品（排除手表/平板/机器人等同名品牌非手机产品）
    if (q.includes('手机')) {
      const notPhone = ['手表','Pad','pad','机器人','扫地','平板','耳机','相机','充电'];
      kwMatch = kwMatch.concat(PRODUCTS.filter(p =>
        phoneBrands.some(b => p.name.includes(b)) &&
        !notPhone.some(n => p.name.includes(n))
      ));
    }

    // 合并精确 + 关键词命中
    results = [...new Map([...exact, ...kwMatch].map(p => [p.id, p])).values()];

    // ===== 第三层：以上都没结果，才按品类兜底 =====
    if (results.length === 0) {
      const catMap = {
        数码: ['手机','耳机','手表','平板','相机','充电','数码','鼠标'],
        服饰: ['衣','服','鞋','裙','裤','防晒','服饰','外套','连衣裙'],
        家电: ['锅','空调','冰箱','机器人','吹风','牙刷','家电','炸锅'],
        美妆: ['口红','精华','眼霜','粉底','神仙水','美妆','护肤'],
        母婴: ['奶粉','尿裤','奶瓶','湿巾','海马','母婴','宝宝','婴儿'],
        生鲜: ['蓝莓','车厘子','芒','苹果','牛排','蟹','水果','生鲜'],
        日用: ['纸','洗衣液','牙膏','沐浴露','保鲜膜','日用'],
        食品: ['坚果','气泡水','牛奶','凤爪','咖啡','食品'],
        家居: ['四件套','收纳','灯','沙发','家居'],
      };
      let matched = [];
      for (const [cat, kws] of Object.entries(catMap)) {
        if (kws.some(k => q.includes(k))) matched = matched.concat(PRODUCTS.filter(p => p.cat === cat));
      }
      results = [...new Map(matched.map(p => [p.id, p])).values()];
    }
  }
  // 按销量排序
  results = results.sort((a, b) => b.sales - a.sales);

  if (results.length === 0) {
    // 没有任何匹配时，显示空状态，不胡乱展示无关商品
    $('#productList').innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--muted)">
      <div style="font-size:48px;margin-bottom:12px">🔍</div>
      <div style="font-size:16px;margin-bottom:8px">没找到跟"${q}"相关的商品</div>
      <div style="font-size:13px">换个关键词试试，或者看看下面的推荐好物~</div>
    </div>`;
    $('#resultCount').textContent = '共 0 件商品';
    toast('没搜到相关商品，换个词试试~', 'info');
    return;
  }

  renderProducts(results);
  $('#resultCount').textContent = `共 ${results.length} 件商品`;
  toast(`挖到 ${results.length} 件好货，瞅瞅？`, 'success');
}

function renderProducts(list) {
  $('#productList').innerHTML = list.map(p => productCard(p)).join('');
}

function renderRecommend() {
  const rec = [...PRODUCTS].sort(() => Math.random() - .5).slice(0, 4);
  $('#recommendList').innerHTML = rec.map(p => productCard(p)).join('');
}

function productCard(p) {
  return `<div class="product-card" onclick="toast('已加入购物车：${p.name}，买买买！', 'success')">
    <div class="product-img" style="padding:0;background:#fff">
      <img src="${productImg(p)}" alt="${p.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover;border-radius:8px" onerror="this.style.display='none';this.parentElement.innerHTML='<div style=\\'display:flex;align-items:center;justify-content:center;height:100%;font-size:40px\\'>${p.img}</div>'" />
    </div>
    <div class="product-info">
      <div class="product-title">${p.name}</div>
      <div class="product-meta">已售 ${fmt(p.sales)} · <span style="color:var(--primary)">${p.tag}</span></div>
      <div class="product-price">¥${p.price}</div>
    </div>
  </div>`;
}
