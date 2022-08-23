const IMAGE_EXTENSIONS = [
  'apng',
  'avif',
  'gif',
  'jpg',
  'jpeg',
  'jfif',
  'pjpeg',
  'pjp',
  'png',
  'svg',
  'webp'
];

export function isValidImage(name: string): boolean {
  return IMAGE_EXTENSIONS.includes(name.split('.').pop() ?? '');
}
