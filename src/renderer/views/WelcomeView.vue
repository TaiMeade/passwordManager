<template>
  <LockAnimation @complete="goToVault" />
</template>

<script setup>
import { useRouter } from 'vue-router'
import LockAnimation from '../components/LockAnimation.vue'

const router = useRouter()

function goToVault() {
  router.replace('/vault')
}
</script>
