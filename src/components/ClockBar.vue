<template>
  <div class="clockbar">
    <span class="date">{{ dateText }}</span>
    <span class="time">
      <small>{{ ntpOk ? 'UTC+8 ✓' : 'UTC+8' }}</small><span>{{ timeText }}</span>
    </span>
  </div>
  <p v-if="diffText" class="clock-diff">{{ diffText }}</p>
</template>

<script setup>
// NTP 校時組件：聯網取網絡時間，與裝置時間比對，偏差明顯時以網絡時間為準
import { ref, onMounted, onUnmounted } from 'vue'
import { app, WEEK } from '../store'

const dateText = ref('—')
const timeText = ref('--:--:--')
const ntpOk = ref(false)
const diffText = ref('')

let tickTimer = null

function pad (n) { return n < 10 ? '0' + n : '' + n }

function tick () {
  const d = app.nowUtc8()
  dateText.value = d.getUTCFullYear() + '年' + (d.getUTCMonth() + 1) + '月' + d.getUTCDate() + '日 星期' + WEEK[d.getUTCDay()]
  timeText.value = pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds())
}

function applyOffset (ts) {
  app.clockOffset = ts - Date.now()
  app.ntpState = 'ok'
  ntpOk.value = true
  // 與裝置時間比對：裝置時間(本地時區) vs 網絡 UTC+8 時間
  const dev = new Date()
  const net = new Date(ts)
  const diffSec = Math.round((dev.getTime() - net.getTime()) / 1000)
}

function ntpCleanup (cb, s) {
  clearTimeout(app._ntpT)
  if (cb) delete window[cb]
  if (s && s.parentNode) s.parentNode.removeChild(s)
}

function ntpJsonp () {
  const cb = 'cvmNtp' + Date.now()
  window[cb] = function (data) {
    try {
      const ts = Date.parse(String(data.sysTime2).replace(' ', 'T') + '+08:00')
      if (!isNaN(ts)) { applyOffset(ts); return }
    } catch (e) {}
    ntpCleanup(cb, s)
  }
  const s = document.createElement('script')
  s.src = 'https://quan.suning.com/getSysTime.do?callback=' + cb
  s.onerror = function () { ntpCleanup(cb, s); app.ntpState = 'fail' }
  app._ntpT = setTimeout(function () { ntpCleanup(cb, s); app.ntpState = 'fail' }, 4000)
  document.body.appendChild(s)
}

function calibrate () {
  if (app.ntpState === 'ok') return
  try {
    const ctrl = new AbortController()
    app._ntpT = setTimeout(() => ctrl.abort(), 5000)
    fetch('https://worldtimeapi.org/api/timezone/Asia/Shanghai', { signal: ctrl.signal })
      .then(r => r.json())
      .then(j => {
        const ts = Date.parse(j && j.utc_datetime)
        if (!isNaN(ts)) applyOffset(ts)
      })
      .catch(() => ntpJsonp())
      .finally(() => clearTimeout(app._ntpT))
  } catch (e) { ntpJsonp() }
}

onMounted(() => {
  tick()
  calibrate()
  tickTimer = setInterval(() => { tick() }, 1000)
})
onUnmounted(() => { clearInterval(tickTimer) })
</script>

<style scoped>
.clockbar{display:flex;align-items:center;justify-content:space-between;padding:0 2px 10px}
.clockbar .date{font-size:15px;font-weight:600}
.clockbar .time{font-size:15px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--muted)}
.clockbar .time small{font-size:11px;font-weight:600;color:#9AA79F;margin-right:4px}
.clock-diff{font-size:11px;color:#9AA79F;font-weight:600}
</style>
