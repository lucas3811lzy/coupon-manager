<template>
  <section class="total-card" aria-label="剩餘總額">
    <div class="total-grid">
      <div class="total-col">
        <p class="lbl">{{ NAMES[app.bank] }}</p>
        <p class="num" :style="{ fontSize: amountFont(curTotal, 27, 17) }"><small>MOP$</small>{{ fmt(curTotal) }}</p>
        <p class="sub">用完券需消費 <b>MOP${{ fmt(curNeed) }}</b></p>
      </div>
      <button class="total-col all" type="button" @click="app.view = 'stats'" aria-label="查看全部銀行統計">
        <span class="all-go"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></span>
        <p class="lbl">全部銀行統計</p>
        <p class="num" :style="{ fontSize: amountFont(allTotal, 27, 17) }"><small>MOP$</small>{{ fmt(allTotal) }}</p>
        <p class="sub"><b>{{ BANKS.length }}</b> 家銀行 · 點我看明細</p>
      </button>
    </div>
    <p class="total-hint">點下面任意一行，記一筆</p>
  </section>
</template>

<script setup>
import { app, BANKS, NAMES, fmt, amountFont } from '../../store'
import { curTotal, curNeed, allTotal } from '../../store'
</script>

<style scoped>
.total-card{background:var(--card);border-radius:20px;padding:16px 14px 14px;box-shadow:var(--shadow);border:1px solid var(--line);margin-bottom:14px}
.total-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.total-col{background:#FAFBF9;border:1px solid var(--line);border-radius:14px;padding:12px 8px;text-align:center;min-width:0}
.total-col .lbl{font-size:12.5px;color:var(--muted);margin:0;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.total-col .num{font-size:27px;font-weight:800;color:var(--gold);font-variant-numeric:tabular-nums;margin:5px 0 0;line-height:1.15;white-space:nowrap;overflow:hidden;text-overflow:clip;display:flex;align-items:baseline;justify-content:center;gap:3px;min-height:31px}
.total-col .num small{font-size:13px;font-weight:700}
.total-col .sub{font-size:11px;color:var(--muted);margin:5px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.total-col .sub b{color:var(--gold)}
.total-col.all{position:relative;cursor:pointer;transition:transform .13s,box-shadow .13s;background:#F0F8F4;border-color:#CFE4DA;overflow:hidden}
.total-col.all:active{transform:scale(.97)}
.total-col.all .lbl{color:var(--brand)}
.total-col.all .num{color:var(--brand)}
.total-col.all .sub b{color:var(--brand)}
.all-go{position:absolute;top:8px;right:9px;color:#A9C7BA;display:flex}
.total-hint{font-size:12.5px;color:var(--muted);margin:10px 0 0;text-align:center}
</style>
