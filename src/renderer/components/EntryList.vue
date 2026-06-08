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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 340px));
  gap: 20px;
  width: 100%;
  align-items: start;
  justify-content: start;
}

/* Gentle staggered reveal for the first rows of cards */
.entry-list > :nth-child(1) { animation-delay: 0.02s; }
.entry-list > :nth-child(2) { animation-delay: 0.06s; }
.entry-list > :nth-child(3) { animation-delay: 0.1s; }
.entry-list > :nth-child(4) { animation-delay: 0.14s; }
.entry-list > :nth-child(5) { animation-delay: 0.18s; }
.entry-list > :nth-child(6) { animation-delay: 0.22s; }
.entry-list > :nth-child(7) { animation-delay: 0.26s; }
.entry-list > :nth-child(8) { animation-delay: 0.3s; }
</style>
