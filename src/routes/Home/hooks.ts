import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import type { Meta } from 'types';
import { fetcher, metaToItem } from 'lib/helpers';
import { useDebounce, useSettings } from 'lib/hooks';

export function useSearchValue() {
  return useDebounce(useSearchParams()[0].get('q'), 500);
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
