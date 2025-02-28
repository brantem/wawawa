import { useState } from 'react';
import { PlayIcon } from '@heroicons/react/24/solid';
import { ListBulletIcon, ViewColumnsIcon, CheckCircleIcon } from '@heroicons/react/16/solid';

import type { ItemSeries } from 'types';
import { getTotalSeasons } from '../helpers';
import { cn } from 'lib/helpers';

type EpisodesProps = {
  items: ItemSeries['items'];
};

export default function Episodes({ items }: EpisodesProps) {
  const [view, setView] = useState<'vertical' | 'horizontal'>('vertical');
  const [season, setSeason] = useState(1);

  const seasons = getTotalSeasons(items);
  const _items = items.filter((item) => item.season === season);

  return (
    <div className="flex flex-col gap-8">
      <div className="sticky top-0 z-10 -my-4 flex items-center justify-between gap-8 bg-neutral-950 py-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <span>Episodes</span>
          <span className="text-neutral-500">{_items.length}</span>
        </h2>

        <div className="flex gap-2">
          <button
            className="flex size-8.5 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 hover:bg-neutral-800"
            onClick={() => setView((prev) => (prev === 'vertical' ? 'horizontal' : 'vertical'))}
          >
            {view === 'vertical' ? <ListBulletIcon className="size-4" /> : <ViewColumnsIcon className="size-4" />}
          </button>

          <select
            className="appearance-none rounded-full border border-neutral-200 bg-white px-3 py-1 text-center font-semibold text-neutral-950 outline-none hover:bg-neutral-100"
            value={season}
            onChange={(e) => setSeason(parseInt(e.target.value))}
          >
            {[...new Array(seasons)].map((_, i) => (
              <option key={i} value={i + 1}>
                Season {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {view === 'vertical' ? (
        <div className="flex flex-col gap-6">
          {_items.map((item) => (
            <a key={item.id} href="#" className="group relative flex gap-4" onClick={() => alert('TODO')}>
              <Thumbnail
                className="aspect-video h-[150px] shrink-0"
                src={item.thumbnailUrl.replace('/w780.jpg', '/w300.jpg')}
                height={150}
              />

              <div className="pt-1">
                <span className="text-xs font-semibold text-neutral-500 uppercase">Episode {item.episode}</span>
                <Name isWatched={item.episode === 1}>{item.name}</Name>
                <p className="line-clamp-3 text-sm text-neutral-400">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      ) : null}

      {view === 'horizontal' ? <Horizontal items={_items} /> : null}
    </div>
  );
}

type ThumbnailProps = {
  src: string;
  className?: string;
  height: number;
  width?: number;
};

function Thumbnail({ className, ...props }: ThumbnailProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-neutral-900 outline-0 outline-offset-2 outline-white transition-[outline] duration-100 group-hover:outline-3 group-focus:outline-3',
        className,
      )}
    >
      <img
        {...props}
        ref={(img) => {
          if (!img) return;
          img.onload = () => img.classList.remove('opacity-0');
        }}
        className="absolute inset-0 size-full object-cover object-center opacity-0 transition-opacity"
      />

      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
        <PlayIcon className="size-16" />
      </div>
    </div>
  );
}

type NameProps = {
  isWatched: boolean;
  children: string;
};

function Name({ isWatched, children }: NameProps) {
  return (
    <div className="mt-1 flex items-center gap-1.5">
      <h4 className="truncate font-medium">{children}</h4>
      {isWatched && <CheckCircleIcon className="size-4 text-neutral-500" />}
    </div>
  );
}

function Horizontal({ items }: EpisodesProps) {
  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 -left-8 z-10 w-8 bg-gradient-to-r from-neutral-950 to-transparent" />

      <div className="no-scrollbar -mx-8 -mt-1.25 flex snap-x gap-6 overflow-x-auto px-2 pt-1.25">
        <div className="snap-start scroll-mx-8" />
        {items.map((item) => (
          <a
            key={item.id}
            href="#"
            className="group w-[304px] shrink-0 snap-start scroll-mx-8"
            onClick={() => alert('TODO')}
          >
            <Thumbnail
              className="h-[171px] w-[304px]"
              src={item.thumbnailUrl.replace('/w780.jpg', '/w342.jpg')}
              height={171}
              width={304}
            />
            <div className="mt-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase">Episode {item.episode}</span>
              <Name isWatched={item.episode === 1}>{item.name}</Name>
              <p className="mt-0.5 line-clamp-3 text-sm text-neutral-400">{item.description}</p>
            </div>
          </a>
        ))}
        <div className="snap-start scroll-mx-8" />
      </div>

      <div className="absolute top-0 -right-8 bottom-0 z-10 w-8 bg-gradient-to-l from-neutral-950 to-transparent" />
    </div>
  );
}
