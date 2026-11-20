<template>
  <!-- ===== 主视图 ===== -->
  <div class="page" v-if="app.view === 'main'">
    <header class="top">
      <div class="brand">
        <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="14" width="52" height="36" rx="10" fill="#0E7C66"/><rect x="30" y="14" width="4" height="36" fill="#F6E7C8"/><circle cx="20" cy="32" r="4" fill="#F6E7C8"/><circle cx="44" cy="32" r="4" fill="#F6E7C8"/></svg>
        <h1>消費券管家</h1>
      </div>
      <button class="ghost" type="button" @click="app.showHelp = true">幫助</button>
    </header>

    <ClockBar />
    <ActivityBanner />
    <BankBar />
    <TotalCard />
    <FaceList />
  </div>

  <!-- ===== 统计视图 ===== -->
  <StatsView v-else />

  <SheetModal />
  <Toast />
  <ActModal />
  <HelpModal />
  <Tutorial />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { app, TUT_KEY } from './store'
import ClockBar from './components/ClockBar.vue'
import ActivityBanner from './components/ActivityBanner.vue'
import BankBar from './components/BankBar.vue'
import TotalCard from './components/TotalCard.vue'
import FaceList from './components/FaceList.vue'
import StatsView from './components/StatsView.vue'
import SheetModal from './components/SheetModal.vue'
import Toast from './components/Toast.vue'
import ActModal from './components/ActModal.vue'
import HelpModal from './components/HelpModal.vue'
import Tutorial from './components/Tutorial.vue'

let cycleTimer = null

onMounted(() => {
  app.checkCycle()
  cycleTimer = setInterval(() => { app.checkCycle() }, 60000)
  if (!localStorage.getItem(TUT_KEY)) {
    app.showTut = true
    app.tutPage = 0
  }
})
onUnmounted(() => { clearInterval(cycleTimer) })
</script>

<style>
:root{
  --bg:#F6F7F6; --card:#FFFFFF; --ink:#1F2A26; --muted:#6C7B74;
  --brand:#0E7C66; --brand-dark:#0A6553; --brand-soft:#E5F2EC;
  --gold:#B26A13; --gold-soft:#F8EBD2;
  --danger:#C9432F; --danger-soft:#FBE8E4;
  --line:#E7EBE8; --shadow:0 2px 10px rgba(24,44,36,.06);
}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;padding:0}
body{
  font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",system-ui,-apple-system,sans-serif;
  background:var(--bg); color:var(--ink); line-height:1.5;
  -webkit-font-smoothing:antialiased; font-size:16px;
}
button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit;font-size:inherit;touch-action:manipulation;-webkit-touch-callout:none}
a{color:inherit}
.page{max-width:560px;margin:0 auto;padding:14px 16px 34px;min-height:100vh}

.top{display:flex;align-items:center;justify-content:space-between;padding:4px 2px 10px}
.brand{display:flex;align-items:center;gap:9px}
.brand h1{font-size:21px;margin:0;font-weight:700;letter-spacing:.5px}
.ghost{height:42px;padding:0 16px;border-radius:999px;background:var(--card);color:var(--brand);font-size:15px;font-weight:600;box-shadow:var(--shadow);border:1px solid var(--line)}

/* 飞行券片（注入 body，须全局） */
.fly{position:fixed;z-index:130;width:66px;height:38px;border-radius:9px;background:var(--gold);color:#fff;font-size:15px;font-weight:800;display:flex;align-items:center;justify-content:center;pointer-events:none;box-shadow:0 4px 12px rgba(0,0,0,.28);transform-origin:center;transition:transform .6s cubic-bezier(.25,.6,.25,1),opacity .6s}
.fly small{font-size:10px;font-weight:700;margin-right:2px}
.fly.go{transform:scale(.72);opacity:0}

@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes bump{0%{transform:scale(1)}40%{transform:scale(1.14)}100%{transform:scale(1)}}
.bump{animation:bump .35s ease}
@keyframes pop{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.pop{animation:pop .35s ease both}

/* 通用弹层（活动/帮助共用） */
.modal{position:fixed;inset:0;z-index:150;display:flex;align-items:center;justify-content:center;padding:22px;background:rgba(18,28,24,.45);opacity:0;pointer-events:none;transition:opacity .25s}
.modal.show{opacity:1;pointer-events:auto}
.modal-card{background:#fff;border-radius:20px;padding:22px;width:100%;max-width:400px;max-height:84vh;overflow:auto;box-shadow:0 10px 40px rgba(0,0,0,.2)}
.modal-card h2{margin:0 0 12px;font-size:20px}
.modal-card p{font-size:15px;margin:0 0 10px;line-height:1.7;color:var(--ink)}
.modal-card .small{font-size:13px;color:var(--muted);margin-top:-4px}
.linkbtn{display:block;width:100%;height:50px;border-radius:13px;font-size:15.5px;font-weight:700;margin-top:10px;background:var(--brand);color:#fff;display:flex;align-items:center;justify-content:center;gap:6px;text-decoration:none}
.linkbtn.ghost{background:#F0F3F1;color:var(--ink)}
.linkbtn.danger{background:var(--danger-soft);color:var(--danger)}
.linkbtn.plain{background:#F0F3F1;color:var(--ink)}
.modal-note{font-size:12.5px;color:var(--muted);margin-top:14px;text-align:center}
.rule-tag{display:inline-block;padding:3px 10px;border-radius:999px;font-size:13px;font-weight:700;margin-bottom:10px}
.rule-tag.lucky{background:var(--gold-soft);color:var(--gold)}
.rule-tag.normal{background:var(--brand-soft);color:var(--brand)}

@media (prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
}
</style>
