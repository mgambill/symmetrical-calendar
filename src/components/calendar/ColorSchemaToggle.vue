<script setup lang="ts">
import { SystemThemIcon, LightThemeIcon, DarkThemeIcon } from '@/assets/logos'
const model = defineModel<string>('theme', {
  default: 'system',
})
const items = [
  { label: 'System theme', value: 'system', icon: SystemThemIcon },
  { label: 'Light theme', value: 'light', icon: LightThemeIcon },
  { label: 'Dark theme', value: 'dark', icon: DarkThemeIcon },
]

const applyTheme = (theme: string) => {
  const html = document.documentElement
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.setAttribute('data-theme', isDark ? 'dark' : 'light')
  } else {
    html.setAttribute('data-theme', theme)
  }
}

onMounted(() => {
  applyTheme(model.value)

  // Listen to system theme changes when in 'system' mode
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handleChange = () => {
    if (model.value === 'system') applyTheme('system')
  }
  mediaQuery.addEventListener('change', handleChange)
})

watch(model, applyTheme)
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
            v-model="model"
          />
          <component :is="item.icon" />
        </div>
      </template>
    </div>
  </div>
</template>
