<template>
  <div class="modal" :class="{ show: app.showAct }" @click.self="app.showAct = false">
    <div class="modal-card">
      <h2>🎁 2026 社區消費連環賞</h2>
      <span class="rule-tag" :class="isWarn ? 'lucky' : (isLucky ? 'lucky' : 'normal')">{{ actTag }}</span>
      <p v-html="actDesc"></p>
      <p class="small">活動期：2026年10月9日 至 12月17日（共 10 週）· 葡幣 MOP$ 結算。</p>
      <a class="linkbtn" href="https://rewards.dsedt.gov.mo" target="_blank" rel="noopener">官方活動專頁</a>
      <a class="linkbtn ghost" href="https://www.gov.mo/zh-hans/news/947269/" target="_blank" rel="noopener">活動最新消息（政府新聞）</a>
      <button class="linkbtn plain" type="button" @click="app.showAct = false">關閉</button>
    </div>
  </div>
</template>

<script setup>
import { app, isLucky, isWarn, actTag, actDesc } from '../store'
</script>
