<template>
  <div class="lock-wrapper" :class="{ disappear: fading }">
    <div class="lock-container">
      <!-- Shackle (the U-shaped top part) -->
      <div class="shackle" :class="{ unlocked: unlocked }" />
      <!-- Lock body -->
      <div class="lock-body" :class="{ unlocked: unlocked }">
        <div class="keyhole" :class="{ unlocked: unlocked }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['complete'])

const unlocked = ref(false)
const fading = ref(false)

onMounted(() => {
  // T=600ms: Unlock animation starts
  setTimeout(() => {
    unlocked.value = true
  }, 600)

  // T=2200ms: Start fade out
  setTimeout(() => {
    fading.value = true
  }, 2200)

  // T=4000ms: Animation complete, navigate
  setTimeout(() => {
    emit('complete')
  }, 4000)
})
</script>

<style scoped>
.lock-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1e1e1e;
  transition: opacity 1.5s ease-out, transform 1.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.lock-wrapper.disappear {
  opacity: 0;
  transform: scale(0.8);
}

.lock-container {
  position: relative;
  width: 120px;
  height: 160px;
}

/* Shackle - the curved top piece */
.shackle {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 50px;
  border: 6px solid #dc2f02;
  border-bottom: none;
  border-radius: 50px 50px 0 0;
  transform-origin: bottom left;
  transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1),
              border-color 0.8s ease;
  z-index: 1;
}

.shackle.unlocked {
  border-color: #38b000;
  transform: translateX(-50%) rotate(-30deg);
}

/* Lock body */
.lock-body {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 80px;
  background-color: #dc2f02;
  border-radius: 8px;
  transition: background-color 0.8s ease;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lock-body.unlocked {
  background-color: #38b000;
}

/* Keyhole */
.keyhole {
  width: 16px;
  height: 16px;
  background-color: #1e1e1e;
  border-radius: 50%;
  position: relative;
  transition: background-color 0.8s ease;
}

.keyhole::after {
  content: '';
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 16px;
  background-color: #1e1e1e;
  border-radius: 0 0 4px 4px;
}
</style>
