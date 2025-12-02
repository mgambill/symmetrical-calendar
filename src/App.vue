<script setup lang="ts">
import {
  monthNames,
  currentMonth,
  currentYear,
  type CalendarEvents,
} from './components/calendar/generators'
import YearCalendar from './components/calendar/YearCalendar.vue'
import { useLocalStorage } from '@vueuse/core'
const year = useLocalStorage('year', currentYear())
const month = useLocalStorage('month', currentMonth())

const selectedDays = ref<CalendarEvents>({
  '2025-12-21': { name: 'Christmas Shopping', color: 'bg-red-500' },
  '2025-12-25': { name: 'Christmas Day', color: 'bg-green-500' },
  '2026-01-18': [
    {
      name: 'SP 1 Prod',
      color:
        'text-gray-900 group-hover:text-indigo-600 dark:text-cyan-200 dark:group-hover:text-indigo-400',
    },
    {
      name: 'SP 2 Prod',
      color:
        'text-gray-900 group-hover:text-indigo-600 dark:text-sky-400 dark:group-hover:text-indigo-400',
    },
  ],
})
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] min-h-screen">
    <div class="flex max-w-96 p-4">
      <select
        name="month"
        id="month"
        v-model="month"
        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-transparent dark:text-gray-400 dark:*:bg-gray-800 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
      >
        <option v-for="(name, index) in monthNames" :key="index" :value="index + 1">
          {{ name }}
        </option>
      </select>

      <select
        v-model="year"
        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-7 pl-3 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 dark:bg-transparent dark:text-gray-400 dark:*:bg-gray-800 dark:placeholder:text-gray-500 dark:focus:outline-indigo-500"
      >
        <option :value="2024">2024</option>
        <option :value="2025">2025</option>
        <option :value="2026">2026</option>
      </select>
    </div>

    <div class="p-4 border-t border-gray-500/50">
      <YearCalendar :year="year" :month="month" :selectedDays />
    </div>
  </div>
</template>
