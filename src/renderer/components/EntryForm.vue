<template>
  <v-card class="mx-auto mt-5" max-width="450" elevation="4">
    <v-card-text>
      <v-select
        v-model="entryType"
        :items="entryTypes"
        item-title="label"
        item-value="value"
        variant="outlined"
        density="compact"
        hide-details
        class="mb-4"
      />

      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <!-- Password Fields -->
        <template v-if="entryType === 'Password'">
          <v-text-field
            v-model="form.service"
            label="Service"
            maxlength="30"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-text-field
            v-model="form.email"
            label="Email"
            maxlength="30"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-text-field
            v-model="form.username"
            label="Username"
            maxlength="30"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-text-field
            v-model="form.password"
            label="Password"
            maxlength="30"
            :rules="[required]"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            density="compact"
            class="mb-2"
          >
            <template #append-inner>
              <v-icon
                class="me-1 cursor-pointer"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
              <v-icon
                class="cursor-pointer"
                @click="form.password = generatePassword()"
              >
                mdi-key
              </v-icon>
            </template>
          </v-text-field>
        </template>

        <!-- Card Fields -->
        <template v-if="entryType === 'Card'">
          <v-text-field
            v-model="form.cardholder"
            label="Cardholder"
            maxlength="30"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-text-field
            v-model="form.card_number"
            label="Card Number"
            maxlength="19"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-text-field
            v-model="form.expiry_date"
            label="Expiry Date"
            placeholder="MM/YY"
            maxlength="5"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-text-field
            v-model="form.cvv"
            label="CVV"
            maxlength="4"
            :type="showPassword ? 'text' : 'password'"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          >
            <template #append-inner>
              <v-icon class="cursor-pointer" @click="showPassword = !showPassword">
                {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
          </v-text-field>
        </template>

        <!-- Bank Account Fields -->
        <template v-if="entryType === 'Bank'">
          <v-text-field
            v-model="form.bank"
            label="Bank / Financial Institution"
            maxlength="30"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-text-field
            v-model="form.routing"
            label="Routing Number"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-text-field
            v-model="form.account"
            label="Account Number"
            :type="showPassword ? 'text' : 'password'"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          >
            <template #append-inner>
              <v-icon class="cursor-pointer" @click="showPassword = !showPassword">
                {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
              </v-icon>
            </template>
          </v-text-field>
        </template>

        <!-- ID Fields -->
        <template v-if="entryType === 'ID'">
          <v-text-field
            v-model="form.id_type"
            label="ID Type"
            maxlength="30"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-text-field
            v-model="form.id_number"
            label="ID Number"
            maxlength="30"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
        </template>

        <!-- Note Fields -->
        <template v-if="entryType === 'Note'">
          <v-text-field
            v-model="form.title"
            label="Title"
            maxlength="30"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
          <v-textarea
            v-model="form.content"
            label="Content"
            rows="5"
            :rules="[required]"
            variant="outlined"
            density="compact"
            class="mb-2"
          />
        </template>

        <v-btn type="submit" color="primary" block :loading="saving">
          Save
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['saved'])

const entryTypes = [
  { label: 'Password:', value: 'Password' },
  { label: 'Credit/Debit Card:', value: 'Card' },
  { label: 'Bank Account:', value: 'Bank' },
  { label: 'ID Numbers:', value: 'ID' },
  { label: 'Notes:', value: 'Note' }
]

const entryType = ref('Password')
const formRef = ref(null)
const showPassword = ref(false)
const saving = ref(false)

const form = ref(getEmptyForm('Password'))

const required = v => !!v || 'This field is required'

watch(entryType, (type) => {
  form.value = getEmptyForm(type)
  showPassword.value = false
  formRef.value?.resetValidation()
})

function getEmptyForm(type) {
  switch (type) {
    case 'Password': return { service: '', email: '', username: '', password: '' }
    case 'Card': return { cardholder: '', card_number: '', expiry_date: '', cvv: '' }
    case 'Bank': return { bank: '', routing: '', account: '' }
    case 'ID': return { id_type: '', id_number: '' }
    case 'Note': return { title: '', content: '' }
    default: return {}
  }
}

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='
  let result = ''
  const array = new Uint32Array(16)
  crypto.getRandomValues(array)
  for (let i = 0; i < 16; i++) {
    result += chars[array[i] % chars.length]
  }
  return result
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    const data = { ...form.value }
    switch (entryType.value) {
      case 'Password':
        await window.electronAPI.passwords.add(data)
        break
      case 'Card':
        await window.electronAPI.cards.add(data)
        break
      case 'Bank':
        await window.electronAPI.bankAccounts.add(data)
        break
      case 'ID':
        await window.electronAPI.ids.add(data)
        break
      case 'Note':
        await window.electronAPI.notes.add(data)
        break
    }
    form.value = getEmptyForm(entryType.value)
    formRef.value?.resetValidation()
    emit('saved')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
