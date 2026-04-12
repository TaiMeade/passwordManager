<template>
  <v-layout>
    <NavBar
      v-model:search-term="searchTerm"
      v-model:show-sensitive="showSensitive"
      :entry-count="entryCount"
      @self-destruct="handleSelfDestruct"
    />

    <v-main>
      <Transition name="fade" appear>
        <v-container fluid class="pa-6">
          <EntryForm @saved="refreshAll" />

          <h2 class="text-h6 mt-6 mb-4">
            {{ searchTerm ? 'Search Results' : 'Saved Items' }}
          </h2>

          <EntryList
            :passwords="displayedPasswords"
            :cards="displayedCards"
            :bank-accounts="displayedBankAccounts"
            :ids="displayedIds"
            :notes="displayedNotes"
            :show-sensitive="showSensitive"
            @refresh="refreshAll"
          />
        </v-container>
      </Transition>
    </v-main>
  </v-layout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import EntryForm from '../components/EntryForm.vue'
import EntryList from '../components/EntryList.vue'

const searchTerm = ref('')
const showSensitive = ref(false)
const entryCount = ref(0)

const passwords = ref([])
const cards = ref([])
const bankAccounts = ref([])
const ids = ref([])
const notes = ref([])

const searchResults = ref(null)

const displayedPasswords = computed(() =>
  searchResults.value ? searchResults.value.filter(r => r.entry_type === 'password') : passwords.value
)
const displayedCards = computed(() =>
  searchResults.value ? searchResults.value.filter(r => r.entry_type === 'card') : cards.value
)
const displayedBankAccounts = computed(() =>
  searchResults.value ? searchResults.value.filter(r => r.entry_type === 'bank') : bankAccounts.value
)
const displayedIds = computed(() =>
  searchResults.value ? searchResults.value.filter(r => r.entry_type === 'id') : ids.value
)
const displayedNotes = computed(() =>
  searchResults.value ? searchResults.value.filter(r => r.entry_type === 'note') : notes.value
)

onMounted(() => {
  refreshAll()
  window.addEventListener('beforeunload', () => {
    navigator.clipboard.writeText(' ')
  })
})

watch(searchTerm, async (term) => {
  if (term && term.length > 0) {
    searchResults.value = await window.electronAPI.db.search(term)
  } else {
    searchResults.value = null
  }
})

async function refreshAll() {
  const [p, c, b, i, n, count] = await Promise.all([
    window.electronAPI.passwords.getAll(),
    window.electronAPI.cards.getAll(),
    window.electronAPI.bankAccounts.getAll(),
    window.electronAPI.ids.getAll(),
    window.electronAPI.notes.getAll(),
    window.electronAPI.db.getEntryCount()
  ])
  passwords.value = p
  cards.value = c
  bankAccounts.value = b
  ids.value = i
  notes.value = n
  entryCount.value = count
}

async function handleSelfDestruct() {
  await window.electronAPI.db.selfDestruct()
  await refreshAll()
}
</script>

<style scoped>
.fade-enter-active {
  transition: opacity 1s ease-in;
}

.fade-enter-from {
  opacity: 0;
}
</style>
