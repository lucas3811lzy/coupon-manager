<template>
  <div class="bankbar" role="tablist" aria-label="選擇銀行">
    <button class="bank" :class="{ on: app.bank === 'boc' }" type="button" @click="app.switchBank('boc')">
      <span class="logo bg-boc"></span>
      <span class="name">{{ NAMES.boc }}</span>
    </button>
    <button class="bank" :class="{ on: app.bank === 'icbc' }" type="button" @click="app.switchBank('icbc')">
      <span class="logo bg-icbc"></span>
      <span class="name">{{ NAMES.icbc }}</span>
    </button>
    <button class="bank" :class="{ on: app.bank === 'macaupass' }" type="button" @click="app.switchBank('macaupass')">
      <span class="logo bg-macaupass"></span>
      <span class="name">{{ NAMES.macaupass }}</span>
    </button>
    <button class="bank" :class="{ on: app.bank === 'luso' }" type="button" @click="app.switchBank('luso')">
      <span class="logo bg-luso"></span>
      <span class="name">{{ NAMES.luso }}</span>
    </button>
    <button class="bank" :class="{ on: app.bank === 'taifung' }" type="button" @click="app.switchBank('taifung')">
      <span class="logo bg-taifung"></span>
      <span class="name">{{ NAMES.taifung }}</span>
    </button>
    <button class="bank" :class="{ on: app.bank === 'cgb' }" type="button" @click="app.switchBank('cgb')">
      <span class="logo bg-cgb"></span>
      <span class="name">{{ NAMES.cgb }}</span>
    </button>
    <button class="bank" :class="{ on: app.bank === 'alipay' }" type="button" @click="app.switchBank('alipay')">
      <span class="logo bg-alipay"></span>
      <span class="name">{{ NAMES.alipay }}</span>
    </button>
  </div>
</template>

<script setup>
import { app, BANKS, NAMES } from '../../store'
</script>

<style scoped>
.bankbar {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 2px 2px 14px;
  scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch;
}
.bank {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 18px;
  border: 2px solid transparent;
  background: var(--card);
  scroll-snap-align: start;
  transition: all 0.18s;
  min-width: 88px;
}
/* logo 保持原始比例，絕不拉伸 */
.bank .logo {
  display: block;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #fff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border: 1px solid var(--line);
}
.bank .name {
  font-size: 13px;
  color: var(--text-main);
  line-height: 1.2;
  white-space: nowrap;
}
.bank.on {
  border-color: var(--brand);
  background: var(--brand-soft);
}
.bank.on .name {
  color: var(--brand);
  font-weight: 600;
}

.bank .logo.bg-boc { background-image: url('../../assets/boc.png'); }
.bank .logo.bg-icbc { background-image: url('../../assets/icbc.png'); }
.bank .logo.bg-macaupass { background-image: url('../../assets/macaupass.png'); }
.bank .logo.bg-luso { background-image: url('../../assets/luso.png'); }
.bank .logo.bg-taifung { background-image: url('../../assets/taifung.png'); }
.bank .logo.bg-cgb { background-image: url('../../assets/cgb.png'); }
.bank .logo.bg-alipay { background-image: url('../../assets/alipay.png'); }
</style>
