'use client'

import React, { useState } from 'react';
import { format } from 'date-fns';
import { HorizontalDatePicker } from './horizontal-date-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function HorizontalDatePickerExample() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    // You can add additional logic here to handle the selected date
    console.log('Selected date:', format(date, 'PP'));
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Date Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <HorizontalDatePicker 
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          startDate={new Date()} // Start from today
          daysToShow={30} // Show 30 days
        />
        
        {selectedDate && (
          <div className="mt-4 p-3 bg-gray-100 rounded">
            <p>Selected date: <strong>{format(selectedDate, 'PPP')}</strong></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 