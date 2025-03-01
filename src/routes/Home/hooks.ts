import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import type { Meta } from 'types';
import * as constants from 'constants';
import { metaToItem } from 'lib/helpers';
import { useDebounce } from 'lib/hooks';

export function useSearchValue() {
  return useDebounce(useSearchParams()[0].get('q'), 500);
}

const fetcher = async ({ type, search }: { type: string; search: string }) => {
  const _search = search ? `/search=${search}` : '';
  const res = await fetch(`${constants.CINEMETA_BASE_URL}/catalog/${type}/top${_search}.json`);
  return res.json();
};

export function useData() {
  const search = useSearchValue();

  const movies = useSWR<{ metas: Meta[]; rank: number }>({ type: 'movie', search }, fetcher);
  const series = useSWR<{ metas: Meta[]; rank: number }>({ type: 'series', search }, fetcher);

  return {
    movies: Object.assign((movies.data?.metas || []).map(metaToItem), { rank: movies?.data?.rank || 0 }),
    series: Object.assign((series.data?.metas || []).map(metaToItem), { rank: series?.data?.rank || 0 }),
    isLoading: movies.isLoading || series.isLoading,
  };
}
