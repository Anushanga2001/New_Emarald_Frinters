import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: 'LKR' | 'USD' = 'LKR'): string {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatPhoneNumber(phone: string): string {
  // Format Sri Lankan phone numbers: +94 XX XXX XXXX
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('94')) {
    const number = cleaned.substring(2)
    return `+94 ${number.substring(0, 2)} ${number.substring(2, 5)} ${number.substring(5)}`
  }
  return phone
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-LK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}
