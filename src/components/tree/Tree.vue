<script setup lang="ts" generic="T">
import TreeItem from './TreeItem.vue'

type Props = {
  root?: T
  hasChildren: (item: T) => boolean
}

const { root, hasChildren } = defineProps<Props>()

provide('tree-context', {
  hasChildren,
})
</script>

<template>
  <slot>
    <ul class="tree">
      <TreeItem :role="root" :root="true" />
    </ul>
  </slot>
</template>
