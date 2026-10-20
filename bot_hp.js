/**
 * HamedVPNS Telegram Bot
 * نسخه ۱.۵.۵ (اصلاح خطای 1101 + عیب‌یابی)
 * اجرا روی Cloudflare Workers
 */

// ============================================
// تنظیمات — این بخش رو پر کن
// ============================================
const BOT_TOKEN = '8980319082:AAG3j5OIMHe6vsGB99jvxaqncpgOReU4k8w';
const BOT_USERNAME = 'hamedvpns_bot';
const BOT_BASE_URL = 'https://hamedp.71hp.workers.dev';
const PANEL_URL = 'https://hamedp.71hp.workers.dev';
const WEBHOOK_SECRET = 'hp321456';

// آدرس فایلهای کد ورکرها
const WORKER_CODE_URLS = {
  edgetunnel: 'https://raw.githubusercontent.com/hamedp-71/CF_Panel_SAZ/refs/heads/main/edgetunnel.js',
  cfnew:      'https://raw.githubusercontent.com/hamedp-71/CF_Panel_SAZ/refs/heads/main/Cfnew.js',
  hamedvpns:  'https://raw.githubusercontent.com/hamedp-71/Hamed_Panel/refs/heads/main/_worker.js',
  cfnext:     'https://raw.githubusercontent.com/hamedp-71/CF_Panel_SAZ/refs/heads/main/CFNext_W.js',
  RezaGROOTZ: 'https://raw.githubusercontent.com/hamedp-71/CF_Panel_SAZ/refs/heads/main/RezaG_W.js'
};

// آدرس لیست IP
const IPS_URL: 'https://raw.githubusercontent.com/RododoIsHere/cf-clean-ips/refs/heads/main/list.json';

// استخر پروکسیهای SOCKS5
const SOCKS5_POOLS = {};

// ============================================
// ادامه کد
// ============================================

const CF_SIGNUP_URL = 'https://dash.cloudflare.com/sign-up';
const CF_CREATE_TOKEN_URL = 'https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_kv_storage%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22d1%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22workers_subdomain%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_analytics%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22user_details%22%2C%22type%22%3A%22read%22%7D%2C%7B%22key%22%3A%22page%22%2C%22type%22%3A%22edit%22%7D%5D&accountId=*&zoneId=all&name=HamedVPNS-Deployer-Token';

const WORKER_LOGIN = {
  edgetunnel: { loginPath: '', useAdminPassword: true, adminPassword: 'HamedVPNS', subPath: '/sub' },
  cfnew:      { loginPath: '/{uuid}', useAdminPassword: false, subPath: '/{uuid}/sub' },
  hamedvpns:  { loginPath: '/panel', useAdminPassword: false, subPath: '/sub' },
  cfnext:     { loginPath: '/{uuid}', useAdminPassword: false, subPath: '/{uuid}/sub' },
  RezaGROOTZ: { loginPath: '/panel', useAdminPassword: false, subPath: '/sub' }
};

const DEFAULT_PORTS = [80, 443];

const ALL_PORTS = {
  http: [8080, 80, 2052, 8880, 2086, 2082, 2095],
  https: [2053, 443, 2087, 2083, 8443, 2096]
};

const SOCKS5_NAMES = {
  LV: 'لتونی',
  IT: 'ایتالیا',
  CA: 'کانادا',
  FR: 'فرانسه',
  GB: 'انگلیس',
  SE: 'سوئد',
  DE: 'آلمان'
};

const AZURE_REGIONS = [
  { code: 'eastus', name: 'شرق آمریکا' },
  { code: 'eastus2', name: 'شرق آمریکا ۲' },
  { code: 'westus', name: 'غرب آمریکا' },
  { code: 'westus2', name: 'غرب آمریکا ۲' },
  { code: 'westus3', name: 'غرب آمریکا ۳' },
  { code: 'centralus', name: 'مرکز آمریکا' },
  { code: 'northcentralus', name: 'شمال مرکز آمریکا' },
  { code: 'southcentralus', name: 'جنوب مرکز آمریکا' },
  { code: 'canadacentral', name: 'کانادا مرکزی' },
  { code: 'canadaeast', name: 'کانادا شرقی' },
  { code: 'brazilsouth', name: 'برزیل جنوبی' },
  { code: 'brazilsoutheast', name: 'برزیل جنوب شرقی' },
  { code: 'chilecentral', name: 'شیلی مرکزی' },
  { code: 'argentinacentral', name: 'آرژانتین مرکزی' },
  { code: 'northeurope', name: 'ایرلند' },
  { code: 'westeurope', name: 'هلند' },
  { code: 'uksouth', name: 'انگلیس جنوبی' },
  { code: 'ukwest', name: 'انگلیس غربی' },
  { code: 'germanywestcentral', name: 'آلمان غربی مرکزی' },
  { code: 'germanynorth', name: 'آلمان شمالی' },
  { code: 'francecentral', name: 'فرانسه مرکزی' },
  { code: 'francesouth', name: 'فرانسه جنوبی' },
  { code: 'italynorth', name: 'ایتالیا شمالی' },
  { code: 'swedencentral', name: 'سوئد مرکزی' },
  { code: 'polandcentral', name: 'لهستان مرکزی' },
  { code: 'switzerlandnorth', name: 'سوئیس شمالی' },
  { code: 'switzerlandwest', name: 'سوئیس غربی' },
  { code: 'norwayeast', name: 'نروژ شرقی' },
  { code: 'denmarkeast', name: 'دانمارک شرقی' },
  { code: 'belgiumcentral', name: 'بلژیک مرکزی' },
  { code: 'spaincentral', name: 'اسپانیا مرکزی' },
  { code: 'eastasia', name: 'شرق آسیا' },
  { code: 'southeastasia', name: 'جنوب شرق آسیا' },
  { code: 'japaneast', name: 'ژاپن شرقی' },
  { code: 'japanwest', name: 'ژاپن غربی' },
  { code: 'koreacentral', name: 'کره مرکزی' },
  { code: 'koreasouth', name: 'کره جنوبی' },
  { code: 'chinanorth', name: 'چین شمالی' },
  { code: 'chinaeast', name: 'چین شرقی' },
  { code: 'indiacentral', name: 'هند مرکزی' },
  { code: 'indiasouth', name: 'هند جنوبی' },
  { code: 'indiawest', name: 'هند غربی' },
  { code: 'malaysiawest', name: 'مالزی غربی' },
  { code: 'malaysiasouth', name: 'مالزی جنوبی' },
  { code: 'taiwannorth', name: 'تایوان شمالی' },
  { code: 'taiwansouth', name: 'تایوان جنوبی' },
  { code: 'indonesiacentral', name: 'اندونزی مرکزی' },
  { code: 'philippinescentral', name: 'فیلیپین مرکزی' },
  { code: 'vietnamcentral', name: 'ویتنام مرکزی' },
  { code: 'australiaeast', name: 'استرالیا شرقی' },
  { code: 'australiasoutheast', name: 'استرالیا جنوب شرقی' },
  { code: 'newzealandnorth', name: 'نیوزیلند شمالی' },
  { code: 'uaenorth', name: 'امارات شمالی' },
  { code: 'uaecentral', name: 'امارات مرکزی' },
  { code: 'israelcentral', name: 'اسرائیل مرکزی' },
  { code: 'qatarcentral', name: 'قطر مرکزی' },
  { code: 'southafricanorth', name: 'آفریقای جنوبی شمالی' },
  { code: 'southafricawest', name: 'آفریقای جنوبی غربی' }
];

const HAMEDVPNS_SOCKS5_LIST = '';
const EFFECTIVE_SETTINGS_CACHE_KEY = 'cache:owner_settings';
const EFFECTIVE_SETTINGS_TTL_MS = 10 * 60 * 1000;

function getKV(env) {
  if (!env) return null;
  return env.BOT_KV || env.KV || env.bot_kv || env.kv || null;
}

function getBotToken(env) {
  return (env && env.BOT_TOKEN) ? env.BOT_TOKEN : BOT_TOKEN;
}

function buildHamedvpnsSocks5ListFromPools(socks5Pools) {
  const lines = [];
  for (const code of Object.keys(socks5Pools || {})) {
    const arr = socks5Pools[code] || [];
    for (const cred of arr) {
      lines.push('socks5=' + cred);
    }
  }
  return lines.length ? lines.join('\n') : HAMEDVPNS_SOCKS5_LIST;
}

async function getEffectiveSettings(kv) {
  const fallback = {
    ipsUrl: IPS_URL,
    workerCodeUrls: WORKER_CODE_URLS,
    socks5Pools: SOCKS5_POOLS,
    hamedvpnsSocks5List: HAMEDVPNS_SOCKS5_LIST,
    fragment: { rules: DEFAULT_FRAGMENT_RULES }
  };
  let cached = null;
  if (kv) {
    try {
      const raw = await kv.get(EFFECTIVE_SETTINGS_CACHE_KEY);
      if (raw) cached = JSON.parse(raw);
    } catch (e) {}
  }

  if (cached && (Date.now() - cached.fetchedAt) < EFFECTIVE_SETTINGS_TTL_MS) {
    return cached.data;
  }

  try {
    const res = await fetch(PANEL_URL + '/api/public-settings');
    if (!res.ok) throw new Error('پاسخ نامعتبر از پنل');
    const json = await res.json();
    if (!json.success) throw new Error('پنل موفق نبود');
    const data = {
      ipsUrl: json.ipsUrl || IPS_URL,
      workerCodeUrls: Object.assign({}, WORKER_CODE_URLS, json.workerCodeUrls || {}),
      socks5Pools: (json.socks5Pools && Object.keys(json.socks5Pools).length) ? json.socks5Pools : SOCKS5_POOLS,
      hamedvpnsSocks5List: buildHamedvpnsSocks5ListFromPools(json.socks5Pools),
      fragment: { rules: safeFragmentRules(json.fragment && json.fragment.rules) }
    };
    if (kv) {
      try {
        await kv.put(EFFECTIVE_SETTINGS_CACHE_KEY, JSON.stringify({ data, fetchedAt: Date.now() }));
      } catch (e) {}
    }
    return data;
  } catch (e) {
    if (cached) return cached.data;
    return fallback;
  }
}

