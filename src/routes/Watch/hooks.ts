import { useParams } from 'react-router';
import useSWR from 'swr';

import * as constants from 'constants';
import type { Stream } from './types';

export function useStreams() {
  type Raw = {
    name: string;
    title: string;
  } & (
    | {
        infoHash: string;
        fileIdx: string;
        behaviorHints: {
          filename: string;
        };
      }
    | {
        url: string;
      }
  );

  const { type, id, episodeId } = useParams<{ type: 'movies' | 'series'; id: string; episodeId?: string }>();
  const _type = type === 'movies' ? 'movie' : type;
  const _episodeId = episodeId ? `:${episodeId}` : '';

  const { data, isLoading } = useSWR<Raw[]>(`/${_type}/${id}${_episodeId}/streams`, async () => {
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

    let filename;
    if ('url' in stream) {
      filename = stream.url.split('/').pop()!;
    } else {
      filename = stream.behaviorHints.filename;
    }

    streams.push({
      id: btoa('url' in stream ? stream.url : `${stream.infoHash}/${stream.fileIdx}`),
      group,
      title: title.replace('\n', ' '),
      filename,
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
