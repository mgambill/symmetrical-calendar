<script setup lang="ts">
// type Props = {}
// const { } = defineProps<Props>()
// const emits = defineEmits<{ click:[] }>()
import {useProfileStore} from '../store'
const store = useProfileStore()
const { profiles } = storeToRefs(store)
</script>

<template>
  <div class="flex">
    <select>
      <option v-for="profile in profiles" :key="profile.id" :value="profile.id">
        {{ profile.name }}
      </option>
    </select>

    <button @click="$emit('click')">
      Add Profile
    </button>
  </div>
</template>
