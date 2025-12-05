<script lang="ts" setup>
import RoleTree from '../partials/RoleTree.vue'
</script>

<template>
  <div class="grid grid-cols-[1fr_2fr] min-h-screen">
    <nav class="bg-gray-100 dark:bg-white/15 dark:text-gray-300 p-4">
      <RoleTree v-slot="{ item }">
        <div class="block py-1 px-2">
          {{ item.name }}
        </div>
      </RoleTree>
    </nav>
    <section></section>
  </div>
</template>
