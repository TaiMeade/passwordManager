<template>
  <EntryCard
    icon="mdi-note-text-outline"
    kind="Secure note"
    accent="#f08a5a"
    :title="entry.title"
    :rows="[{ label: 'Content', value: entry.content, secret: true }]"
    copy-label="Copy"
    :copy-value="entry.content"
    delete-name="note"
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
  await window.electronAPI.notes.delete(props.entry.id)
  emit('deleted')
  toast.success('Note deleted')
}
</script>
