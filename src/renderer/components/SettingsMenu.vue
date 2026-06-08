<template>
  <v-menu :close-on-content-click="false" location="bottom end" offset="10">
    <template #activator="{ props }">
      <v-btn icon variant="text" v-bind="props" class="mr-2">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>
    </template>

    <v-card min-width="280" class="settings-card">
      <div class="settings-section">
        <p class="vault-eyebrow mb-1">Vault</p>
        <div class="stat-row">
          <span class="text-medium-emphasis">Stored items</span>
          <span class="stat-value">{{ entryCount }}</span>
        </div>
      </div>

      <v-divider />

      <div class="settings-section">
        <p class="vault-eyebrow mb-2">Preferences</p>
        <v-switch
          :model-value="isLight"
          hide-details
          density="compact"
          color="primary"
          @update:model-value="toggleTheme"
        >
          <template #label>
            <v-icon size="18" class="mr-2">{{ isLight ? 'mdi-white-balance-sunny' : 'mdi-weather-night' }}</v-icon>
            {{ isLight ? 'Light mode' : 'Dark mode' }}
          </template>
        </v-switch>

        <v-switch
          :model-value="showSensitive"
          hide-details
          density="compact"
          color="primary"
          class="mt-1"
          @update:model-value="$emit('update:show-sensitive', $event)"
        >
          <template #label>
            <v-icon size="18" class="mr-2">{{ showSensitive ? 'mdi-eye-outline' : 'mdi-eye-off-outline' }}</v-icon>
            Reveal sensitive fields
          </template>
        </v-switch>
      </div>

      <v-divider />

      <div class="settings-section">
        <p class="vault-eyebrow mb-2" style="color:rgb(var(--v-theme-error))">Danger zone</p>
        <v-btn color="error" variant="tonal" block @click="confirmDialog = true">
          <v-icon start>mdi-delete-alert-outline</v-icon>Self-destruct
        </v-btn>
      </div>
    </v-card>
  </v-menu>

  <v-dialog v-model="confirmDialog" max-width="420">
    <v-card class="pa-2">
      <v-card-title class="d-flex align-center ga-2 text-error">
        <v-icon>mdi-alert-octagon-outline</v-icon>Confirm self-destruct
      </v-card-title>
      <v-card-text>
        This will <strong>permanently delete ALL saved entries</strong>. This action
        cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="confirmDialog = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="handleDestruct">
          <v-icon start>mdi-delete-forever-outline</v-icon>Delete all
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

defineProps({
  showSensitive: { type: Boolean, default: false },
  entryCount: { type: Number, default: 0 }
})

const emit = defineEmits(['update:show-sensitive', 'selfDestruct'])

const theme = useTheme()
const confirmDialog = ref(false)

const isLight = computed(() => theme.global.name.value === 'light')

function toggleTheme() {
  theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark'
}

function handleDestruct() {
  confirmDialog.value = false
  emit('selfDestruct')
}
</script>

<style scoped>
.settings-card {
  background: var(--vault-surface);
  border: 1px solid var(--vault-hairline);
}

.settings-section {
  padding: 14px 18px;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stat-value {
  font-family: var(--vault-font-mono);
  font-weight: 700;
  font-size: 1.1rem;
  color: rgb(var(--v-theme-primary));
}
</style>
