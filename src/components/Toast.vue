<template>
  <div class="toast" :class="{ show: app.toastOn }" role="status">{{ app.toastMsg }}</div>
</template>

<script setup>
import { app } from '../store'
</script>

<style scoped>
.toast{position:fixed;left:50%;bottom:92px;transform:translate(-50%,20px);background:rgba(30,40,36,.94);color:#fff;padding:13px 20px;border-radius:13px;font-size:16px;opacity:0;pointer-events:none;transition:all .3s;z-index:120;max-width:86vw;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.2)}
.toast.show{opacity:1;transform:translate(-50%,0)}
</style>
