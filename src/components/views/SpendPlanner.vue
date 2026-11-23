<template>
  <div class="page planner">
    <header class="planner-head">
      <button class="backbtn" type="button" @click="app.view = 'main'">返回</button>
      <div><p class="eyebrow">消費券組合建議</p><h2>這筆消費，怎樣用券？</h2></div>
    </header>

    <section class="amount-card">
      <label for="spend-amount">輸入預計消費金額</label>
      <div class="amount-input"><span>MOP$</span><input id="spend-amount" v-model.number="amount" type="number" min="0" max="50000" step="0.01" inputmode="decimal" placeholder="例如 300" /></div>
      <p>依照目前記錄的未使用優惠券計算；每張券須達到對應消費門檻。</p>
    </section>

    <p v-if="amount > 50000" role="alert">請輸入不超過 MOP$50,000 的金額。</p>
    <section v-if="amount > 0 && amount <= 50000" class="result-card best">
      <span class="feature-badge feature-badge-light">跨銀行最高折抵</span>
      <div class="result-kicker">最大化本次優惠</div>
      <div class="saving">省下 <strong>MOP${{ fmt(mixedSaving) }}</strong></div>
      <p v-if="mixedPlan.length">使用 {{ mixedCount }} 張券 · {{ providerNames(mixedPlan) }}</p>
      <p v-else>目前沒有可用於這筆消費的優惠券。</p>
      <div class="pay-line"><span>預計自付</span><b>MOP${{ fmt(Math.max(0, amount - mixedSaving)) }}</b></div>
    </section>

    <section class="section-block">
      <div class="section-heading"><h3>只用同一銀行／服務</h3><span>比較單一支付來源</span></div>
      <article v-for="(option, index) in visibleSingleOptions" :key="option.bank" class="provider-row">
        <div class="provider-title">
          <span class="provider-name">{{ NAMES[option.bank] }}</span>
          <span class="feature-badge">{{ index === 0 ? '單一來源最佳' : '不用跨行切換' }}</span>
        </div>
        <div class="provider-info"><small>{{ option.count }} 張可用券</small></div>
        <div class="provider-save"><b>MOP${{ fmt(option.saving) }}</b><small>可省金額</small></div>
        <button v-if="amount > 0 && amount <= 50000" class="mpay-button" type="button" @click="copyPayment(option.saving)">複製預計自付金額</button>
        <a :href="bankAppUrl(option.bank)" target="_blank" rel="noopener noreferrer">開啟 {{ NAMES[option.bank] }} App Store 頁面</a>
        <a :href="bankSearchUrl(option.bank)" target="_blank" rel="noopener noreferrer">找不到 App？搜尋</a>
      </article>
      <p v-if="amount > 0 && !visibleSingleOptions.length" class="empty">這筆消費目前沒有可用券的單一銀行方案。</p>
      <p v-else-if="!amount" class="empty">輸入消費金額後，只顯示至少有一張可用券的銀行。</p>
    </section>

    <section class="section-block">
      <div class="section-heading"><h3>跨銀行／服務組合</h3><span class="feature-badge">最多銀行共同折抵</span></div>
      <div v-if="mixedPlan.length" class="mix-list">
        <div v-for="(item, index) in mixedPlan" :key="item.bank + item.face + index" class="mix-row">
          <span class="face-chip">MOP${{ item.face }}</span><span>{{ NAMES[item.bank] }} · {{ item.count }} 張</span><b>−${{ fmt(item.saving) }}</b>
        </div>
      </div>
      <p v-else class="empty">輸入消費金額，查看適用的券組合。</p>
    </section>

    <p class="fine-print">估算只根據已記錄的券數及本工具採用的面值 × 3 消費門檻。實際適用商戶、支付方式和優惠資格請以發券機構及商戶規則為準。可先複製預計自付金額，再開啟相應 App Store 頁面。此連結不會直接啟動銀行付款或自動填入金額。跨銀行方案假設商戶允許分單，每張券分配獨立的最低消費額；請先與商戶確認。</p>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { app, BANKS, FACES, NAMES, TIMES, fmt } from '../../store'

import { bankAppUrl, bankSearchUrl } from '../../config/bankApps.js'
const amount = ref('')

function optimize (banks, budget) {
  const limit = Math.min(50000, Math.max(0, Math.floor(Number(budget) || 0)))
  if (!limit || !Number.isFinite(Number(budget)) || Number(budget) > 50000) return { saving: 0, plan: [] }
  const dp = new Array(limit + 1).fill(null)
  dp[0] = { saving: 0, plan: [] }
  const items = []
  for (const bank of banks) {
    for (const face of FACES) {
      const available = Math.max(0, app.state[bank][face].got - app.state[bank][face].used)
      for (let count = 0; count < Math.min(available, Math.ceil(limit / (face * TIMES))); count++) items.push({ bank, face, threshold: face * TIMES, discount: face })
    }
  }
  for (const item of items) {
    for (let spent = limit; spent >= 0; spent--) {
      const current = dp[spent]
      if (!current) continue
      const nextSpent = spent + item.threshold
      if (nextSpent > limit) continue
      const candidate = { saving: Math.min(limit, current.saving + item.discount), plan: [...current.plan, { bank: item.bank, face: item.face, count: 1, saving: item.discount }] }
      if (!dp[nextSpent] || candidate.saving > dp[nextSpent].saving) dp[nextSpent] = candidate
    }
  }
  const best = dp.reduce((best, candidate) => candidate && candidate.saving > best.saving ? candidate : best, { saving: 0, plan: [] })
  return best || { saving: 0, plan: [] }
}

