const FORMATTER = new Intl.DateTimeFormat('en-gb', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
});

function getTodayTime(date: Date): string {
  return `Today at ${date.toLocaleTimeString('en-gb').slice(0, -3)}`;
}

function isToday(date: Date): boolean {
  return new Date().toDateString() === date.toDateString();
}

export function convertDate(millis: number | null): string {
  if (!millis) return getTodayTime(new Date());

  const date = new Date(millis);

  if (isToday(date)) return getTodayTime(date);

  return FORMATTER.format(date);
}
