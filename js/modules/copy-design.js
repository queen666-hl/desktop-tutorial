/* 文案视频设计 — 多版本方案集，支持重新生成 */
function init_copy_design() {
  if (window._cdInited) return;
  renderTemplates();
  $$('#contentType .chip').forEach(c => c.addEventListener('click', () => {
    $$('#contentType .chip').forEach(x => x.classList.remove('active'));
    c.classList.add('active');
  }));
  $('#genContent').addEventListener('click', generateContent);
  window._cdInited = true;
}

function renderTemplates() {
  const gradients = [
    'linear-gradient(135deg,#6366f1,#22d3ee)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#10b981,#22d3ee)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
    'linear-gradient(135deg,#fb7185,#f59e0b)',
    'linear-gradient(135deg,#06b6d4,#3b82f6)',
    'linear-gradient(135deg,#84cc16,#10b981)',
    'linear-gradient(135deg,#a78bfa,#6366f1)',
  ];
  $('#templateGrid').innerHTML = TEMPLATES.map((t, i) =>
    `<div class="template-card" style="background:${gradients[i]}" onclick="toast('模板「${t}」已套用，开整~', 'info')">${t}</div>`
  ).join('');
}

/* 构建图片生成 prompt */
function buildImagePrompt(theme, style, audience, isVideo, variantName) {
  const sceneMap = {
    '活力年轻': '青春活力，阳光明亮，色彩鲜艳',
    '高端轻奢': '高级质感，简洁大气，光影精致',
    '温馨治愈': '温暖柔和，自然光，舒适治愈',
    '专业严谨': '商务专业，干净利落，科技感',
  };
  const scene = sceneMap[style] || '时尚现代';
  const variantHint = variantName || '';
  if (isVideo) {
    return `${theme}产品短视频封面，${scene}风格，${variantHint}，面向${audience}，画面冲击力强，吸引眼球，真实场景拍摄质感，高清，广告级画质`;
  }
  return `${theme}产品营销海报，${scene}风格，${variantHint}，目标人群${audience}，真实自然不做作，高质量广告设计，专业摄影`;
}

