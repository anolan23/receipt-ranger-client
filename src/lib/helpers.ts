import dayjs from 'dayjs';

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const formatDate = (date: Date): string => {
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return dayjs(date).format('MMM YYYY');
};

export function getDates(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
  }

  return dates;
}

export function toDollar(
  value: string | number,
  roundTo: 'dollar' | 'cent' = 'cent'
): string {
  const amount = typeof value === 'string' ? parseFloat(value) : value;

  if (roundTo === 'dollar') {
    return `$${amount.toFixed(0)}`;
  } else {
    return `$${amount.toFixed(2)}`;
  }
}

export const categoryColors = new Map([
  ['Fruits', 'var(--color-charts-palette-categorical-1)'],
  ['Vegetables', 'var(--color-charts-palette-categorical-2)'],
  ['Canned Goods', 'var(--color-charts-palette-categorical-3)'],
  ['Dairy', 'var(--color-charts-palette-categorical-4)'],
  ['Meat', 'var(--color-charts-palette-categorical-5)'],
  ['Fish & Seafood', 'var(--color-charts-palette-categorical-6)'],
  ['Deli', 'var(--color-charts-palette-categorical-7)'],
  ['Condiments & Spices', 'var(--color-charts-palette-categorical-8)'],
  ['Snacks', 'var(--color-charts-palette-categorical-9)'],
  ['Bread & Bakery', 'var(--color-charts-palette-categorical-10)'],
  ['Beverages', 'var(--color-charts-palette-categorical-11)'],
  ['Pasta, Rice & Cereal', 'var(--color-charts-palette-categorical-12)'],
  ['Baking', 'var(--color-charts-palette-categorical-13)'],
  ['Frozen Foods', 'var(--color-charts-palette-categorical-14)'],
  ['Personal Care', 'var(--color-charts-palette-categorical-15)'],
  ['Health Care', 'var(--color-charts-palette-categorical-16)'],
  [
    'Household & Cleaning Supplies',
    'var(--color-charts-palette-categorical-17)',
  ],
  ['Baby Items', 'var(--color-charts-palette-categorical-18)'],
  ['Pet Care', 'var(--color-charts-palette-categorical-19)'],
  ['Other', 'var(--color-charts-palette-categorical-20)'],
]);
