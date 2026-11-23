<template>
  <main class="list">
    <button v-for="(f, i) in FACES" :key="f" class="row" type="button"
      :data-face="f"
      :style="{ animation: 'rise .4s ' + (i * 0.05) + 's both' }"
      :aria-label="NAMES[app.bank] + '面值' + f + '元券，剩' + app.faceLeft(f) + '張，已用' + app.used(f) + '張，使用需消費滿' + (f * TIMES) + '元'"
      @click="app.openSheet(f)">
      <span class="row-badge"><small>MOP$</small><b>{{ f }}</b></span>
      <span class="row-main">
        <span class="row-left">剩 <b>{{ app.faceLeft(f) }}</b> 張</span>
        <span class="row-sub">滿 MOP${{ f * TIMES }} 可用 · 已用 {{ app.used(f) }} 張</span>
      </span>
      <svg class="row-go" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
    </button>
  </main>
</template>

<script setup>
import { app, FACES, TIMES, NAMES } from '../../store'
</script>

<style scoped>
.list{display:flex;flex-direction:column;gap:10px}
.row{display:flex;align-items:center;gap:12px;width:100%;background:var(--card);border-radius:16px;padding:11px 14px;box-shadow:var(--shadow);border:1px solid var(--line);text-align:left;transition:transform .13s}
.row:active{transform:scale(.98)}
.row-badge{flex:0 0 auto;width:76px;height:52px;border-radius:11px;background:var(--gold-soft);color:var(--gold);display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.15}
.row-badge small{font-size:10.5px;font-weight:700}
.row-badge b{font-size:21px;font-weight:800}
.row-main{flex:1;min-width:0}
.row-left{font-size:19px;font-weight:700}
.row-left b{font-size:21px}
.row-sub{font-size:12px;color:var(--muted);margin-top:2px}
.row-go{color:#B9C4BD;flex:0 0 auto}
</style>
