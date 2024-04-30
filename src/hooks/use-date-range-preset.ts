import { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import { DateRange } from 'react-day-picker';
import { DatePreset } from '@/lib/types';

export function useDateRangePreset(initialPreset: DatePreset = 'mtd') {
  const [datePreset, setDatePreset] = useState<DatePreset>(initialPreset);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const dateRangeStr = useMemo(() => {
    return {
      start_date: dateRange?.from?.toISOString() || '',
      end_date: dateRange?.to?.toISOString() || '',
    };
  }, [dateRange]);

  useEffect(() => {
    const updateDateRange = () => {
      const today = new Date();
      let startDate: Date;

      switch (datePreset) {
        case '1-day':
          startDate = dayjs(today).subtract(1, 'day').toDate();
          break;
        case '7-days':
          startDate = dayjs(today).subtract(7, 'days').toDate();
          break;
        case '1-month':
          startDate = dayjs(today).subtract(1, 'month').toDate();
          break;
        case 'mtd':
          startDate = dayjs(today).startOf('month').toDate();
          break;
        case '3-months':
          startDate = dayjs(today).subtract(3, 'months').toDate();
          break;
        case '6-months':
          startDate = dayjs(today).subtract(6, 'months').toDate();
          break;
        case '1-year':
          startDate = dayjs(today).subtract(1, 'year').toDate();
          break;
        case 'ytd':
          startDate = dayjs(today).startOf('year').toDate();
          break;
        case '3-years':
          startDate = dayjs(today).subtract(3, 'years').toDate();
          break;
        default:
          startDate = today;
      }

      setDateRange({ from: startDate, to: today });
    };

    updateDateRange();
  }, [datePreset]);

  return { datePreset, setDatePreset, dateRange, setDateRange, dateRangeStr };
}
