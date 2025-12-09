<script setup lang="ts" generic="T">
import { computed, inject } from 'vue'
import { treeContextKey, type TreeContext } from './index'

type Prop = {
  item: T
  root?: boolean
  parent?: T | null
  depth?: number
}

const { item, root: isRoot = false, depth = 0 } = defineProps<Prop>()

const context = inject(treeContextKey) as TreeContext<T> | undefined

if (!context) {
  throw new Error('TreeItem must be used within a Tree component')
}

const getItemKey = context.getItemKey
const hasNodeChildren = computed(() => context.hasChildren(item))
const childItems = computed(() => (hasNodeChildren.value ? context.getChildren(item) : []))

defineSlots<{
  default: {
    item: T
    parent: T | null | undefined
    depth: number
  }
}>()
</script>

<template>
  <li :class="{ root: isRoot }">
    <div data-node :class="{ root: isRoot }">
      <slot :item="item" :parent="parent" :depth="depth" />
    </div>
    <template v-if="hasNodeChildren">
      <ul>
        <template v-for="child in childItems" :key="getItemKey(child)">
          <TreeItem :item="child" :parent="item" :depth="depth + 1" v-slot="context">
            <slot v-bind="context" />
          </TreeItem>
        </template>
      </ul>
    </template>
  </li>
</template>
