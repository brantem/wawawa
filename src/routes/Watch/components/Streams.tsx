import { useRef, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';

import * as constants from 'constants';
import { PlayIcon } from '@heroicons/react/24/solid';
import { cn } from 'lib/helpers';

export default function Streams() {
  const { groups, streams, isLoading } = useData();

  const [group, setGroup] = useState('');

  return (
    <div>
      <div className="sticky top-0 z-10 -my-4 flex items-center justify-between gap-4 bg-neutral-950 py-4">
        <h2 className="text-xl font-semibold">Streams</h2>

        <select
          className={cn(
            'appearance-none rounded-full border border-neutral-200 bg-white px-4 py-1 text-center font-semibold text-neutral-950 transition-opacity outline-none hover:bg-neutral-100',
            !groups.length && 'opacity-0',
          )}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          {groups.map((group) => (
            <option key={group} value={group}>
              {getDisplayText(group)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {isLoading
          ? [...new Array(2)].map((_, i) => (
              <div key={i} className="flex items-center rounded-md bg-neutral-900">
                <div className="min-w-15 px-3 text-center text-lg font-semibold tabular-nums">{i + 1}</div>

                <div className="flex-1 py-2">
                  <div className="h-5 w-sm animate-pulse rounded bg-neutral-800" />
                  <div className="mt-2.5 flex items-center gap-2">
                    <div className="h-3.5 w-48 animate-pulse rounded bg-neutral-800" />
                  </div>
                </div>
              </div>
            ))
          : streams
              .filter((stream) => (group ? stream.group === group : stream.group === groups[0]))
              .map((stream, i) => (
                <div
                  key={stream.id}
                  className="group flex items-center rounded-md bg-neutral-900 hover:bg-white hover:text-neutral-950"
                >
                  <div className="min-w-15 px-3 text-center text-lg font-semibold tabular-nums">{i + 1}</div>

                  <div className="flex-1 truncate py-2">
                    <span className="font-medium" title={stream.title}>
                      {stream.title}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-neutral-500">
                      <span className="tabular-nums">{stream.seeders}</span>
                      <div className="size-1 rounded-full bg-neutral-600 group-hover:bg-neutral-400" />
                      <span className="tabular-nums">{stream.size}</span>
                      <div className="size-1 rounded-full bg-neutral-600 group-hover:bg-neutral-400" />
                      <span>{stream.origin}</span>
                    </div>
                  </div>

                  <div className="flex aspect-square size-15 h-full items-center justify-center opacity-0 group-hover:opacity-100">
                    <PlayIcon className="size-6" />
                  </div>
                </div>
              ))}
      </div>
    </div>
  );
}

type Raw = {
  name: string;
  title: string;
  infoHash: string;
  fileIdx: string;
};

type Stream = {
  id: string;
  group: string;
  title: string;
  seeders: string;
  size: string;
  origin: string;
};

export function useData() {
  const params = useParams<{ type: 'movies' | 'series'; streamId: string }>();
  const { data, isLoading } = useSWR<Raw[], any, typeof params>(params, async ({ type, streamId }) => {
    let t = type as string;
    if (type === 'movies') t = 'movie';
    const res = await fetch(`${constants.TORRENTIO_BASE_URL}/stream/${t}/${streamId}.json`);
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

function getDisplayText(s: string) {
  if (s.includes('4k')) return s.replace('4k', '4K');
  return s;
}
