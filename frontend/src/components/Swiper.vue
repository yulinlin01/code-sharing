<template>
  <div class="swiper-box">
    <div class="slides">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="slide"
        :class="{ active: index === currentIndex }"
        :style="{ background: gradients[index % gradients.length] }"
      >
        <div class="slide-content">{{ msg }}</div>
      </div>
    </div>
    <div class="indicators">
      <span
        v-for="(msg, index) in messages"
        :key="'dot-' + index"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="goTo(index)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const messages = [
  "明天的你会感谢今天努力的自己",
  "此时不努力，更待何时",
  "没有人会托举你的明天，只有你自己。",
];

const gradients = [
  "linear-gradient(135deg, rgba(29,78,216,0.20), rgba(236,72,153,0.20))",
  "linear-gradient(135deg, rgba(16,185,129,0.20), rgba(59,130,246,0.20))",
  "linear-gradient(135deg, rgba(234,88,12,0.20), rgba(99,102,241,0.20))",
];

const currentIndex = ref(0);
let timer = null;

function start() {
  stop();
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % messages.length;
  }, 3000);
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function goTo(index) {
  currentIndex.value = index;
  start();
}

onMounted(() => {
  start();
});

onUnmounted(() => {
  stop();
});
</script>

<style scoped>
.swiper-box {
  height: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
}

.slides {
  height: 100%;
  width: 100%;
  position: relative;
  backdrop-filter: blur(10px);
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(1.02);
  transition: opacity 0.6s ease, transform 0.6s ease;
  color: #fff;
}

.slide.active {
  opacity: 1;
  transform: scale(1);
}

.slide-content {
  font-size: 50px;
  font-weight: 600;
  letter-spacing: 1px;
  text-align: center;
  line-height: 1.6;
  padding: 0 24px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
}

.indicators {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 2;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.dot.active {
  background: #fff;
  transform: scale(1.2);
}
</style>
