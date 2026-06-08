<template>
  <EntryCard
    icon="mdi-key-variant"
    kind="Password"
    accent="#ffcb05"
    :title="entry.service"
    :rows="[
      { label: 'Email', value: entry.email },
      { label: 'Username', value: entry.username },
      { label: 'Password', value: entry.password, secret: true }
    ]"
    copy-label="Copy password"
    :copy-value="entry.password"
    delete-name="password entry"
    :show-sensitive="showSensitive"
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

const emit = defineEmits(['deleted'])

async function handleDelete() {
  await window.electronAPI.passwords.delete(props.entry.id)
  emit('deleted')
  toast.success('Password deleted')
}
</script>
