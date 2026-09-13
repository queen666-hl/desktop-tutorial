/* ============================================================
   data.js — 共享 Mock 数据 & 工具函数
   ============================================================ */

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min, max) => +(Math.random() * (max - min) + min).toFixed(2);
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const fmt = n => n.toLocaleString('zh-CN');

/* 生成商品实物图 URL */
function productImg(p) {
  const prompt = `${p.name}，电商商品实拍图，白底，高清，专业产品摄影`;
  return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square`;
}

/* ---------- Toast ---------- */
function toast(msg, type = 'info') {
  const wrap = $('#toastContainer');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const ico = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  t.innerHTML = `<span>${ico}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(100%)'; setTimeout(() => t.remove(), 250); }, 2400);
}

/* ---------- 复制 ---------- */
function copyText(text) {
  if (navigator.clipboard) navigator.clipboard.writeText(text);
  else {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove();
  }
  toast('已复制到剪贴板', 'success');
}

/* ---------- KPI 排行 ---------- */
const RANK_CATEGORIES = [
  { name: '美妆个护', value: 2846 },
  { name: '生鲜果蔬', value: 2310 },
  { name: '日用百货', value: 1986 },
  { name: '数码家电', value: 1654 },
  { name: '服饰鞋包', value: 1432 },
  { name: '母婴用品', value: 1128 },
  { name: '食品饮料', value: 986 },
];

/* ---------- 实时动态 ---------- */
const FEED_TEMPLATES = [
  { ico: '🛒', text: '用户 李** 又剁手了「无线降噪耳机」', amt: '¥899' },
  { ico: '📦', text: '订单 #2026091388 已飞奔在路上', amt: null },
  { ico: '⭐', text: '用户 王** 五星好评：这波不亏！', amt: null },
  { ico: '🎯', text: '广告计划「夏日防晒」ROI 干到 4.2，投麻了', amt: null },
  { ico: '🔔', text: '门店「静安店」客流破 2000，店员腿已废', amt: null },
  { ico: '💰', text: '本月 GMV 破 1200 万，可以加鸡腿了', amt: null },
  { ico: '🤖', text: '数字员工小智默默干完 23 个活，不摸鱼', amt: null },
];

/* ---------- 设备 ---------- */
const DEVICES = [
  { ico: '📷', name: '智能摄像头', status: 'online', num: 12 },
  { ico: '🚪', name: '客流计数器', status: 'online', num: 8 },
  { ico: '💡', name: '智能货架灯', status: 'online', num: 46 },
  { ico: '🌡', name: '温控传感器', status: 'offline', num: 2 },
  { ico: '🛰', name: 'WiFi 探针', status: 'online', num: 6 },
  { ico: '🧾', name: '电子价签', status: 'online', num: 320 },
];

/* ---------- 陈列建议 ---------- */
const SUGGESTIONS = [
  { ico: '💡', title: 'A3 货架凑 CP 计划', text: '把「洗发水」和「护发素」放一起，连带率预计 +18%，锁死这对 CP', urgent: false },
  { ico: '🔥', title: '爆款要断货了！', text: '「防晒衣」库存只够卖 3 天，再不补货顾客要哭了，建议补 200 件', urgent: true },
  { ico: '📍', title: '入口黄金位该换人了', text: '把新品「空气炸锅」挪到门口 C 位，曝光 +45%，让它当一回顶流', urgent: false },
  { ico: '🌡', title: '冷藏柜在摆烂', text: 'B2 冷藏柜温度 6.2℃ 超标了，再不管冰淇淋要化汤，已自动告警', urgent: true },
];

/* ---------- 预测因子 ---------- */
const FACTORS = [
  { name: '历史销量', value: 38 },
  { name: '促销活动', value: 26 },
  { name: '节假日', value: 14 },
  { name: '天气因素', value: 12 },
  { name: '竞品价格', value: 6 },
  { name: '其他', value: 4 },
];

