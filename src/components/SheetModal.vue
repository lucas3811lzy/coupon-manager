<template>
  <div class="mask" :class="{ show: app.sheetOpen }" @click="app.closeSheet()"></div>
  <div class="sheet" :class="{ show: app.sheetOpen }" role="dialog" aria-label="記一筆">
    <div class="sheet-head">
      <div>
        <div class="sheet-face">MOP${{ app.curFace }} 券</div>
        <div class="sheet-bank">{{ NAMES[app.bank] }} · 剩 {{ app.faceLeft(app.curFace) }} 張 · 已用 {{ app.used(app.curFace) }} 張</div>
      </div>
      <button class="close" type="button" aria-label="關閉" @click="app.closeSheet()">×</button>
    </div>
    <div class="seg">
      <button class="add" :class="{ active: app.mode === 'add' }" type="button" @click="app.mode = 'add'; app.qty = 1">🟢 收券</button>
      <button class="use" :class="{ active: app.mode === 'use' }" type="button" @click="app.mode = 'use'; app.qty = 1">🔴 用券</button>
    </div>
    <div class="qty">
      <button class="qty-btn" type="button" aria-label="減少一張" @click="app.qty = Math.max(1, app.qty - 1); bump()">−</button>
      <div class="qty-num" :class="app.mode" ref="qnum">{{ app.qty }}</div>
      <button class="qty-btn" type="button" aria-label="增加一張" @click="app.qty = Math.min(99, app.qty + 1); bump()">＋</button>
    </div>
    <div class="qty-presets">
      <button v-for="n in [2, 5, 10]" :key="n" type="button" :class="{ on: app.qty === n }" @click="app.qty = n">{{ n }} 張</button>
      <button class="allbtn" v-show="app.mode === 'use' && app.faceLeft(app.curFace) > 0" type="button" @click="app.useAll()">⚡ 用完</button>
    </div>
    <button class="confirm" :class="app.mode" type="button" @click="app.confirm()">{{ app.mode === 'add' ? '🟢 收 ' : '🔴 用 ' }}{{ app.qty }} 張券</button>
    <p class="sheet-rule" v-if="app.mode === 'use'">用券需消費滿 <b>MOP${{ app.curFace * TIMES }}</b>（面值 {{ app.curFace }} 元 × 3）</p>
    <p class="sheet-rule" v-else>收到哪家銀行的券，就記在哪家</p>
    <p class="sheet-err">{{ app.errMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { app, NAMES, TIMES } from '../store'

const qnum = ref(null)
function bump () {
  const el = qnum.value
  if (!el) return
  el.classList.remove('bump')
  void el.offsetWidth
  el.classList.add('bump')
}
</script>

<style scoped>
.mask{position:fixed;inset:0;background:rgba(18,28,24,.45);opacity:0;pointer-events:none;transition:opacity .25s;z-index:90}
.mask.show{opacity:1;pointer-events:auto}
.sheet{position:fixed;left:0;right:0;bottom:0;background:#fff;border-radius:24px 24px 0 0;padding:20px 20px 24px;transform:translateY(105%);transition:transform .32s cubic-bezier(.2,.8,.2,1);z-index:91;max-width:560px;margin:0 auto;box-shadow:0 -8px 30px rgba(0,0,0,.14)}
.sheet.show{transform:translateY(0)}
.sheet-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.sheet-face{font-size:24px;font-weight:800}
.sheet-bank{font-size:14px;color:var(--muted);margin-top:2px}
.close{flex:0 0 auto;width:44px;height:44px;border-radius:50%;background:#F0F3F1;color:var(--muted);font-size:24px;line-height:1;display:flex;align-items:center;justify-content:center}
.seg{display:flex;background:#F0F3F1;border-radius:14px;padding:4px;margin-top:14px;gap:4px}
.seg button{flex:1;height:52px;border-radius:11px;font-size:18px;font-weight:700;transition:all .2s}
.seg button.add{background:var(--brand-soft);color:var(--brand)}
.seg button.use{background:var(--danger-soft);color:var(--danger)}
.seg button.active.add{background:var(--brand);color:#fff;box-shadow:0 3px 8px rgba(14,124,102,.3)}
.seg button.active.use{background:var(--danger);color:#fff;box-shadow:0 3px 8px rgba(201,67,47,.3)}
.qty{display:flex;align-items:center;gap:12px;margin:16px 0 10px}
.qty-btn{flex:1;height:72px;border-radius:15px;background:#F0F3F1;font-size:34px;font-weight:700;color:var(--ink)}
.qty-btn:active{transform:scale(.95)}
.qty-num{flex:1.2;text-align:center;font-size:44px;font-weight:800;font-variant-numeric:tabular-nums;transition:color .2s}
.qty-num.add{color:var(--brand)}
.qty-num.use{color:var(--danger)}
.qty-presets{display:flex;gap:10px;margin-bottom:14px}
.qty-presets button{flex:1;height:46px;border-radius:11px;background:#F0F3F1;font-size:15px;font-weight:600;color:var(--ink)}
.qty-presets button.on{background:var(--brand-soft);color:var(--brand);font-weight:700}
.qty-presets .allbtn{background:var(--danger);color:#fff;font-weight:700;box-shadow:0 3px 8px rgba(201,67,47,.25)}
.qty-presets .allbtn:active{filter:brightness(.92)}
.confirm{width:100%;height:56px;border-radius:15px;font-size:18px;font-weight:700;color:#fff;transition:filter .15s}
.confirm.add{background:var(--brand)}
.confirm.use{background:var(--danger)}
.confirm:active{filter:brightness(.92)}
.sheet-rule{font-size:13px;color:var(--muted);text-align:center;margin:10px 0 0}
.sheet-rule b{color:var(--gold)}
.sheet-err{color:var(--danger);font-size:14.5px;text-align:center;min-height:20px;margin:8px 0 0;font-weight:600}
</style>
