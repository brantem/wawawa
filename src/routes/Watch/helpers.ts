import langs from 'langs';

export function getDisplayText(s: string) {
  if (s.includes('4k')) return s.replace('4k', '4K');
  return s;
}

export function getLabel(lang: string) {
  return (langs.where('2', lang) || langs.where('2T', lang) || langs.where('2B', lang))?.name || lang;
}
