<script setup lang="ts">
import { useRoleStore } from '../store'
import { type Lookup, type Role } from '../types'
type Props = {
  cat: Lookup
}
const { cat } = defineProps<Props>()
const { permissionLevels, categories, getCategoryChildren, getRolesByCategory } = useRoleStore()

const primaryRoles = getRolesByCategory(cat.id).filter((r) => r.roleKind === 'PRIMARY')
const secondaryRoles = getRolesByCategory(cat.id).filter((r) => r.roleKind !== 'PRIMARY')

const set = [
  primaryRoles.find((r) => r.permissionLevel === 'ADMIN') ?? { id: crypto.randomUUID(), name: 'xa' },
  primaryRoles.find((r) => r.permissionLevel === 'WRITE') ?? { id: crypto.randomUUID(), name: 'xw' },
  primaryRoles.find((r) => r.permissionLevel === 'READ') ?? { id: crypto.randomUUID(), name: 'xr' },
]
</script>
<template>
  <section class="grid grid-cols-subgrid col-span-full border-t *:p-4 border-white/60">
    <div v-if="false" class="col-span-full border-b border-dashed border-white/30">{{ cat.label }}</div>

    <div>
      <span>{{ cat.label }}</span>
    </div>

    <label class="text-center"><input type="radio" :name="`${cat.id}`" :value="null" /></label>
    <template v-for="role in set" :key="role.id">
      <label class="text-center"><input type="radio" :name="`${cat.id}`" :value="role.id" /></label>
    </template>

    <template v-for="role in getRolesByCategory(cat.id).filter((r) => r.roleKind !== 'PRIMARY')" :key="role.id">
      <div class="border-t border-dashed border-white/30">
        <span class="pl-4">{{ role.name }}</span>
      </div>

      <label class="border-t border-dashed border-white/30 text-center">
        <input type="checkbox" name="role-{{ role.id }}" :value="role.value" />
      </label>
      <div class="border-t border-dashed col-span-3 border-white/30"></div>
    </template>
  </section>
</template>
