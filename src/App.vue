<script setup lang="ts">
import {
  monthNames,
  currentMonth,
  currentYear,
  generateRecurringEvents,
  combineEvents,
} from './components/calendar/generators'
import YearCalendar from './components/calendar/YearCalendar.vue'
import { useLocalStorage } from '@vueuse/core'
const year = useLocalStorage('year', currentYear())
const month = useLocalStorage('month', currentMonth())

const themes = {
  primary:
    'text-gray-900 group-hover:text-indigo-600 dark:text-cyan-200 dark:group-hover:text-indigo-400',
  secondary:
    'text-gray-900 group-hover:text-indigo-600 dark:text-sky-400 dark:group-hover:text-indigo-400',
  tertiary:
    'text-gray-900 group-hover:text-indigo-600 dark:text-green-400 dark:group-hover:text-indigo-400',
}

const calmhsa = () => {
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
      color: themes.primary,
      id: crypto.randomUUID(),
      date,
    }
  })
}
const sp1Events = calmhsa()

//const sp2Events = threeWeek()
const sp2Events = [
  {
    name: `B) 26.1 Stage`,
    color: themes.secondary,
    date: '2026-01-11',
    id: crypto.randomUUID(),
  },
  {
    name: `B) 26.1 Production`,
    color: themes.secondary,
    date: '2026-01-18',
    id: crypto.randomUUID(),
  },
  ...generateRecurringEvents('2026-02-08', 21, 7, ({ index, isOdd }) => ({
    name: `B) 26.${(isOdd ? index : index + 1) + 1} ${isOdd ? 'Production' : 'Stage'}  Release`,
    color: themes.secondary,
    id: crypto.randomUUID(),
  })),
]
// let offset = -6
// let release = 1
// const holidays = generateRecurringEvents('2026-01-04', 21, 7, ({ index, isOdd }) => {
//   if (offset % 3 === 1) {
//     release++
//   }
//   return {
//     name: `C) ${++offset % 3 === 1 ? 'Production' : 'Stage'} ${release} Release`,
//     color: themes.tertiary,
//     id: crypto.randomUUID(),
//   }
// })

const selectedDays = ref(combineEvents(sp1Events, sp2Events))
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
      <template v-for="i in 6" :key="i">
        <p class="py-2">{{ monthNames[i - 1] }}</p>
        <YearCalendar :year="year" :month="month + i - 1" :selectedDays />
        <hr />
      </template>
    </div>
    <pre>{{ sp2Events.map((x) => x.date) }}</pre>
  </div>
</template>
