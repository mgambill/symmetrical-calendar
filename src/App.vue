<script setup lang="ts">
import {
  monthNames,
  generateRecurringEvents,
  combineEvents,
} from './components/calendar/generators'
import YearCalendar from './components/calendar/YearCalendar.vue'
import { useLocalStorage } from '@vueuse/core'

import ColorSchemaToggle from './components/calendar/ColorSchemaToggle.vue'

const year = useLocalStorage('year', 2026)
const month = useLocalStorage('month', 1)

const themes = {
  cyan: 'text-cyan-600 group-hover:text-cyan-600 dark:text-cyan-300 dark:group-hover:text-cyan-400 data-dot:bg-cyan-400 dark:data-dot:bg-cyan-500',
  orange:
    'text-orange-600 group-hover:text-orange-600 dark:text-orange-400 dark:group-hover:text-orange-400 data-dot:bg-orange-400 dark:data-dot:bg-orange-500',
  green:
    'text-green-600 group-hover:text-green-600 dark:text-green-400 dark:group-hover:text-green-400 data-dot:bg-green-400 dark:data-dot:bg-green-500',
  red: 'text-red-600 group-hover:text-red-600 dark:text-red-400 dark:group-hover:text-red-400 data-dot:bg-red-400 dark:data-dot:bg-red-500',
  indigo:
    'text-indigo-700 group-hover:text-indigo-600 dark:text-indigo-400 dark:group-hover:text-indigo-400 data-dot:bg-indigo-400 dark:data-dot:bg-indigo-500',
  gray: 'text-gray-900 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-400 data-dot:bg-gray-400 dark:data-dot:bg-gray-500',
}

const sp1Events = (() => {
  const temp = [
    '2026-01-11',
    '2026-01-18',
    '2026-02-08',
    '2026-02-22',

    '2026-03-08',
    '2026-03-22',
    '2026-04-05',
    '2026-04-19',
    '2026-05-03',
    '2026-05-17',
    '2026-06-07',
    '2026-06-21',
  ]
  let rel = 0
  return temp.map((date, i) => {
    if (i % 2 === 0) {
      rel++
    }
    return {
      name: `A) 26.${rel} ${i % 2 === 0 ? 'Stage' : 'Production'}`,
      color: themes.cyan,
      id: crypto.randomUUID(),
      date,
    }
  })
})()

//const sp2Events = threeWeek()
const sp2Events = (() => {
  let rel = 0
  return [
    {
      name: `B) 26.1 Stage`,
      color: themes.orange,
      date: '2026-01-11',
      id: crypto.randomUUID(),
    },
    {
      name: `B) 26.1 Production`,
      color: themes.orange,
      date: '2026-01-18',
      id: crypto.randomUUID(),
    },
    ...generateRecurringEvents('2026-02-08', 21, 7, ({ index, isOdd }) => {
      if (index % 2 === 0) {
        rel++
      }
      return {
        name: `B) 26.${rel + 1} ${isOdd ? 'Production' : 'Stage'}`,
        color: themes.orange,
        id: crypto.randomUUID(),
      }
    }),
  ]
})()

const holidays = (() => {
  const temp = [
    ['2026-01-01'],
    ['2026-01-02', 'Ken & Lauren OOO'],
    ['2026-01-19'],
    ['2026-01-23', 'Milestone 3 Deadline', themes.red],
    ['2026-02-16'],
    ['2026-03-31'],
    ['2026-05-25'],
  ]

  return temp.map(([date, name, color]) => {
    return {
      name: name ?? 'Calmhsa Closed',
      color: color ?? themes.indigo,
      id: crypto.randomUUID(),
      date: date!,
    }
  })
})()

const range = 6
const selectedDays = ref(combineEvents(sp1Events, sp2Events, holidays))
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] min-h-screen">
    <div class="flex justify-between items-center p-4">
      <div class="flex max-w-96">
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
      <div class="items-center">
        <ColorSchemaToggle />
      </div>
    </div>

    <div class="p-4 border-t border-gray-500/50">
      <template v-for="i in range" :key="i">
        <p class="pb-2 pt-4 text-gray-700 dark:text-gray-300">{{ monthNames[i + month - 2] }}</p>
        <YearCalendar :year="year" :month="month + i - 1" :selectedDays />
      </template>
    </div>
  </div>
</template>
