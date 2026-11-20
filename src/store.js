// 常量与数据模型（KEY 保持 cvm-v2，历史数据不丢失）
export const FACES = [10, 20, 50, 100, 200]
export const DENOMS = [10, 20, 50, 100, 200]
export const TIMES = 3
export const KEY = 'cvm-v2'
export const TUT_KEY = 'cvm-tut-v2'
export const BANKS = ['boc', 'icbc', 'macaupass', 'luso', 'taifung', 'cgb', 'alipay']
export const NAMES = {
  boc: '中國銀行', icbc: '工銀澳門', macaupass: '澳門通', luso: '澳門國際銀行',
  taifung: '大豐銀行', cgb: '廣發銀行', alipay: '支付寶（澳門）'
}
export const WEEK = ['日', '一', '二', '三', '四', '五', '六']

export const TUT = [
  { h: '歡迎使用消費券管家', t: '今次活動有 7 家贊助單位，每家都有自己的消費券（MOP$10、20、50、100、200），葡幣結算。',
    illu: '<svg width="150" height="110" viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="14" width="52" height="36" rx="10" fill="#0E7C66"/><rect x="30" y="14" width="4" height="36" fill="#F6E7C8"/><circle cx="20" cy="32" r="4" fill="#F6E7C8"/><circle cx="44" cy="32" r="4" fill="#F6E7C8"/></svg>' },
  { h: '先選銀行', t: '點上方銀行的標誌切換，下面顯示那家銀行的券：剩幾張、用幾張。',
    illu: '<svg width="200" height="120" viewBox="0 0 220 130" aria-hidden="true"><g><circle cx="40" cy="40" r="26" fill="#FFFFFF" stroke="#E7EBE8"/><circle cx="40" cy="40" r="12" fill="#0E7C66"/></g><g><circle cx="110" cy="40" r="26" fill="#E5F2EC" stroke="#0E7C66"/><circle cx="110" cy="40" r="12" fill="#0E7C66"/></g><g><circle cx="180" cy="40" r="26" fill="#FFFFFF" stroke="#E7EBE8"/><circle cx="180" cy="40" r="12" fill="#C9D4CD"/></g><rect x="30" y="80" width="160" height="32" rx="10" fill="#FFFFFF" stroke="#E7EBE8"/><rect x="42" y="90" width="60" height="12" rx="5" fill="#F8EBD2"/><rect x="120" y="91" width="48" height="9" rx="4" fill="#C9D4CD"/></svg>' },
  { h: '三步記一筆', t: '① 點面值那一行　② 選「🟢 收券」還是「🔴 用券」　③ 按數量，點確認。',
    illu: '<svg width="200" height="120" viewBox="0 0 200 130" aria-hidden="true"><rect x="14" y="14" width="172" height="104" rx="14" fill="#FFFFFF" stroke="#E7EBE8"/><rect x="30" y="30" width="120" height="22" rx="8" fill="#F8EBD2"/><rect x="30" y="62" width="140" height="26" rx="8" fill="#E5F2EC"/><rect x="30" y="96" width="98" height="16" rx="6" fill="#FBE8E4"/><circle cx="160" cy="30" r="13" fill="#F0F3F1"/><path d="M153 30h14M160 23v14" stroke="#6C7B74" stroke-width="2.4" stroke-linecap="round"/></svg>' },
  { h: '活動週期提醒', t: '週五、六、日＝抽獎＋消費日 🎁；週一至週四＝消費日 🛒，用上週抽到的券。消費滿 MOP$50 可抽獎。用券需消費滿面值 3 倍。🗓 週四會提醒你，週五凌晨自動清理舊券、開始新一週。',
    illu: '<svg width="200" height="120" viewBox="0 0 220 130" aria-hidden="true"><rect x="20" y="20" width="180" height="42" rx="12" fill="#FFF7EC" stroke="#F3D9B0"/><text x="38" y="47" font-size="15" font-weight="700" fill="#B26A13">五六日：抽獎＋消費日</text><rect x="20" y="74" width="180" height="42" rx="12" fill="#E5F2EC" stroke="#BFE0D2"/><text x="38" y="101" font-size="15" font-weight="700" fill="#0E7C66">一至四：消費日</text></svg>' }
]

export function blankBank () {
  const o = {}
  FACES.forEach(f => { o[f] = { got: 0, used: 0 } })
  return o
}

export function blank () {
  const o = {}
  BANKS.forEach(b => { o[b] = blankBank() })
  return o
}