const mixed = computed(() => optimize(BANKS, amount.value))
const mixedSaving = computed(() => mixed.value.saving)
const mixedPlan = computed(() => {
  const grouped = new Map()
  mixed.value.plan.forEach(item => {
    const key = item.bank + ':' + item.face
    const prev = grouped.get(key) || { ...item, count: 0, saving: 0 }
    prev.count++; prev.saving += item.saving; grouped.set(key, prev)
  })
  return [...grouped.values()]
})
const mixedCount = computed(() => mixedPlan.value.reduce((sum, item) => sum + item.count, 0))
const singleOptions = computed(() => BANKS.map(bank => {
  const option = optimize([bank], amount.value)
  return { bank, saving: option.saving, count: option.plan.length }
}).sort((a, b) => b.saving - a.saving))
const visibleSingleOptions = computed(() => {
  if (amount.value <= 0) return singleOptions.value

  const options = singleOptions.value.filter(option => option.count > 0)
  const bySaving = new Map()
  options.forEach(option => {
    if (!bySaving.has(option.saving)) bySaving.set(option.saving, [])
    bySaving.get(option.saving).push(option)
  })

  return [...bySaving.values()].map(tiedOptions =>
    tiedOptions[Math.floor(Math.random() * tiedOptions.length)]
  ).sort((a, b) => b.saving - a.saving)
})

function providerNames (plan) { return [...new Set(plan.map(item => NAMES[item.bank]))].join('、') }
async function copyPayment (saving) {
  const due = Math.max(0, Number(amount.value) - saving)
  try {
    await navigator.clipboard.writeText(due.toFixed(2).replace(/\.00$/, ''))
    app.toast('已複製付款金額 MOP$' + fmt(due) + '，請核對銀行實際付款金額')
  } catch {
    app.toast('無法自動複製；請記下付款金額 MOP$' + fmt(due))
  }

}
</script>

<style scoped>
.planner{padding-top:18px}.planner-head{display:flex;align-items:center;gap:12px;margin-bottom:16px}.planner-head h2{font-size:20px;margin:0;font-weight:800}.eyebrow{font-size:12px;color:var(--muted);margin:0 0 2px}.backbtn{height:42px;padding:0 15px;border-radius:999px;background:var(--card);color:var(--brand);font-weight:700;box-shadow:var(--shadow);border:1px solid var(--line)}
.amount-card,.result-card,.section-block{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px;margin-bottom:14px;box-shadow:var(--shadow)}.amount-card label{font-size:13px;color:var(--muted);font-weight:700}.amount-input{display:flex;align-items:center;gap:8px;margin-top:7px}.amount-input span{font-size:14px;font-weight:700;color:var(--brand)}.amount-input input{width:100%;border:0;outline:0;background:transparent;font-family:inherit;font-weight:800;color:var(--ink);font-size:28px}.amount-card p,.result-card p{font-size:12px;color:var(--muted);margin:7px 0 0;line-height:1.5}.best{background:linear-gradient(135deg,#0E7C66,#168d73);color:#fff;border:0}.result-kicker{font-size:12px;opacity:.82}.saving{font-size:17px;margin-top:5px}.saving strong{font-size:29px}.best p{color:rgba(255,255,255,.84)}.pay-line{display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,.22);padding-top:11px;margin-top:13px;font-size:13px}.pay-line b{font-size:18px}
.section-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.section-heading h3{font-size:15px;margin:0}.section-heading>span:not(.feature-badge),.provider-info small,.provider-save small{font-size:11px;color:var(--muted)}.provider-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 10px;align-items:center;padding:12px 0;border-top:1px solid var(--line)}.provider-title{display:flex;align-items:center;justify-content:space-between;gap:8px;min-width:0}.provider-name{display:block;font-weight:700;font-size:14px;min-width:0}.provider-info{grid-column:1;grid-row:2}.provider-save{grid-column:2;grid-row:1 / span 2;text-align:right}.provider-save b{display:block;color:var(--brand);font-size:15px}.feature-badge{display:inline-flex;align-items:center;justify-content:center;flex:none;max-width:58%;padding:4px 8px;border-radius:999px;background:var(--brand-soft);color:var(--brand);font-size:10px;font-weight:700;line-height:1.2;white-space:nowrap}.feature-badge-light{position:absolute;top:12px;right:12px;background:rgba(255,255,255,.18);color:#fff}.result-card.best{position:relative;padding-right:128px}.mpay-button{grid-column:1/-1;padding:10px;border-radius:11px;background:#e8f3ef;color:var(--brand);font-weight:700}.mix-list{display:flex;flex-direction:column}.mix-row{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;padding:9px 0;border-top:1px solid var(--line);font-size:12px}.mix-row b{color:var(--brand)}.face-chip{background:var(--gold-soft);color:var(--gold);border-radius:8px;padding:5px 7px;font-weight:700;font-size:11px}.empty,.fine-print{font-size:12px;color:var(--muted);line-height:1.6}.fine-print{margin:4px 4px 18px}
@media(max-width:390px){.result-card.best{padding-right:16px;padding-top:48px}.feature-badge-light{left:16px;right:auto}.section-heading{align-items:flex-start}.section-heading h3{max-width:58%}.section-heading .feature-badge{max-width:42%;white-space:normal;text-align:center}}
</style>