async function tg(method, body, token = BOT_TOKEN) {
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (e) {
    console.error(`tg error in ${method}:`, e);
    return { ok: false, description: e.message };
  }
}

async function sendMessage(chatId, text, replyMarkup = null, token = BOT_TOKEN) {
  const body = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  };
  if (replyMarkup) body.reply_markup = replyMarkup;
  return tg('sendMessage', body, token);
}

async function editMessage(chatId, messageId, text, replyMarkup = null, token = BOT_TOKEN) {
  if (!messageId) {
    return sendMessage(chatId, text, replyMarkup, token);
  }
  const body = {
    chat_id: chatId,
    message_id: messageId,
    text: text,
    parse_mode: 'HTML',
    disable_web_page_preview: true
  };
  if (replyMarkup) body.reply_markup = replyMarkup;
  
  const res = await tg('editMessageText', body, token);
  if (!res.ok) {
    if (res.description && res.description.includes('message is not modified')) {
      return res;
    }
    return sendMessage(chatId, text, replyMarkup, token);
  }
  return res;
}

async function answerCallback(callbackId, text = '', token = BOT_TOKEN) {
  if (!callbackId) return;
  return tg('answerCallbackQuery', { callback_query_id: callbackId, text: text }, token);
}

function mainMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '🚀 ساخت پنل جدید (پیشرفته)', callback_data: 'deploy_advanced' }],
      [{ text: '⚡ ساخت سریع', callback_data: 'quick_menu' }],
      [{ text: '🔧 مدیریت و آپدیت پنلها', callback_data: 'manage_panels' }],
      [{ text: '🔑 حسابهای کلودفلر', callback_data: 'manage_token' }],
      [
        { text: '🛠 ساخت توکن کلودفلر', url: CF_CREATE_TOKEN_URL },
        { text: '📝 ثبت نام کلودفلر', url: CF_SIGNUP_URL }
      ],
      [{ text: '📎 لینکهای ساب من', callback_data: 'my_subs' }],
      [{ text: '📖 راهنما', callback_data: 'help' }],
      [{ text: '🎬 آموزش ساخت اکانت کلودفلر', url: 'https://t.me/hamedvpns/21513' }],
      [{ text: '🎬 آموزش ساخت پنل', url: 'https://t.me/hamedvpns/21514' }]
    ]
  };
}

function quickMenuKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '⚡ Pages + RezaGROOTZ', callback_data: 'quick|pages|RezaGROOTZ' }],
      [{ text: '🚀 Worker + RezaGROOTZ', callback_data: 'quick|worker|RezaGROOTZ' }],
      [{ text: '⚡ Pages + CFNext', callback_data: 'quick|pages|cfnext' }],
      [{ text: '🚀 Worker + CFNext', callback_data: 'quick|worker|cfnext' }],
      [{ text: '⚡ Pages + CFNew', callback_data: 'quick|pages|cfnew' }],
      [{ text: '🚀 Worker + CFNew', callback_data: 'quick|worker|cfnew' }],
      [{ text: '⚡ Pages + EdgeTunnel', callback_data: 'quick|pages|edgetunnel' }],
      [{ text: '🚀 Worker + EdgeTunnel', callback_data: 'quick|worker|edgetunnel' }],
      [{ text: '⚡ Pages + HamedVPNS', callback_data: 'quick|pages|hamedvpns' }],
      [{ text: '🚀 Worker + HamedVPNS', callback_data: 'quick|worker|hamedvpns' }],
      [{ text: '🔙 بازگشت', callback_data: 'main_menu' }]
    ]
  };
}

function backToMainKeyboard() {
  return { inline_keyboard: [[{ text: '🔙 منوی اصلی', callback_data: 'main_menu' }]] };
}

function accountsManageKeyboard(accounts) {
  const rows = [[{ text: '➕ افزودن حساب جدید', callback_data: 'set_token' }]];
  (accounts || []).forEach(a => {
    rows.push([{ text: '🗑 حذف ' + (a.label || a.accountId), callback_data: 'delacc|' + a.accountId }]);
  });
  rows.push([{ text: '🛠 ساخت توکن کلودفلر', url: CF_CREATE_TOKEN_URL }]);
  rows.push([{ text: '🔙 بازگشت', callback_data: 'main_menu' }]);
  return { inline_keyboard: rows };
}

function accountPickKeyboard(accounts) {
  const rows = accounts.map(a => [{ text: '☁️ ' + (a.label || a.accountId), callback_data: 'acc_pick|' + a.accountId }]);
  rows.push([{ text: '🔙 منوی اصلی', callback_data: 'main_menu' }]);
  return { inline_keyboard: rows };
}

function typeKeyboard() {
  return {
    inline_keyboard: [
      [{ text: 'RezaGROOTZ', callback_data: 'adv_type|RezaGROOTZ' }],
      [{ text: 'EdgeTunnel', callback_data: 'adv_type|edgetunnel' }],
      [{ text: 'HamedVPNS', callback_data: 'adv_type|hamedvpns' }],
      [{ text: 'CFNew', callback_data: 'adv_type|cfnew' }],
      [{ text: 'CFNext', callback_data: 'adv_type|cfnext' }],
      [{ text: '🔙 بازگشت', callback_data: 'main_menu' }]
    ]
  };
}

function platformKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '📄 Pages', callback_data: 'adv_plat|pages' }],
      [{ text: '⚡ Worker', callback_data: 'adv_plat|worker' }],
      [{ text: '🔙 بازگشت', callback_data: 'main_menu' }]
    ]
  };
}

function nameKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '🎲 اسم رندوم', callback_data: 'adv_name|random' }],
      [{ text: '🔙 بازگشت', callback_data: 'main_menu' }]
    ]
  };
}

function portsKeyboard(selected) {
  const sel = selected || [80, 443];
  const rows = [];
  const all = [...ALL_PORTS.http, ...ALL_PORTS.https];
  for (let i = 0; i < all.length; i += 3) {
    const row = [];
    for (let j = 0; j < 3 && i + j < all.length; j++) {
      const p = all[i + j];
      const mark = sel.includes(p) ? '✅ ' : '';
      row.push({ text: mark + p, callback_data: 'adv_port|' + p });
    }
    rows.push(row);
  }
  rows.push([{ text: '➡️ بعدی', callback_data: 'adv_ports_next' }]);
  rows.push([{ text: '🔙 بازگشت', callback_data: 'main_menu' }]);
  return { inline_keyboard: rows };
}

async function socksKeyboard(selected, kv) {
  const sel = selected || ['direct'];
  const rows = [[{ text: (sel.includes('direct') ? '✅ ' : '') + 'اتصال مستقیم', callback_data: 'adv_s5|direct' }]];
  const settings = kv ? await getEffectiveSettings(kv) : { socks5Pools: SOCKS5_POOLS };
  const codes = Object.keys(settings.socks5Pools || SOCKS5_POOLS);
  for (let i = 0; i < codes.length; i += 2) {
    const row = [];
    for (let j = 0; j < 2 && i + j < codes.length; j++) {
      const c = codes[i + j];
      row.push({ text: (sel.includes(c) ? '✅ ' : '') + (SOCKS5_NAMES[c] || c), callback_data: 'adv_s5|' + c });
    }
    rows.push(row);
  }
  rows.push([{ text: '➡️ بعدی', callback_data: 'adv_s5_next' }]);
  rows.push([{ text: '🔙 بازگشت', callback_data: 'main_menu' }]);
  return { inline_keyboard: rows };
}

function regionKeyboard() {
  const rows = [[{ text: 'پیشفرض کلودفلر (بدون ریجن)', callback_data: 'adv_reg|' }]];
  for (let i = 0; i < AZURE_REGIONS.length; i += 2) {
    const row = [];
    for (let j = 0; j < 2 && i + j < AZURE_REGIONS.length; j++) {
      const r = AZURE_REGIONS[i + j];
      row.push({ text: r.name, callback_data: 'adv_reg|' + r.code });
    }
    rows.push(row);
  }
  rows.push([{ text: '🔙 بازگشت', callback_data: 'main_menu' }]);
  return { inline_keyboard: rows };
}

function confirmKeyboard() {
  return {
    inline_keyboard: [
      [{ text: '✅ شروع دپلوی', callback_data: 'adv_go' }],
      [{ text: '❌ انصراف', callback_data: 'main_menu' }]
    ]
  };
}

async function getUser(kv, userId) {
  if (!kv) {
    throw new Error('دیتابیس KV به ورکر متصل نشده است! لطفاً متغیر BOT_KV را در تنظیمات ورکر بررسی کنید.');
  }
  try {
    const raw = await kv.get('tg:' + userId);
    if (!raw) return { accounts: [], panels: [], waitingFor: null, draft: {} };
    const u = JSON.parse(raw);
    if (!u.draft) u.draft = {};
    if (!u.panels) u.panels = [];
    if (!u.accounts) u.accounts = [];
    return u;
  } catch (e) {
    console.error('getUser error:', e);
    throw new Error('خطا در خواندن اطلاعات از دیتابیس KV: ' + e.message);
  }
}

