<template>
  <v-menu :close-on-content-click="false" location="bottom end">
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </template>

    <v-card min-width="220" class="pa-3">
      <v-switch
        :model-value="isDark"
        label="Light Mode"
        hide-details
        density="compact"
        color="primary"
        @update:model-value="toggleTheme"
      />

      <v-switch
        :model-value="showSensitive"
        label="Show"
        hide-details
        density="compact"
        color="primary"
        class="mt-2"
        @update:model-value="$emit('update:show-sensitive', $event)"
      />

      <p class="text-body-2 mt-3">
        <strong>Entry Count: </strong>{{ entryCount }}
      </p>

      <v-btn
        color="error"
        variant="tonal"
        block
        class="mt-3"
        @click="confirmDialog = true"
      >
        Self-Destruct
      </v-btn>
    </v-card>
  </v-menu>

  <v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Confirm Self-Destruct</v-card-title>
      <v-card-text>
        This will permanently delete ALL saved entries. This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="confirmDialog = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="handleDestruct">Delete All</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'

const props = defineProps({
  showSensitive: { type: Boolean, default: false },
  entryCount: { type: Number, default: 0 }
})

const emit = defineEmits(['update:show-sensitive', 'selfDestruct'])

const theme = useTheme()
const confirmDialog = ref(false)

const isDark = computed(() => theme.global.name.value === 'dark')

function toggleTheme() {
  theme.global.name.value = theme.global.name.value === 'dark' ? 'light' : 'dark'
}

function handleDestruct() {
  confirmDialog.value = false
  emit('selfDestruct')
}
</script>
