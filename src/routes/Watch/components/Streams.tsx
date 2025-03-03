import { useState } from 'react';
import { Link } from 'react-router';
import { PlayIcon } from '@heroicons/react/24/solid';

import Select from 'components/Select';
import Progress from 'components/Progress';

import type { Stream } from '../types';
import { useStreams, useSelectedStream } from '../hooks';
import { getDisplayText } from '../helpers';
import { cn } from 'lib/helpers';

// TODO: empty state

export default function Streams() {
  const { groups, streams, isLoading } = useStreams();
  const { selected, isLoading: isSelectedLoading } = useSelectedStream();

  const [group, setGroup] = useState('');

  const $streams = streams.filter((stream) => (group ? stream.group === group : stream.group === groups[0]));
  const $stream = selected ? streams.find((stream) => stream.id === selected.id) : null;
  const isSelectedVisible = selected ? $streams.some((stream) => stream.id === selected.id) : false;

  return (
    <div className="m-auto flex w-full flex-col gap-4 pb-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Select a Stream</h2>

        <Select
          className={!groups.length ? 'opacity-0' : undefined}
          value={group ? group : $stream ? $stream.group : ''}
          onChange={(e) => setGroup(e.target.value)}
        >
          {groups.map((group) => (
            <option key={group} value={group}>
              {getDisplayText(group)}
            </option>
          ))}
        </Select>
      </div>

      {selected && $stream && !isSelectedVisible ? (
        <div>
          <h4 className="mb-1 text-sm text-neutral-500">Last Used</h4>
          <Card index={0} stream={$stream} isSelected progress={selected.progress} />
          {selected.progress !== null ? <Progress value={selected.progress} className="mx-3 mt-2" /> : null}
        </div>
      ) : null}

      <div className="relative">
        <div className="absolute top-0 right-0 left-0 z-10 h-2 bg-gradient-to-b from-neutral-950 to-transparent" />
        <div className="no-scrollbar flex h-[calc(var(--spacing)*15*5.5+var(--spacing)*2*5)] snap-y flex-col gap-2 overflow-auto">
          <div className="snap-start" />
          {isLoading || isSelectedLoading
            ? [...new Array(5)].map((_, i) => <SkeletonCard key={i} index={i + 1} />)
            : $streams.map((stream, i) => {
                const isSelected = stream.id === selected?.id;
                return (
                  <Card
                    key={stream.id}
                    index={i + 1}
                    stream={stream}
                    isSelected={isSelected}
                    progress={isSelected ? selected.progress : 0}
                  />
                );
              })}
          <div className="snap-start" />
        </div>
        <div className="absolute right-0 bottom-0 left-0 z-10 h-2 bg-gradient-to-t from-neutral-950 to-transparent" />
      </div>
    </div>
  );
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

type CardProps = {
  index: number;
  stream: Stream;
  isSelected: boolean;
  progress: number | null;
};

function Card({ index, stream, isSelected, progress }: CardProps) {
  return (
    <Link
      to={encodeURIComponent(stream.id)}
      className={cn(
        'group relative flex shrink-0 items-center overflow-hidden rounded-md bg-neutral-900 hover:bg-white hover:text-neutral-950',
        !index && 'pl-3',
      )}
      title={stream.title}
    >
      {index ? <div className="min-w-15 px-3 text-center text-lg font-semibold tabular-nums">{index}</div> : null}

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
