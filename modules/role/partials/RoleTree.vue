<script setup lang="ts">
import RoleItem from './RoleItem.vue'
import { useRoleStore } from '../store'

const { root, categories } = useRoleStore()

provide('tree-context', categories)

const getCategory = (role: Role) => categories.find((c) => c.id == role.roleCategory)
</script>

<template>
  <ul>
    <template v-for="child in root.children" :key="child.id">
      <details class="open:mb-4 group" open>
        <summary class="font-medium mb-2 list-none cursor-pointer flex items-center">
          <span class="inline-block dark:text-white">{{ getCategory(child).label }}</span>
        </summary>
        <div class="tree">
          <RoleItem :role="child" :root="true" v-slot="{ item }">
            <slot :item="item" />
          </RoleItem>
        </div>
      </details>
    </template>
  </ul>
</template>
