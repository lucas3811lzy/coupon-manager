<template>
  <button class="activity" :class="{ lucky: isLucky && !isWarn, warn: isWarn }" type="button" @click="app.showAct = true">
    <span class="act-emoji">{{ actEmoji }}</span>
    <span class="act-main">
      <span class="act-title">{{ actTitle }}</span>
      <span class="act-sub">{{ actSub }}</span>
    </span>
    <svg class="act-go" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
  </button>
</template>

<script setup>
import { app, isLucky, isWarn, actEmoji, actTitle, actSub } from '../store'
</script>

<style scoped>
.activity{display:flex;align-items:center;gap:10px;width:100%;text-align:left;background:var(--card);border:1px solid var(--line);border-radius:16px;padding:12px 14px;margin-bottom:14px;box-shadow:var(--shadow);transition:transform .12s}
.activity:active{transform:scale(.985)}
.activity.lucky{background:#FFF7EC;border-color:#F3D9B0}
.activity.warn{background:#FDF3F0;border-color:#F1C4B8}
.act-dot{flex:0 0 auto;width:12px;height:12px;border-radius:50%;background:var(--brand)}
.activity.lucky .act-dot{background:#E08A2E;box-shadow:0 0 0 4px rgba(224,138,46,.15)}
.activity.warn .act-dot{background:var(--danger);box-shadow:0 0 0 4px rgba(201,67,47,.15)}
.act-emoji{flex:0 0 auto;font-size:24px;line-height:1}
.act-main{flex:1;min-width:0}
.act-title{font-size:16px;font-weight:700}
.act-sub{font-size:12.5px;color:var(--muted);margin-top:2px}
.act-go{color:#B9C4BD;flex:0 0 auto}
</style>
