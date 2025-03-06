import { useState } from 'react';
import { Link } from 'react-router';
import { PlayIcon } from '@heroicons/react/24/solid';
import { ListBulletIcon, ViewColumnsIcon, CheckCircleIcon } from '@heroicons/react/16/solid';
import dayjs from 'dayjs';

import Select from 'components/Select';
import Img from 'components/Img';
import Progress from 'components/Progress';

import type { ItemSeries } from 'types';
import type { Stream } from 'types/storage';
import { getStreamProgress } from 'lib/helpers';
import { getTotalSeasons } from '../helpers';
import { cn } from 'lib/helpers';
import { useMediaQuery } from 'lib/hooks';

type EpisodesProps = {
  items: ItemSeries['items'];
  streams: Stream[];
};

export default function Episodes({ items, streams }: EpisodesProps) {
  const isDesktop = useMediaQuery('(width >= 768px)');

  const [view, setView] = useState<'horizontal' | 'vertical'>('horizontal');
  const [season, setSeason] = useState(1);

  const seasons = getTotalSeasons(items);
  const hasSpecial = items.some((item) => item.season === 0);
  const $items = items.filter((item) => item.season === season);

  return (
    <div className="flex flex-col gap-4">
      <div className="sticky top-0 z-10 -mx-4 -my-4 flex items-center justify-between gap-4 bg-neutral-950 px-4 py-4 md:-mx-8 md:px-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <span>Episodes</span>
          <span className="text-neutral-500">{$items.length}</span>
        </h2>

        <div className="flex gap-2">
          {isDesktop && (
            <button
              className="flex size-8.5 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 hover:bg-neutral-800"
              onClick={() => setView((prev) => (prev === 'horizontal' ? 'vertical' : 'horizontal'))}
            >
              {view === 'vertical' ? <ListBulletIcon className="size-4" /> : <ViewColumnsIcon className="size-4" />}
            </button>
          )}

          <Select className="w-36" value={season} onChange={(e) => setSeason(parseInt(e.target.value))}>
            {[...new Array(seasons)].map((_, i) => (
              <option key={i} value={i + 1}>
                Season {i + 1}
              </option>
            ))}
            {hasSpecial ? <option value="0">Special</option> : null}
          </Select>
        </div>
      </div>

      {!isDesktop ? (
        <Horizontal items={$items} streams={streams} />
      ) : (
        <>
          {view === 'horizontal' ? <Horizontal items={$items} streams={streams} /> : null}
          {view === 'vertical' ? <Vertical items={$items} streams={streams} /> : null}
        </>
      )}
    </div>
  );
}

function Horizontal({ items, streams }: EpisodesProps) {
  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 -left-4 z-10 w-4 bg-gradient-to-r from-neutral-950 to-transparent max-md:hidden md:-left-8" />

      <div className="no-scrollbar -mx-4 flex snap-x overflow-x-auto pt-1.25 md:-mx-8">
        <div className="mr-4 snap-start scroll-mx-4 md:mr-8 md:scroll-mx-8" />
        {items.map((item) => {
          const stream = streams.find((stream) => stream.id.endsWith(item.id));
          const isUpcoming = dayjs(item.released).isAfter(new Date());
          return (
            <Card
              key={item.id}
              to={stream ? stream.url : `${item.id}/watch`}
              className="mr-4 w-[304px] shrink-0 snap-start scroll-mx-4 md:scroll-mx-8"
              isUpcoming={isUpcoming}
            >
              <Thumbnail
                className="h-[171px] w-[304px]"
                src={item.thumbnailUrl.replace('/w780.jpg', '/w342.jpg')}
                height={171}
                width={304}
                isUpcoming={isUpcoming}
                progress={getStreamProgress(stream)}
              />
              <div className="mt-2">
                <Episode isUpcoming={isUpcoming}>{item.episode}</Episode>
                <Title>{item.title}</Title>
                <p className="mt-0.5 line-clamp-3 text-sm text-neutral-400" title={item.synopsis}>
                  {item.synopsis}
                </p>
              </div>
            </Card>
          );
        })}
        <div className="snap-start md:mr-4" />
      </div>

      <div className="absolute top-0 -right-4 bottom-0 z-10 w-4 bg-gradient-to-l from-neutral-950 to-transparent max-md:hidden md:-right-8" />
    </div>
  );
}

function Vertical({ items, streams }: EpisodesProps) {
  return (
    <div className="flex flex-col gap-6 pt-1.25">
      {items.map((item) => {
        const stream = streams.find((stream) => stream.id.endsWith(item.id));
        const isUpcoming = dayjs(item.released).isAfter(new Date());
        return (
          <Card
            key={item.id}
            to={stream ? stream.url : `${item.id}/watch`}
            className="relative flex gap-4"
            isUpcoming={isUpcoming}
          >
            <Thumbnail
              className="h-[171px] w-[304px]"
              src={item.thumbnailUrl.replace('/w780.jpg', '/w342.jpg')}
              height={171}
              width={304}
              isUpcoming={isUpcoming}
              progress={getStreamProgress(stream)}
            />

            <div className="flex-1 pt-3">
              <Episode isUpcoming={isUpcoming}>{item.episode}</Episode>
              <Title>{item.title}</Title>
              <p className="line-clamp-3 text-sm text-neutral-400" title={item.synopsis}>
                {item.synopsis}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

type CardProps = React.PropsWithChildren<{
  to: string;
  className: string;
  isUpcoming: boolean;
}>;

function Card({ className, to, isUpcoming, ...props }: CardProps) {
  return isUpcoming ? (
    <div className={className} {...props} />
  ) : (
    <Link to={to} className={cn('group', className)} {...props} />
  );
}

type ThumbnailProps = {
  isUpcoming: boolean;
  progress: number | null;
  className?: string;
  src: string;
  height: number;
  width?: number;
};

function Thumbnail({ isUpcoming, progress, className, ...props }: ThumbnailProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-neutral-900',
        !isUpcoming &&
          'outline-0 outline-offset-2 outline-white transition-[outline] duration-100 group-hover:outline-3 group-focus:outline-3',
        className,
      )}
    >
      <Img {...props} className="absolute inset-0 size-full object-cover object-center" />

      {!isUpcoming ? (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <PlayIcon className="size-16" />
        </div>
      ) : null}

      {progress !== null ? <Progress value={progress} className="absolute right-2 bottom-2 left-2" /> : null}
    </div>
  );
}

function Episode({ isUpcoming, children }: { isUpcoming: boolean; children: number }) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 uppercase">
      <span>Episode {children}</span>
      {isUpcoming ? (
        <>
          <div className="size-1 rounded-full bg-neutral-600" />
          <span>Upcoming</span>
        </>
      ) : null}
    </div>
  );
}

type TitleProps = {
  isWatched?: boolean;
  children: string;
};

function Title({ isWatched, children }: TitleProps) {
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <h4 className="truncate font-medium">{children}</h4>
      {isWatched ? <CheckCircleIcon className="size-4 text-neutral-500" /> : null}
    </div>
  );
}
