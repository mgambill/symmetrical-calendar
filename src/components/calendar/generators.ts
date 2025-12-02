export interface Day {
  date: string
  isCurrentMonth: boolean
  isToday: boolean
  day: number
  events: DayEvent[]
}

export interface DayEvent {
  name: string
  color: string
}

export type CalendarEvents = Record<Day['date'], DayEvent | DayEvent[]>

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

export function generateCalendarForYear(year: number, month?: number) {
  const today = formatDate(new Date())
  const months = []

  // Convert 1-indexed month to 0-indexed for internal use
  const startMonth = month !== undefined ? month - 1 : 0
  const endMonth = month !== undefined ? month : 12

  for (let m = startMonth; m < endMonth; m++) {
    const firstDay = new Date(year, m, 1)
    const lastDay = new Date(year, m + 1, 0)
    const dayOfWeek = (firstDay.getDay() + 7) % 7 // Convert to Monday=0
    const days = []

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

    // Next month's leading days (always 42 days total = 6 weeks)
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, m + 1, i)
      days.push(createDayObject(date, false, today))
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
