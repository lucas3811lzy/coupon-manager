<template>
  <div class="page">
    <header class="stats-top">
      <button class="backbtn" type="button" @click="app.view = 'main'">返回</button>
      <h2>全部銀行統計</h2>
      <span class="spacer"></span>
    </header>

    <section class="stats-hero pop">
      <p class="lbl">全部銀行剩餘總額</p>
      <p class="num" :style="{ fontSize: amountFont(allTotal, 34, 20) }"><small>MOP$</small>{{ fmt(allTotal) }}</p>
      <p class="sub">已收 MOP${{ fmt(allGotAmt) }} · 已用 MOP${{ fmt(allUsedAmt) }} · 剩 {{ allLeftCnt }} 張</p>
      <span class="need">用完所有券需消費 MOP${{ fmt(allNeed) }}</span>
    </section>

    <p class="sec-title">按面額合計（7 家銀行）</p>

    <section class="face-list">
      <div v-for="fs in faceStats" :key="fs.face" class="face-card">
        <div class="face-badge"><small>MOP$</small><b>{{ fs.face }}</b></div>
        <div class="face-main">
          <div class="face-left">剩 <b>{{ fs.left }}</b> 張</div>
          <div class="face-sub">收 {{ fs.got }} · 用 {{ fs.used }} · 滿 MOP${{ fs.face * TIMES }} 可用</div>
        </div>
        <div class="face-amt" :style="{ fontSize: amountFont(fs.left * fs.face, 22, 14) }"><small>MOP$</small>{{ fmt(fs.left * fs.face) }}</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { app, FACES, TIMES, fmt, amountFont } from '../store'
import { allTotal, allNeed, allGotAmt, allUsedAmt, allLeftCnt, faceStats } from '../store'
</script>

<style scoped>
.stats-top{display:flex;align-items:center;gap:10px;padding:4px 2px 12px}
.backbtn{flex:0 0 auto;height:44px;padding:0 18px;border-radius:999px;background:var(--card);color:var(--brand);font-size:16px;font-weight:700;box-shadow:var(--shadow);border:1px solid var(--line)}
.stats-top h2{flex:1;margin:0;font-size:20px;font-weight:800;text-align:center;white-space:nowrap}
.stats-top .spacer{flex:0 0 76px}

.stats-hero{background:linear-gradient(135deg,var(--brand),#128A71);border-radius:20px;padding:18px 16px;color:#fff;text-align:center;box-shadow:0 6px 18px rgba(14,124,102,.25);margin-bottom:16px}
.stats-hero .lbl{font-size:13px;opacity:.9;margin:0 0 4px;font-weight:600}
.stats-hero .num{font-weight:800;margin:0;line-height:1.15;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:clip;display:flex;align-items:baseline;justify-content:center;gap:4px;min-height:40px}
.stats-hero .num small{font-size:15px;font-weight:700}
.stats-hero .sub{font-size:12.5px;opacity:.92;margin:8px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.stats-hero .need{display:inline-block;margin-top:10px;font-size:12.5px;font-weight:700;background:rgba(255,255,255,.16);padding:6px 14px;border-radius:999px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

.sec-title{font-size:14px;font-weight:700;color:var(--muted);margin:0 4px 10px}

.face-list{display:flex;flex-direction:column;gap:12px}
.face-card{display:flex;align-items:center;gap:14px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:14px 16px;box-shadow:var(--shadow)}
.face-badge{flex:0 0 auto;width:86px;height:58px;border-radius:12px;background:var(--gold-soft);color:var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.12}
.face-badge small{font-size:11px;font-weight:700}
.face-badge b{font-size:22px;font-weight:800}
.face-main{flex:1;min-width:0}
.face-left{font-size:18px;font-weight:700}
.face-left b{font-size:20px}
.face-sub{font-size:12px;color:var(--muted);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.face-amt{flex:0 0 auto;font-weight:800;color:var(--brand);font-variant-numeric:tabular-nums;white-space:nowrap}
.face-amt small{font-size:11px;font-weight:700}
</style>
