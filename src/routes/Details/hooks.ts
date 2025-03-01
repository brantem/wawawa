import useSWR from 'swr';
import { useParams } from 'react-router';

import * as constants from 'constants';
import { metaToItem } from 'lib/helpers';

export function useData() {
  const params = useParams<{ type: 'movies' | 'series'; id: string }>();
  const { data: item, isLoading } = useSWR(params, async ({ type, id }) => {
    let _type = type === 'movies' ? 'movie' : type;

    const res = await fetch(`${constants.CINEMETA_BASE_URL}/meta/${_type}/${id}.json`);
    return metaToItem((await res.json()).meta);
  });

  return { item, isLoading };
}
