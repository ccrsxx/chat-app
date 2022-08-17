const FORMATTER = new Intl.DateTimeFormat('en-gb', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
});

export function convertDate(millis: number | null): string {
  if (!millis) return 'Today at .....';

  const date = new Date(millis);

  if (isToday(date))
    return `Today at ${date.toLocaleTimeString('en-gb').slice(0, -3)}`;

  return FORMATTER.format(date);
}

function isToday(date: Date): boolean {
  return new Date().toDateString() === date.toDateString();
}
