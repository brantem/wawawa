import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { PlayIcon } from '@heroicons/react/24/solid';
import omit from 'just-omit';

import BackButton from 'components/BackButton';
import Select from 'components/Select';
import StreamingServerUnavailableBanner from 'components/StreamingServerUnavailableBanner';
import Progress from 'components/Progress';

import type { Stream } from '../types';
import { useDevice, useSettings } from 'lib/hooks';
import { useStreams, useSelectedStream } from '../hooks';
import { cn, generateExternalPlayerUrl, generateItemPathFromParams } from 'lib/helpers';
import { getDisplayText } from '../helpers';

export default function Streams() {
  const params = useParams();

  const settings = useSettings();
  const { groups, streams, isLoading } = useStreams();
  const { selected, isLoading: isSelectedLoading } = useSelectedStream();

  const [group, setGroup] = useState('');

  const $stream = selected ? streams.find((stream) => stream.id === selected.id) : null;
  const _group = (() => {
    if (group) return group;
    if ($stream && groups.includes($stream.group)) return $stream.group;
    return groups[0];
  })();

  const $streams = streams.filter((stream) => stream.group === _group);

  return (
    <>
      <div className="flex shrink-0 justify-between gap-4 max-md:flex-col md:h-9 md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <BackButton className="-ml-2" to={`/${generateItemPathFromParams(omit(params, 'episodeId'))}`} />
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <span>Select a Stream</span>
              {$streams.length ? <span className="text-neutral-500">{$streams.length}</span> : null}
            </h2>
          </div>
        </div>

        <div className="flex">
          <Select
            className="w-1/2 truncate rounded-r-none focus:z-10 md:min-w-36"
            value={settings.stream.url}
            onChange={(e) => settings.set('stream', e.target.value)}
          >
            {settings.options.stream.map((option) => (
              <option key={option.url} value={option.url}>
                {option.name}
              </option>
            ))}
          </Select>
          <Select
            className="-ml-px w-1/2 truncate rounded-l-none md:min-w-36"
            value={_group}
            onChange={(e) => setGroup(e.target.value)}
            disabled={!groups.length}
          >
            {groups.map((group) => (
              <option key={group} value={group}>
                {getDisplayText(group)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <StreamingServerUnavailableBanner />

      {selected && $stream ? (
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
          $streams.map((stream, i) => {
            if ($stream && stream.id !== $stream.id && stream.group === $stream.group) return;
            return <Card key={stream.id} index={i + 1} stream={stream} />;
          })
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

      <div className="flex-1 py-2 pr-2">
        <div className="h-5 w-full max-w-sm animate-pulse rounded bg-neutral-800" />
        <div className="mt-2.5 flex items-center gap-2">
          <div className="h-3.5 w-full max-w-48 animate-pulse rounded bg-neutral-800" />
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
  const settings = useSettings();
  const device = useDevice();

  const to = (() => {
    if (!settings.externalPlayer) return stream.id;

    const m = generateExternalPlayerUrl(settings.externalPlayer, stream.url);
    if (!m) return stream.id;

    return m[device.name] || stream.id;
  })();

  return (
    <Link
      to={to}
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