async function saveUser(kv, userId, data) {
  if (!kv) {
    throw new Error('دیتابیس KV به ورکر متصل نشده است! لطفاً متغیر BOT_KV را در تنظیمات ورکر بررسی کنید.');
  }
  try {
    const cleanData = {
      accounts: (data.accounts || []).map(a => ({
        accountId: a.accountId,
        token: a.token,
        label: a.label
      })),
      panels: (data.panels || []).map(p => ({
        name: p.name,
        domain: p.domain,
        platform: p.platform,
        type: p.type,
        uuid: p.uuid,
        accountId: p.accountId,
        kvId: p.kvId,
        d1Uuid: p.d1Uuid,
        ports: p.ports,
        socks5: p.socks5,
        region: p.region,
        subUrl: p.subUrl,
        panelUrl: p.panelUrl,
        createdAt: p.createdAt
      })),
      waitingFor: data.waitingFor || null,
      draft: data.draft || {}
    };
    await kv.put('tg:' + userId, JSON.stringify(cleanData));
    return true;
  } catch (e) {
    console.error('saveUser error:', e);
    throw new Error('خطا در نوشتن اطلاعات درون KV: ' + e.message);
  }
}

async function getAccountEmail(apiToken) {
  try {
    const res = await fetch('https://api.cloudflare.com/client/v4/user', {
      headers: { 'Authorization': 'Bearer ' + apiToken }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.success && data.result && data.result.email) ? data.result.email : null;
  } catch (e) {
    return null;
  }
}

async function getAccountId(apiToken) {
  let response = await fetch('https://api.cloudflare.com/client/v4/accounts', {
    headers: { 'Authorization': 'Bearer ' + apiToken }
  });
  if (response.ok) {
    const data = await response.json();
    if (data.result && data.result.length > 0) return data.result[0].id;
  }
  response = await fetch('https://api.cloudflare.com/client/v4/user', {
    headers: { 'Authorization': 'Bearer ' + apiToken }
  });
  if (!response.ok) throw new Error('توکن نامعتبر است');
  const data = await response.json();
  const accountId = data.result?.accounts?.[0]?.id;
  if (!accountId) throw new Error('هیچ اکانتی یافت نشد');
  return accountId;
}

async function createD1Database(apiToken, accountId, name, prefix = 'db-') {
  const safeName = (prefix + name).replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase().slice(0, 30);
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database`,
    {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: safeName })
    }
  );
  if (!response.ok) {
    const errText = await response.text();
    if (response.status === 403 || errText.includes('"code":10000') || errText.includes('Authentication error')) {
      throw new Error(
        'ساخت D1 ناموفق: توکن API شما مجوز D1:Edit ندارد.\n\n' +
        '🔧 راه‌حل:\n' +
        '۱. از منوی «🔑 حساب‌های کلودفلر» توکن فعلی را حذف کن\n' +
        '۲. با دکمه «🛠 ساخت توکن کلودفلر» یک توکن جدید بساز (حالا شامل D1 است)\n' +
        '۳. توکن جدید را به ربات بده\n\n' +
        '💡 اگر می‌خواهی توکن فعلی را نگه داری: به داشبورد کلودفلر → API Tokens → توکن خود → Edit برو و permission «Account → D1 → Edit» را اضافه کن.'
      );
    }
    throw new Error('ساخت دیتابیس D1 ناموفق بود:\n' + errText);
  }
  const data = await response.json();
  return data.result?.uuid;
}

async function deleteD1Database(apiToken, accountId, dbUuid) {
  if (!dbUuid) return;
  try {
    await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbUuid}`,
      { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + apiToken } }
    );
  } catch (e) {}
}

async function getOrCreateKVNamespace(apiToken, accountId, name = 'HV_SHARED_KV') {
  try {
    const listRes = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces?per_page=100`,
      { headers: { 'Authorization': 'Bearer ' + apiToken } }
    );
    if (listRes.ok) {
      const data = await listRes.json();
      const existing = (data.result || []).find(ns => ns.title === name);
      if (existing) return existing.id;
    }
  } catch (e) {}

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/storage/kv/namespaces`,
    {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: name })
    }
  );
  if (!response.ok) throw new Error('ساخت KV ناموفق: ' + (await response.text()));
  const data = await response.json();
  return data.result.id;
}

async function listWorkerScripts(apiToken, accountId) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts`,
    { headers: { 'Authorization': 'Bearer ' + apiToken } }
  );
  if (!response.ok) throw new Error('دریافت لیست Workerها ناموفق: ' + (await response.text()));
  const data = await response.json();
  return (data.result || []).map(w => w.id);
}

async function listPagesProjects(apiToken, accountId) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
    { headers: { 'Authorization': 'Bearer ' + apiToken } }
  );
  if (!response.ok) throw new Error('دریافت لیست پروژه‌های Pages ناموفق: ' + (await response.text()));
  const data = await response.json();
  return (data.result || []).map(p => p.name);
}

async function assertNameAvailable(apiToken, accountId, name, platform) {
  const lower = (name || '').toLowerCase();
  if (platform === 'pages') {
    const existing = await listPagesProjects(apiToken, accountId);
    if (existing.some(n => (n || '').toLowerCase() === lower)) {
      throw new Error('پروژه‌ای با نام "' + name + '" قبلاً وجود دارد. یک نام دیگر انتخاب کنید.');
    }
  } else {
    const existing = await listWorkerScripts(apiToken, accountId);
    if (existing.some(n => (n || '').toLowerCase() === lower)) {
      throw new Error('Workerی با نام "' + name + '" قبلاً وجود دارد. یک نام دیگر انتخاب کنید.');
    }
  }
}

async function fetchWorkerCode(type, kv) {
  const settings = kv ? await getEffectiveSettings(kv) : { workerCodeUrls: WORKER_CODE_URLS };
  const urls = settings.workerCodeUrls || WORKER_CODE_URLS;
  const url = urls[type] || urls.edgetunnel;
  const res = await fetch(url);
  if (!res.ok) throw new Error('دریافت کد ورکر ناموفق: ' + type);
  return res.text();
}

function getCompatDate() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function generateRandomName() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let name = 'hv-';
  for (let i = 0; i < 8; i++) name += chars.charAt(Math.floor(Math.random() * chars.length));
  return name;
}

function getKvBindingName(workerType) {
  if (workerType === 'cfnew') return 'C';
  if (workerType === 'cfnext') return 'K';
  if (workerType === 'hamedvpns') return 'SESSIONS_KV';
  return 'KV';
}

function getD1BindingName(workerType) {
  if (workerType === 'hamedvpns') return 'IOT_DB';
  return 'DB';
}

function usesD1(workerType) {
  return workerType === 'RezaGROOTZ' || workerType === 'hamedvpns';
}

function buildBindings(kvId, uuid, workerType, hamedvpnsSocks5List, d1Uuid) {
  const bindingName = getKvBindingName(workerType);
  const varName = workerType === 'edgetunnel' ? 'ADMIN' : ((workerType === 'cfnew' || workerType === 'cfnext') ? 'U' : 'UUID');
  const varValue = workerType === 'edgetunnel' ? 'HamedVPNS' : uuid;
  
  const bindings = [
    { name: 'UUID', type: 'secret_text', text: uuid },
    { name: 'userID', type: 'secret_text', text: uuid }
  ];

  if (kvId) {
    bindings.unshift({ name: bindingName, type: 'kv_namespace', namespace_id: kvId });
  }

  if (d1Uuid && usesD1(workerType)) {
    bindings.push({ name: getD1BindingName(workerType), type: 'd1', id: d1Uuid });
  }

  if (varName !== 'UUID' && varName !== 'userID') {
    bindings.push({ name: varName, type: 'secret_text', text: varValue });
  }
  if (workerType === 'hamedvpns') {
    bindings.push({ name: 'SOCKS5', type: 'secret_text', text: hamedvpnsSocks5List || HAMEDVPNS_SOCKS5_LIST });
  }
  return bindings;
}

async function deployToWorker(apiToken, accountId, workerName, code, kvId, uuid, workerType, regionCode, hamedvpnsSocks5List, d1Uuid) {
  const bindings = buildBindings(kvId, uuid, workerType, hamedvpnsSocks5List, d1Uuid);
  const metadata = {
    main_module: 'worker.js',
    bindings: bindings,
    compatibility_date: getCompatDate()
  };
  if (regionCode) {
    metadata.placement = { region: 'azure:' + regionCode };
  }

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('worker.js', new Blob([code], { type: 'application/javascript+module' }), 'worker.js');

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}`,
    { method: 'PUT', headers: { Authorization: 'Bearer ' + apiToken }, body: form }
  );
  if (!res.ok) throw new Error('دپلوی Worker ناموفق: ' + (await res.text()));

  const enableRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}/subdomain`,
    {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: true })
    }
  );
  if (!enableRes.ok) throw new Error('فعالسازی دامنه workers.dev ناموفق: ' + (await enableRes.text()));

  const subRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/subdomain`,
    { headers: { Authorization: 'Bearer ' + apiToken } }
  );
  if (!subRes.ok) throw new Error('subdomain پیدا نشد');
  const subData = await subRes.json();
  const subdomain = subData.result?.subdomain;
  if (!subdomain) throw new Error('subdomain پیدا نشد');
  return workerName + '.' + subdomain + '.workers.dev';
}

