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
const primary = ref(null)
const primaryRole = computed(() => {
  return getRolesByCategory(cat.id).find((r) => r.id === primary.value)
})
</script>
<template>
  <!-- <div class="grid-cols-subgrid col-span-full">
    <pre>{{ primaryRole }}</pre>
  </div> -->
  <section class="group grid grid-cols-subgrid col-span-full border-t *:p-4 border-white/60">
    <div v-if="false" class="col-span-full border-b border-dashed border-white/30">{{ cat.label }}</div>

    <div>
      <span>{{ cat.label }}</span>
    </div>

    <label class="block group-hover:hidden text-center">
      <template v-if="primary === null">X</template>
      <template v-else> - </template>
    </label>
    <label class="hidden group-hover:block text-center has-checked:bg-red-100 hover:bg-gray-50">
      <input
        type="radio"
        v-model="primary"
        :name="`${cat.id}`"
        :value="null"
        class="relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden checked:border-red-600 checked:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 dark:border-white/10 dark:bg-white/5 dark:checked:border-red-500 dark:checked:bg-red-500 dark:focus-visible:outline-red-500 dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:before:bg-white/20 forced-colors:appearance-auto forced-colors:before:hidden"
      />
    </label>

    <template v-for="role in set" :key="role.id">
      <label class="block group-hover:hidden text-center">
        <template v-if="primary === role.id">X</template>
        <template v-else-if="primaryRole && role && primaryRole?.depth < role?.depth">Z</template>
        <template v-else> - </template>
      </label>
      <label class="hidden group-hover:block text-center has-checked:bg-green-100 hover:bg-gray-50"
        ><input type="radio" v-model="primary" :name="`${cat.id}`" :value="role.id"
      /></label>
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
