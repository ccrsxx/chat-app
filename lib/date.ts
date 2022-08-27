const FORMATTER = new Intl.DateTimeFormat('en-gb', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
});

function getShortTime(date: Date, type: 'today' | 'yesterday'): string {
  return `${type === 'today' ? 'Today' : 'Yesterday'} at ${date
    .toLocaleTimeString('en-gb')
    .slice(0, -3)}`;
}

function isToday(date: Date): boolean {
  return new Date().toDateString() === date.toDateString();
}

function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toDateString() === date.toDateString();
}

export function convertDate(millis: number | null): string {
  if (!millis) return getShortTime(new Date(), 'today');

  const date = new Date(millis);

  if (isToday(date)) return getShortTime(date, 'today');
  if (isYesterday(date)) return getShortTime(date, 'yesterday');

  return FORMATTER.format(date);
}
