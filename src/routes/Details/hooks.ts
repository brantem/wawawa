import { useParams } from 'react-router';
import useSWR from 'swr';

import storage from 'lib/storage';
import { useDevice, useSettings } from 'lib/hooks';
import { generateExternalPlayerUrl } from 'lib/helpers';

export function useStreams() {
  const params = useParams();

  const device = useDevice();
  const settings = useSettings();

  const { data, isLoading } = useSWR(
    `${params.type}/${params.id}:local-streams`,
    async () => {
      const query = IDBKeyRange.bound(params.id, `${params.id}\uffff`, false, true); /* wtf is this */
      const streams = await storage.getAll('streams', query);

      return streams.map((stream) => {
        let url = stream.url;
        if (settings.externalPlayer) {
          const _url = atob(decodeURIComponent(stream.url.split('/watch/').pop()!));
          const m = generateExternalPlayerUrl(settings.externalPlayer!, _url);
          if (m) url = m[device.name] || url;
        }
        return { ...stream, url };
      });
    },
    { revalidateIfStale: true },
  );

  return {
    streams: data || [],
    isLoading,
  };
}
