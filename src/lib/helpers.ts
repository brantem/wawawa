import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import pick from 'just-pick';

import type { Meta, Item } from 'types';
import type { Stream } from 'types/storage';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isTypeValid(s: string) {
  switch (s) {
    case 'movie':
    case 'series':
      return true;
    default:
      return false;
  }
}

export async function fetcher<T extends any = any>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export function metaToItem(meta: Meta) {
  const item: Record<string, any> = {
    ...pick(meta, ['id', 'type', 'runtime']),
    url: `${meta.type}/${meta.id}`,
    title: meta.name,
    synopsis: meta.description,
    logoUrl: meta.logo,
    posterUrl: meta.poster,
    backgroundUrl: meta.background,
    release: meta.releaseInfo?.replace('–', ' - ') || '',
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

export function generateItemPathFromParams(params: Record<string, string | undefined>) {
  return `${params.type}/${params.id}${params.episodeId ? `/${params.episodeId}` : ''}`;
}

export function generateItemIdFromParams(params: Record<string, string | undefined>) {
  return `${params.id}${params.episodeId ? `:${params.episodeId}` : ''}`;
}

const httpRegex = /https?:\/\//;
export function generateExternalPlayerUrl(type: string, url: string): Record<string, string> | null {
  switch (type) {
    case 'choose':
      return {
        android: `${url.replace(httpRegex, 'intent://')}#Intent;type=video/any;scheme=https;end`,
      };
    case 'vlc':
      return {
        ios: `vlc-x-callback://x-callback-url/stream?url=${url}`,
        visionos: `vlc-x-callback://x-callback-url/stream?url=${url}`,
        android: `${url.replace(httpRegex, 'intent://')}#Intent;package=org.videolan.vlc;type=video;scheme=https;end`,
      };
    case 'mxplayer':
      return {
        android: `${url.replace(httpRegex, 'intent://')}#Intent;package=com.mxtech.videoplayer.ad;type=video;scheme=https;end`,
      };
    case 'justplayer':
      return {
        android: `${url.replace(httpRegex, 'intent://')}#Intent;package=com.brouken.player;type=video;scheme=https;end`,
      };
    case 'outplayer':
      return {
        ios: url.replace(httpRegex, 'outplayer://'),
        visionos: url.replace(httpRegex, 'outplayer://'),
      };
    case 'iina':
      return {
        macos: `iina://weblink?url=${url}`,
      };
    case 'mpv':
      return {
        macos: `mpv://${url}`,
      };
    case 'moonplayer':
      return {
        macos: `moonplayer://open?url=${url}`,
      };
    case 'm3u': {
      const playlist = `data:application/octet-stream;charset=utf-8;base64,${btoa(`#EXTM3U\n#EXTINF:0\n${url}`)}`;
      return {
        linux: playlist,
        windows: playlist,
        macos: playlist,
        android: playlist,
        ios: playlist,
      };
    }
    default:
      return null;
  }
}
