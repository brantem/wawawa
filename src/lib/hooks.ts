import useSWR from 'swr';

import type { Item } from 'types';
import * as constants from 'constants';

export type Stream = {
  name: string;
  title: string;
  infoHash: string;
  fileIdx: string;
};

export function useStreams(type: Item['type'], id: string | undefined) {
  const { data, isLoading } = useSWR<Stream[]>(id, async () => {
    const res = await fetch(`${constants.TORRENTIO_BASE_URL}/stream/${type}/${id}.json`);
    return (await res.json())?.streams || [];
  });

  const groups = new Set<string>();
  const streams = (data || []).map((stream) => {
    const group = stream.name.replace(/Torrentio\n/, '');
    groups.add(group);

    const [title, info] = stream.title.split('\n👤');
    const [, seeders, size, origin] = info.split('\n')[0].match(/^ (\d+) 💾 (.+) ⚙️ (.+)$/)!;
    return {
      id: `${stream.infoHash}/${stream.fileIdx}`,
      group,
      title: title.replace('\n', ' '),
      seeders,
      size,
      origin,
    };
  });

  return {
    groups: Array.from(groups),
    streams,
    isLoading,
  };
}
