export interface CalendarSettings {
  trimEmptyWeeks?: boolean
  startDay?: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'
}

export interface Day {
  date: string
  isCurrentMonth: boolean
  isToday: boolean
  day: number
  events: DayEvent[]
}

export interface DayEvent {
  id: string
  name: string
  color: string
}

interface EventContext {
  index: number
  isOdd: boolean
}

export type CalendarEvents = Record<Day['date'], RecurringEvent | RecurringEvent[]>

export interface RecurringEvent extends DayEvent {
  date: string
}
function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number)
  return new Date(year!, month! - 1, day)
}

export function generateRecurringEvents(
  startDate: string,
  intervalDays: number,
  monthsOut: number,
  event: (c: EventContext) => DayEvent,
): RecurringEvent[] {
  const start = parseDate(startDate)
  const end = new Date(start.getFullYear(), start.getMonth() + monthsOut, start.getDate())
  const events: RecurringEvent[] = []
  const current = new Date(start)
  let index = 0

  while (current < end) {
    events.push({
      date: formatDate(current),
      ...event({ index, isOdd: index % 2 === 1 }),
    })
    current.setDate(current.getDate() + intervalDays)
    index++
  }

  return events
}

export function combineEvents(...eventGroups: RecurringEvent[][]): CalendarEvents {
  const result: CalendarEvents = {}

  for (const group of eventGroups) {
    for (const { date, name, color, id } of group) {
      if (result[date]) {
        if (Array.isArray(result[date])) {
          ;(result[date] as DayEvent[]).push({ name, color, id, date })
        } else {
          result[date] = [result[date] as DayEvent, { name, color, id, date }]
        }
      } else {
        result[date] = { name, color, id, date }
      }
    }
  }

  return result
}

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const currentYear = () => new Date().getFullYear()
export const currentMonth = () => new Date().getMonth() + 1

export function generateCalendarForMonth(year: number, month?: number): Day[] {
  return generateCalendarForYear(year, month)[0]?.days ?? []
}

function generateCalendarForYear(year: number, month?: number, settings: CalendarSettings = {}) {
  const { trimEmptyWeeks = true, startDay = 'sunday' } = settings

  const dayMap: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }

  const startDayOffset = dayMap[startDay]!
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const today = formatDate(new Date())
  const months = []

  const startMonth = month !== undefined ? month - 1 : 0
  const endMonth = month !== undefined ? month : 12

  for (let m = startMonth; m < endMonth; m++) {
    const firstDay = new Date(year, m, 1)
    const lastDay = new Date(year, m + 1, 0)
    const dayOfWeek = (firstDay.getDay() - startDayOffset + 7) % 7
    let days = []

    // Previous month's trailing days
    for (let i = dayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, m, -i)
      days.push(createDayObject(date, false, today))
    }

    // Current month's days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, m, day)
      days.push(createDayObject(date, true, today))
    }

    // Next month's leading days (always 42 days = 6 weeks unless trimmed)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, m + 1, i)
      days.push(createDayObject(date, false, today))
    }

    // Trim empty weeks if enabled
    if (trimEmptyWeeks) {
      // Remove complete weeks from the end where all days are in next month
      while (days.length >= 7) {
        const lastWeekStart = days.length - 7
        const lastWeek = days.slice(lastWeekStart)

        // If all days in this week are not current month, remove it
        if (lastWeek.every((d) => !d.isCurrentMonth)) {
          days = days.slice(0, lastWeekStart)
        } else {
          break
        }
      }
    }

    months.push({ name: monthNames[m], days })
  }

  return months
}

function createDayObject(date: Date, isCurrentMonth: boolean, today: string) {
  const dateStr = formatDate(date)
  return {
    date: dateStr,
    isCurrentMonth,
    isToday: dateStr === today,
    day: date.getDate(),
    events: [],
  }
}

function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
