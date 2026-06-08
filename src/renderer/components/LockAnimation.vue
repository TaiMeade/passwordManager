<template>
  <div class="lock-wrapper" :class="{ disappear: fading }">
    <div class="lock-stage">
      <div class="burst" :class="{ unlocked }" />
      <div class="lock-container">
        <!-- Shackle (the U-shaped top part) -->
        <div class="shackle" :class="{ unlocked }" />
        <!-- Lock body -->
        <div class="lock-body" :class="{ unlocked }">
          <div class="keyhole" :class="{ unlocked }" />
        </div>
      </div>
      <div class="brand vault-wordmark" :class="{ unlocked }">The Vault</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['complete'])

const unlocked = ref(false)
const fading = ref(false)

onMounted(() => {
  setTimeout(() => { unlocked.value = true }, 600)
  setTimeout(() => { fading.value = true }, 2300)
  setTimeout(() => { emit('complete') }, 4000)
})
</script>

<style scoped>
.lock-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--vault-bg, #0e0f12);
  /* Fade the backdrop only — scaling the full-screen rectangle is what
     produced the visible edge/line, so we never transform the wrapper. */
  transition: opacity 1.4s ease-out;
}

.lock-wrapper.disappear {
  opacity: 0;
}

.lock-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-origin: center;
  transition: transform 1.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Zoom out only the lock graphic, not the background */
.lock-wrapper.disappear .lock-stage {
  transform: scale(0.85);
}

/* Radial burst that blooms on unlock */
.burst {
  position: absolute;
  top: 70px;
  left: 50%;
  width: 280px;
  height: 280px;
  transform: translate(-50%, -50%) scale(0.4);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 203, 5, 0.35), transparent 65%);
  opacity: 0;
  transition: opacity 1s ease, transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.burst.unlocked {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
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
  border: 7px solid #8a8a82;
  border-bottom: none;
  border-radius: 50px 50px 0 0;
  transform-origin: bottom left;
  transition: transform 1s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.8s ease;
  z-index: 1;
}

.shackle.unlocked {
  border-color: #a9a9a0;
  transform: translateX(-50%) rotate(-32deg);
}

/* Lock body */
.lock-body {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 80px;
  background: linear-gradient(160deg, #2a2d33, #1a1c20);
  border-radius: 12px;
  box-shadow: 0 14px 40px -16px rgba(0, 0, 0, 0.8);
  transition: background 0.8s ease, box-shadow 0.8s ease;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lock-body.unlocked {
  background: linear-gradient(160deg, #ffd84a, #f0a800);
  box-shadow: 0 18px 50px -14px rgba(255, 203, 5, 0.55);
}

/* Keyhole */
.keyhole {
  width: 16px;
  height: 16px;
  background-color: #8a8a82;
  border-radius: 50%;
  position: relative;
  transition: background-color 0.8s ease;
}

.keyhole.unlocked {
  background-color: #1a1500;
}

.keyhole::after {
  content: '';
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 16px;
  background-color: inherit;
  border-radius: 0 0 4px 4px;
}

.brand {
  margin-top: 28px;
  font-size: 1.05rem;
  color: var(--vault-text, #f3f1ea);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
}

.brand.unlocked {
  opacity: 1;
  transform: translateY(0);
}
</style>