async function bindAndDeployPagesCode(apiToken, accountId, projectName, code, kvId, uuid, workerType, hamedvpnsSocks5List, d1Uuid) {
  const bindingName = getKvBindingName(workerType);
  const varName = workerType === 'edgetunnel' ? 'ADMIN' : ((workerType === 'cfnew' || workerType === 'cfnext') ? 'U' : 'UUID');
  const varValue = workerType === 'edgetunnel' ? 'HamedVPNS' : uuid;

  const envVars = {
    UUID: { type: 'secret_text', value: uuid },
    userID: { type: 'secret_text', value: uuid }
  };
  if (varName !== 'UUID' && varName !== 'userID') {
    envVars[varName] = { type: 'secret_text', value: varValue };
  }
  if (workerType === 'hamedvpns') {
    envVars.SOCKS5 = { type: 'secret_text', value: hamedvpnsSocks5List || HAMEDVPNS_SOCKS5_LIST };
  }

  const productionConfig = {
    env_vars: envVars,
    compatibility_date: getCompatDate()
  };

  if (kvId) {
    productionConfig.kv_namespaces = {};
    productionConfig.kv_namespaces[bindingName] = { namespace_id: kvId };
  }

  if (d1Uuid && usesD1(workerType)) {
    productionConfig.d1_databases = {};
    productionConfig.d1_databases[getD1BindingName(workerType)] = { id: d1Uuid };
  }

  const bindRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
    {
      method: 'PATCH',
      headers: { Authorization: 'Bearer ' + apiToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_configs: {
          production: productionConfig
        }
      })
    }
  );
  if (!bindRes.ok) throw new Error('تنظیم binding های Pages ناموفق: ' + (await bindRes.text()));

  const form = new FormData();
  form.append('branch', 'main');
  form.append('manifest', '{}');
  form.append('_worker.js', new Blob([code], { type: 'application/javascript+module' }), '_worker.js');

  const deployRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`,
    { method: 'POST', headers: { Authorization: 'Bearer ' + apiToken }, body: form }
  );
  if (!deployRes.ok) throw new Error('دپلوی Pages ناموفق: ' + (await deployRes.text()));
}

async function deployToPages(apiToken, accountId, projectName, code, kvId, uuid, workerType, hamedvpnsSocks5List, d1Uuid) {
  const createRes = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects`,
    {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiToken, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: projectName, production_branch: 'main' })
    }
  );
  if (!createRes.ok) throw new Error('ساخت پروژه Pages ناموفق: ' + (await createRes.text()));
  const createData = await createRes.json();
  const actualName = createData.result?.name || projectName;
  const subdomain = createData.result?.subdomain || (actualName + '.pages.dev');

  await bindAndDeployPagesCode(apiToken, accountId, actualName, code, kvId, uuid, workerType, hamedvpnsSocks5List, d1Uuid);

  return { domain: subdomain, name: actualName };
}

async function getExistingWorkerBindings(apiToken, accountId, workerName) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/${workerName}/settings`,
    { headers: { Authorization: 'Bearer ' + apiToken } }
  );
  if (!res.ok) throw new Error('این Worker روی این حساب پیدا نشد');
  const data = await res.json();
  const bindings = data.result?.bindings || [];
  const kvBinding = bindings.find(b => b.type === 'kv_namespace');
  const d1Binding = bindings.find(b => b.type === 'd1');
  return {
    kvId: kvBinding ? kvBinding.namespace_id : null,
    d1Uuid: d1Binding ? d1Binding.id : null
  };
}

async function getExistingPagesBindings(apiToken, accountId, projectName) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
    { headers: { Authorization: 'Bearer ' + apiToken } }
  );
  if (!res.ok) throw new Error('این پروژه Pages روی این حساب پیدا نشد');
  const data = await res.json();
  const kvNs = data.result?.deployment_configs?.production?.kv_namespaces || {};
  const firstKey = Object.keys(kvNs)[0];
  const d1Db = data.result?.deployment_configs?.production?.d1_databases || {};
  const firstD1Key = Object.keys(d1Db)[0];
  return {
    kvId: firstKey ? kvNs[firstKey].namespace_id : null,
    d1Uuid: firstD1Key ? d1Db[firstD1Key].id : null
  };
}

async function runUpdatePanel(chatId, messageId, userId, kv, panelIndex, botToken) {
  const user = await getUser(kv, userId);
  const panel = (user.panels || [])[panelIndex];
  if (!panel) {
    await editMessage(chatId, messageId, '❌ این پنل پیدا نشد (شاید قبلاً حذف شده).', backToMainKeyboard(), botToken);
    return;
  }
  if (panel.type === 'edgetunnel') {
    await editMessage(chatId, messageId,
      '⚠️ این پنل از نوع EdgeTunnel است.\n\nآیا رمز ADMIN رو دستی عوض کردی؟',
      {
        inline_keyboard: [
          [{ text: '✅ نه، پیش‌فرضه (HamedVPNS)', callback_data: 'updateconfirm|' + panelIndex + '|default' }],
          [{ text: '⚠️ آره، دستی عوضش کردم', callback_data: 'updateconfirm|' + panelIndex + '|manual' }],
          [{ text: '🔙 بازگشت', callback_data: 'manage_panels' }]
        ]
      },
      botToken
    );
    return;
  }
  await performPanelUpdate(chatId, messageId, userId, kv, panelIndex, botToken);
}

async function performPanelUpdate(chatId, messageId, userId, kv, panelIndex, botToken) {
  const user = await getUser(kv, userId);
  const panel = (user.panels || [])[panelIndex];
  if (!panel) {
    await editMessage(chatId, messageId, '❌ این پنل پیدا نشد (شاید قبلاً حذف شده).', backToMainKeyboard(), botToken);
    return;
  }

  let account = (user.accounts || []).find(a => a.accountId === panel.accountId);
  if (!account) {
    for (const a of (user.accounts || [])) {
      try {
        if (panel.platform === 'pages') {
          await getExistingPagesBindings(a.token, a.accountId, panel.name);
        } else {
          await getExistingWorkerBindings(a.token, a.accountId, panel.name);
        }
        account = a;
        break;
      } catch (e) {}
    }
  }
  if (!account) {
    await editMessage(chatId, messageId, '❌ حساب کلودفلر مربوط به این پنل پیدا نشد.', backToMainKeyboard(), botToken);
    return;
  }

  await editMessage(chatId, messageId, '⏳ در حال آپدیت کد «' + panel.name + '»...\n\nصبر کنید.', null, botToken);

  try {
    const settings = await getEffectiveSettings(kv);
    const code = await fetchWorkerCode(panel.type, kv);
    if (panel.platform === 'pages') {
      const bindings = await getExistingPagesBindings(account.token, account.accountId, panel.name);
      await bindAndDeployPagesCode(account.token, account.accountId, panel.name, code, bindings.kvId, panel.uuid, panel.type, settings.hamedvpnsSocks5List, panel.d1Uuid || bindings.d1Uuid);
    } else {
      const bindings = await getExistingWorkerBindings(account.token, account.accountId, panel.name);
      await deployToWorker(account.token, account.accountId, panel.name, code, bindings.kvId, panel.uuid, panel.type, null, settings.hamedvpnsSocks5List, panel.d1Uuid || bindings.d1Uuid);
    }
    await editMessage(chatId, messageId,
      '✅ کد «' + panel.name + '» با موفقیت آپدیت شد.\n\nUUID و آدرس قبلی دست‌نخورده باقی ماندند.',
      backToMainKeyboard(),
      botToken
    );
  } catch (err) {
    await editMessage(chatId, messageId,
      '❌ <b>آپدیت ناموفق</b>\n\n<code>' + err.message + '</code>',
      backToMainKeyboard(),
      botToken
    );
  }
}

async function enrichIPsWithGeo(ips) {
  const geoMap = {};
  try {
    const limitedIps = ips.slice(0, 100);
    const chunk = limitedIps.map(item => item.ip);
    if (chunk.length > 0) {
      const res = await fetch('http://ip-api.com/batch?fields=status,country,countryCode,query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chunk)
      });
      if (res.ok) {
        const results = await res.json();
        for (const r of results) {
          if (r.status === 'success') {
            geoMap[r.query] = { country: r.country, countryCode: r.countryCode };
          }
        }
      }
    }
  } catch (e) {}
  return ips.map(item => {
    const geo = geoMap[item.ip];
    return Object.assign({}, item, {
      country: geo ? geo.country : null,
      countryCode: geo ? geo.countryCode : null,
      flag: geo ? countryCodeToFlag(geo.countryCode) : '🌐'
    });
  });
}

async function fetchDefaultIPs(kv) {
  try {
    const settings = kv ? await getEffectiveSettings(kv) : { ipsUrl: IPS_URL };
    const url = settings.ipsUrl || IPS_URL;
    const res = await fetch(url + '?ts=' + Date.now());
    if (!res.ok) return [{ ip: 'cdnjs.cloudflare.com', flag: '🌐' }, { ip: 'cloudflare.com', flag: '🌐' }];
    const text = await res.text();
    const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    const ips = lines.map(ip => ({ ip: ip, port: 80 }));
    return await enrichIPsWithGeo(ips);
  } catch {
    return [{ ip: 'cdnjs.cloudflare.com', flag: '🌐' }, { ip: 'cloudflare.com', flag: '🌐' }];
  }
}

function countryCodeToFlag(cc) {
  if (!cc || cc.length !== 2) return '🌐';
  const points = cc.toUpperCase().split('').map(c => 0x1F1E6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(points[0], points[1]);
}

const DEFAULT_FRAGMENT_RULES = [
  { packets: 'tlshello', lengths: ['0', '104', '1'], delays: ['0'], maxSplit: '0' },
  { packets: '1-1', lengths: ['114', '1'], delays: ['1'], maxSplit: '11' }
];

function normalizeFragmentRules(rules) {
  if (!Array.isArray(rules) || rules.length < 1 || rules.length > 4) {
    throw new Error('تعداد قانون‌های فرگمنت باید بین ۱ تا ۴ باشد');
  }
  const tokenRe = /^\d{1,6}(-\d{1,6})?$/;
  const str = function(v) { return String(v === undefined || v === null ? '' : v).trim(); };
  const toList = function(v, label, idx) {
    const arr = Array.isArray(v) ? v : str(v).split(',');
    const out = arr.map(function(x) { return str(x); }).filter(function(x) { return x.length > 0; });
    if (out.length < 1 || out.length > 6) throw new Error('قانون ' + (idx + 1) + ': «' + label + '» باید ۱ تا ۶ عدد باشد');
    out.forEach(function(x) {
      if (!tokenRe.test(x)) throw new Error('قانون ' + (idx + 1) + ': مقدار «' + x.slice(0, 20) + '» در «' + label + '» معتبر نیست');
    });
    return out;
  };
  return rules.map(function(r, idx) {
    if (!r || typeof r !== 'object') throw new Error('قانون ' + (idx + 1) + ' نامعتبر است');
    const packets = str(r.packets);
    if (!(packets === 'tlshello' || tokenRe.test(packets))) throw new Error('قانون ' + (idx + 1) + ': packets نامعتبر');
    const maxSplit = str(r.maxSplit);
    if (!tokenRe.test(maxSplit)) throw new Error('قانون ' + (idx + 1) + ': maxSplit نامعتبر');
    return { packets: packets, lengths: toList(r.lengths, 'lengths', idx), delays: toList(r.delays, 'delays', idx), maxSplit: maxSplit };
  });
}

function safeFragmentRules(rules) {
  try { return normalizeFragmentRules(rules); } catch (e) { return DEFAULT_FRAGMENT_RULES; }
}

function buildFragmentParam(rules) {
  const list = safeFragmentRules(rules);
  return encodeURIComponent(JSON.stringify({
    tcp: list.map(function(r) {
      return { type: 'fragment', settings: { packets: r.packets, lengths: r.lengths, delays: r.delays, maxSplit: r.maxSplit } };
    })
  }));
}

const ECH_PARAM = '&ech=cloudflare-ech.com%2Budp%3A%2F%2F1.1.1.1';

function generateConfigs(domain, uuid, ips, ports, socks5Countries, regionLabel, workerType, socks5PoolsOverride, fragmentRules) {
  const pools = socks5PoolsOverride || SOCKS5_POOLS;
  const configs = [];
  const extra = (workerType === 'cfnew' || workerType === 'cfnext' || workerType === 'RezaGROOTZ') ? '&insecure=0&allowInsecure=0' : '';
  const countries = (socks5Countries && socks5Countries.length) ? socks5Countries : ['direct'];
  const needsFragment = true;
  const fragParam = buildFragmentParam(fragmentRules);

  for (const country of countries) {
    const socks5Cred = (country !== 'direct' && pools[country]) ? pools[country][0] : null;
    for (const ipItem of ips) {
      const ip = typeof ipItem === 'string' ? ipItem : ipItem.ip;
      const ipCountryCode = typeof ipItem === 'object' && ipItem.countryCode ? ipItem.countryCode : null;
      const ipFlag = typeof ipItem === 'object' && ipItem.flag ? ipItem.flag : '🌐';
      for (const port of ports) {
        const security = [80, 8080, 2052, 8880, 2086, 2082, 2095].includes(Number(port)) ? 'none' : 'tls';

        let wsPath = '/';
        if (workerType === 'cfnext') {
          wsPath = '/' + uuid + '?ed=2048';
          if (socks5Cred) wsPath += '&socks5=' + socks5Cred;
        } else {
          if (socks5Cred) wsPath += '?socks5=' + socks5Cred;
        }
        const path = encodeURIComponent(wsPath);

        let remark = '@HamedVPNS ❤️‍🔥';
        if (country !== 'direct') remark += ' S5 : ' + country + ' ' + countryCodeToFlag(country);
        if (ipCountryCode) remark += ' CF : ' + ipCountryCode + ' ' + ipFlag;
        if (regionLabel) remark += ' Region : ' + regionLabel;

        const baseConfig = `vless://${uuid}@${ip}:${port}?path=${path}&security=${security}&encryption=none${extra}&host=${domain}&fp=chrome&type=ws&sni=${domain}`;
        configs.push(baseConfig + ECH_PARAM + '#' + encodeURIComponent(remark));

        if (needsFragment && security === 'tls') {
          const fragRemark = remark + ' | Frag';
          configs.push(
            `vless://${uuid}@${ip}:${port}?path=${path}&security=${security}&encryption=none&fm=${fragParam}&insecure=0&host=${domain}&fp=unsafe&type=ws&allowInsecure=0&sni=${domain}${ECH_PARAM}#${encodeURIComponent(fragRemark)}`
          );
        }

        configs.push(baseConfig + '#' + encodeURIComponent(remark + ' | Plain'));
      }
    }
  }
  return configs.join('\n');
}

