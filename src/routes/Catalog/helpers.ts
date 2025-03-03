export function getDisplayText(s: string) {
  switch (s) {
    case 'movie':
      return 'Movies';
    case 'series':
      return 'Series';
    default:
      return s;
  }
}
