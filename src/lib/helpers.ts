import clsx, { type ClassValue } from 'clsx';
import pick from 'just-pick';

import type { Meta, Item } from 'types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function metaToItem(meta: Meta) {
  const item: Record<string, any> = {
    ...pick(meta, ['id', 'type', 'name', 'description', 'runtime', 'director']),
    logoUrl: meta.logo,
    posterUrl: meta.poster,
    backgroundUrl: meta.background,
    release: meta.releaseInfo.replace('–', ' - '),
    rating: meta.imdbRating || null,
    genres: meta.genres || [],
    cast: meta.cast || [],
  };
  if (meta.type === 'series') {
    item.episodes = meta.videos.map((video) => ({
      ...pick(video, ['id', 'season', 'episode', 'name', 'description']),
      thumbnailUrl: video.thumbnail,
    }));
  }
  return item as Item;
}