/* ---------- 广告计划 ---------- */
const CAMPAIGNS = [
  { title: '夏日防晒大促', cover: '🏖', meta: '朋友圈定向 · 18-35岁怕黑星人', stats: { 曝光: '12.8万', 点击: '3,842', ROI: '4.2' }, progress: 68 },
  { title: '新品耳机首发', cover: '🎧', meta: '抖音信息流 · 数码发烧友聚集地', stats: { 曝光: '8.6万', 点击: '2,104', ROI: '3.8' }, progress: 45 },
  { title: '会员日感恩回馈', cover: '🎁', meta: '短信+Push · 把沉睡会员薅醒', stats: { 曝光: '5.2万', 点击: '1,680', ROI: '5.1' }, progress: 92 },
  { title: '母婴品类专场', cover: '🍼', meta: '小红书 · 宝妈们的种草天堂', stats: { 曝光: '6.8万', 点击: '1,920', ROI: '3.5' }, progress: 30 },
  { title: '家电以旧换新', cover: '📺', meta: '百度搜索 · 高意向精准人群', stats: { 曝光: '4.3万', 点击: '1,240', ROI: '6.2' }, progress: 78 },
  { title: '美妆品牌日', cover: '💄', meta: '淘宝钻展 · 精致女孩收割机', stats: { 曝光: '9.5万', 点击: '2,860', ROI: '4.7' }, progress: 55 },
];

