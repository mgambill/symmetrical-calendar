<script lang="ts" setup>
import RoleGrid from '../partials/RoleGrid.vue'
import RoleTree from '../partials/RoleTree.vue'
import type {Profile} from '~/identity/profiles/types'
import ProfileSelector from '~/identity/profiles/partials/ProfileSelector.vue'
const profile = ref<Profile>(null)
</script>

<template>
  <ProfileSelector v-model="profile"/>
  <div class="grid grid-cols-[1fr_3fr] min-h-screen">
    <nav class="bg-gray-100 dark:bg-white/15 dark:text-gray-300 p-4">
      <RoleTree />
    </nav>
    <section>
      <RoleGrid />
    </section>
  </div>
</template>
