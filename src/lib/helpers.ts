import clsx, { type ClassValue } from 'clsx';
import pick from 'just-pick';

import type { Meta, Item } from 'types';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function metaToItem(meta: Meta) {
  const item: Record<string, any> = {
    ...pick(meta, ['id', 'type', 'runtime']),
    title: meta.name,
    synopsis: meta.description,
    logoUrl: meta.logo,
    posterUrl: meta.poster,
    backgroundUrl: meta.background,
    release: meta.releaseInfo.replace('–', ' - '),
    rating: meta.imdbRating || null,
    genres: meta.genres || [],
    directors: meta.director || [],
    casts: meta.cast || [],
  };
  if (meta.type === 'series') {
    item.items = meta.videos.map((video) => {
      return {
        ...pick(video, ['id', 'season', 'episode', 'released']),
        title: video.name || video.title || '',
        synopsis: video.description || video.overview || '',
        thumbnailUrl: video.thumbnail,
      };
    });
  }
  return item as Item;
}
