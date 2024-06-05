import dayjs from 'dayjs';
import { ReceiptData } from './types';

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

  const options: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: roundTo === 'dollar' ? 0 : 2,
    maximumFractionDigits: roundTo === 'dollar' ? 0 : 2,
  };

  return new Intl.NumberFormat('en-US', options).format(amount);
}

export function getReceiptTitle(receipt: ReceiptData) {
  const transactionDate = receipt.transaction_date
    ? dayjs(receipt.transaction_date).format('MMM D, YYYY')
    : undefined;
  return `${receipt.merchant.name} Receipt - ${transactionDate} - ${toDollar(
    receipt.total_amount || 0
  )}`;
}

export function getS3FileUrl(objectKey: string) {
  const bucketDomain = import.meta.env.VITE_S3_BUCKET_URL;
  if (!bucketDomain) return '';
  return `${bucketDomain}/${objectKey}`;
}