// 宽松迁移校验：老数据逐项补默认，绝不整体丢弃（新增银行/字段时旧数据保留）
export function load () {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (!s || typeof s !== 'object') return null
    BANKS.forEach(b => {
      if (!s[b] || typeof s[b] !== 'object') { s[b] = blankBank(); return }
      FACES.forEach(f => {
        if (!s[b][f] || typeof s[b][f] !== 'object') { s[b][f] = { got: 0, used: 0 }; return }
        if (typeof s[b][f].got !== 'number') s[b][f].got = 0
        if (typeof s[b][f].used !== 'number') s[b][f].used = 0
      })
    })
    return s
  } catch (e) { return null }
}

export function fmt (n) {
  return Math.round(n).toLocaleString('en-US')
}

// 金额数字字号自适应：位数越多字号越小，保证不超出卡片边界且等宽对齐
export function amountFont (n, base, min) {
  const s = fmt(n).length
  const size = Math.max(min, base - (s - 4) * 2.6)
  return size + 'px'
}

// ================= 全局响应式 Store =================
import { reactive, computed } from 'vue'

export const app = reactive({
  state: load() || blank(),
  bank: 'boc',
  curFace: 50,
  mode: 'add',
  qty: 1,
  view: 'main',            // main | stats
  sheetOpen: false,
  showAct: false,
  showHelp: false,
  showTut: false,
  tutPage: 0,
  toastMsg: '',
  toastOn: false,
  errMsg: '',
  clockOffset: 0,          // NTP 与设备时间偏差（毫秒）
  ntpState: 'off',         // off | ok | fail
  _tt: null,

  save () {
    localStorage.setItem(KEY, JSON.stringify(this.state))
  },

  nowUtc8 () {
    return new Date(Date.now() + this.clockOffset + 8 * 3600 * 1000)
  },

  switchBank (b) {
    this.bank = b
    this.qty = 1
  },

  openSheet (f) {
    this.curFace = f
    this.mode = 'add'
    this.qty = 1
    this.errMsg = ''
    this.sheetOpen = true
  },
  closeSheet () { this.sheetOpen = false },

  faceLeft (f) {
    const o = this.state[this.bank][f]
    return o.got - o.used
  },
  used (f) {
    return this.state[this.bank][f].used
  },
  bankTotal (b) {
    const s = this.state[b]
    return FACES.reduce((sum, f) => sum + f * (s[f].got - s[f].used), 0)
  },
  bankNeed (b) {
    const s = this.state[b]
    return FACES.reduce((sum, f) => sum + f * TIMES * (s[f].got - s[f].used), 0)
  },
  allGotAmt () {
    return BANKS.reduce((sum, b) => sum + FACES.reduce((x, f) => x + f * this.state[b][f].got, 0), 0)
  },
  allUsedAmt () {
    return BANKS.reduce((sum, b) => sum + FACES.reduce((x, f) => x + f * this.state[b][f].used, 0), 0)
  },
  allLeftCnt () {
    return BANKS.reduce((sum, b) => sum + FACES.reduce((x, f) => x + (this.state[b][f].got - this.state[b][f].used), 0), 0)
  },

  confirm () {
    const f = this.state[this.bank][this.curFace]
    if (this.mode === 'use' && f.used + this.qty > f.got) {
      this.errMsg = '剩下的不夠用，最多還能用 ' + (f.got - f.used) + ' 張'
      return
    }
    if (this.mode === 'add') { f.got += this.qty } else { f.used += this.qty }
    this.save()
    const label = (this.mode === 'add' ? '🟢 收了 ' : '🔴 用了 ') + this.qty + ' 張 MOP$' + this.curFace + ' 券（' + NAMES[this.bank] + '）'
    const face = this.curFace, mode = this.mode
    this.sheetOpen = false
    this.flyTicket(face, mode)
    this.toast(label)
  },

  useAll () {
    const f = this.state[this.bank][this.curFace]
    const left = f.got - f.used
    if (this.mode !== 'use' || left <= 0) return
    f.used = f.got
    this.save()
    const label = '🔴 用完了 ' + left + ' 張 MOP$' + this.curFace + ' 券（' + NAMES[this.bank] + '）'
    this.sheetOpen = false
    this.flyTicket(this.curFace, 'use')
    this.toast(label)
  },

  resetBank () {
    if (window.confirm('要把「' + NAMES[this.bank] + '」的所有記錄都清零嗎？清零後不能恢復。')) {
      this.state[this.bank] = blankBank()
      this.save()
      this.showHelp = false
      this.toast('已清零，重新開始')
    }
  },

  toast (msg) {
    this.toastMsg = msg
    this.toastOn = true
    clearTimeout(this._tt)
    this._tt = setTimeout(() => { this.toastOn = false }, 2200)
  },

  flyTicket (face, mode) {
    const row = document.querySelector('.row[data-face="' + face + '"]')
    const el = document.createElement('div')
    el.className = 'fly'
    el.innerHTML = '<small>MOP$</small>' + face
    let cx, cy, sx, sy
    if (row) {
      const r = row.getBoundingClientRect()
      cx = r.left + r.width / 2
      cy = r.top + r.height / 2
    } else {
      cx = window.innerWidth / 2
      cy = window.innerHeight / 2
    }
    if (mode === 'add') { sx = window.innerWidth / 2; sy = window.innerHeight + 20 } else { sx = cx; sy = cy }
    el.style.left = sx + 'px'
    el.style.top = sy + 'px'
    document.body.appendChild(el)
    let tx = cx, ty = cy
    if (mode === 'use') { tx = window.innerWidth / 2; ty = window.innerHeight + 20 }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = 'translate(' + (tx - sx) + 'px,' + (ty - sy) + 'px) scale(.72)'
        el.style.opacity = '0'
      })
    })
    setTimeout(() => { el.remove() }, 650)
    if (row) {
      row.classList.remove('bump')
      void row.offsetWidth
      row.classList.add('bump')
    }
  },

  currentCycleFriday () {
    const d = this.nowUtc8()
    const wd = d.getUTCDay()
    const day = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
    let diff
    if (wd === 5) { diff = 0 } else if (wd === 6) { diff = -1 } else if (wd === 0) { diff = -2 } else { diff = -(wd + 2) }
    day.setUTCDate(day.getUTCDate() + diff)
    return day.toISOString().slice(0, 10)
  },

  checkCycle () {
    const friday = this.currentCycleFriday()
    if (this.state.cycleKey !== undefined) {
      if (this.state.cycleKey !== friday) {
        this.state.cycleKey = friday
        BANKS.forEach(b => { this.state[b] = blankBank() })
        this.save()
        this.toast('🗓 新一週開始！上週的券已自動清理')
      }
    } else {
      this.state.cycleKey = friday
      this.save()
    }
  },

  startTut () { this.tutPage = 0; this.showTut = true },
  tutNext () {
    if (this.tutPage === TUT.length - 1) { this.closeTut() } else { this.tutPage++ }
  },
  closeTut () {
    this.showTut = false
    localStorage.setItem(TUT_KEY, '1')
  }
})

