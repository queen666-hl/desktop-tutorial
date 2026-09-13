/* 商品介绍生成 */
function init_product_desc() {
  if (window._pdInited) return;
  $('#pdLength').addEventListener('input', e => $('#pdLenVal').textContent = e.target.value);
  $$('#pdPlatform .chip').forEach(c => c.addEventListener('click', () => {
    $$('#pdPlatform .chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
  }));
  $('#genDesc').addEventListener('click', generateDesc);
  $('#copyDesc').addEventListener('click', () => {
    const text = $('#descResult').innerText;
    if (text && text !== '填写商品信息后点击生成') copyText(text);
  });
  window._pdInited = true;
}

function generateDesc() {
  const name = $('#pdName').value;
  const features = $('#pdFeatures').value.split(/[,，]/).map(s => s.trim()).filter(Boolean);
  const platform = $('#pdPlatform .chip.active').textContent;
  const len = +$('#pdLength').value;

  const featureHtml = features.map(f => `<li>✅ <b>${f}</b> — 为您带来极致体验</li>`).join('');

  const desc = `【${platform}专用商品详情】

🏷 商品名称：${name}

━━━━━━━━━━━━━━━━━━━━

🔥 商品亮点

${features.map(f => `• ${f}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━

📖 详细介绍

${name}，为追求品质生活的您精心打造。

我们深知，每一个细节都关乎体验。因此，从选材到工艺，从设计到测试，我们倾注了全部心血。${features[0] || '卓越的品质'}，让您的每一次使用都成为享受。

核心优势：

<ol style="line-height:2">${featureHtml}</ol>

━━━━━━━━━━━━━━━━━━━━

💎 品质保证

• 正品保障，假一赔十
• 7 天无理由退换货
• 全国联保，售后无忧
• 专业客服 7×24 在线

━━━━━━━━━━━━━━━━━━━━

🎁 购买即享

1. 限时特惠价
2. 精美原装包装
3. 专属客服一对一服务
4. 会员积分翻倍

${name}，不只是一件商品，更是一种生活态度。

立即下单，开启您的品质之旅！🚀`;

  $('#descResult').innerHTML = desc.replace(/\n/g, '<br>');
  toast(`详情页文案搞定（约 ${len} 字），复制走你`, 'success');
}