/* ===== 各内容类型的多版本方案池 ===== */
const VERSIONS = {
  '文案': [
    {
      name: 'AIDA 转化型',
      desc: '注意→兴趣→欲望→行动，驱动下单',
      fn: (theme, style, audience) => `【AIDA 转化型文案】

🎯 注意 Attention
${audience}注意了！这款${theme}正在悄悄改变你的日常。

💡 兴趣 Interest
还在为传统方案的种种不便烦恼吗？
${theme}用全新思路重新定义体验，轻盈如羽，却强大到足以改变日常。

🔥 欲望 Desire
• 行业领先技术，体验感拉满
• 匠心工艺，细节经得起推敲
• ${audience}的共同选择，好评率 98%

⚡ 行动 Action
限时福利：前 1000 名立减 ¥100，加赠周边礼包
👉 立即抢购，开启焕新之旅！`
    },
    {
      name: '痛点共鸣型',
      desc: '直击痛点，引发强烈共鸣',
      fn: (theme, style, audience) => `【痛点共鸣型文案】

😩 你是不是也这样？
每次遇到老问题都无奈摇头，
花了钱却没得到想要的体验……

直到遇见 ${theme} ——
它把你抱怨过的每个细节，都悄悄解决了。

✨ 解决了什么？
→ 曾经的麻烦，现在一键搞定
→ 曾经的将就，现在变成享受
→ 曾经的昂贵，现在性价比爆棚

${audience}都说：用过就回不去了。
今天下单，明天开始新体验。`
    },
    {
      name: '故事种草型',
      desc: '用真实故事打动人心',
      fn: (theme, style, audience) => `【故事种草型文案】

上周朋友来我家，一眼就盯上了我的 ${theme}。
"你这也太会买了吧！在哪入的？"

其实我也是被种草的。
第一次用就惊了——原来还能这么舒服/方便/好看。

说几个真实感受：
① 拿到手质感绝了，完全不像这个价位
② 用了一周，身边人都在问链接
③ ${style}的设计，放哪都好看

现在它已经成了我生活里离不开的小东西。
真心推荐给 ${audience} 的你，入股不亏~`
    },
  ],

  '海报': [
    { name: '大字报促销风', desc: '大字幕+高对比，瞬间抓眼', variant: '大字报风格，醒目大标题，促销氛围', isImage: true },
    { name: '极简杂志风', desc: '留白+高级感，品牌调性', variant: '极简杂志风格，大量留白，高级质感', isImage: true },
    { name: '潮流撞色风', desc: '撞色+潮酷，年轻吸睛', variant: '潮流撞色风格，鲜艳色彩，年轻时尚', isImage: true },
  ],

  '小红书': [
    {
      name: '真实体验种草',
      desc: '第一人称+细节+标签',
      fn: (theme, style, audience) => `【小红书 · 真实体验种草】

📌 标题：${audience}必入！这个${theme}我后悔没早买😭

姐妹们！今天必须安利这个宝藏——${theme}！

💖 真实感受：
拿到手第一感觉：这也太值了吧！
质感不输大牌，价格只要一半。

✨ 亮点1：设计绝美
${style}外观，随手一拍都是大片
发朋友圈被问爆链接！

✨ 亮点2：实力能打
用过才懂什么叫相见恨晚
细节控狂喜，每个设计都恰到好处

✨ 亮点3：性价比天花板
这价位这品质，偷偷乐出声🤫

📝 适合${audience}，闭眼入不踩雷
冲就完事了！

#好物分享 #${theme.replace(/\s/g,'')} #种草 #${style}风`
    },
    {
      name: '干货测评向',
      desc: '参数+对比+购买建议',
      fn: (theme, style, audience) => `【小红书 · 干货测评】

📌 标题：扒一扒${theme}到底值不值得买？实测来了

最近风很大的${theme}，我用了半个月来交作业！

🔍 实测维度：
① 颜值：${style}风，拍照出片率⭐⭐⭐⭐⭐
② 实用：日常使用频率高，不鸡肋
③ 质量：用了半个月没毛病，做工扎实
④ 价格：对比同类，性价比偏高

📊 适合人群：${audience}
❌ 不适合：追求极致XX的可以再看看

💡 购买建议：
有活动时囤最划算，平时价也可入
建议优先选XX色/XX款，更百搭

真实测评，理性种草~
#测评 #${theme.replace(/\s/g,'')} #干货分享`
    },
  ],

  '种草': [
    {
      name: '痛点→方案型',
      desc: '挖掘痛点→引入方案→效果验证',
      fn: (theme, style, audience) => `【种草视频 · 痛点解决型】

😣 痛点挖掘
有没有跟我一样，一直被XX问题困扰？
试了各种办法都没用，都快放弃了……

🌟 解决方案
直到闺蜜给我安利了 ${theme}
本来没抱期望，结果真香！

🔍 深度体验
• 外观：${style}设计，质感在线
• 操作：上手零难度，老人都能用
• 场景：在家/出门都能用，不挑环境

✅ 效果验证
用了一周，困扰我的问题真的改善了！
前后对比差距肉眼可见（有图有真相）

🛒 哪买？
搜索「${theme}」就能找到，现在还有活动
真心推荐给${audience}的你，这波不亏！`
    },
    {
      name: '朋友安利型',
      desc: '朋友口吻+多维度展示+UGC',
      fn: (theme, style, audience) => `【种草视频 · 朋友安利型】

宝子们！今天必须按头安利这个 ${theme}！

我以人头担保，真的好用👇

🎨 外观细节
${style}的设计，拿在手里就觉得高级
每个角度都好看，放哪都提升格调

⚙️ 操作过程
操作巨简单，看一眼就会
用的时候那种顺滑感，谁懂啊！

🌈 多场景应用
在家用、带出门、送朋友都行
不同场景都能打，不是那种买了吃灰的东西

👂 用户真实反馈
"用了就回不去了"
"这价格这品质，绝了"
"已经推荐给三个朋友了"

📍 关键词搜「${theme}」，${audience}闭眼冲！`
    },
  ],
};

/* 随机打乱版本顺序（重新生成时用） */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let currentType = '';
let currentTheme = '';
let currentStyle = '';
let currentAudience = '';

function generateContent() {
  currentTheme = $('#aiTheme').value;
  currentStyle = $('#aiStyle').value;
  currentAudience = $('#aiAudience').value;
  currentType = $('#contentType .chip.active').dataset.type;

  const versions = shuffle(VERSIONS[currentType] || []);
  const el = $('#genResult');

  if (!versions.length) {
    el.innerHTML = `<div class="empty-hint">这个类型还没有方案，换一个试试？</div>`;
    return;
  }

  // 文案/小红书/种草走文本；海报/视频走图片
  if (currentType === '海报' || currentType === '视频') {
    el.innerHTML = `<div class="empty-hint">AI 正在出图，稍等一下下~ 🎨</div>`;
    generateImageVersions(versions);
  } else {
    el.innerHTML = renderVersionCards(versions);
    bindVersionActions(versions);
    toast(`生成了 ${versions.length} 个版本，挑一个喜欢的~`, 'success');
  }
}

