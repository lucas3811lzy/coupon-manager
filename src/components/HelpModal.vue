<template>
  <div class="modal" :class="{ show: app.showHelp }" @click.self="app.showHelp = false">
    <div class="modal-card">
      <h2>📖 怎麼用</h2>
      <p>① 先點上方銀行標誌，切換到那家銀行。</p>
      <p>② 點要記的面值那一行。</p>
      <p>③ 選「🟢 收券」還是「🔴 用券」→ 按數量 → 點確認。</p>
      <span class="rule-tag" :class="isWarn ? 'lucky' : (isLucky ? 'lucky' : 'normal')">{{ helpTag }}</span>
      <p class="small">週五至週日＝抽獎＋消費日 🎁；週一至週四＝消費日 🛒（用上週五至日抽到的券）。消費滿 MOP$50 可抽獎。週四會提醒，週五凌晨自動清理舊券、開始新一週。</p>
      <button class="linkbtn" type="button" @click="app.showHelp = false; app.showAct = true">活動規則與官方連結</button>
      <button class="linkbtn ghost" type="button" @click="app.startTut()">重新看一遍教程</button>
      <button class="linkbtn danger" type="button" @click="app.resetBank()">清零當前銀行的記錄</button>
      <button class="linkbtn plain" type="button" @click="app.showHelp = false">關閉</button>
      <p class="modal-note">資料只保存在這台手機，不聯網、不上傳。時間為北京時間 UTC+8（聯網自動校準）。</p>
    </div>
  </div>
</template>

<script setup>
import { app, isLucky, isWarn, helpTag } from '../store'
</script>
