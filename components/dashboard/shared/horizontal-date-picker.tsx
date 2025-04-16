import * as React from 'react'
import { format, addDays } from 'date-fns'
import { cn } from '@/lib/utils'

interface HorizontalDatePickerProps {
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  startDate?: Date
  daysToShow?: number
  className?: string
}

export function HorizontalDatePicker({
  selectedDate,
  onDateSelect,
  startDate = new Date(),
  daysToShow = 30,
  className
}: HorizontalDatePickerProps) {
  // Create an array of dates to display
  const dates = React.useMemo(() => {
    // Ensure startDate is at midnight
    const start = new Date(startDate)
    start.setHours(0, 0, 0, 0)
    
    // Generate dates, filtering out weekends and past dates
    const generatedDates: Date[] = []
    let currentDate = new Date(start)
    let count = 0
    
    // We'll continue until we have the requested number of valid dates
    while (generatedDates.length < daysToShow && count < 100) { // Safety limit
      const dayOfWeek = currentDate.getDay()
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // Skip weekends and past dates
      if (!(dayOfWeek === 0 || dayOfWeek === 6 || currentDate < today)) {
        generatedDates.push(new Date(currentDate))
      }
      
      currentDate = addDays(currentDate, 1)
      count++
    }
    
    return generatedDates
  }, [startDate, daysToShow])

  // Group dates by month
  const monthGroups = React.useMemo(() => {
    const groups: Record<string, Date[]> = {}
    
    dates.forEach(date => {
      const monthYear = format(date, 'MMMM')
      if (!groups[monthYear]) {
        groups[monthYear] = []
      }
      groups[monthYear].push(date)
    })
    
    return groups
  }, [dates])

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const handleDateClick = (date: Date) => {
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  // Format weekday to match the image (Mo, Tu, We, Th, Fr, Sa, Su)
  const formatWeekday = (date: Date) => {
    const day = date.getDay()
    const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    return weekdays[day]
  }

  return (
    <div 
      className={cn(
        "flex overflow-x-auto pb-2 hide-scrollbar",
        className
      )}
    >
      {Object.entries(monthGroups).map(([month, datesInMonth]) => (
        <div key={month} className="flex flex-col min-w-fit mr-6">
          <h3 className="text-base font-semibold mb-2">{month}</h3>
          <div className="flex space-x-2">
            {datesInMonth.map((date) => {
              const dayNumber = format(date, 'dd')
              const dayName = formatWeekday(date)
              const selected = isSelected(date)
              
              return (
                <div key={date.toISOString()} className="min-w-[42px]">
                  <div className="flex flex-col items-center">
                    <span className="text-xs mb-1 text-gray-500">
                      {dayName}
                    </span>
                    <button
                      onClick={() => handleDateClick(date)}
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full text-sm transition-colors",
                        selected ? "bg-blue-600 text-white font-medium" : "hover:bg-gray-100"
                      )}
                      aria-selected={selected}
                    >
                      {dayNumber}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
