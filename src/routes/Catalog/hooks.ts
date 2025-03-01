import { useParams, useSearchParams } from 'react-router';
import useSWR from 'swr';

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
};

const fetcher = async ({ type, sort, genre, year }: Key) => {
  const _type = type === 'movies' ? 'movie' : type;
  let url = `${constants.CINEMETA_BASE_URL}/catalog/${_type}`;

  switch (sort) {
    case 'popularity':
      url += `/top${genre ? `/genre=${genre}` : ''}.json`;
      break;
    default:
      if (year) url += `/year/genre=${year}.json`;
  }

  const res = await fetch(`${url}`);
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

  const { data, isLoading } = useSWR<{ metas: Meta[] }>(key, fetcher);

  return {
    data: (data?.metas || []).map(metaToItem),
    isLoading,
  };
}
