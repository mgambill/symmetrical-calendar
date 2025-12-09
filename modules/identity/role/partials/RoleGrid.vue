<script setup lang="ts">
import { useRoleStore } from '../store'
import RoleGridRow from './RoleGridRow.vue'

const { permissionLevels, categories, getCategoryChildren, getRolesByCategory } = useRoleStore()
</script>
<template>
  <h2 class="dark:text-white text-3xl px-2 py-4">Permission Level</h2>

  <div class="inline-grid grid-cols-[auto_1fr_1fr_1fr_1fr] dark:text-gray-300">
    <section class="grid grid-cols-subgrid col-span-full">
      <div></div>
      <div class="text-center p-4 font-medium">None</div>
      <template v-for="{ label, key } in permissionLevels.filter((p) => p.enabled)" :key="key">
        <div class="text-center p-4 font-medium">{{ label }}</div>
      </template>
    </section>

    <template v-for="cat in categories" :key="cat.id">
      <template v-if="getCategoryChildren(cat).length > 0">
        <RoleGridRow :cat="cat" />
      </template>
    </template>
  </div>
</template>