/* 渲染文本版本卡片 */
function renderVersionCards(versions) {
  return `<div class="version-grid">${versions.map((v, i) => {
    const content = v.fn ? v.fn(currentTheme, currentStyle, currentAudience) : '';
    return `
    <div class="version-card" data-idx="${i}">
      <div class="version-head">
        <div>
          <div class="version-name">${v.name}</div>
          <div class="version-desc">${v.desc}</div>
        </div>
        <div class="version-actions">
          <button class="mini-btn" onclick="copyVersion(${i})">复制</button>
          <button class="mini-btn ghost" onclick="regenerateVersion(${i})">↻ 换一个</button>
          <button class="mini-btn danger" onclick="deleteVersion(${i})">删除</button>
        </div>
      </div>
      <pre class="version-content">${content}</pre>
    </div>`;
  }).join('')}</div>`;
}

/* 复制单个版本 */
function copyVersion(idx) {
  const card = document.querySelector(`.version-card[data-idx="${idx}"]`);
  if (!card) return;
  const text = card.querySelector('.version-content').innerText;
  copyText(text);
  toast('已复制到剪贴板~', 'success');
}

/* 重新生成单个版本 */
function regenerateVersion(idx) {
  const type = currentType;
  const versions = VERSIONS[type];
  // 随机选一个不同的版本
  let pool = versions.filter((_, i) => i !== parseInt(idx));
  const pick = pool[Math.floor(Math.random() * pool.length)];
  const card = document.querySelector(`.version-card[data-idx="${idx}"]`);
  if (!card || !pick) return;
  card.querySelector('.version-name').textContent = pick.name;
  card.querySelector('.version-desc').textContent = pick.desc;
  if (pick.fn) {
    card.querySelector('.version-content').textContent = pick.fn(currentTheme, currentStyle, currentAudience);
  }
  toast('换了一个新版本~', 'info');
}

function bindVersionActions() {}

/* 删除单个版本卡片（从DOM中移除，对应操作数据数组） */
function deleteVersion(idx) {
  const card = document.querySelector(`.version-card[data-idx="${idx}"]`);
  if (!card) return;
  if (!confirm('确定删除这个版本吗？')) return;
  card.style.transition = 'all .3s';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.9)';
  setTimeout(() => {
    card.remove();
    // 如果全部删完了，提示用户
    const remaining = document.querySelectorAll('.version-card').length;
    if (remaining === 0) {
      $('#genResult').innerHTML = `<div class="empty-hint">所有版本已删除，重新生成试试？</div>`;
    }
    toast('已删除', 'success');
  }, 280);
}

/* ===== 图片版本（海报/视频） ===== */
function generateImageVersions(versions) {
  const el = $('#genResult');
  el.innerHTML = `<div class="version-grid" id="imgVersionGrid"></div>`;
  const grid = $('#imgVersionGrid');

  versions.forEach((v, i) => {
    // 插入占位卡片
    const card = document.createElement('div');
    card.className = 'version-card';
    card.dataset.idx = i;
    card.innerHTML = `
      <div class="version-head">
        <div>
          <div class="version-name">${v.name}</div>
          <div class="version-desc">${v.desc}</div>
        </div>
        <div class="version-actions">
          <button class="mini-btn" onclick="regenerateImgVersion(${i})">↻ 换一张</button>
          <button class="mini-btn danger" onclick="deleteVersion(${i})">删除</button>
        </div>
      </div>
      <div class="version-image" id="vimg-${i}">
        <div class="empty-hint" style="padding:40px 0">生成中...</div>
      </div>
      ${v.script ? `<pre class="version-content" style="margin-top:10px">${v.script(currentTheme, currentStyle, currentAudience)}</pre>` : ''}
    `;
    grid.appendChild(card);

    // 生成图片
    const isVideo = currentType === '视频';
    const prompt = encodeURIComponent(buildImagePrompt(currentTheme, currentStyle, currentAudience, isVideo, v.variant));
    const size = isVideo ? 'landscape_16_9' : 'portrait_4_3';
    const url = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=${size}`;

    const img = new Image();
    img.onload = () => {
      const container = $(`#vimg-${i}`);
      if (isVideo) {
        container.innerHTML = `
          <div class="video-frame" onclick="openVideoPlayer('${url}','${currentTheme} - ${v.name}','${v.script ? encodeURIComponent(v.script(currentTheme, currentStyle, currentAudience)) : ''}')">
            <img src="${url}" alt="${currentTheme}" />
            <div class="video-play">▶</div>
            <div class="video-meta">
              <span class="video-dur">00:15</span>
              <span class="video-badge">${v.name}</span>
            </div>
          </div>`;
      } else {
        container.innerHTML = `<img src="${url}" alt="${currentTheme}" style="width:100%;border-radius:10px" />`;
      }
    };
    img.onerror = () => {
      $(`#vimg-${i}`).innerHTML = `<div class="empty-hint" style="padding:40px 0">生成失败，点"换一张"重试</div>`;
    };
    img.src = url;
  });

  toast(`生成了 ${versions.length} 个版本，挑一个喜欢的~`, 'success');
}

