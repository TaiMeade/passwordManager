<template>
  <div class="entry-list">
    <PasswordCard
      v-for="entry in passwords"
      :key="'p-' + entry.id"
      :entry="entry"
      :show-sensitive="showSensitive"
      @deleted="$emit('refresh')"
    />
    <CardCard
      v-for="entry in cards"
      :key="'c-' + entry.id"
      :entry="entry"
      :show-sensitive="showSensitive"
      @deleted="$emit('refresh')"
    />
    <BankAccountCard
      v-for="entry in bankAccounts"
      :key="'b-' + entry.id"
      :entry="entry"
      :show-sensitive="showSensitive"
      @deleted="$emit('refresh')"
    />
    <IdCard
      v-for="entry in ids"
      :key="'i-' + entry.id"
      :entry="entry"
      :show-sensitive="showSensitive"
      @deleted="$emit('refresh')"
    />
    <NoteCard
      v-for="entry in notes"
      :key="'n-' + entry.id"
      :entry="entry"
      :show-sensitive="showSensitive"
      @deleted="$emit('refresh')"
    />
  </div>
</template>

<script setup>
import PasswordCard from './PasswordCard.vue'
import CardCard from './CardCard.vue'
import BankAccountCard from './BankAccountCard.vue'
import IdCard from './IdCard.vue'
import NoteCard from './NoteCard.vue'

defineProps({
  passwords: { type: Array, default: () => [] },
  cards: { type: Array, default: () => [] },
  bankAccounts: { type: Array, default: () => [] },
  ids: { type: Array, default: () => [] },
  notes: { type: Array, default: () => [] },
  showSensitive: { type: Boolean, default: false }
})

defineEmits(['refresh'])
</script>

<style scoped>
.entry-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  justify-content: flex-start;
}
</style>
