<script setup lang="ts" generic="T">
import { provide, type InjectionKey } from 'vue'
import { treeContextKey, type TreeContext } from '.'
import TreeItem from './TreeItem.vue'

type Props = {
  root?: T
  hasChildren: (item: T) => boolean
  getChildren: (item: T) => T[]
  getItemKey: (item: T) => string | number
}

const props = defineProps<Props>()

provide(treeContextKey as InjectionKey<TreeContext<T>>, props)
</script>

<template>
  <slot>
    <ul class="tree">
      <TreeItem :item="props.root" :root="true" />
    </ul>
  </slot>
</template>
