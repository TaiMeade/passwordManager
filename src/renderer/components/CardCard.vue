<template>
  <EntryCard
    icon="mdi-credit-card-outline"
    kind="Card"
    accent="#5aa9e6"
    :title="entry.cardholder"
    :rows="[
      { label: 'Number', value: formattedCardNumber },
      { label: 'Expiry', value: entry.expiry_date },
      { label: 'CVV', value: entry.cvv, secret: true }
    ]"
    copy-label="Copy CVV"
    :copy-value="entry.cvv"
    delete-name="card entry"
    :show-sensitive="showSensitive"
    @edit="$emit('edit')"
    @delete="handleDelete"
  />
</template>

<script setup>
import { computed } from 'vue'
import EntryCard from './EntryCard.vue'
import { toast } from '../composables/useToast'

const props = defineProps({
  entry: { type: Object, required: true },
  showSensitive: { type: Boolean, default: false }
})

const emit = defineEmits(['deleted', 'edit'])

const formattedCardNumber = computed(() => {
  const num = props.entry.card_number.replace(/\s/g, '')
  return num.match(/.{1,4}/g)?.join(' ') || num
})

async function handleDelete() {
  await window.electronAPI.cards.delete(props.entry.id)
  emit('deleted')
  toast.success('Card deleted')
}
</script>
