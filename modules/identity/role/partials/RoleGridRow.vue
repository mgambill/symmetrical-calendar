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

    <label class="text-center">
      <template v-if="primary === null">
        <i class="fa-duotone fa-solid fa-circle-check duo-primary-red-600 duo-secondary-red-100 dark:duo-primary-red-200 dark:duo-secondary-red-800"></i>
      </template>
      <template v-else>
        <i data-inherited class="fa-duotone fa-solid fa-circle-x duo-primary-zinc-500 duo-secondary-zinc-100 dark:duo-primary-zinc-400 dark:duo-secondary-zinc-800" ></i>
      </template>

      <input
        type="radio"
        v-model="primary"
        :name="`${cat.id}`"
        :value="null"
        class="relative size-0 opacity-0 hidden"
      />
    </label>

    <template v-for="role in set" :key="role.id">
      <label class="text-center">
        <template v-if="primary === role.id">
          <i data-checked class="fa-duotone fa-solid fa-circle-check duo-primary-green-600 duo-secondary-green-100 dark:duo-secondary-green-800 dark:duo-primary-green-500"></i>
        </template>
        <template v-else-if="primaryRole && role && primaryRole?.depth <= role?.depth">
          <i data-inherited class="fa-duotone fa-solid fa-circle-half-horizontal duo-primary-green-600 duo-secondary-green-100 dark:duo-secondary-green-800 dark:duo-primary-green-500"></i>
        </template>
        <template v-else>
          <i data-inherited class="fa-duotone fa-solid fa-circle-x duo-primary-zinc-500 duo-secondary-zinc-100 dark:duo-primary-zinc-400 dark:duo-secondary-zinc-800" ></i>
        </template>
        <input type="radio" v-model="primary" :name="`${cat.id}`" :value="role.id" class="opacity-0 size-0" />
      </label>
      <!-- <label class="hidden group-hover:block text-center has-checked:bg-green-100 dark:has-checked:bg-green-800 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
        /></label> -->
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
