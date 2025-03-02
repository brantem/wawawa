import { useParams, useSearchParams } from 'react-router';
import useSWRInfinite from 'swr/infinite';

import { Meta } from 'types';
import * as constants from 'constants';
import { metaToItem } from 'lib/helpers';

export function useType() {
  const { type } = useParams() as { type: 'movies' | 'series' };
  return type;
}

type Key = {
  type: string;
  sort: 'popularity' | null;
  genre: string | null;
  year: string | null;
  skip: number;
};

const fetcher = async ({ type, sort, genre, year, skip }: Key) => {
  const _type = type === 'movies' ? 'movie' : type;
  let url = `${constants.CINEMETA_BASE_URL}/catalog/${_type}`;

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

  const res = await fetch(url);
  return res.json();
};

export function useData() {
  const [searchParams] = useSearchParams();

  const type = useType();
  const key = {
    type,
    sort: searchParams.has('sort') ? searchParams.get('sort') : searchParams.has('year') ? null : 'popularity',
    genre: searchParams.get('genre'),
    year: searchParams.get('year'),
  };

  let skip = 0;
  const { data, isLoading, size, setSize } = useSWRInfinite<{ metas: Meta[]; hasMore: boolean }>((_, prev) => {
    if (prev) {
      if (!prev.hasMore) return null;
      skip += prev.metas.length;
    }
    return { ...key, skip };
  }, fetcher);

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
