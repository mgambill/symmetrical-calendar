<script lang="ts" setup>
import ColorSchemaToggle from './components/ColorSchemaToggle.vue'
</script>
<template>
  <router-view />

  <div class="absolute z-10 right-4 top-4">
    <ColorSchemaToggle />
  </div>
</template>
