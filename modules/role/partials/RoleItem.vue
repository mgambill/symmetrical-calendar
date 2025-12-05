<script setup lang="ts">
import type { Role } from '../type'

type Prop = {
  role: Role
  root?: boolean
  parent?: Role | null
}

const { role, root: isRoot = false } = defineProps<Prop>()
const hasChildren = role.children && role.children.length > 0
</script>

<template>
  <li :class="{ root: isRoot }">
    <div data-node :class="{ root: isRoot }"><slot :item="role" /></div>
    <template v-if="hasChildren">
      <ul>
        <RoleItem v-for="child in role.children" :key="child.id" :role="child" :parent="role">
          <slot :item="child" />
        </RoleItem>
      </ul>
    </template>
  </li>
</template>
