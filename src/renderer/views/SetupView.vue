<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4" xl="3">
        <div class="auth-card vault-rise">
          <div class="auth-glow" />

          <div class="text-center">
            <img src="../assets/logo.png" alt="The Vault" class="auth-logo">
            <h1 class="vault-wordmark text-h6 mt-4">The Vault</h1>
            <p class="vault-eyebrow mt-2">Create your master password</p>
          </div>

          <v-form ref="formRef" class="mt-8" @submit.prevent="handleSetup">
            <v-text-field
              v-model="password"
              :type="show ? 'text' : 'password'"
              label="Master password"
              prepend-inner-icon="mdi-shield-key-outline"
              autofocus
              hide-details
            >
              <template #append-inner>
                <v-icon class="cursor-pointer" @click="show = !show">
                  {{ show ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>

            <!-- Strength meter -->
            <div class="strength mt-4">
              <div class="strength-track">
                <div
                  class="strength-fill"
                  :style="{ width: strength.pct + '%', background: strength.color }"
                />
              </div>
              <span class="strength-label" :style="{ color: strength.color }">
                {{ password ? strength.label : '' }}
              </span>
            </div>

            <!-- Live requirement checklist -->
            <ul class="reqs mt-3">
              <li v-for="r in checks" :key="r.label" :class="{ met: r.ok }">
                <v-icon size="15">
                  {{ r.ok ? 'mdi-check-circle' : 'mdi-circle-small' }}
                </v-icon>
                {{ r.label }}
              </li>
            </ul>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              :disabled="!allMet"
              class="mt-5 font-weight-bold"
            >
              <v-icon start>mdi-lock-check-outline</v-icon>
              Create vault
            </v-btn>
          </v-form>

          <p class="auth-foot vault-eyebrow text-center mt-6">
            <v-icon size="13" class="mr-1">mdi-information-outline</v-icon>
            This password cannot be recovered — keep it safe
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '../composables/useToast'

const router = useRouter()
const formRef = ref(null)
const password = ref('')
const show = ref(false)
const loading = ref(false)

const checks = computed(() => {
  const v = password.value
  return [
    { label: 'At least 9 characters', ok: v.length >= 9 },
    { label: 'A lowercase letter', ok: /[a-z]/.test(v) },
    { label: 'An uppercase letter', ok: /[A-Z]/.test(v) },
    { label: 'A number', ok: /\d/.test(v) },
    { label: 'A special character', ok: /\W/.test(v) }
  ]
})

const allMet = computed(() => checks.value.every(c => c.ok))

const strength = computed(() => {
  const met = checks.value.filter(c => c.ok).length
  const bonus = password.value.length >= 14 ? 1 : 0
  const score = Math.min(met + bonus, 5)
  const pct = (score / 5) * 100
  if (score <= 2) return { pct, label: 'Weak', color: '#e5484d' }
  if (score === 3) return { pct, label: 'Fair', color: '#f0a800' }
  if (score === 4) return { pct, label: 'Strong', color: '#ffcb05' }
  return { pct, label: 'Excellent', color: '#3fb57e' }
})

async function handleSetup() {
  if (!allMet.value) return
  loading.value = true
  try {
    await window.electronAPI.db.setMasterPassword(password.value)
    toast.success('Master password set successfully!')
    setTimeout(() => router.replace('/login'), 1000)
  } catch {
    toast.error('Failed to set master password.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-card {
  position: relative;
  padding: 40px 36px 32px;
  border-radius: 20px;
  background: var(--vault-surface);
  border: 1px solid var(--vault-hairline);
  box-shadow: var(--vault-shadow);
  overflow: hidden;
}

.auth-glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--vault-glow), transparent 70%);
  pointer-events: none;
}

.auth-logo {
  position: relative;
  width: 64px;
  height: auto;
  filter: drop-shadow(0 8px 22px rgba(255, 203, 5, 0.28));
}

.strength {
  display: flex;
  align-items: center;
  gap: 10px;
}

.strength-track {
  flex: 1;
  height: 6px;
  border-radius: 99px;
  background: var(--vault-hairline);
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.3s ease, background 0.3s ease;
}

.strength-label {
  min-width: 64px;
  text-align: right;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.reqs {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 14px;
}

.reqs li {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: var(--vault-text-dim);
  transition: color 0.2s ease;
}

.reqs li .v-icon {
  color: var(--vault-text-dim);
  transition: color 0.2s ease;
}

.reqs li.met,
.reqs li.met .v-icon {
  color: rgb(var(--v-theme-primary));
}

.auth-foot {
  color: var(--vault-text-dim);
  letter-spacing: 0.1em;
  line-height: 1.4;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
