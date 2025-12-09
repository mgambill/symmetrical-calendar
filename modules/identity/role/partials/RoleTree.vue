<script setup lang="ts">
import { initializeTreeContext, Tree, TreeItem } from '@/components/tree'
import { useRoleStore } from '../store'
import { type Lookup, type Role } from '../types'

const { root, categories, getCategory, getCategoryChildren } = useRoleStore()

const args = initializeTreeContext(root, {
  hasChildren: (item: Role) => item.children && item.children.length > 0,
  getChildren: (item: Role) => item.children || [],
  getItemKey: (item: Role) => item.id,
})
</script>

<template>
  <Tree v-bind="args">
    <template v-for="cat in categories" :key="cat.id">
      <template v-if="getCategoryChildren(cat).length > 0">
        <details name="role-cat" class="group mt-2 border bg-white/5 border-gray-200 dark:border-gray-900/50">
          <summary class="font-medium list-none cursor-pointer flex items-center bg-black/10 py-2">
            <span class="inline-block dark:text-white px-2">{{ cat.label ?? 'No Category' }}</span>
          </summary>
          <ul class="tree py-2">
            <template v-for="role in getCategoryChildren(cat)" :key="role.id">
              <TreeItem :item="role" :root="true" :parent="root" v-slot="source">
                <div class="flex py-1 px-2 gap-2 items-center">
                  <span>
                    {{ source.item.name }}
                  </span>

                  <span class="font-mono text-xs bg-zinc-300 rounded px-2 dark:bg-zinc-950">
                    {{ source.item.value }}
                  </span>
                </div>
              </TreeItem>
            </template>
          </ul>
        </details>
      </template>
    </template>
  </Tree>
</template>
