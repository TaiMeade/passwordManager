<template>
  <v-layout>
    <NavBar
      v-model:search-term="searchTerm"
      v-model:show-sensitive="showSensitive"
      :entry-count="entryCount"
      @self-destruct="handleSelfDestruct"
    />

    <v-main>
      <v-container fluid class="pa-6 pa-md-8" style="max-width:1500px">
        <!-- Header -->
        <div class="vault-header vault-rise">
          <div>
            <p class="vault-eyebrow">{{ searchTerm ? 'Search results' : 'Your vault' }}</p>
            <h1 class="text-h5 font-weight-bold d-flex align-center ga-3">
              {{ searchTerm ? `“${searchTerm}”` : 'Saved items' }}
              <span class="count-chip">{{ totalShown }}</span>
            </h1>
          </div>
          <v-btn color="primary" size="large" class="font-weight-bold" @click="addDialog = true">
            <v-icon start>mdi-plus</v-icon>Add item
          </v-btn>
        </div>

        <!-- Empty: no entries at all -->
        <div v-if="entryCount === 0 && !searchTerm" class="empty-state vault-rise">
          <v-icon size="64" color="primary">mdi-shield-plus-outline</v-icon>
          <h2 class="text-h6 mt-4">Your vault is empty</h2>
          <p class="text-medium-emphasis mb-5">Add your first password, card, or secure note.</p>
          <v-btn color="primary" size="large" class="font-weight-bold" @click="addDialog = true">
            <v-icon start>mdi-plus</v-icon>Add your first item
          </v-btn>
        </div>

        <!-- Empty: search returned nothing -->
        <div v-else-if="totalShown === 0 && searchTerm" class="empty-state vault-rise">
          <v-icon size="64" color="secondary">mdi-magnify-close</v-icon>
          <h2 class="text-h6 mt-4">No matches</h2>
          <p class="text-medium-emphasis">Nothing in your vault matches “{{ searchTerm }}”.</p>
        </div>

        <!-- List -->
        <EntryList
          v-else
          :passwords="displayedPasswords"
          :cards="displayedCards"
          :bank-accounts="displayedBankAccounts"
          :ids="displayedIds"
          :notes="displayedNotes"
          :show-sensitive="showSensitive"
          @refresh="refreshAll"
          @edit="editTarget = $event"
        />
      </v-container>
    </v-main>

    <!-- Add dialog -->
    <v-dialog v-model="addDialog" max-width="500" scrollable>
      <EntryForm @saved="onSaved" @close="addDialog = false" />
    </v-dialog>

    <!-- Edit dialog -->
    <v-dialog v-model="editDialog" max-width="500" scrollable>
      <EntryForm
        v-if="editTarget"
        :entry="editTarget.entry"
        :type="editTarget.type"
        @saved="onEdited"
        @close="editTarget = null"
      />
    </v-dialog>
  </v-layout>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import NavBar from '../components/NavBar.vue'
import EntryForm from '../components/EntryForm.vue'
import EntryList from '../components/EntryList.vue'
import { toast } from '../composables/useToast'

const searchTerm = ref('')
const showSensitive = ref(false)
const entryCount = ref(0)
const addDialog = ref(false)

const editTarget = ref(null)
const editDialog = computed({
  get: () => !!editTarget.value,
  set: (open) => { if (!open) editTarget.value = null }
})

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

const totalShown = computed(() =>
  displayedPasswords.value.length +
  displayedCards.value.length +
  displayedBankAccounts.value.length +
  displayedIds.value.length +
  displayedNotes.value.length
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
  // Keep an active search in sync after add/edit/delete
  if (searchTerm.value) {
    searchResults.value = await window.electronAPI.db.search(searchTerm.value)
  }
}

function onSaved() {
  addDialog.value = false
  refreshAll()
  toast.success('Added to your vault')
}

function onEdited() {
  editTarget.value = null
  refreshAll()
  toast.success('Changes saved')
}

async function handleSelfDestruct() {
  await window.electronAPI.db.selfDestruct()
  await refreshAll()
  toast.success('Vault cleared — all entries deleted')
}
</script>

<style scoped>
.vault-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.count-chip {
  display: inline-grid;
  place-items: center;
  min-width: 30px;
  height: 26px;
  padding: 0 9px;
  border-radius: 99px;
  font-size: 0.82rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 16%, transparent);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 20px;
  border: 1px dashed var(--vault-hairline);
  border-radius: 20px;
  margin-top: 8px;
}
</style>
