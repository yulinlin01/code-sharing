<template>
  <div class="resume-page">
    <div class="resume-content">
      <Model1 />
    </div>
  </div>
</template>

<script setup>
import Model1 from './resume/model-1/model1.vue'
</script>

<style scoped>
.resume-page {
  min-height: 100vh;
  width: 100vw;
}
.resume-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 100px 100px;
}

</style>




