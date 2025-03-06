import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { PlayIcon } from '@heroicons/react/24/solid';
import omit from 'just-omit';

import BackButton from 'components/BackButton';
import Select from 'components/Select';
import Progress from 'components/Progress';

import type { Stream } from '../types';
import { useStreams, useSelectedStream } from '../hooks';
import { getDisplayText } from '../helpers';
import { cn, generateItemPathFromParams } from 'lib/helpers';

// TODO: if some some links are not url and streaming server is not availble, show baner

export default function Streams() {
  const params = useParams();

  const { groups, streams, isLoading } = useStreams();
  const { selected, isLoading: isSelectedLoading } = useSelectedStream();

  const [group, setGroup] = useState('');

  const $stream = selected ? streams.find((stream) => stream.id === selected.id) : null;
  const $streams = streams.filter((stream) => {
    if (group) return stream.group === group;
    if ($stream) return stream.id !== $stream.id && stream.group === $stream.group;
    return stream.group === groups[0];
  });
  const isSelectedVisible = selected ? $streams.some((stream) => stream.id === selected.id) : false;

  return (
    <>
      <div className="mt-3 flex shrink-0 justify-between gap-4 max-md:flex-col md:mt-6 md:h-9 md:items-center">
        <div className="flex items-center gap-2">
          <BackButton className="-ml-2" to={`/${generateItemPathFromParams(omit(params, 'episodeId'))}`} />
          <h2 className="text-xl font-semibold">Select a Stream</h2>
        </div>

        {groups.length ? (
          <Select
            className="md:w-36"
            value={group ? group : $stream ? $stream.group : ''}
            onChange={(e) => setGroup(e.target.value)}
          >
            {groups.map((group) => (
              <option key={group} value={group}>
                {getDisplayText(group)}
              </option>
            ))}
          </Select>
        ) : null}
      </div>

      {selected && $stream && !isSelectedVisible ? (
        <div>
          <h4 className="mb-1 text-sm text-neutral-500">Last Used</h4>
          <Card index={0} stream={$stream} />
          {selected.progress !== null ? <Progress value={selected.progress} className="mx-3 mt-2" /> : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        {isLoading || isSelectedLoading ? (
          [...new Array(5)].map((_, i) => <SkeletonCard key={i} index={i + 1} />)
        ) : $streams.length ? (
          $streams.map((stream, i) => <Card key={stream.id} index={i + 1} stream={stream} />)
        ) : (
          <div className="flex h-15 flex-col items-center justify-center">
            <h3 className="text-lg font-medium">No streams found</h3>
            <p className="text-neutral-500">Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </>
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
};

function Card({ index, stream }: CardProps) {
  return (
    <Link
      to={encodeURIComponent(stream.id)}
      className={cn(
        'group relative flex shrink-0 rounded-md bg-neutral-900 hover:bg-white hover:text-neutral-950 max-md:pr-3',
        !index && 'pl-3',
      )}
      title={stream.title}
    >
      {index ? <div className="mt-4 min-w-15 px-3 text-center text-lg font-semibold tabular-nums">{index}</div> : null}

      <div className="flex-1 py-2">
        <span className="font-medium break-all" title={stream.title}>
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

      <div className="hidden aspect-square size-15 h-full items-center justify-center opacity-0 group-hover:opacity-100 md:flex">
        <PlayIcon className="size-6" />
      </div>
    </Link>
  );
}
