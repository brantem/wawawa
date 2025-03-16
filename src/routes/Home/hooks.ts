import { useSearchParams } from 'react-router';
import useSWR from 'swr';
import pick from 'just-pick';

import type { ItemCardProps } from 'components/ItemCard';

import type { Meta } from 'types';
import type { Stream } from 'types/storage';
import { fetcher, metaToItem, getStreamProgress } from 'lib/helpers';
import { useDebounce, useSettings } from 'lib/hooks';
import storage from 'lib/storage';

export function useSearchValue() {
  return useDebounce(useSearchParams()[0].get('q'), 500);
}

export function useContinueWatching() {
  type Feed = Pick<Meta, 'id' | 'type' | 'name' | 'releaseInfo' | 'poster' | 'imdbRating'>;

  const { data, isLoading } = useSWR('continue-watching', async () => {
    const [feed, streams] = await Promise.all([
      fetcher<Feed[]>('https://cinemeta-catalogs.strem.io/feed.json'),
      storage.getAll('streams'),
    ]);

    const metas = new Map(feed!.map((item) => [item.id, item]));
    const items = new Map<string, Pick<Stream, 'id' | 'time' | 'duration' | 'watchedAt'>>();

    for (const stream of streams) {
      const id = stream.id.split(':').shift()!;
      const item = items.get(id);
      if (!item || stream.watchedAt > item.watchedAt) {
        items.set(id, { id, ...pick(stream, ['watchedAt', 'time', 'duration']) });
      }
    }

    return [...items.values()]
      .sort((a, b) => b.watchedAt - a.watchedAt)
      .reduce(
        (items, item) => {
          const meta = metas.get(item.id);
          if (!meta) return items;
          return [
            ...items,
            {
              ...pick(meta, ['id', 'type']),
              url: `${meta.type}/${meta.id}`,
              title: meta.name,
              posterUrl: meta.poster,
              release: meta.releaseInfo?.replace('–', ' - ') || '',
              rating: meta.imdbRating || null,
              progress: getStreamProgress(item),
            },
          ];
        },
        [] as ItemCardProps['item'][],
      );
  });

  return {
    items: data || [],
    isLoading,
  };
}

export function useItems(type: Meta['type']) {
  const search = useSearchValue();
  const _search = search ? `/search=${search}` : '';

  const settings = useSettings();

  const url = `${settings.catalog.url}/catalog/${type}/top${_search}.json`;
  const { data, isLoading } = useSWR<{ metas: Meta[]; rank: number } | null>(url, fetcher);

  return {
    items: (data?.metas || []).map(metaToItem),
    rank: data?.rank || 0,
    isLoading: isLoading,
  };
}