/* ---------- 商品库 ---------- */
const PRODUCTS = [
  /* 数码 */
  { id: 1, name: 'Sony WH-1000XM5 无线降噪耳机', price: 2499, img: '🎧', cat: '数码', sales: 3200, tag: '降噪王者' },
  { id: 2, name: '小米智能手表 S1 Pro', price: 699, img: '⌚', cat: '数码', sales: 2800, tag: '科技感拉满' },
  { id: 3, name: 'iPhone 16 128GB 粉色', price: 4299, img: '📱', cat: '数码', sales: 18600, tag: '真香价' },
  { id: 4, name: 'iPhone 16 Pro 256GB 原色钛金属', price: 5499, img: '📱', cat: '数码', sales: 15600, tag: '旗舰爆款' },
  { id: 5, name: 'iPhone 16 Pro Max 256GB 黑色钛金属', price: 8799, img: '📱', cat: '数码', sales: 9800, tag: '超大杯' },
  { id: 6, name: '华为 Mate 80 Pro 12+512GB 雅丹黑', price: 6999, img: '📱', cat: '数码', sales: 12500, tag: '国产之光' },
  { id: 7, name: '华为 Pura 80 12+256GB 雪域白', price: 5199, img: '📱', cat: '数码', sales: 9200, tag: '影像旗舰' },
  { id: 8, name: '小米15 Pro 12+256GB 黑色', price: 3299, img: '📱', cat: '数码', sales: 13800, tag: '性价比之王' },
  { id: 9, name: '小米15 Ultra 16+512GB 白色', price: 3999, img: '📱', cat: '数码', sales: 8600, tag: '徕卡影像' },
  { id: 10, name: '三星 Galaxy S25 Ultra 12+256GB 钛灰', price: 9699, img: '📱', cat: '数码', sales: 5200, tag: '安卓机皇' },
  { id: 11, name: 'OPPO Find X9 Pro 12+256GB 海阔天空', price: 5299, img: '📱', cat: '数码', sales: 7400, tag: '哈苏影像' },
  { id: 12, name: 'vivo X200 12+256GB 星迹蓝', price: 4299, img: '📱', cat: '数码', sales: 8100, tag: '蔡司影像' },
  { id: 13, name: '一加 13 16+512GB 岩黑', price: 4299, img: '📱', cat: '数码', sales: 6500, tag: '性能旗舰' },
  { id: 14, name: '华为 MatePad 11 平板电脑', price: 2299, img: '📲', cat: '数码', sales: 4100, tag: '学习办公' },
  { id: 15, name: '罗技 MX Master 3S 无线鼠标', price: 699, img: '🖱', cat: '数码', sales: 5200, tag: '效率神器' },
  { id: 16, name: '大疆 Pocket 3 口袋云台相机', price: 3499, img: '📷', cat: '数码', sales: 2300, tag: 'Vlog神器' },
  { id: 17, name: '倍思 65W GaN 氮化镓充电器', price: 129, img: '🔌', cat: '数码', sales: 18000, tag: '充电自由' },
  /* 服饰 */
  { id: 18, name: '蕉下轻薄透气防晒衣 UPF50+', price: 199, img: '🧥', cat: '服饰', sales: 8600, tag: '夏日救命' },
  { id: 19, name: 'Nike Air Max 跑步鞋 男款', price: 799, img: '👟', cat: '服饰', sales: 3600, tag: '潮人标配' },
  { id: 20, name: '优衣库摇粒绒外套 男女同款', price: 199, img: '🧣', cat: '服饰', sales: 6700, tag: '秋冬必入' },
  { id: 21, name: 'UR 法式碎花连衣裙', price: 299, img: '👗', cat: '服饰', sales: 4200, tag: '温柔显瘦' },
  { id: 22, name: '南极人纯棉男士T恤 3件装', price: 89, img: '👕', cat: '服饰', sales: 12000, tag: '囤货之选' },
  { id: 23, name: 'New Balance 574 复古运动鞋', price: 659, img: '👟', cat: '服饰', sales: 3100, tag: '百搭爆款' },
  /* 家电 */
  { id: 24, name: '美的空气炸锅 5L 大容量', price: 299, img: '🍟', cat: '家电', sales: 5400, tag: '懒人神器' },
  { id: 25, name: '戴森吹风机 Supersonic', price: 2990, img: '💨', cat: '家电', sales: 1500, tag: '颜值天花板' },
  { id: 26, name: '小米扫地机器人 Pro', price: 2299, img: '🤖', cat: '家电', sales: 3800, tag: '解放双手' },
  { id: 27, name: '格力变频空调 1.5匹 一级能效', price: 2799, img: '❄', cat: '家电', sales: 2100, tag: '省电静音' },
  { id: 28, name: '海尔双开门冰箱 520L', price: 4399, img: '🧊', cat: '家电', sales: 1800, tag: '大容积' },
  { id: 29, name: '飞利浦电动牙刷 Sonicare', price: 349, img: '🪥', cat: '家电', sales: 9200, tag: '护齿黑科技' },
  /* 美妆 */
  { id: 30, name: '兰蔻小黑瓶精华肌底液 50ml', price: 880, img: '💧', cat: '美妆', sales: 4800, tag: '贵妇必备' },
  { id: 31, name: '雅诗兰黛小棕瓶眼霜 15ml', price: 520, img: '👁', cat: '美妆', sales: 4200, tag: '熬夜救星' },
  { id: 32, name: 'MAC 子弹头口红 Chili小辣椒', price: 190, img: '💄', cat: '美妆', sales: 8900, tag: '显白百搭' },
  { id: 33, name: 'SK-II 神仙水 230ml', price: 1590, img: '🧴', cat: '美妆', sales: 2600, tag: '油皮亲妈' },
  { id: 34, name: '花西子雕花口红 同心锁', price: 149, img: '💋', cat: '美妆', sales: 5600, tag: '国风美妆' },
  { id: 35, name: '美宝莲Fit Me 粉底液', price: 99, img: '🩹', cat: '美妆', sales: 11000, tag: '平价宝藏' },
  /* 母婴 */
  { id: 36, name: '飞鹤星飞帆婴幼儿奶粉 3段', price: 298, img: '🍼', cat: '母婴', sales: 2100, tag: '正品保障' },
  { id: 37, name: '帮宝适纸尿裤 NB码 96片', price: 129, img: '👶', cat: '母婴', sales: 9800, tag: '超薄透气' },
  { id: 38, name: '费雪早教安抚海马', price: 89, img: '🐴', cat: '母婴', sales: 6500, tag: '哄睡神器' },
  { id: 39, name: 'babycare 婴儿湿巾 80抽*10包', price: 59, img: '🧻', cat: '母婴', sales: 15000, tag: '手口专用' },
  { id: 40, name: '贝亲宽口径玻璃奶瓶 240ml', price: 139, img: '🍶', cat: '母婴', sales: 7200, tag: '防胀气' },
  /* 生鲜 */
  { id: 41, name: '云南高山蓝莓 125g*4盒', price: 49, img: '🫐', cat: '生鲜', sales: 12000, tag: '新鲜直达' },
  { id: 42, name: '智利车厘子 J级 2斤装', price: 79, img: '🍒', cat: '生鲜', sales: 8800, tag: '进口鲜甜' },
  { id: 43, name: '海南金煌芒 5斤装', price: 35, img: '🥭', cat: '生鲜', sales: 6500, tag: '树上熟' },
  { id: 44, name: '澳洲M3和牛雪花牛排 200g', price: 68, img: '🥩', cat: '生鲜', sales: 4200, tag: '原切牛排' },
  { id: 45, name: '鲜活大闸蟹 4两公*4只', price: 179, img: '🦀', cat: '生鲜', sales: 3100, tag: '膏满黄肥' },
  { id: 46, name: '山东烟台红富士苹果 5斤', price: 25, img: '🍎', cat: '生鲜', sales: 14000, tag: '脆甜多汁' },
  /* 日用 */
  { id: 47, name: '维达超韧抽纸 24包整箱', price: 42, img: '🧻', cat: '日用', sales: 18000, tag: '囤货之选' },
  { id: 48, name: '蓝月亮洗衣液 3kg+2kg套装', price: 69, img: '🧴', cat: '日用', sales: 11000, tag: '深层洁净' },
  { id: 49, name: '黑人牙膏双重薄荷 140g*4支', price: 35, img: '🦷', cat: '日用', sales: 9500, tag: '清新口气' },
  { id: 50, name: '舒肤佳沐浴露 720ml*2瓶', price: 52, img: '🛁', cat: '日用', sales: 8700, tag: '抑菌留香' },
  { id: 51, name: '妙洁保鲜膜 30cm*60m 3卷', price: 22, img: '📦', cat: '日用', sales: 13000, tag: '厨房必备' },
  /* 食品 */
  { id: 52, name: '三只松鼠每日坚果 750g', price: 79, img: '🥜', cat: '食品', sales: 9800, tag: '追剧搭子' },
  { id: 53, name: '元气森林气泡水 480ml*15瓶', price: 55, img: '🥤', cat: '食品', sales: 16000, tag: '0糖0脂' },
  { id: 54, name: '蒙牛特仑苏纯牛奶 250ml*16盒', price: 59, img: '🥛', cat: '食品', sales: 14500, tag: '高钙营养' },
  { id: 55, name: '良品铺子虎皮凤爪 200g', price: 25, img: '🍗', cat: '食品', sales: 7800, tag: '追剧必备' },
  { id: 56, name: '星巴克速溶咖啡 10条装', price: 45, img: '☕', cat: '食品', sales: 6200, tag: '续命神器' },
  /* 家居 */
  { id: 57, name: '水星家纺全棉四件套 1.8m', price: 259, img: '🛏', cat: '家居', sales: 4100, tag: '亲肤柔软' },
  { id: 58, name: '无印良品收纳箱 50L', price: 79, img: '📦', cat: '家居', sales: 8900, tag: '收纳神器' },
  { id: 59, name: '北欧风落地灯 卧室客厅', price: 169, img: '💡', cat: '家居', sales: 3200, tag: '氛围感' },
  { id: 60, name: '懒人沙发豆袋 小户型', price: 229, img: '🛋', cat: '家居', sales: 2800, tag: '躺平快乐' },
];

