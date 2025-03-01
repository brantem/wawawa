import { useParams } from 'react-router';
import useSWR from 'swr';

import * as constants from 'constants';
import type { Stream } from './types';

export function useStreams() {
  type Raw = {
    name: string;
    title: string;
    infoHash: string;
    fileIdx: string;
  };

  const params = useParams<{ type: 'movies' | 'series'; id: string; episodeId?: string }>();
  const { data, isLoading } = useSWR<Raw[], any, typeof params>(params, async ({ type, id, episodeId }) => {
    const _type = type === 'movies' ? 'movie' : type;
    const _episodeId = episodeId ? `:${episodeId}` : '';

    const res = await fetch(`${constants.TORRENTIO_BASE_URL}/stream/${_type}/${id}${_episodeId}.json`);
    return (await res.json())?.streams || [];
  });

  const groups = new Set<string>();
  const streams: Stream[] = [];
  (data || []).forEach((stream) => {
    const group = stream.name.replace(/Torrentio\n/, '');
    groups.add(group);

    const [title, info] = stream.title.split('\n👤');
    const [, seeders, size, origin] = info.split('\n')[0].match(/^ (\d+) 💾 (.+) ⚙️ (.+)$/)!;
    streams.push({
      id: `${stream.infoHash}/${stream.fileIdx}`,
      group,
      title: title.replace('\n', ' '),
      seeders,
      size,
      origin,
    });
  }, []);

  return {
    groups: Array.from(groups),
    streams,
    isLoading,
  };
}
