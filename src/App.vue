<template>
  <!-- ===== 主视图 ===== -->
  <div class="page" v-if="app.view === 'main'">
    <header class="top">
      <div class="brand">
        <svg width="32" height="32" viewBox="0 0 64 64" aria-hidden="true"><rect x="6" y="14" width="52" height="36" rx="10" fill="#0E7C66"/><rect x="30" y="14" width="4" height="36" fill="#F6E7C8"/><circle cx="20" cy="32" r="4" fill="#F6E7C8"/><circle cx="44" cy="32" r="4" fill="#F6E7C8"/></svg>
        <h1>消費券管家</h1>
      </div>
      <div class="top-actions">
        <a class="github-link" href="https://github.com/lucas3811lzy/coupon-manager" target="_blank" rel="noopener noreferrer" aria-label="Welcome to collaborate or contribute for learning purpose" title="Welcome to collaborate or contribute for learning purpose"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.53v-2.07c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.76 1.97 3.66 1.39.1-.72.39-1.21.7-1.49-2.48-.28-5.08-1.24-5.08-5.52 0-1.22.44-2.21 1.15-2.99-.12-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.53.23 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.3-2.6 5.23-5.09 5.51.4.35.75 1.02.75 2.06V22c0 .29.2.64.77.53A11.1 11.1 0 0 0 12 .9Z"/></svg><span>GitHub</span><span class="github-tooltip">Welcome to collaborate or contribute for learning purpose</span></a>
        <button class="ghost" type="button" @click="app.showHelp = true">幫助</button>
      </div>
    </header>

    <ClockBar />
    <ActivityBanner />
    <BankBar />
    <button class="planner-entry" type="button" @click="app.view = 'planner'">
      <span class="planner-icon" aria-hidden="true">✦</span>
      <span class="planner-copy">
        <b>消費組合建議</b>
        <small>輸入金額，查看各銀行可用優惠及預計付款金額</small>
      </span>
      <span class="planner-arrow" aria-hidden="true">›</span>
    </button>
    <TotalCard />
    <FaceList />
  </div>

  <!-- ===== 统计视图 ===== -->
  <StatsView v-else-if="app.view === 'stats'" />
  <SpendPlanner v-else />

  <SheetModal />
  <Toast />
  <ActModal />
  <HelpModal />
  <Tutorial />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { app, TUT_KEY } from './store'
import ClockBar from './components/common/ClockBar.vue'
import ActivityBanner from './components/activity/ActivityBanner.vue'
import BankBar from './components/coupons/BankBar.vue'
import TotalCard from './components/coupons/TotalCard.vue'
import FaceList from './components/coupons/FaceList.vue'
import StatsView from './components/views/StatsView.vue'
import SpendPlanner from './components/views/SpendPlanner.vue'
import SheetModal from './components/dialogs/SheetModal.vue'
import Toast from './components/common/Toast.vue'
import ActModal from './components/activity/ActModal.vue'
import HelpModal from './components/dialogs/HelpModal.vue'
import Tutorial from './components/dialogs/Tutorial.vue'

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
.top-actions{display:flex;align-items:center;gap:7px}
.github-link{position:relative}
.github-tooltip{position:absolute;top:calc(100% + 7px);right:0;width:220px;padding:8px 10px;border-radius:10px;background:#1F2A26;color:#fff;font-size:11px;font-weight:500;line-height:1.4;opacity:0;pointer-events:none;transform:translateY(-3px);transition:opacity .15s,transform .15s;z-index:5}
.github-link:hover .github-tooltip,.github-link:focus-visible .github-tooltip{opacity:1;transform:translateY(0)}
.github-link svg{width:16px;height:16px}
.planner-entry{display:flex;align-items:center;gap:11px;width:100%;margin:0 0 14px;padding:12px;border:1px solid #cfe4da;border-radius:15px;background:linear-gradient(100deg,#eff8f3,#fff);text-align:left;box-shadow:var(--shadow)}
.planner-icon{display:grid;place-items:center;width:36px;height:36px;border-radius:12px;background:var(--brand);color:#fff;font-size:19px}
.planner-copy{display:flex;flex:1;flex-direction:column;gap:2px}.planner-copy b{font-size:13px;color:var(--brand)}.planner-copy small{font-size:11px;color:var(--muted)}.planner-arrow{font-size:23px;color:var(--brand)}
.brand h1{font-size:21px;margin:0;font-weight:700;letter-spacing:.5px}
.ghost{height:42px;padding:0 16px;border-radius:999px;background:var(--card);color:var(--brand);font-size:15px;font-weight:600;box-shadow:var(--shadow);border:1px solid var(--line)}
.github-link{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:42px;padding:0 10px;border:1px solid var(--line);border-radius:999px;background:var(--card);color:var(--muted);font-size:12px;font-weight:600;text-decoration:none;box-shadow:var(--shadow)}
.github-link svg{width:16px;height:16px;flex:none}
.github-link:focus-visible,.planner-entry:focus-visible{outline:2px solid var(--brand);outline-offset:3px}
.planner-entry:hover{border-color:var(--brand)}

@media(max-width:390px){
  .page{padding-right:12px;padding-left:12px}
  .top{gap:6px}
  .brand{gap:6px;min-width:0}
  .brand svg{width:27px;height:27px;flex:none}
  .brand h1{font-size:17px;white-space:nowrap}
  .top-actions{gap:5px;flex:none}
  .github-link{width:38px;padding:0}
  .github-link span:first-of-type{display:none}
  .ghost{height:40px;padding:0 11px;font-size:14px}
}

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
