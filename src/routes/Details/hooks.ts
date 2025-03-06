import { useParams } from 'react-router';
import useSWR from 'swr';

import storage from 'lib/storage';

export function useStreams() {
  const params = useParams();

  const { data, isLoading } = useSWR(
    `${params.type}/${params.id}:local-streams`,
    () => storage.getAll('streams', IDBKeyRange.bound(params.id, `${params.id}\uffff`, false, true) /* wtf is this */),
    { revalidateIfStale: true },
  );

  return {
    streams: data || [],
    isLoading,
  };
}
