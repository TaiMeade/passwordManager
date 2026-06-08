<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="auto" class="text-center">
        <v-progress-circular indeterminate color="primary" size="48" />
        <p class="mt-4 text-body-1">Checking setup...</p>
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
  if (exists) {
    router.replace('/login')
  } else {
    router.replace('/setup')
  }
})
</script>
