import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import pick from 'just-pick';

import type { Meta, Item } from 'types';
import type { Stream } from 'types/storage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
  if (meta.type === 'series' && meta.videos) {
    item.items = meta.videos.map((video) => {
      return {
        ...pick(video, ['season', 'episode', 'released']),
        id: video.id.split(':').slice(1).join(':'),
        title: video.name || video.title || '',
        synopsis: video.description || video.overview || '',
        thumbnailUrl: video.thumbnail,
      };
    });
  }
  return item as Item;
}

export function getStreamProgress(stream: Stream | null | undefined) {
  if (!stream || stream.duration === null || stream.time === null) return null;
  if (!stream.time || !stream.duration) return 0;
  return (stream.time / stream.duration) * 100;
}