async function runRefreshSub(chatId, messageId, userId, kv, panelIndex, botToken) {
  const user = await getUser(kv, userId);
  const panel = (user.panels || [])[panelIndex];
  if (!panel) {
    await editMessage(chatId, messageId, '❌ این پنل پیدا نشد (شاید قبلاً حذف شده).', backToMainKeyboard(), botToken);
    return;
  }

  await editMessage(chatId, messageId, '⏳ در حال آپدیت ساب «' + panel.name + '»...', null, botToken);

  try {
    const settings = await getEffectiveSettings(kv);
    const ips = await fetchDefaultIPs(kv);
    const regionEntry = panel.region ? AZURE_REGIONS.find(r => r.code === panel.region) : null;
    const regionLabel = regionEntry ? regionEntry.name : null;
    const ports = [80, 443];
    const socks5 = (panel.socks5 && panel.socks5.length) ? panel.socks5 : ['direct'];
    const configs = generateConfigs(panel.domain, panel.uuid, ips, ports, socks5, regionLabel, panel.type, settings.socks5Pools, settings.fragment && settings.fragment.rules);

    if (kv && typeof kv.put === 'function') {
      await kv.put('subw:' + panel.domain.toLowerCase(), configs);
    }
    try {
      await fetch(PANEL_URL + '/api/save-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: panel.domain, configs: configs, workerType: panel.type })
      });
    } catch (e) {}

    await editMessage(chatId, messageId,
      '✅ ساب «' + panel.name + '» با لیست آی‌پی تازه آپدیت شد.\n\nلینک ساب نیازی به تغییر در کلاینت ندارد.',
      backToMainKeyboard(),
      botToken
    );
  } catch (err) {
    await editMessage(chatId, messageId,
      '❌ <b>آپدیت ساب ناموفق</b>\n\n<code>' + err.message + '</code>',
      backToMainKeyboard(),
      botToken
    );
  }
}

async function runDeploy(chatId, messageId, userId, kv, options, botToken) {
  const user = await getUser(kv, userId);
  const accounts = user.accounts || [];
  if (!accounts.length) {
    await editMessage(chatId, messageId, '❌ ابتدا یک حساب کلودفلر اضافه کنید.', backToMainKeyboard(), botToken);
    return;
  }
  const account = accounts.find(a => a.accountId === options.accountId) || accounts[0];

  const platform = options.platform;
  const workerType = options.workerType;
  const workerName = options.name || generateRandomName();
  const ports = [80, 443];
  const socks5 = options.socks5 && options.socks5.length ? options.socks5 : ['direct'];
  const regionCode = options.region || null;

  await editMessage(chatId, messageId,
    '⏳ در حال دپلوی...\n\n' +
    'حساب: <b>' + (account.label || account.accountId) + '</b>\n' +
    'پلتفرم: <b>' + (platform === 'pages' ? 'Pages' : 'Worker') + '</b>\n' +
    'نوع: <b>' + workerType + '</b>\n' +
    'نام: <code>' + workerName + '</code>\n\nلطفاً صبر کنید...',
    null,
    botToken
  );

  let createdD1Uuid = null;
  let workerDeployed = false;
  try {
    const apiToken = account.token;
    const accountId = account.accountId;
    await assertNameAvailable(apiToken, accountId, workerName, platform);
    const uuid = generateUUID();

    let kvId = null;
    let d1Uuid = null;

    if (workerType === 'RezaGROOTZ') {
      d1Uuid = await createD1Database(apiToken, accountId, workerName);
      createdD1Uuid = d1Uuid;
    } else if (workerType === 'hamedvpns') {
      kvId = await getOrCreateKVNamespace(apiToken, accountId, 'SESSIONS_KV');
      d1Uuid = await createD1Database(apiToken, accountId, workerName, 'iot-db-');
      createdD1Uuid = d1Uuid;
    } else {
      kvId = await getOrCreateKVNamespace(apiToken, accountId, 'HV_SHARED_KV');
    }

    const settings = await getEffectiveSettings(kv);
    const code = await fetchWorkerCode(workerType, kv);

    let domain, finalName;
    if (platform === 'pages') {
      const result = await deployToPages(apiToken, accountId, workerName, code, kvId, uuid, workerType, settings.hamedvpnsSocks5List, d1Uuid);
      domain = result.domain;
      finalName = result.name;
    } else {
      domain = await deployToWorker(apiToken, accountId, workerName, code, kvId, uuid, workerType, regionCode, settings.hamedvpnsSocks5List, d1Uuid);
      finalName = workerName;
    }
    workerDeployed = true;

    const ips = await fetchDefaultIPs(kv);
    const regionEntry = AZURE_REGIONS.find(r => r.code === regionCode);
    const regionLabel = regionEntry ? regionEntry.name : null;
    const configs = generateConfigs(domain, uuid, ips, ports, socks5, regionLabel, workerType, settings.socks5Pools, settings.fragment && settings.fragment.rules);

    if (kv && typeof kv.put === 'function') {
      await kv.put('subw:' + domain.toLowerCase(), configs);
    }

    try {
      await fetch(PANEL_URL + '/api/save-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: domain,
          configs: configs,
          workerType: workerType
        })
      });
    } catch (e) {}

    const subUrl = BOT_BASE_URL + '/sub?domain=' + encodeURIComponent(domain);
    const loginMeta = WORKER_LOGIN[workerType] || { loginPath: '', useAdminPassword: false, subPath: '/sub' };
    const loginPath = (loginMeta.loginPath || '').replace('{uuid}', uuid);
    const panelUrl = 'https://' + domain + loginPath;
    const nativeSubPath = (loginMeta.subPath || '/sub').replace('{uuid}', uuid);
    const nativeSubUrl = 'https://' + domain + nativeSubPath;

    const freshUser = await getUser(kv, userId);
    freshUser.panels = freshUser.panels || [];
    freshUser.panels.push({
      name: finalName,
      domain: domain,
      platform: platform,
      type: workerType,
      uuid: uuid,
      accountId: accountId,
      kvId: kvId,
      d1Uuid: d1Uuid,
      ports: ports,
      socks5: socks5,
      region: regionCode,
      subUrl: subUrl,
      panelUrl: panelUrl,
      createdAt: Date.now()
    });
    freshUser.draft = {};
    freshUser.waitingFor = null;
    await saveUser(kv, userId, freshUser);

    let successText =
      '✅ <b>دپلوی با موفقیت انجام شد!</b>\n\n' +
      '📌 نام: <code>' + finalName + '</code>\n' +
      '🌐 دامنه: <code>' + domain + '</code>\n' +
      '🔧 نوع: ' + workerType + ' | ' + platform + '\n' +
      '🆔 UUID: <code>' + uuid + '</code>\n';
    if (workerType === 'hamedvpns') {
      successText += '🔐 KV: <code>SESSIONS_KV</code>\n';
      successText += '🗄 D1: <code>IOT_DB</code>\n';
    }
    if (loginMeta.useAdminPassword) {
      successText += '🔑 رمز ADMIN: <code>' + loginMeta.adminPassword + '</code>\n';
    }
    successText +=
      '\n🔗 <b>لینک ساب:</b>\n<code>' + subUrl + '</code>\n\n' +
      '📄 آدرس پنل:\n<code>' + panelUrl + '</code>';
    if (workerType === 'cfnew' || workerType === 'cfnext' || workerType === 'RezaGROOTZ') {
      successText += '\n\n📎 لینک ساب داخلی خود ورکر (' + workerType + '):\n<code>' + nativeSubUrl + '</code>';
    }

    await editMessage(chatId, messageId,
      successText,
      {
        inline_keyboard: [
          [{ text: '🚀 ساخت سریع دیگر', callback_data: 'quick_menu' }],
          [{ text: '🔙 منوی اصلی', callback_data: 'main_menu' }]
        ]
      },
      botToken
    );
  } catch (err) {
    if (!workerDeployed) {
      if (createdD1Uuid) await deleteD1Database(account.token, account.accountId, createdD1Uuid);
    }
    await editMessage(chatId, messageId,
      '❌ <b>خطا در دپلوی</b>\n\n<code>' + err.message + '</code>',
      backToMainKeyboard(),
      botToken
    );
  }
}

