import { useParams, useSearchParams } from 'react-router';
import useSWR from 'swr';
import useSWRInfinite from 'swr/infinite';

import type { Meta } from 'types';
import { useSettings } from 'lib/hooks';
import { metaToItem } from 'lib/helpers';

export function useOptions() {
  type Catalog = {
    id: 'top' | 'year';
    type: 'movie' | 'series';
    genres: string[];
  };

  const params = useParams();

  const settings = useSettings();

  const { data, isLoading } = useSWR<Catalog[]>('/cinemeta/manifest.json', async () => {
    try {
      const res = await fetch(`${settings.catalog.url}/manifest.json`);
      if (!res.ok) return [];

      return (await res.json())?.catalogs || [];
    } catch (err) {
      return [];
    }
  });

  return {
    genres: (() => {
      const catalog = (data || []).find((catalog) => catalog.id === 'top' && catalog.type === params.type);
      if (!catalog) return [];
      return catalog.genres;
    })(),
    year: (() => {
      const catalog = (data || []).find((catalog) => catalog.id === 'year' && catalog.type === params.type);
      if (!catalog) return [];
      return catalog.genres;
    })(),
    isLoading,
  };
}

export function useData() {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const sort = searchParams.has('sort') ? searchParams.get('sort') : searchParams.has('year') ? null : 'popularity';
  const genre = searchParams.get('genre');
  const year = searchParams.get('year');

  const settings = useSettings();

  let skip = 0;
  const { data, isLoading, size, setSize } = useSWRInfinite<{ metas: Meta[]; hasMore: boolean }>(
    (_, prev) => {
      if (prev) {
        if (!prev.hasMore) return null;
        skip += prev.metas.length;
      }
      return `/${params.type}?sort=${sort}&genre=${genre}&year=${year}&skip=${skip}`;
    },
    async () => {
      let url = `${settings.catalog.url}/catalog/${params.type}`;

      const searchParams = new URLSearchParams();
      if (skip) searchParams.set('skip', skip.toString());

      switch (sort) {
        case 'popularity':
          if (genre) searchParams.set('genre', genre);

          const params = searchParams.toString();
          url += `/top${params ? `/${params}` : ''}.json`;
          break;
        default:
          if (!year) return [];

          searchParams.set('genre', year);
          url += `/year/${searchParams.toString()}.json`;
          break;
      }

      try {
        const res = await fetch(url);
        if (!res.ok) return { metas: [], hasMore: false };

        return res.json();
      } catch (err) {
        console.error(err);
        return { metas: [], hasMore: false };
      }
    },
  );

  let hasMore = true;
  const items = data
    ? data
        .reduce((metas, data) => {
          hasMore = data.hasMore;

          // cinemeta is so bad, they repeat the last few metas on the next page
          const prevIds = metas.map((meta) => meta.id);
          return [...metas, ...data.metas.filter((meta) => !prevIds.includes(meta.id))];
        }, [] as Meta[])
        .map(metaToItem)
    : [];

  return {
    data: items,
    isLoading,

    hasMore,
    loadMore() {
      if (!hasMore) return;
      setSize(size + 1);
    },
    isLoadingMore: isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined'),
  };
}
