import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router';

import * as constants from 'constants';
import { metaToItem } from 'lib/helpers';

export function useDebounce<T extends any>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useItem() {
  const { type, id } = useParams<{ type: 'movies' | 'series'; id: string }>();
  const _type = type === 'movies' ? 'movie' : type;

  const { data: item, isLoading } = useSWR(`/${_type}/${id}`, async () => {
    const res = await fetch(`${constants.CINEMETA_BASE_URL}/meta/${_type}/${id}.json`);
    return metaToItem((await res.json()).meta);
  });

  return { item, isLoading };
}
