import { useState } from 'react';
import { Link } from 'react-router';
import { PlayIcon } from '@heroicons/react/24/solid';

import Select from 'components/Select';

import type { Stream } from '../types';
import { useStreams } from '../hooks';

// TODO: empty state, support torbox (url)

export default function Streams() {
  const { groups, streams, isLoading } = useStreams();

  const [group, setGroup] = useState('');

  return (
    <div className="m-auto w-full pb-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Select a Stream</h2>

        <Select
          className={!groups.length ? 'opacity-0' : undefined}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          {groups.map((group) => (
            <option key={group} value={group}>
              {getDisplayText(group)}
            </option>
          ))}
        </Select>
      </div>

      <div className="relative mt-2">
        <div className="absolute top-0 right-0 left-0 z-10 h-2 bg-gradient-to-b from-neutral-950 to-transparent" />
        <div className="no-scrollbar flex h-[calc(var(--spacing)*15*5.5+var(--spacing)*2*5)] snap-y flex-col gap-2 overflow-auto">
          <div className="snap-start scroll-mt-2" />
          {isLoading
            ? [...new Array(5)].map((_, i) => <SkeletonCard key={i} index={i + 1} />)
            : streams
                .filter((stream) => (group ? stream.group === group : stream.group === groups[0]))
                .map((stream, i) => <Card key={stream.id} index={i + 1} stream={stream} />)}
          <div className="snap-end scroll-mb-2" />
        </div>
        <div className="absolute right-0 bottom-0 left-0 z-10 h-2 bg-gradient-to-t from-neutral-950 to-transparent" />
      </div>
    </div>
  );
}

function getDisplayText(s: string) {
  if (s.includes('4k')) return s.replace('4k', '4K');
  return s;
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div className="flex items-center rounded-md bg-neutral-900">
      <div className="min-w-15 px-3 text-center text-lg font-semibold tabular-nums">{index}</div>

      <div className="flex-1 py-2">
        <div className="h-5 w-sm animate-pulse rounded bg-neutral-800" />
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-3.5 w-48 animate-pulse rounded bg-neutral-800" />
        </div>
      </div>
    </div>
  );
}

function Card({ index, stream }: { index: number; stream: Stream }) {
  return (
    <Link
      to={encodeURIComponent(stream.id)}
      className="group flex items-center rounded-md bg-neutral-900 hover:bg-white hover:text-neutral-950"
      title={stream.title}
    >
      <div className="min-w-15 px-3 text-center text-lg font-semibold tabular-nums">{index}</div>

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
    </Link>
  );
}
