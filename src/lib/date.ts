const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;

const relativeFormatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

export function nowISO(): string {
  return new Date().toISOString();
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = Date.now();
  const diff = date.getTime() - now;
  const absDiff = Math.abs(diff);

  if (absDiff < MINUTE) {
    return relativeFormatter.format(Math.round(diff / SECOND), 'second');
  }
  if (absDiff < HOUR) {
    return relativeFormatter.format(Math.round(diff / MINUTE), 'minute');
  }
  if (absDiff < DAY) {
    return relativeFormatter.format(Math.round(diff / HOUR), 'hour');
  }
  if (absDiff < WEEK) {
    return relativeFormatter.format(Math.round(diff / DAY), 'day');
  }
  if (absDiff < MONTH) {
    return relativeFormatter.format(Math.round(diff / WEEK), 'week');
  }
  return relativeFormatter.format(Math.round(diff / MONTH), 'month');
}

export function formatDate(dateStr: string): string {
  return dateFormatter.format(new Date(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return dateTimeFormatter.format(new Date(dateStr));
}
