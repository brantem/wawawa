import { useParams } from 'react-router';
import useSWR from 'swr';

import storage from 'lib/storage';

export function useStreams() {
  const { type, id } = useParams();

  const { data, isLoading } = useSWR(
    `/${type}/${id}/streams/local`,
    () => storage.getAll('streams', IDBKeyRange.bound(id, `${id}\uffff`, false, true) /* wtf is this */),
    { revalidateIfStale: true },
  );

  return {
    streams: data || [],
    isLoading,
  };
}
