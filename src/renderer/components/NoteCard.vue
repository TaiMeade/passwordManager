<template>
  <v-card class="entry-card" variant="outlined">
    <v-card-text>
      <p class="entry-field"><strong>Title: </strong>{{ entry.title }}</p>
      <p v-show="showSensitive" class="entry-field sensitive">
        <strong>Content: </strong>{{ entry.content }}
      </p>
    </v-card-text>
    <v-card-actions>
      <v-btn size="small" variant="text" color="primary" @click="copyValue(entry.content)">
        <v-icon start>mdi-content-copy</v-icon>Copy
      </v-btn>
      <v-spacer />
      <v-btn size="small" variant="text" color="error" @click="confirmDelete = true">
        <v-icon start>mdi-delete</v-icon>Delete
      </v-btn>
    </v-card-actions>

    <v-dialog v-model="confirmDelete" max-width="350">
      <v-card>
        <v-card-title>Delete Entry?</v-card-title>
        <v-card-text>This will permanently delete this note.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="confirmDelete = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="handleDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  entry: { type: Object, required: true },
  showSensitive: { type: Boolean, default: false }
})

const emit = defineEmits(['deleted'])
const confirmDelete = ref(false)

function copyValue(value) {
  navigator.clipboard.writeText(value)
  setTimeout(() => navigator.clipboard.writeText(' '), 30000)
}

async function handleDelete() {
  confirmDelete.value = false
  await window.electronAPI.notes.delete(props.entry.id)
  emit('deleted')
}
</script>

<style scoped>
.entry-card {
  width: 280px;
  border-left: 5px solid rgb(var(--v-theme-primary));
}

.entry-field {
  margin: 6px 0;
  font-size: 14px;
  font-family: 'Courier New', Courier, monospace;
}

.entry-field strong {
  color: rgb(var(--v-theme-primary));
}
</style>
