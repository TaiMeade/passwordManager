<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4" xl="3">
        <div class="auth-card vault-rise">
          <div class="auth-glow" />

          <div class="text-center">
            <img src="../assets/logo.png" alt="The Vault" class="auth-logo">
            <h1 class="vault-wordmark text-h6 mt-4">The Vault</h1>
            <p class="vault-eyebrow mt-2">Enter your master password</p>
          </div>

          <v-form class="mt-8" @submit.prevent="handleLogin">
            <v-text-field
              ref="fieldRef"
              v-model="password"
              :type="show ? 'text' : 'password'"
              label="Master password"
              prepend-inner-icon="mdi-shield-key-outline"
              autofocus
              :error="hasError"
              @update:model-value="hasError = false"
            >
              <template #append-inner>
                <v-icon class="cursor-pointer" @click="show = !show">
                  {{ show ? 'mdi-eye-off' : 'mdi-eye' }}
                </v-icon>
              </template>
            </v-text-field>

            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              :loading="loading"
              class="mt-2 font-weight-bold"
            >
              <v-icon start>mdi-lock-open-variant-outline</v-icon>
              Unlock
            </v-btn>
          </v-form>

          <p class="auth-foot vault-eyebrow text-center mt-8">
            <v-icon size="13" class="mr-1">mdi-shield-check-outline</v-icon>
            Encrypted &amp; stored locally
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setAuthenticated } from '../router'
import { toast } from '../composables/useToast'

const router = useRouter()
const password = ref('')
const show = ref(false)
const loading = ref(false)
const hasError = ref(false)

function fail(msg) {
  hasError.value = true
  toast.error(msg)
}

async function handleLogin() {
  if (!password.value) {
    fail('Please enter the master password.')
    return
  }

  loading.value = true
  try {
    const valid = await window.electronAPI.db.verifyMasterPassword(password.value)
    if (valid) {
      setAuthenticated(true)
      router.replace('/welcome')
    } else {
      fail('Incorrect password. Try again.')
    }
  } catch {
    fail('An error occurred. Please try again.')
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

.auth-foot {
  color: var(--vault-text-dim);
  letter-spacing: 0.12em;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