function draftSummary(d, accounts) {
  const region = d.region ? (AZURE_REGIONS.find(r => r.code === d.region)?.name || d.region) : 'پیش‌فرض';
  const s5 = (d.socks5 || ['direct']).map(c => c === 'direct' ? 'مستقیم' : (SOCKS5_NAMES[c] || c)).join('، ');
  const acc = (accounts || []).find(a => a.accountId === d.accountId);
  const accLabel = acc ? (acc.label || acc.accountId) : (d.accountId || '—');
  return 'حساب: <b>' + accLabel + '</b>\n' +
    'نوع: <b>' + (d.workerType || '—') + '</b>\n' +
    'پلتفرم: <b>' + (d.platform === 'pages' ? 'Pages' : 'Worker') + '</b>\n' +
    'نام: <code>' + (d.name || '—') + '</code>\n' +
    'پورت‌ها: <code>' + (d.ports || DEFAULT_PORTS).join(', ') + '</code>\n' +
    'SOCKS5: ' + s5 + '\n' +
    'ریجن: ' + region;
}

async function handleStart(chatId, userId, kv, botToken) {
  if (!kv) {
    await sendMessage(chatId, '⚠️ <b>خطای بحرانی:</b> دیتابیس KV به ورکر متصل نشده است!\n\nلطفاً در داشبورد کلودفلر، بخش Settings > Variables and KV، حتماً یک KV Namespace با نام <code>BOT_KV</code> متصل کنید.', null, botToken);
    return;
  }
  const user = await getUser(kv, userId);
  const accCount = (user.accounts || []).length;

  let text = '⚡ <b>پنل مدیریت HamedVPNS در تلگرام</b> ⚡\n\n';

  if (!accCount) {
    text += '👋 <b>خوش اومدی!</b>\n\n';
    text += 'برای شروع فقط ۳ قدم داری:\n\n';
    text += '1️⃣ اگه حساب کلودفلر نداری، دکمه <b>📝 ثبت نام کلودفلر</b> رو بزن\n';
    text += '2️⃣ دکمه <b>🛠 ساخت توکن کلودفلر</b> رو بزن و توکن رو با مجوزهای پیش‌فرض ذخیره کن\n';
    text += '3️⃣ از <b>🔑 حساب‌های کلودفلر</b> توکن رو به ربات بده\n\n';
    text += 'بعدش می‌تونی از <b>⚡ ساخت سریع</b> یه پنل بسازی!\n\n';
    text += '📖 اگه گیر کردی، <b>📖 راهنما</b> رو بزن یا دستور /whoami رو بفرست تا وضعیتت رو ببینی.';
  } else {
    text += '✅ ' + accCount + ' حساب کلودفلر ذخیره داری.\n\n';
    text += 'از منوی زیر انتخاب کن:';
  }

  await sendMessage(chatId, text, mainMenuKeyboard(), botToken);
}

async function handleHelp(chatId, messageId, botToken) {
  const text =
    '📖 <b>راهنمای HamedVPNS Bot</b>\n\n' +
    '1️⃣ اگه حساب کلودفلر نداری، دکمه <b>ثبت نام کلودفلر</b> رو بزن و اکانت بساز.\n\n' +
    '2️⃣ دکمه <b>ساخت توکن کلودفلر</b> رو بزن و یک Custom Token با پرمیشن‌های Worker, Pages, D1 و KV بساز.\n\n' +
    '3️⃣ از بخش <b>حساب‌های کلودفلر</b> توکن رو اضافه کن.\n\n' +
    '4️⃣ برای شروع سریع، <b>ساخت سریع</b> رو انتخاب کن.\n\n' +
    '5️⃣ لینک‌های قبلیت همیشه توی <b>لینک‌های ساب من</b> ذخیره میشن.\n\n' +
    '🩺 <b>عیب‌یابی:</b> اگه مشکلی داشتی، دستور /whoami رو بفرست تا وضعیت توکن و مجوزهات رو ببینی.';
  await editMessage(chatId, messageId, text, backToMainKeyboard(), botToken);
}

async function handleWhoami(chatId, userId, msg, kv, botToken) {
  const user = await getUser(kv, userId);
  const accounts = user.accounts || [];
  const panels = user.panels || [];

  let diag = '🩺 <b>وضعیت حساب شما</b>\n\n';
  diag += '🆔 آیدی تلگرام شما: <code>' + userId + '</code>\n';
  diag += '💬 چت: <code>' + chatId + '</code>\n';
  diag += '👤 نام: ' + ((msg.from && msg.from.first_name) || '') + ' ' + ((msg.from && msg.from.last_name) || '') + '\n';
  diag += '🔗 یوزرنیم: ' + ((msg.from && msg.from.username) ? '@' + msg.from.username : '—') + '\n\n';
  diag += '☁️ تعداد اکانت کلودفلر ذخیره‌شده: <b>' + accounts.length + '</b>\n';
  diag += '📊 تعداد پنل‌ها: <b>' + panels.length + '</b>\n\n';

  if (!accounts.length) {
    diag += '⚠️ هیچ اکانتی ذخیره نکردی.\n\n';
    diag += '👉 اول از منو «🔑 حساب‌های کلودفلر» → «➕ افزودن حساب جدید» رو بزن و توکن کلودفلر رو اضافه کن.';
    await sendMessage(chatId, diag, backToMainKeyboard(), botToken);
    return;
  }

  diag += '🔍 <b>بررسی مجوزهای توکن‌ها:</b>\n\n';

  for (const a of accounts) {
    diag += '▪️ <b>' + (a.label || a.accountId) + '</b>\n';
    diag += '   <code>' + a.accountId + '</code>\n';

    let permInfo = '';

    try {
      const d1Check = await fetch('https://api.cloudflare.com/client/v4/accounts/' + a.accountId + '/d1/database', {
        headers: { 'Authorization': 'Bearer ' + a.token }
      });
      permInfo += d1Check.ok ? '   🟢 D1: OK\n' : '   🔴 D1: خطا ' + d1Check.status + '\n';
    } catch (e) {
      permInfo += '   ⚠️ D1: ' + e.message + '\n';
    }

    try {
      const wCheck = await fetch('https://api.cloudflare.com/client/v4/accounts/' + a.accountId + '/workers/scripts', {
        headers: { 'Authorization': 'Bearer ' + a.token }
      });
      permInfo += wCheck.ok ? '   🟢 Workers: OK\n' : '   🔴 Workers: خطا ' + wCheck.status + '\n';
    } catch (e) {
      permInfo += '   ⚠️ Workers: ' + e.message + '\n';
    }

    try {
      const kvCheck = await fetch('https://api.cloudflare.com/client/v4/accounts/' + a.accountId + '/storage/kv/namespaces?per_page=1', {
        headers: { 'Authorization': 'Bearer ' + a.token }
      });
      permInfo += kvCheck.ok ? '   🟢 KV: OK\n' : '   🔴 KV: خطا ' + kvCheck.status + '\n';
    } catch (e) {
      permInfo += '   ⚠️ KV: ' + e.message + '\n';
    }

    try {
      const pCheck = await fetch('https://api.cloudflare.com/client/v4/accounts/' + a.accountId + '/pages/projects', {
        headers: { 'Authorization': 'Bearer ' + a.token }
      });
      permInfo += pCheck.ok ? '   🟢 Pages: OK\n' : '   🔴 Pages: خطا ' + pCheck.status + '\n';
    } catch (e) {
      permInfo += '   ⚠️ Pages: ' + e.message + '\n';
    }

    diag += permInfo + '\n';
  }

  diag += '💡 <b>راهنما:</b>\n';
  diag += '• اگه هر کدوم از دسترسی‌ها قرمز بود، باید توکن رو با لینک «🛠 ساخت توکن کلودفلر» دوباره بسازی.\n';
  diag += '• برای HamedVPNS نیاز به مجوز D1 هست، حتماً موقع ساخت توکن «Account → D1 → Edit» رو فعال کن.';

  await sendMessage(chatId, diag, backToMainKeyboard(), botToken);
}

