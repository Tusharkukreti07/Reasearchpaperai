import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Check if date is valid
  if (isNaN(d.getTime())) return 'Invalid date';
  
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const day = 24 * 60 * 60 * 1000;
  
  if (diff < day) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    if (hours < 1) {
      const minutes = Math.floor(diff / (60 * 1000));
      return minutes < 1 ? 'Just now' : `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diff < 2 * day) {
    return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (diff < 7 * day) {
    return d.toLocaleDateString('en-US', { weekday: 'long' }) + 
           `, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

export function truncate(text: string, length: number): string {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function bytesToSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

export function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