/* ---------- 数字员工 ---------- */
const EMPLOYEES = [
  { name: '小智', role: '运营助理', ico: '✨', tasks: '数据分析 / 写日报', status: '肝报表中' },
  { name: '小运', role: '供应链专员', ico: '📦', tasks: '补货 / 调拨', status: '摸鱼中' },
  { name: '小客', role: '客服专员', ico: '💬', tasks: '售前 / 售后', status: '安抚客户中' },
  { name: '小退', role: '退换货专员', ico: '🔄', tasks: '退货 / 换货 / 退款', status: '处理退单中' },
  { name: '小维', role: '售后维权专员', ico: '🛡️', tasks: '投诉 / 维权 / 纠纷', status: '调解中' },
  { name: '小暖', role: '客户关怀专员', ico: '💝', tasks: '回访 / 安抚 / 满意度', status: '嘘寒问暖中' },
  { name: '小策', role: '营销策划', ico: '🎯', tasks: '活动 / 文案', status: '脑洞大开' },
  { name: '小数', role: '数据分析师', ico: '📊', tasks: '建模 / 预测', status: '算懵了' },
  { name: '小设', role: '设计师', ico: '🎨', tasks: '海报 / 视频', status: '改稿第8版' },
];

/* ---------- 客服工单 ---------- */
const TICKETS = [
  { name: '王先生', avatar: '王', time: '刚刚', preview: '这耳机降噪是假的吧？我要退货！😡', emotion: 'angry', type: '售后' },
  { name: '李女士', avatar: '李', time: '3分钟前', preview: '防晒衣有粉色的吗？在线等挺急的', emotion: 'normal', type: '售前' },
  { name: '张先生', avatar: '张', time: '10分钟前', preview: '我的订单咋还不发货呀~', emotion: 'normal', type: '售后' },
  { name: '赵女士', avatar: '赵', time: '25分钟前', preview: '优惠券用不了，搞我心态呢？', emotion: 'angry', type: '售后' },
  { name: '陈先生', avatar: '陈', time: '1小时前', preview: '空气炸锅怎么做鸡翅？在线教学', emotion: 'normal', type: '售前' },
  { name: '刘女士', avatar: '刘', time: '2小时前', preview: '送的小礼物太可爱啦，爱你们~', emotion: 'happy', type: '售后' },
];

