<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { SystemThemIcon, LightThemeIcon, DarkThemeIcon } from '@/assets/logos'

const model = defineModel<string>('theme')
const localTheme = useLocalStorage('theme', 'system')

const theme = computed({
  get: () => model.value ?? localTheme.value,
  set: (value) => {
    if (model.value !== undefined) model.value = value
    localTheme.value = value
  },
})

const items = [
  { label: 'System theme', value: 'system', icon: SystemThemIcon },
  { label: 'Light theme', value: 'light', icon: LightThemeIcon },
  { label: 'Dark theme', value: 'dark', icon: DarkThemeIcon },
]

const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

watchEffect(() => {
  const html = document.documentElement
  const currentTheme = theme.value

  if (currentTheme === 'system') {
    html.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light')
  } else {
    html.setAttribute('data-theme', currentTheme)
  }
})

mediaQuery.addEventListener('change', () => {
  if (theme.value === 'system') {
    document.documentElement.setAttribute('data-theme', mediaQuery.matches ? 'dark' : 'light')
  }
})
</script>
<template>
  <div class="grid grid-cols-1 max-sm:hidden">
    <div
      class="relative z-0 inline-grid grid-cols-3 gap-0.5 rounded-full bg-gray-950/5 p-0.75 text-gray-950 dark:bg-white/10 dark:text-white"
    >
      <template v-for="item in items" :key="item.value">
        <div
          class="relative rounded-full p-1.5 *:size-7 has-checked:bg-white has-checked:ring has-checked:inset-ring has-checked:ring-gray-950/10 has-checked:inset-ring-white/10 sm:p-0 dark:has-checked:bg-gray-600 dark:has-checked:text-white dark:has-checked:ring-transparent"
        >
          <input
            type="radio"
            class="absolute inset-0 appearance-none"
            name="theme-:re:"
            :aria-label="item.label"
            :value="item.value"
            v-model="theme"
          />
          <component :is="item.icon" />
        </div>
      </template>
    </div>
  </div>
</template>
