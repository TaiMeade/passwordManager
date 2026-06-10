<template>
  <EntryCard
    icon="mdi-card-account-details-outline"
    kind="ID"
    accent="#b18cf0"
    :title="entry.id_type"
    :rows="[{ label: 'Number', value: entry.id_number, secret: true }]"
    copy-label="Copy"
    :copy-value="entry.id_number"
    delete-name="ID entry"
    :show-sensitive="showSensitive"
    @edit="$emit('edit')"
    @delete="handleDelete"
  />
</template>

<script setup>
import EntryCard from './EntryCard.vue'
import { toast } from '../composables/useToast'

const props = defineProps({
  entry: { type: Object, required: true },
  showSensitive: { type: Boolean, default: false }
})

const emit = defineEmits(['deleted', 'edit'])

async function handleDelete() {
  await window.electronAPI.ids.delete(props.entry.id)
  emit('deleted')
  toast.success('ID deleted')
}
</script>
