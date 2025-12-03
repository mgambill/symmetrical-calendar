<script lang="ts" setup>
import {
  generateCalendarForMonth,
  currentMonth,
  currentYear,
  type Day,
  type CalendarEvents,
} from './generators'

type Props = {
  selectedDays: CalendarEvents
}

const { selectedDays } = defineProps<Props>()

type CalendarSettings = {
  showEvents?: 'all' | 'scoped' | 'never'
  showDays?: 'all' | 'scoped'
}

const settings: CalendarSettings = {
  showEvents: 'scoped',
  showDays: 'scoped',
}

const selectedYear = defineModel<number>('year', { required: true, default: currentYear() })
const selectedMonth = defineModel<number>('month', { required: true, default: currentMonth() })
const source = computed(() => generateCalendarForMonth(selectedYear.value, selectedMonth.value))

const isSelected = (day: Day) => {
  const [year, month, date] = day.date.split('-').map(Number)
  const today = new Date()
  return (
    year === selectedYear.value &&
    month === selectedMonth.value &&
    date === today.getDate() &&
    month === today.getMonth() + 1 &&
    year === today.getFullYear()
  )
}

const days = computed(() => {
  return source.value.map((d) => {
    const ev = selectedDays[d.date]
    console.log('ev', ev)
    return {
      ...d,
      events: ev ? (Array.isArray(ev) ? ev : [ev]) : [],
    }
  })
})

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// lg:grid-rows-7 | lg:grid-rows-6 | lg:grid-rows-5
</script>

<template>
  <div
    class="shadow-sm ring-1 ring-black/5 lg:flex lg:flex-auto lg:flex-col dark:shadow-none dark:ring-white/5"
  >
    <div
      class="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs/6 font-semibold text-gray-700 lg:flex-none dark:border-white/5 dark:bg-white/15 dark:text-gray-300"
    >
      <template v-for="day in daysOfWeek" :key="day">
        <div class="flex justify-center bg-white py-2 dark:bg-gray-900">
          <span>{{ day.charAt(0) }}</span>
          <span class="sr-only sm:not-sr-only">{{ day.substring(1) }}</span>
        </div>
      </template>
    </div>
    <div
      class="flex bg-gray-200 text-xs/6 text-gray-700 lg:flex-auto dark:bg-white/10 dark:text-gray-300"
    >
      <div
        :class="`hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-${days.length / 7} lg:gap-px`"
      >
        <template v-for="item in days" :key="item.date">
          <div
            :data-is-current-month="item.isCurrentMonth ? '' : undefined"
            :data-is-today="item.isToday ? '' : undefined"
            class="min-h-28 group relative bg-gray-50 px-3 py-2 text-gray-500 data-is-current-month:bg-white dark:bg-gray-900 dark:text-gray-400 dark:not-data-is-current-month:before:pointer-events-none dark:not-data-is-current-month:before:absolute dark:not-data-is-current-month:before:inset-0 dark:not-data-is-current-month:before:bg-gray-800/50 dark:data-is-current-month:bg-gray-900"
          >
            <time
              v-if="
                settings.showDays === 'all' ||
                (settings.showDays === 'scoped' && item.isCurrentMonth)
              "
              :datetime="item.date"
              class="relative group-not-data-is-current-month:opacity-75 in-data-is-today:flex in-data-is-today:size-6 in-data-is-today:items-center in-data-is-today:justify-center in-data-is-today:rounded-full in-data-is-today:bg-indigo-600 in-data-is-today:font-semibold in-data-is-today:text-white dark:in-data-is-today:bg-indigo-500"
              >{{ item.day }}</time
            >

            <template
              v-if="
                settings.showEvents === 'all' ||
                (settings.showEvents === 'scoped' && item.isCurrentMonth)
              "
            >
              <ol v-if="item.events.length > 0" class="mt-2">
                <li v-for="event in item.events.slice(0, 3)" :key="event.id">
                  <a :href="event.href" class="group flex">
                    <p :class="['flex-auto truncate font-medium', event.color]">
                      {{ event.name }}
                    </p>
                    <time
                      :datetime="event.datetime"
                      class="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block dark:text-gray-400 dark:group-hover:text-indigo-400"
                      >{{ event.time }}</time
                    >
                  </a>
                </li>
                <li v-if="item.events.length > 3" class="text-gray-500 dark:text-gray-400">
                  + {{ item.events.length - 3 }} more
                </li>
              </ol></template
            >
          </div>
        </template>
      </div>
      <div :class="`isolate grid w-full grid-cols-7 grid-rows-${days.length / 7} gap-px lg:hidden`">
        <button
          v-for="item in days"
          :key="item.date"
          type="button"
          :data-is-current-month="item.isCurrentMonth ? '' : undefined"
          :data-is-selected="isSelected(item) ? '' : undefined"
          :data-is-today="item.isToday ? '' : undefined"
          class="group relative flex h-14 flex-col px-3 py-2 not-data-is-current-month:bg-gray-50 not-data-is-selected:not-data-is-current-month:not-data-is-today:text-gray-500 hover:bg-gray-100 focus:z-10 data-is-current-month:bg-white not-data-is-selected:data-is-current-month:not-data-is-today:text-gray-900 data-is-current-month:hover:bg-gray-100 data-is-selected:font-semibold data-is-selected:text-white data-is-today:font-semibold not-data-is-selected:data-is-today:text-indigo-600 dark:not-data-is-current-month:bg-gray-900 dark:not-data-is-selected:not-data-is-current-month:not-data-is-today:text-gray-400 dark:not-data-is-current-month:before:pointer-events-none dark:not-data-is-current-month:before:absolute dark:not-data-is-current-month:before:inset-0 dark:not-data-is-current-month:before:bg-gray-800/50 dark:hover:bg-gray-900/50 dark:data-is-current-month:bg-gray-900 dark:not-data-is-selected:data-is-current-month:not-data-is-today:text-white dark:data-is-current-month:hover:bg-gray-900/50 dark:not-data-is-selected:data-is-today:text-indigo-400"
        >
          <time
            :datetime="item.date"
            class="ml-auto group-not-data-is-current-month:opacity-75 in-data-is-selected:flex in-data-is-selected:size-6 in-data-is-selected:items-center in-data-is-selected:justify-center in-data-is-selected:rounded-full in-data-is-selected:not-in-data-is-today:bg-gray-900 in-data-is-selected:in-data-is-today:bg-indigo-600 dark:in-data-is-selected:not-in-data-is-today:bg-white dark:in-data-is-selected:not-in-data-is-today:text-gray-900 dark:in-data-is-selected:in-data-is-today:bg-indigo-500"
            >{{ item.day }}</time
          >
          <span class="sr-only">{day.events.length} events</span>
          <span v-if="item.events.length > 0" class="-mx-0.5 mt-auto flex flex-wrap-reverse">
            <template v-for="event in item.events" :key="event.id">
              <span
                data-dot
                :class="['mx-0.5 mb-1 size-1.5 rounded-full', event.color]"
              ></span>
            </template>
          </span>
        </button>
      </div>
    </div>
  </div>
  <details v-if="false">
    <summary class="cursor-pointer text-sm text-gray-500 underline">Debug Info</summary>
    <pre>{{ { selectedYear, selectedMonth, l: days.length / 7 } }}</pre>
  </details>
</template>
