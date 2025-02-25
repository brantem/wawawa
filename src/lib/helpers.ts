import clsx, { type ClassValue } from 'clsx';

import type { Meta } from 'types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function metaToItem(meta: Meta) {
  return {
    id: meta.id,
    logoUrl: meta.logo,
    posterUrl: meta.poster,
    backgroundUrl: meta.background,
    name: meta.name,
    release: meta.releaseInfo,
  };
}