// ---------- 计算属性 ----------
export const curTotal = computed(() => app.bankTotal(app.bank))
export const curNeed = computed(() => app.bankNeed(app.bank))
export const allTotal = computed(() => BANKS.reduce((sum, b) => sum + app.bankTotal(b), 0))
export const allNeed = computed(() => allTotal.value * TIMES)
export const allGotAmt = computed(() => app.allGotAmt())
export const allUsedAmt = computed(() => app.allUsedAmt())
export const allLeftCnt = computed(() => app.allLeftCnt())

export const faceStats = computed(() => FACES.map(f => {
  let got = 0, used = 0
  BANKS.forEach(b => {
    got += app.state[b][f].got
    used += app.state[b][f].used
  })
  return { face: f, got, used, left: got - used }
}))

export const isLucky = computed(() => {
  const wd = app.nowUtc8().getUTCDay()
  return wd === 0 || wd === 5 || wd === 6
})
export const isWarn = computed(() => app.nowUtc8().getUTCDay() === 4)

export const actEmoji = computed(() => isWarn.value ? '⏰' : (isLucky.value ? '🎁' : '🛒'))
export const actTitle = computed(() => isWarn.value ? '⏰ 明天新一輪！記得用完手上的券' : (isLucky.value ? '🎁 今日是抽獎＋消費日' : '🛒 今日是消費日'))
export const actSub = computed(() => isWarn.value ? '上週（五至日）抽到的券，將於明天（週五）自動清理' : '2026 社區消費連環賞 · 消費滿 MOP$50 可抽獎')
export const actTag = computed(() => isWarn.value ? '明天（週五）清理舊券 ⏰' : (isLucky.value ? '抽獎＋消費日 🎁' : '消費日 🛒'))
export const helpTag = computed(() => isWarn.value ? '今日：消費日 · 明天新一輪 ⏰' : (isLucky.value ? '今日：抽獎＋消費日 🎁' : '今日：消費日 🛒'))
export const actDesc = computed(() => isWarn.value
  ? '今日是<strong>消費日</strong> 🛒，也是本輪最後一天。<br><br>⏰ <strong>明天（週五）新一輪開始</strong>，上週（五至日）抽到的券——用過的、沒用的——都會被<strong>自動清理</strong>，記得今天用完！'
  : (isLucky.value
    ? '今日是<strong>抽獎＋消費日</strong> 🎁：消費滿 <strong>MOP$50</strong> 即可參與抽獎，把握今日！<br><br>🛒 週一至週四則為消費日，用上週五至日抽到的券。'
    : '今日是<strong>消費日</strong> 🛒：只消費、無抽獎。<br><br>🎁 記得週五至週日（抽獎＋消費日），消費滿 <strong>MOP$50</strong> 就能抽獎！'))
