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
      <span v-if="recommendedPlan.length" class="feature-badge feature-badge-light">{{ recommendedBanks.length === 1 ? '單一來源最佳' : '跨銀行最高折抵' }}</span>
      <div class="result-kicker">最大化本次優惠</div>
      <div class="saving">省下 <strong>MOP${{ fmt(recommendation.saving) }}</strong></div>
      <p v-if="recommendedPlan.length">使用 {{ recommendation.plan.length }} 張券 · {{ recommendedBanks.join('、') }}</p>
      <p v-else>目前沒有可用於這筆消費的優惠券。</p>
      <div class="pay-line"><span>預計自付</span><b>MOP${{ fmt(Math.max(0, amount - recommendation.saving)) }}</b></div>
    </section>

    <section class="section-block">
      <div class="section-heading"><h3>建議用券明細</h3></div>
      <div v-if="recommendedPlan.length" class="mix-list">
        <div v-for="(item, index) in recommendedPlan" :key="item.bank + item.face + index" class="mix-row">
          <span class="face-chip">MOP${{ item.face }}</span><span class="mix-provider"><span>{{ NAMES[item.bank] }} · {{ item.count }} 張</span><a v-if="item.bank === 'boc'" class="boc-payment-link" href="bocmwidget://Widget_Payment_BocPay"><img :src="bocLogo" alt="" class="boc-payment-logo" />進入付款碼頁面</a></span><b>−${{ fmt(item.saving) }}</b>
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
import { optimize } from '../../utils/planner.js'

import { bankAppUrl } from '../../config/bankApps.js'
import bocLogo from '../../assets/boc.png'
import icbcLogo from '../../assets/icbc.png'
import macaupassLogo from '../../assets/macaupass.png'
import lusoLogo from '../../assets/luso.png'
import taifungLogo from '../../assets/taifung.png'
import cgbLogo from '../../assets/cgb.png'
import alipayLogo from '../../assets/alipay.png'
const amount = ref('')
const BANK_LOGOS = { boc: bocLogo, icbc: icbcLogo, macaupass: macaupassLogo, luso: lusoLogo, taifung: taifungLogo, cgb: cgbLogo, alipay: alipayLogo }

const recommendation = computed(() => optimize(BANKS, amount.value, app.state, FACES, TIMES))
const recommendedBanks = computed(() => [...new Set(recommendation.value.plan.map(item => NAMES[item.bank]))])
const recommendedPlan = computed(() => {
  const grouped = new Map()
  recommendation.value.plan.forEach(item => {
    const key = item.bank + ':' + item.face
    const prev = grouped.get(key) || { ...item, count: 0, saving: 0 }
    prev.count++; prev.saving += item.saving; grouped.set(key, prev)
  })
  return [...grouped.values()]
})
const singleOptions = computed(() => BANKS.map(bank => {
  const option = optimize([bank], amount.value, app.state, FACES, TIMES)
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
.section-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}.section-heading h3{font-size:15px;margin:0}.section-heading>span:not(.feature-badge),.provider-info small,.provider-save small{font-size:11px;color:var(--muted)}.provider-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px 10px;align-items:center;padding:12px 0;border-top:1px solid var(--line)}.provider-title{display:flex;align-items:center;gap:8px;min-width:0}.provider-logo-link{display:grid;place-items:center;width:34px;height:34px;flex:none;border:1px solid var(--line);border-radius:50%;background:#fff}.provider-logo-link:focus-visible{outline:2px solid var(--brand);outline-offset:2px}.provider-logo{display:block;width:27px;height:27px;object-fit:contain}.provider-name{display:block;font-weight:700;font-size:14px;min-width:0}.provider-title .feature-badge{margin-left:auto}.provider-info{grid-column:1;grid-row:2}.provider-save{grid-column:2;grid-row:1 / span 2;text-align:right}.provider-save b{display:block;color:var(--brand);font-size:15px}.feature-badge{display:inline-flex;align-items:center;justify-content:center;flex:none;max-width:58%;padding:4px 8px;border-radius:999px;background:var(--brand-soft);color:var(--brand);font-size:10px;font-weight:700;line-height:1.2;white-space:nowrap}.feature-badge-light{position:absolute;top:12px;right:12px;background:rgba(255,255,255,.18);color:#fff}.result-card.best{position:relative;padding-right:128px}.mpay-button{grid-column:1/-1;padding:10px;border-radius:11px;background:#e8f3ef;color:var(--brand);font-weight:700}.mix-list{display:flex;flex-direction:column}.mix-row{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;padding:9px 0;border-top:1px solid var(--line);font-size:12px}.mix-row b{color:var(--brand)}.face-chip{background:var(--gold-soft);color:var(--gold);border-radius:8px;padding:5px 7px;font-weight:700;font-size:11px}.empty,.fine-print{font-size:12px;color:var(--muted);line-height:1.6}.fine-print{margin:4px 4px 18px}
.mix-provider{display:flex;align-items:center;justify-content:space-between;gap:12px;min-width:0}.boc-payment-link{display:inline-flex;align-items:center;gap:6px;flex:none;color:var(--brand);font-weight:700;text-decoration:none}.boc-payment-link:hover{text-decoration:underline}.boc-payment-logo{width:22px;height:22px;object-fit:cover;object-position:center;clip-path:circle(45% at center)}
@media(max-width:390px){.result-card.best{padding-right:16px;padding-top:48px}.feature-badge-light{left:16px;right:auto}.section-heading{align-items:flex-start}.section-heading h3{max-width:58%}.section-heading .feature-badge{max-width:42%;white-space:normal;text-align:center}}
</style>
