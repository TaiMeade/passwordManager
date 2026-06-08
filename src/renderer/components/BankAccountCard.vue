<template>
  <EntryCard
    icon="mdi-bank-outline"
    kind="Bank account"
    accent="#3fb57e"
    :title="entry.bank"
    :rows="[
      { label: 'Routing', value: entry.routing },
      { label: 'Account', value: entry.account, secret: true }
    ]"
    copy-label="Copy account"
    :copy-value="entry.account"
    delete-name="bank account entry"
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
  await window.electronAPI.bankAccounts.delete(props.entry.id)
  emit('deleted')
  toast.success('Bank account deleted')
}
</script>
