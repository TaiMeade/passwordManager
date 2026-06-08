<template>
  <v-card class="entry-card vault-rise" :style="{ '--accent': accent }" variant="flat">
    <div class="entry-head">
      <div class="entry-icon"><v-icon size="20">{{ icon }}</v-icon></div>
      <div style="min-width:0; flex:1">
        <div class="entry-title">{{ title }}</div>
        <div class="entry-kind">{{ kind }}</div>
      </div>
      <v-tooltip v-if="hasSecret && !showSensitive" :text="revealed ? 'Hide' : 'Reveal'" location="top">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon variant="text" size="small" @click="revealed = !revealed">
            <v-icon size="20">{{ shown ? 'mdi-eye-off-outline' : 'mdi-eye-outline' }}</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>

    <div class="entry-body">
      <div v-for="row in rows" :key="row.label" class="entry-row">
        <span class="entry-label">{{ row.label }}</span>
        <span
          class="entry-value"
          :class="{ 'is-secret': row.secret }"
        >
          <template v-if="row.secret && !shown">
            <span class="entry-secret-dots">••••••••••</span>
          </template>
          <template v-else>{{ row.value || '—' }}</template>
        </span>
      </div>
    </div>

    <v-divider />
    <div class="entry-foot">
      <v-btn size="small" variant="text" color="primary" @click="copy">
        <v-icon start size="18">{{ copied ? 'mdi-check' : 'mdi-content-copy' }}</v-icon>
        {{ copied ? 'Copied' : copyLabel }}
      </v-btn>
      <v-spacer />
      <v-tooltip text="Delete" location="top">
        <template #activator="{ props }">
          <v-btn v-bind="props" icon size="small" variant="text" color="error" @click="confirm = true">
            <v-icon size="20">mdi-trash-can-outline</v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </div>

    <v-dialog v-model="confirm" max-width="380">
      <v-card class="pa-2">
        <v-card-title class="d-flex align-center ga-2">
          <v-icon color="error">mdi-trash-can-outline</v-icon>Delete entry?
        </v-card-title>
        <v-card-text>This will permanently delete this {{ deleteName }}.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirm = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="onDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  icon: { type: String, default: 'mdi-shield-outline' },
  kind: { type: String, required: true },
  title: { type: String, default: '' },
  accent: { type: String, default: 'var(--vault-gold)' },
  rows: { type: Array, default: () => [] },
  copyLabel: { type: String, default: 'Copy' },
  copyValue: { type: [String, Number], default: '' },
  deleteName: { type: String, default: 'entry' },
  showSensitive: { type: Boolean, default: false }
})

const emit = defineEmits(['delete'])

const revealed = ref(false)
const copied = ref(false)
const confirm = ref(false)

const hasSecret = computed(() => props.rows.some(r => r.secret))
const shown = computed(() => props.showSensitive || revealed.value)

// When global "Show All" turns on, the per-card toggle is hidden — reset its
// state so turning Show All back off cleanly hides every secret again.
watch(() => props.showSensitive, (on) => {
  if (on) revealed.value = false
})

function copy() {
  navigator.clipboard.writeText(String(props.copyValue))
  copied.value = true
  setTimeout(() => { copied.value = false }, 1600)
  // Clear clipboard after 30s for security
  setTimeout(() => navigator.clipboard.writeText(' '), 30000)
}

function onDelete() {
  confirm.value = false
  emit('delete')
}
</script>

<style scoped>
.entry-foot {
  display: flex;
  align-items: center;
  padding: 6px 10px 8px;
}
</style>
