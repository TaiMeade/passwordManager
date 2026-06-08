<template>
  <v-app>
    <div class="vault-bg" />
    <div class="vault-grain" />
    <router-view v-slot="{ Component }">
      <Transition name="view" mode="out-in">
        <component :is="Component" />
      </Transition>
    </router-view>
    <ToastHost />
  </v-app>
</template>

<script setup>
import ToastHost from './components/ToastHost.vue'
</script>

<style>
.view-enter-active,
.view-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.view-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.view-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