/* 重新生成某张图片 */
function regenerateImgVersion(idx) {
  const versions = VERSIONS[currentType];
  const v = versions[idx];
  if (!v) return;
  const container = $(`#vimg-${idx}`);
  container.innerHTML = `<div class="empty-hint" style="padding:40px 0">重新生成中...</div>`;

  const isVideo = currentType === '视频';
  const prompt = encodeURIComponent(buildImagePrompt(currentTheme, currentStyle, currentAudience, isVideo, v.variant + ' 变化版'));
  const size = isVideo ? 'landscape_16_9' : 'portrait_4_3';
  const url = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${prompt}&image_size=${size}`;

  const img = new Image();
  img.onload = () => {
    if (isVideo) {
      container.innerHTML = `
        <div class="video-frame" onclick="openVideoPlayer('${url}','${currentTheme} - ${v.name}','')">
          <img src="${url}" alt="${currentTheme}" />
          <div class="video-play">▶</div>
          <div class="video-meta">
            <span class="video-dur">00:15</span>
            <span class="video-badge">${v.name}</span>
          </div>
        </div>`;
    } else {
      container.innerHTML = `<img src="${url}" alt="${currentTheme}" style="width:100%;border-radius:10px" />`;
    }
  };
  img.onerror = () => {
    container.innerHTML = `<div class="empty-hint" style="padding:40px 0">生成失败，再试一次</div>`;
  };
  img.src = url;
}

/* ========== 视频播放器（增强版：动态文字特效） ========== */
let videoTimer = null;
let videoPlaying = false;
let videoProgress = 0;
const VIDEO_DURATION = 15;
let videoScriptText = '';

function openVideoPlayer(url, title, scriptEncoded) {
  const modal = $('#videoPlayerModal');
  $('#vpImage').src = url;
  $('#vpTitle').textContent = title || '视频预览';
  videoScriptText = scriptEncoded ? decodeURIComponent(scriptEncoded) : '';
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  videoProgress = 0;
  updateVideoUI();
  updateVideoOverlay(0);
  playVideo();
}

function closeVideoPlayer() {
  $('#videoPlayerModal').classList.remove('show');
  document.body.style.overflow = '';
  pauseVideo();
}

function playVideo() {
  if (videoPlaying) return;
  videoPlaying = true;
  $('#vpPlayBtn').textContent = '⏸';
  $('#vpImage').classList.add('vp-animating');
  videoTimer = setInterval(() => {
    videoProgress += 0.1;
    if (videoProgress >= VIDEO_DURATION) {
      videoProgress = VIDEO_DURATION;
      pauseVideo();
    }
    updateVideoUI();
    updateVideoOverlay(videoProgress);
  }, 100);
}

function pauseVideo() {
  videoPlaying = false;
  $('#vpPlayBtn').textContent = '▶';
  $('#vpImage').classList.remove('vp-animating');
  if (videoTimer) { clearInterval(videoTimer); videoTimer = null; }
}

function toggleVideoPlay() {
  if (videoProgress >= VIDEO_DURATION) { videoProgress = 0; }
  videoPlaying ? pauseVideo() : playVideo();
}

function seekVideo(e) {
  const bar = $('#vpProgressBar');
  const rect = bar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  videoProgress = Math.max(0, Math.min(VIDEO_DURATION, pct * VIDEO_DURATION));
  updateVideoUI();
  updateVideoOverlay(videoProgress);
}

function updateVideoUI() {
  const pct = (videoProgress / VIDEO_DURATION) * 100;
  $('#vpProgressFill').style.width = pct + '%';
  const cur = formatTime(videoProgress);
  $('#vpTime').textContent = `${cur} / 00:${VIDEO_DURATION < 10 ? '0' : ''}${VIDEO_DURATION}`;
}

/* 动态文字特效：根据播放进度显示不同字幕 */
function updateVideoOverlay(t) {
  const overlay = $('#vpOverlay');
  if (!videoScriptText) { overlay.style.opacity = 0; return; }
  // 从脚本中提取字幕行，按时间段显示
  const lines = videoScriptText.split('\n').filter(l => l.trim() && !l.startsWith('【') && !l.startsWith('运镜') && !l.startsWith('画面') && !l.startsWith('BGM'));
  const subtitleLines = lines.filter(l => /^(字幕|旁白|[AB]?台词)/.test(l.trim()));
  if (subtitleLines.length === 0) { overlay.style.opacity = 0; return; }
  const per = VIDEO_DURATION / subtitleLines.length;
  const idx = Math.min(subtitleLines.length - 1, Math.floor(t / per));
  let text = subtitleLines[idx].replace(/^(字幕|旁白|[AB]?台词)[：:]?\s*/, '').replace(/[「」""]/g, '');
  overlay.textContent = text;
  overlay.style.opacity = 1;
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`;
}
