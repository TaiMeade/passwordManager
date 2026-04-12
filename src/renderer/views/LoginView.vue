<template>
  <v-container class="fill-height" fluid>
    <div class="background-image" />

    <v-row align="center" justify="center" style="z-index: 1">
      <v-col cols="12" sm="8" md="5" lg="4">
        <div class="text-center">
          <h2 class="text-h5 font-weight-bold mb-6" style="color: #1e1e1e">
            The Vault
          </h2>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="password"
              type="password"
              placeholder="Enter Master Password"
              variant="outlined"
              density="comfortable"
              bg-color="rgba(255,255,255,0.25)"
              @keydown.enter="handleLogin"
            />

            <v-btn
              type="submit"
              color="success"
              size="large"
              block
              :loading="loading"
              class="mt-4"
            >
              Login
            </v-btn>
          </v-form>
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" color="error" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { setAuthenticated } from '../router'

const router = useRouter()
const password = ref('')
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')

async function handleLogin() {
  if (!password.value) {
    snackbarText.value = 'Please enter the master password.'
    snackbar.value = true
    return
  }

  loading.value = true
  try {
    const valid = await window.electronAPI.db.verifyMasterPassword(password.value)
    if (valid) {
      setAuthenticated(true)
      router.replace('/welcome')
    } else {
      snackbarText.value = 'Incorrect password. Try again.'
      snackbar.value = true
    }
  } catch {
    snackbarText.value = 'An error occurred. Please try again.'
    snackbar.value = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.background-image {
  position: absolute;
  top: 16%;
  left: 50%;
  transform: translateX(-50%);
  width: 50vw;
  height: 50vh;
  background: url('../assets/logo.png') no-repeat center;
  background-size: cover;
}
</style>
