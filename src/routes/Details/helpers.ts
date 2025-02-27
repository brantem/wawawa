import type { ItemSeries } from 'types';

export function getTotalSeasons(items: ItemSeries['items']) {
  return items.reduce((max, item) => (item.season > max ? item.season : max), 1);
}
