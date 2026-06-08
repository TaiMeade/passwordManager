<template>
  <v-container class="fill-height position-relative" fluid>
    <v-row align="center" justify="center">
      <v-col cols="auto" class="text-center">
        <img src="../assets/logo.png" alt="The Vault" class="check-logo vault-rise">
        <div class="vault-wordmark text-h6 mt-4 vault-rise" style="animation-delay:0.1s">
          The Vault
        </div>
        <div class="loader mt-6 vault-rise" style="animation-delay:0.2s">
          <span /><span /><span />
        </div>
        <p class="vault-eyebrow mt-4 vault-rise" style="animation-delay:0.3s">
          Securing session
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(async () => {
  const exists = await window.electronAPI.db.checkMasterPassword()
  router.replace(exists ? '/login' : '/setup')
})
</script>

<style scoped>
.check-logo {
  width: 84px;
  height: auto;
  filter: drop-shadow(0 10px 28px rgba(255, 203, 5, 0.25));
}

.loader {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.loader span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  animation: pulse 1.2s ease-in-out infinite;
}

.loader span:nth-child(2) {
  animation-delay: 0.18s;
}
.loader span:nth-child(3) {
  animation-delay: 0.36s;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.25;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
