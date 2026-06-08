<template>
  <v-container class="fill-height" fluid>
    <div class="background-image" />

    <v-row align="center" justify="center" style="z-index: 1">
      <v-col cols="12" sm="8" md="5" lg="4">
        <div class="text-center">
          <h2 class="text-h5 font-weight-bold mb-6" style="color: #1e1e1e">
            Create a Master Password
          </h2>

          <v-form ref="formRef" @submit.prevent="handleSetup">
            <v-text-field
              v-model="password"
              type="password"
              placeholder="Enter Master Password"
              variant="outlined"
              density="comfortable"
              :rules="passwordRules"
              class="mb-2"
              bg-color="rgba(255,255,255,0.25)"
            />

            <v-btn
              type="submit"
              color="success"
              size="large"
              block
              :loading="loading"
              class="mt-4"
            >
              Save
            </v-btn>
          </v-form>
        </div>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formRef = ref(null)
const password = ref('')
const loading = ref(false)
const snackbar = ref(false)
const snackbarText = ref('')
const snackbarColor = ref('error')

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 9 || 'Must be at least 9 characters',
  v => /[a-z]/.test(v) || 'Must contain a lowercase letter',
  v => /[A-Z]/.test(v) || 'Must contain an uppercase letter',
  v => /\W/.test(v) || 'Must contain a special character'
]

async function handleSetup() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await window.electronAPI.db.setMasterPassword(password.value)
    snackbarColor.value = 'success'
    snackbarText.value = 'Master password set successfully!'
    snackbar.value = true
    setTimeout(() => router.replace('/login'), 1000)
  } catch {
    snackbarColor.value = 'error'
    snackbarText.value = 'Failed to set master password.'
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
