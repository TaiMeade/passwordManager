<template>
  <v-app-bar color="surface" elevation="2" density="comfortable">
    <template #prepend>
      <img
        src="../assets/logo.png"
        alt="Logo"
        style="height: 36px; margin-left: 12px; margin-right: 8px"
      >
      <v-app-bar-title class="text-body-1 font-weight-bold">
        The Vault
      </v-app-bar-title>
    </template>

    <v-text-field
      :model-value="searchTerm"
      placeholder="Search..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="compact"
      hide-details
      single-line
      clearable
      class="mx-4"
      style="max-width: 400px"
      @update:model-value="$emit('update:searchTerm', $event || '')"
    />

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
