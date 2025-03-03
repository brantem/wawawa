import type { ItemSeries } from 'types';
import type { Stream } from 'types/storage';

export function getTotalSeasons(items: ItemSeries['items']) {
  return items.reduce((max, item) => (item.season > max ? item.season : max), 1);
}

export function getLastWatched(streams: Stream[]) {
  if (!streams.length) return null;
  if (streams.length === 1) return streams[0];

  let last = streams[0];
  for (let i = 1; i < streams.length; i++) {
    if (last.watchedAt < streams[i].watchedAt) last = streams[i];
  }
  return last;
}
