<template>
  <v-app-bar :height="68" flat class="vault-appbar">
    <template #prepend>
      <div class="brand">
        <img src="../assets/logo.png" alt="Logo" class="brand-logo">
        <span class="vault-wordmark brand-text">The Vault</span>
      </div>
    </template>

    <v-spacer />

    <v-text-field
      :model-value="searchTerm"
      placeholder="Search your vault…"
      prepend-inner-icon="mdi-magnify"
      variant="solo-filled"
      flat
      density="compact"
      hide-details
      single-line
      clearable
      rounded="lg"
      class="search-field"
      @update:model-value="$emit('update:searchTerm', $event || '')"
    />

    <v-spacer />

    <template #append>
      <SettingsMenu
        :show-sensitive="showSensitive"
        :entry-count="entryCount"
        @update:show-sensitive="$emit('update:showSensitive', $event)"
        @self-destruct="$emit('selfDestruct')"
      />
    </template>
  </v-app-bar>
</template>

<script setup>
import SettingsMenu from './SettingsMenu.vue'

defineProps({
  searchTerm: { type: String, default: '' },
  showSensitive: { type: Boolean, default: false },
  entryCount: { type: Number, default: 0 }
})

defineEmits(['update:searchTerm', 'update:showSensitive', 'selfDestruct'])
</script>

<style scoped>
.vault-appbar {
  background: var(--vault-surface) !important;
  border-bottom: 1px solid var(--vault-hairline);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 16px;
}

.brand-logo {
  height: 32px;
  width: auto;
  filter: drop-shadow(0 4px 10px rgba(255, 203, 5, 0.3));
}

.brand-text {
  font-size: 0.95rem;
  color: var(--vault-text);
}

.search-field {
  max-width: 460px;
}

@media (max-width: 720px) {
  .brand-text {
    display: none;
  }
}
</style>
