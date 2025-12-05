<script setup lang="ts" generic="T">
import { treeContextKey, type TreeContext } from './index'

type Prop = {
  item: T
  root?: boolean
  parent?: T | null
}

const { item, root: isRoot = false } = defineProps<Prop>()
const { hasChildren, getChildren, getItemKey } = inject(treeContextKey) as TreeContext<T>

const _hasChildren = hasChildren(item)
const children = getChildren(item)
</script>

<template>
  <li :class="{ root: isRoot }">
    <div data-node :class="{ root: isRoot }"><slot :item="item" /></div>
    <template v-if="_hasChildren">
      <ul>
        <TreeItem v-for="child in children" :key="getItemKey(child)" :item="child" :parent="item" />
      </ul>
    </template>
  </li>
</template>