const QUICK_REPLIES = [
  '实在抱歉给您添堵了，马上给您安排得明明白白',
  '您的订单已加急，今天就能飞出去',
  '这款支持 7 天无理由退换，放心冲',
  '这就给您转专属客服，稍等一丢丢',
  '已为您安排 20 元优惠券赔罪，收下吧',
];

/* ---------- 模板 ---------- */
const TEMPLATES = ['夏日促销', '新品首发', '会员专享', '限时秒杀', '品牌日', '节日钜惠', '清仓特卖', '直播专场'];

/* ---------- 小程序分类 ---------- */
const MINI_CATS = [
  { ico: '🔥', name: '秒杀' },
  { ico: '🎁', name: '优惠券' },
  { ico: '🆕', name: '新品' },
  { ico: '👗', name: '服饰' },
  { ico: '💄', name: '美妆' },
  { ico: '📱', name: '数码' },
  { ico: '🍼', name: '母婴' },
  { ico: '🍎', name: '生鲜' },
  { ico: '🏠', name: '家居' },
  { ico: '⚽', name: '运动' },
];

/* ---------- 生活服务四大板块 ---------- */
const LIFE_SECTIONS = [
  {
    key: 'home',
    name: '本地到家生活服务',
    desc: '线上下单 · 配送到家',
    items: [
      { ico: '🛒', name: '生鲜商超到家', products: ['线上商超小程序', '前置仓配送服务'], desc: '日用百货、果蔬肉禽即时配送，支持预约送达、定时配送', platform: '智能派单 · 库存同步 · 履约调度' },
      { ico: '🍜', name: '餐饮外卖服务', products: ['外卖点餐系统'], desc: '正餐、快餐、茶饮小吃全品类覆盖', platform: '智能推荐餐馆 · 订单流转 · 骑手调度 · 评价体系' },
      { ico: '💊', name: '药品送药到家', products: ['线上医药服务模块'], desc: '夜间急送、慢病续方购药', platform: '处方校验 · 就近药房履约 · 24h 值守' },
      { ico: '🧹', name: '家政上门服务', products: ['上门服务预约系统'], desc: '保洁、家电清洗、搬家、维修', platform: '服务人员资质展示 · 预约排期 · 服务后评价' },
    ],
  },
  {
    key: 'store',
    name: '到店消费生活服务',
    desc: '线上选购 · 门店核销',
    items: [
      { ico: '🍽', name: '到店餐饮团购', products: ['团购券', '套餐核销系统'], desc: '多人聚餐套餐、单人工作餐、下午茶', platform: '到店扫码核销 · 套餐管理 · 多店通用' },
      { ico: '🎬', name: '休闲娱乐服务', products: ['票务团购模块'], desc: '影院、KTV、健身场馆、桌游剧本杀', platform: '场次预约 · 在线购票 · 次卡套餐' },
      { ico: '💇', name: '美业服务', products: ['美业预约平台'], desc: '美发美甲、美容护肤、SPA', platform: '技师选择 · 预约时段 · 套餐卡券管理' },
      { ico: '🏞', name: '本地文旅零售', products: ['本地文旅消费模块'], desc: '景区门票、周边游、文创商品', platform: '游玩+实物商品一体化结算' },
    ],
  },
  {
    key: 'family',
    name: '家庭民生便民服务',
    desc: '高频民生 · 日常强关联',
    items: [
      { ico: '📦', name: '社区便民服务', products: ['社区服务入口'], desc: '快递代收寄件、洗衣洗护、修鞋修配', platform: '社区网点线上下单 · 自提柜联动' },
      { ico: '💡', name: '生活缴费服务', products: ['生活缴费组件'], desc: '水电燃气、话费充值、宽带续费', platform: '嵌入零售消费平台 · 账单代扣' },
      { ico: '🚗', name: '汽车生活服务', products: ['汽车服务专区'], desc: '洗车、保养、充电桩预约、代驾', platform: '线上购买服务套餐 · 线下门店使用' },
    ],
  },
  {
    key: 'smart',
    name: '增值衍生智能服务',
    desc: '平台智能运营 · 串联全业务',
    items: [
      { ico: '🎯', name: '个性化推荐', products: ['生活服务推荐引擎'], desc: '基于位置+消费习惯推荐餐饮、家政、团购券', platform: '新老用户冷启动策略 · LBS 召回' },
      { ico: '📋', name: '订单一体化中台', products: ['统一订单中心'], desc: '实物商品与生活服务订单统一管理、券码核销、售后维权', platform: '跨品类订单聚合 · 统一售后入口' },
      { ico: '📊', name: '商户智能运营工具', products: ['商户后台 SaaS'], desc: '上架服务套餐、排期管理、营销活动、经营数据看板', platform: '营收分析 · 客流预测 · 营销 ROI' },
      { ico: '🛡', name: '服务质量风控体系', products: ['风控中台'], desc: '人员资质审核、用户评价、差评预警、违规商户限流下架', platform: '资质校验 · 评价情感分析 · 违规自动处置' },
    ],
  },
];