async function handleUpdate(update, env) {
  const kv = getKV(env);
  const botToken = getBotToken(env);

  if (!kv) {
    if (update.message) {
      await sendMessage(update.message.chat.id, '❌ <b>خطا:</b> متغیر <code>BOT_KV</code> در تنظیمات ورکر بایند نشده است.', null, botToken);
    } else if (update.callback_query && update.callback_query.message) {
      await sendMessage(update.callback_query.message.chat.id, '❌ <b>خطا:</b> متغیر <code>BOT_KV</code> در تنظیمات ورکر بایند نشده است.', null, botToken);
    }
    return;
  }

  if (update.message) {
    const msg = update.message;
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = (msg.text || '').trim();

    if (text === '/start' || text === '/menu') {
      await handleStart(chatId, userId, kv, botToken);
      return;
    }

    if (text === '/whoami' || text === '/diag') {
      await handleWhoami(chatId, userId, msg, kv, botToken);
      return;
    }

    const user = await getUser(kv, userId);
    const looksLikeToken = text.length >= 30 && text.length <= 60 && !text.includes(' ') && !text.includes('\n');

    if (user.waitingFor === 'token' || looksLikeToken) {
      if (text.length < 20) {
        await sendMessage(chatId, '❌ توکن نامعتبر به نظر می‌رسد. دوباره ارسال کن.', backToMainKeyboard(), botToken);
        return;
      }

      await sendMessage(chatId, '⏳ در حال بررسی و اعتبارسنجی توکن کلودفلر...', null, botToken);

      try {
        const accountId = await getAccountId(text);
        const email = await getAccountEmail(text);
        const label = email || accountId;

        user.accounts = user.accounts || [];
        const idx = user.accounts.findIndex(a => a.accountId === accountId);
        if (idx >= 0) {
          user.accounts[idx].token = text;
          user.accounts[idx].label = label;
        } else {
          user.accounts.push({ accountId, token: text, label });
        }

        user.waitingFor = null;
        await saveUser(kv, userId, user);

        await sendMessage(chatId,
          '✅ <b>حساب با موفقیت اضافه شد و در دیتابیس KV ذخیره گردید!</b>\n\n' +
          '👤 شناسه/ایمیل: <code>' + label + '</code>\n' +
          '🔑 اکانت ID: <code>' + accountId + '</code>\n\n' +
          'تعداد حساب‌های فعال شما: ' + user.accounts.length,
          mainMenuKeyboard(),
          botToken
        );
      } catch (e) {
        await sendMessage(
          chatId,
          '❌ <b>خطا در ثبت توکن:</b>\n<code>' + e.message + '</code>\n\n' +
          'مطمئن شوید توکن دسترسی‌های لازم (Account Settings, Workers, Pages, KV, D1) را دارد.',
          accountsManageKeyboard(user.accounts || []),
          botToken
        );
      }
      return;
    }

    if (user.waitingFor === 'adv_name') {
      let name = text.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '').slice(0, 58);
      if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
        await sendMessage(chatId, '❌ نام فقط حروف کوچک انگلیسی، عدد و خط تیره باشد.', null, botToken);
        return;
      }
      user.draft.name = name;
      user.waitingFor = null;
      user.draft.ports = user.draft.ports || [80, 443];
      await saveUser(kv, userId, user);
      await sendMessage(chatId, 'پورت‌ها را انتخاب کن:', portsKeyboard(user.draft.ports), botToken);
      return;
    }

    await sendMessage(chatId, 'از دکمه‌های منو استفاده کن یا /start را بزن.\n\n🩺 برای عیب‌یابی: /whoami', mainMenuKeyboard(), botToken);
    return;
  }

  if (update.callback_query) {
    const cb = update.callback_query;
    const chatId = cb.message ? cb.message.chat.id : cb.from.id;
    const messageId = cb.message ? cb.message.message_id : null;
    const userId = cb.from.id;
    const data = cb.data || '';

    await answerCallback(cb.id, '', botToken);

    const user = await getUser(kv, userId);

    if (data === 'main_menu') {
      user.waitingFor = null;
      await saveUser(kv, userId, user);
      let text = '⚡ <b>پنل مدیریت HamedVPNS در تلگرام</b> ⚡\n\nاز گزینه های زیر یکی رو انتخاب کن :';
      if (!(user.accounts || []).length) text += '\n\n⚠️ هیچ حساب کلودفلری ذخیره نشده.';
      await editMessage(chatId, messageId, text, mainMenuKeyboard(), botToken);
      return;
    }

    if (data === 'quick_menu') {
      await editMessage(chatId, messageId, '⚡ <b>ساخت سریع</b>\n\nیکی از گزینه‌ها را انتخاب کنید :', quickMenuKeyboard(), botToken);
      return;
    }

    if (data.startsWith('quick|')) {
      const parts = data.split('|');
      const accounts = user.accounts || [];
      if (!accounts.length) {
        await editMessage(chatId, messageId, '❌ اول یک حساب کلودفلر اضافه کن.', backToMainKeyboard(), botToken);
        return;
      }
      if (accounts.length === 1) {
        await runDeploy(chatId, messageId, userId, kv, {
          platform: parts[1],
          workerType: parts[2],
          ports: DEFAULT_PORTS,
          socks5: ['direct'],
          accountId: accounts[0].accountId
        }, botToken);
        return;
      }
      user.draft = user.draft || {};
      user.draft.pendingQuick = { platform: parts[1], workerType: parts[2] };
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, '⚡ با کدوم حساب کلودفلر بسازم؟', accountPickKeyboard(accounts), botToken);
      return;
    }

    if (data.startsWith('acc_pick|')) {
      const accountId = data.split('|')[1];
      const acc = (user.accounts || []).find(a => a.accountId === accountId);
      if (!acc) {
        await editMessage(chatId, messageId, '❌ این حساب پیدا نشد.', backToMainKeyboard(), botToken);
        return;
      }
      if (user.draft && user.draft.pendingQuick) {
        const pq = user.draft.pendingQuick;
        user.draft.pendingQuick = null;
        await saveUser(kv, userId, user);
        await runDeploy(chatId, messageId, userId, kv, {
          platform: pq.platform,
          workerType: pq.workerType,
          ports: DEFAULT_PORTS,
          socks5: ['direct'],
          accountId: accountId
        }, botToken);
        return;
      }
      user.draft = user.draft || {};
      user.draft.accountId = accountId;
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId,
        '🚀 <b>ساخت پنل پیشرفته</b>\n\nحساب: <b>' + (acc.label || acc.accountId) + '</b>\n\nنوع ورکر را انتخاب کنید:',
        typeKeyboard(),
        botToken
      );
      return;
    }

    if (data === 'manage_token') {
      const accounts = user.accounts || [];
      let text = '🔑 <b>حساب‌های کلودفلر</b>\n\n';
      if (accounts.length) {
        text += 'حساب‌های ذخیره‌شده (' + accounts.length + '):\n';
        accounts.forEach((a, i) => {
          text += (i + 1) + '. ' + (a.label || a.accountId) + '  —  <code>' + a.token.slice(0, 6) + '••••' + a.token.slice(-4) + '</code>\n';
        });
        text += '\nموقع ساخت پنل، اگه بیشتر از یک حساب داشته باشی ازت می‌پرسم کدوم رو استفاده کنم.';
      } else {
        text += 'وضعیت: ❌ هیچ حسابی ذخیره نشده\n\nاول با دکمه ساخت توکن، توکن بساز سپس اضافه‌اش کن.';
      }
      await editMessage(chatId, messageId, text, accountsManageKeyboard(accounts), botToken);
      return;
    }

    if (data === 'set_token') {
      user.waitingFor = 'token';
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, '🔑 توکن API کلودفلر جدید را ارسال کنید:', backToMainKeyboard(), botToken);
      return;
    }

    if (data.startsWith('delacc|')) {
      const accountId = data.split('|')[1];
      user.accounts = (user.accounts || []).filter(a => a.accountId !== accountId);
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, '✅ حساب با موفقیت از دیتابیس حذف شد.', accountsManageKeyboard(user.accounts), botToken);
      return;
    }

    if (data === 'my_subs') {
      const panels = user.panels || [];
      if (!panels.length) {
        await editMessage(chatId, messageId, '📎 هنوز هیچ پنلی نساختی.', backToMainKeyboard(), botToken);
        return;
      }
      let text = '📎 <b>لینک‌های ساب شما</b> (' + panels.length + ')\n\n';
      panels.slice().reverse().forEach((p, i) => {
        const panelUrl = p.panelUrl || ('https://' + p.domain);
        text += (i + 1) + '. <b>' + p.name + '</b>\n   ' + p.platform + ' | ' + p.type + '\n' +
          '   📄 پنل: <code>' + panelUrl + '</code>\n' +
          '   🆔 UUID: <code>' + p.uuid + '</code>\n' +
          '   🔗 ساب: <code>' + p.subUrl + '</code>\n\n';
      });
      await editMessage(chatId, messageId, text, backToMainKeyboard(), botToken);
      return;
    }

    if (data === 'manage_panels') {
      const panels = user.panels || [];
      if (!panels.length) {
        await editMessage(chatId, messageId, '🔧 هنوز پنلی نداری.', backToMainKeyboard(), botToken);
        return;
      }
      let text = '🔧 <b>مدیریت پنل‌ها</b> (' + panels.length + ')\n\n';
      const buttons = [];
      const indexed = panels.map((p, i) => ({ p, i }));
      indexed.slice().reverse().slice(0, 10).forEach(({ p, i }) => {
        text += '• <b>' + p.name + '</b> — ' + p.platform + '/' + p.type + '\n';
        buttons.push([
          { text: '🔄 آپدیت کد', callback_data: 'updatepanel|' + i },
          { text: '🔃 آپدیت ساب', callback_data: 'refreshsub|' + i },
          { text: '🗑 حذف', callback_data: 'delpanel|' + i }
        ]);
      });
      buttons.push([{ text: '🔙 منوی اصلی', callback_data: 'main_menu' }]);
      await editMessage(chatId, messageId, text, { inline_keyboard: buttons }, botToken);
      return;
    }

    if (data.startsWith('delpanel|')) {
      const idx = parseInt(data.split('|')[1], 10);
      const target = (user.panels || [])[idx];
      const name = target ? target.name : null;
      user.panels = (user.panels || []).filter((_, i) => i !== idx);
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, '✅ پنل ' + (name ? '<b>' + name + '</b> ' : '') + 'از دیتابیس حذف شد.', backToMainKeyboard(), botToken);
      return;
    }

    if (data.startsWith('updateconfirm|')) {
      const parts = data.split('|');
      const idx = parseInt(parts[1], 10);
      const answer = parts[2];
      if (answer === 'manual') {
        await editMessage(chatId, messageId,
          '⚠️ چون رمز ADMIN رو دستی عوض کردی، آپدیت خودکار انجام نمیشه.',
          backToMainKeyboard(),
          botToken
        );
        return;
      }
      await performPanelUpdate(chatId, messageId, userId, kv, idx, botToken);
      return;
    }

    if (data.startsWith('updatepanel|')) {
      const idx = parseInt(data.split('|')[1], 10);
      await runUpdatePanel(chatId, messageId, userId, kv, idx, botToken);
      return;
    }

    if (data.startsWith('refreshsub|')) {
      const idx = parseInt(data.split('|')[1], 10);
      await runRefreshSub(chatId, messageId, userId, kv, idx, botToken);
      return;
    }

    if (data === 'help') {
      await handleHelp(chatId, messageId, botToken);
      return;
    }

    if (data === 'deploy_advanced') {
      const accounts = user.accounts || [];
      if (!accounts.length) {
        await editMessage(chatId, messageId, '❌ اول یک حساب کلودفلر اضافه کن.', backToMainKeyboard(), botToken);
        return;
      }
      user.draft = { ports: [80, 443], socks5: ['direct'] };
      if (accounts.length === 1) {
        user.draft.accountId = accounts[0].accountId;
        await saveUser(kv, userId, user);
        await editMessage(chatId, messageId, '🚀 <b>ساخت پنل پیشرفته</b>\n\nنوع ورکر را انتخاب کنید:', typeKeyboard(), botToken);
        return;
      }
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, '🚀 <b>ساخت پنل پیشرفته</b>\n\nبا کدوم حساب کلودفلر می‌سازی؟', accountPickKeyboard(accounts), botToken);
      return;
    }

    if (data.startsWith('adv_type|')) {
      user.draft.workerType = data.split('|')[1];
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, 'روش دپلوی را انتخاب کنید:', platformKeyboard(), botToken);
      return;
    }

    if (data.startsWith('adv_plat|')) {
      user.draft.platform = data.split('|')[1];
      user.waitingFor = 'adv_name';
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, 'اسم پنل را بفرست، یا روی اسم رندوم بزن:', nameKeyboard(), botToken);
      return;
    }

    if (data === 'adv_name|random') {
      user.draft.name = generateRandomName();
      user.waitingFor = null;
      user.draft.ports = user.draft.ports || [80, 443];
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, 'پورت‌ها را انتخاب کن:', portsKeyboard(user.draft.ports), botToken);
      return;
    }

    if (data.startsWith('adv_port|')) {
      const port = parseInt(data.split('|')[1], 10);
      user.draft.ports = user.draft.ports || [80, 443];
      if (user.draft.ports.includes(port)) {
        user.draft.ports = user.draft.ports.filter(p => p !== port);
      } else {
        user.draft.ports.push(port);
      }
      if (!user.draft.ports.length) user.draft.ports = [443];
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, 'پورت‌ها را انتخاب کن:', portsKeyboard(user.draft.ports), botToken);
      return;
    }

    if (data === 'adv_ports_next') {
      if (user.draft.workerType === 'hamedvpns') {
        user.draft.socks5 = ['direct'];
        await saveUser(kv, userId, user);
        await editMessage(chatId, messageId, 'ریجن را انتخاب کنید (فقط روی Worker اعمال می‌شود):', regionKeyboard(), botToken);
        return;
      }
      user.draft.socks5 = user.draft.socks5 || ['direct'];
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, 'کشور SOCKS5 یا اتصال مستقیم را انتخاب کنید:', await socksKeyboard(user.draft.socks5, kv), botToken);
      return;
    }

    if (data.startsWith('adv_s5|')) {
      const code = data.split('|')[1];
      user.draft.socks5 = user.draft.socks5 || [];
      if (user.draft.socks5.includes(code)) {
        user.draft.socks5 = user.draft.socks5.filter(c => c !== code);
      } else {
        user.draft.socks5.push(code);
      }
      if (!user.draft.socks5.length) user.draft.socks5 = ['direct'];
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId, 'کشور SOCKS5 یا اتصال مستقیم را انتخاب کنید:', await socksKeyboard(user.draft.socks5, kv), botToken);
      return;
    }

    if (data === 'adv_s5_next') {
      await editMessage(chatId, messageId, 'ریجن را انتخاب کنید (فقط روی Worker اعمال می‌شود):', regionKeyboard(), botToken);
      return;
    }

    if (data.startsWith('adv_reg|')) {
      user.draft.region = data.split('|')[1] || null;
      await saveUser(kv, userId, user);
      await editMessage(chatId, messageId,
        '✅ <b>تأیید نهایی</b>\n\n' + draftSummary(user.draft, user.accounts) + '\n\nشروع دپلوی؟',
        confirmKeyboard(),
        botToken
      );
      return;
    }

    if (data === 'adv_go') {
      await runDeploy(chatId, messageId, userId, kv, user.draft || {}, botToken);
      return;
    }
  }
}

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const botToken = getBotToken(env);
      const kv = getKV(env);

      if (url.pathname === '/setwebhook') {
        const webhookUrl = url.origin + '/webhook';
        const res = await fetch('https://api.telegram.org/bot' + botToken + '/setWebhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: webhookUrl, secret_token: WEBHOOK_SECRET, allowed_updates: ['message', 'callback_query'] })
        });
        const data = await res.json();
        return new Response(JSON.stringify(data, null, 2), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (url.pathname === '/webhook' && request.method === 'POST') {
        const secretHeader = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
        if (WEBHOOK_SECRET && secretHeader && secretHeader !== WEBHOOK_SECRET) {
          return new Response('Unauthorized', { status: 401 });
        }

        // ✅ مرحله ۱: خواندن بدنه با request.text() (نه request.json()) تا خطا پرتاب نشه
        let update;
        try {
          const rawBody = await request.text();
          if (!rawBody || rawBody.trim() === '') {
            console.error('Webhook received empty body');
            return new Response('ok');
          }
          update = JSON.parse(rawBody);
        } catch (e) {
          console.error('Failed to parse update body:', e);
          return new Response('ok');
        }

        // ✅ مرحله ۲: پردازش update با محافظت کامل
        const processUpdate = async () => {
          try {
            await handleUpdate(update, env);
          } catch (e) {
            console.error('handleUpdate crashed:', e);
            const chatId = (update.message && update.message.chat && update.message.chat.id) ||
                           (update.callback_query && update.callback_query.message && update.callback_query.message.chat.id) ||
                           (update.callback_query && update.callback_query.from && update.callback_query.from.id);
            if (chatId) {
              try {
                await sendMessage(chatId,
                  '❌ <b>خطای غیرمنتظره در ربات</b>\n\n' +
                  '<code>' + (e && e.message ? e.message : String(e)) + '</code>\n\n' +
                  'این پیام رو برای ادمین بفرست یا /whoami رو بزن.',
                  null, botToken);
              } catch (e2) {
                console.error('sendMessage failed:', e2);
              }
            }
          }
        };

        if (ctx && typeof ctx.waitUntil === 'function') {
          ctx.waitUntil(processUpdate());
        } else {
          await processUpdate();
        }

        return new Response('ok');
      }

      if (url.pathname === '/sub') {
        const domainParam = (url.searchParams.get('domain') || '').trim().toLowerCase();
        if (!domainParam) {
          return new Response('پارامتر domain الزامی است', {
            status: 400,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        }
        if (!kv) {
          return new Response('متغیر KV در ورکر بایند نشده است.', {
            status: 500,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        }
        try {
          let configs = await kv.get('subw:' + domainParam);
          if (!configs) {
            return new Response('ساب یافت نشد\n\nممکن است هنوز ذخیره نشده باشد یا دامنه اشتباه باشد.', {
              status: 404,
              headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
          }
          return new Response(configs, {
            headers: {
              'Content-Type': 'text/plain; charset=utf-8',
              'Cache-Control': 'no-cache'
            }
          });
        } catch (e) {
          return new Response('خطا: ' + e.message, {
            status: 500,
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        }
      }

      if (url.pathname === '/' || url.pathname === '') {
        return new Response('HamedVPNS Telegram Bot v1.5.5 (Diagnostics Enabled) ✅\nBot: @' + BOT_USERNAME + '\n\nبرای عیب‌یابی در ربات دستور /whoami را بفرستید.', {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }

      return new Response('Not Found', { status: 404 });
    } catch (globalErr) {
      // ✅ محافظت نهایی: حتی اگه خود fetch خطا بده، پاسخ بده تا خطای 1101 رخ نده
      console.error('fetch global error:', globalErr);
      return new Response('ok', { status: 200 });
    }
  }
};
