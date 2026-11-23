<template>
  <div class="tut" :class="{ show: app.showTut }">
    <div class="tut-stage">
      <div class="tut-page" v-for="(p, i) in TUT" :key="i"
        :style="{ transform: 'translateX(' + ((i - app.tutPage) * 34) + '%) scale(' + (i === app.tutPage ? 1 : 0.94) + ')', opacity: i === app.tutPage ? 1 : 0 }">
        <div class="tut-illu" v-html="p.illu"></div>
        <h2>{{ p.h }}</h2>
        <p>{{ p.t }}</p>
      </div>
    </div>
    <div class="tut-dots"><i v-for="(p, i) in TUT" :key="i" :class="{ on: i === app.tutPage }"></i></div>
    <button class="tut-next" type="button" @click="app.tutNext()">{{ app.tutPage === TUT.length - 1 ? '開始使用' : '下一步' }}</button>
    <button class="tut-skip" :class="{ show: app.tutPage > 0 }" type="button" @click="app.closeTut()">跳過</button>
  </div>
</template>

<script setup>
import { app, TUT } from '../../store'
</script>

<style scoped>
.tut{position:fixed;inset:0;background:var(--bg);z-index:200;display:flex;flex-direction:column;align-items:center;padding:30px 24px calc(26px + env(safe-area-inset-bottom,0px));opacity:0;pointer-events:none;transition:opacity .3s}
.tut.show{opacity:1;pointer-events:auto}
.tut-stage{flex:1;width:100%;max-width:420px;position:relative;min-height:0}
.tut-page{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 10px;will-change:transform,opacity;pointer-events:none}
.tut-page h2{font-size:24px;margin:22px 0 12px;font-weight:800}
.tut-page p{font-size:16.5px;color:var(--muted);margin:0;max-width:350px}
.tut-illu{width:200px;height:140px;display:flex;align-items:center;justify-content:center}
.tut-dots{display:flex;gap:8px;margin:0 0 18px}
.tut-dots i{width:8px;height:8px;border-radius:50%;background:#C9D4CD;transition:all .25s}
.tut-dots i.on{width:24px;border-radius:5px;background:var(--brand)}
.tut-next{width:100%;max-width:420px;height:56px;border-radius:15px;background:var(--brand);color:#fff;font-size:18px;font-weight:700;box-shadow:0 6px 16px rgba(14,124,102,.3)}
.tut-skip{margin-top:10px;color:var(--muted);font-size:15px;height:44px;visibility:hidden}
.tut-skip.show{visibility:visible}
</style>