/* ---------- 商家 ---------- */
const MERCHANTS = [
  { ico: '🍜', name: '老上海本帮菜(静安店)', rating: 4.8, sales: 2300, tags: ['本帮菜', '人均¥120', '有包间'], distance: '0.3km', price: '¥98 起' },
  { ico: '💇', name: 'TONI&GUY 美发沙龙', rating: 4.7, sales: 1800, tags: ['剪发', '染发', '预约制'], distance: '0.5km', price: '¥168 起' },
  { ico: '🎬', name: '万达影城(大宁店)', rating: 4.6, sales: 5600, tags: ['IMAX', '杜比', '停车免费'], distance: '0.8km', price: '¥35 起' },
  { ico: '🏨', name: '全季酒店(南京西路店)', rating: 4.9, sales: 980, tags: ['商务', '含早', '近地铁'], distance: '1.2km', price: '¥458 起' },
  { ico: '🏋', name: '乐刻运动 24h 健身', rating: 4.5, sales: 3200, tags: ['月付', '私教', '团课'], distance: '0.6km', price: '¥99 起' },
];

/* ---------- 会员权益 ---------- */
const BENEFITS = [
  { ico: '💰', name: '消费返积分', desc: '花 1 块返 1 分，积分能当钱花，四舍五入等于白嫖' },
  { ico: '🎁', name: '生日专属礼', desc: '生日月双倍积分 + 专属券，过生日就是要薅羊毛' },
  { ico: '🚚', name: '免邮特权', desc: '全场包邮不设门槛，买根针都给你送上门' },
  { ico: '⚡', name: '优先客服', desc: '专属 VIP 通道，响应 < 30s，比对象回消息还快' },
  { ico: '🎫', name: '会员特价', desc: '千款商品会员价，省下来的钱喝奶茶不香吗' },
];

/* ---------- 预约服务 ---------- */
const SERVICES = [
  { name: '专业剪发 + 造型', duration: '60分钟', price: 168 },
  { name: '染发服务', duration: '120分钟', price: 388 },
  { name: '头皮护理 SPA', duration: '45分钟', price: 268 },
  { name: '烫染套餐', duration: '180分钟', price: 688 },
];

const BOOKINGS = [
  { orderNo: 'YY20260914001', store: 'TONI&GUY 美发沙龙(静安店)', service: '专业剪发 + 造型', date: '2026-09-14', time: '14:00', day: 14, month: '9月', status: '待履约', customer: '张女士', phone: '138****8888' },
  { orderNo: 'YY20260916002', store: 'TONI&GUY 美发沙龙(静安店)', service: '头皮护理 SPA', date: '2026-09-16', time: '10:30', day: 16, month: '9月', status: '待履约', customer: '张女士', phone: '138****8888' },
  { orderNo: 'YY20260910003', store: 'TONI&GUY 美发沙龙(静安店)', service: '染发服务', date: '2026-09-10', time: '15:00', day: 10, month: '9月', status: '已完成', customer: '张女士', phone: '138****8888' },
  { orderNo: 'YY20260905004', store: 'TONI&GUY 美发沙龙(静安店)', service: '烫染套餐', date: '2026-09-05', time: '11:00', day: 5, month: '9月', status: '已取消', customer: '张女士', phone: '138****8888' },
];

/* ---------- 图表通用配置 ---------- */
Chart.defaults.font.family = "'Inter', 'Noto Sans SC', sans-serif";
Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text-2').trim() || '#475569';
