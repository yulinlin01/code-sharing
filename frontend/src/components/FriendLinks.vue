<template>
  <div class="links-section">
    <h1 class="title-h1">Friendship Links</h1>
    <p class="title-p">友情链接</p>
    <ul class="links-list">
      <li
        v-for="(item, index) in links"
        :key="item._id"
        class="link-item"
        :style="{ background: gradients[index % gradients.length] }"
        @click="openLink(item.linksContent)"
      >
        <span class="link-title-badge">{{
          capitalizeFirst(item.linksName)
        }}</span>
        <span class="link-desc">{{ item.linksFunction }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { SERVER_URL } from "../tools/ip.js";

const links = ref([]);

// 定义渐变色数组
const gradients = [
  "linear-gradient(135deg, rgba(29,78,216,0.3), rgba(236,72,153,0.3))",
  "linear-gradient(135deg, rgba(16,185,129,0.3), rgba(59,130,246,0.3))",
  "linear-gradient(135deg, rgba(234,88,12,0.3), rgba(99,102,241,0.3))",
  "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(236,72,153,0.3))",
  "linear-gradient(135deg, rgba(34,197,94,0.3), rgba(59,130,246,0.3))",
  "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(239,68,68,0.3))",
];

onMounted(async () => {
  try {
    const res = await fetch(`${SERVER_URL}getLinks`);
    if (!res.ok) throw new Error("网络请求失败");
    const data = await res.json();
    links.value = data.data;
  } catch (e) {
    console.error("获取友情链接失败：", e);
  }
});

function capitalizeFirst(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function openLink(url) {
  window.open(url, "_blank", "noopener");
}
</script>

<style scoped>
.links-section {
  width: 100%;
  border-radius: 10px;
}
.title-h1 {
  font-size: 40px;
  margin: 0px !important;
  margin-bottom: 12px;
  color: #fff;
  font-weight: 700;
  text-align: center;
}
.title-p {
  font-size: 16px;
  margin-bottom: 12px;
  color: #fff;
  font-weight: 700;
  text-align: center;
}
.links-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}
.link-item {
  border-bottom: 3px solid #e3e8f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 6px;
  backdrop-filter: blur(10px);
  transition: all 0.2s linear;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 100px;
}
.link-item:hover {
  transform: translateY(-3px);
  box-shadow: 0px 0px 10px 5px rgba(255, 255, 255, 0.5);
}
.link-desc {
  font-size: 10px;
  color: #888;
  max-width: 120px;
}
.link-title-badge {
  color: white;
  font-weight: 700;
  font-size: 20px;
}
.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d5af1;
  margin-bottom: 10px;
}
</style>
