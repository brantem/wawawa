import { Fragment, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { PlayIcon } from '@heroicons/react/20/solid';

import Layout from 'components/layouts/Default';
import Hero from 'components/Hero';
import Progress from 'components/Progress';
import Episodes from './components/Episodes';

import type { Item } from 'types';
import type { Stream } from 'types/storage';
import { useItem } from 'lib/hooks';
import { useStreams } from './hooks';
import { getStreamProgress } from 'lib/helpers';
import { getLastWatched, getTotalSeasons } from './helpers';

// TODO: not found state, play & resume, list of other movies/series?

export default function Details() {
  const params = useParams();
  const { item, isLoading } = useItem();
  const { streams } = useStreams();

  const lastWatched = getLastWatched(streams);

  return (
    <Layout>
      <Hero item={item} isLoading={isLoading} hasBackButton>
        {item ? <PlayButton item={item} lastWatched={lastWatched} /> : null}
      </Hero>

      {item ? (
        <div className="flex flex-col gap-8 px-8 pb-8">
          <div className="flex items-center gap-2 text-lg text-neutral-500">
            <Release>{item.release}</Release>
            {item.type === 'series' ? (
              <>
                <div className="size-1.25 rounded-full bg-neutral-600" />
                <Seasons>{getTotalSeasons(item.items)}</Seasons>
              </>
            ) : null}
            {item.runtime ? (
              <>
                <div className="size-1.25 rounded-full bg-neutral-600" />
                <span>{item.runtime}</span>
              </>
            ) : null}
            {item.rating ? (
              <>
                <div className="size-1.25 rounded-full bg-neutral-600" />
                <span>{item.rating}</span>
              </>
            ) : null}
          </div>

          {item.directors.length || item.casts.length || item.genres.length ? (
            <div className="flex flex-col gap-2 text-sm">
              {item.directors.length ? (
                <span>
                  <span className="text-neutral-500">Director:</span> {item.directors.join(', ')}
                </span>
              ) : null}
              {item.casts.length ? (
                <span>
                  <span className="text-neutral-500">Cast:</span> {item.casts.join(', ')}
                </span>
              ) : null}
              {item.genres.length ? (
                <span>
                  <span className="text-neutral-500">Genres:</span>{' '}
                  {item.genres.map((genre, i) => (
                    <Fragment key={genre}>
                      <Link to={`/${params.type}?genre=${genre}`} className="hover:underline">
                        {genre}
                      </Link>
                      {i !== item.genres.length - 1 ? ', ' : null}
                    </Fragment>
                  ))}
                </span>
              ) : null}
            </div>
          ) : null}

          <p className="text-lg">{item.synopsis}</p>

          {item.type === 'series' ? <Episodes items={item.items} streams={streams} /> : null}
        </div>
      ) : null}
    </Layout>
  );
}

function PlayButton({ item, lastWatched }: { item: Item; lastWatched: Stream | null }) {
  const to = useMemo(() => {
    if (lastWatched) return lastWatched.url;
    if (item.type === 'movie') return 'watch';
    return `${item.items.find((item) => item.season === 1 && item.episode === 1)!.id}/watch`;
  }, [item]);

  let text = '';
  if (lastWatched) {
    if (item.type === 'movie') {
      text = 'Resume';
    } else {
      const [_, season, episode] = lastWatched.id.match(/.+:(\d+):(\d+)/)!;
      text = `Resume S${season}:E${episode}`;
    }
  } else {
    text = 'Play';
  }

  const progress = getStreamProgress(lastWatched);

  return (
    <div className="absolute right-8 bottom-8">
      <Link
        className="relative flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-2 pr-6 pl-5 font-semibold text-neutral-950 hover:bg-neutral-100"
        to={to}
      >
        <PlayIcon className="size-5" />
        <span>{text}</span>

        {progress !== null ? <Progress value={progress} className="absolute right-6 -bottom-4 left-5" /> : null}
      </Link>
    </div>
  );
}

function Release({ children }: { children: string }) {
  const params = useParams();

  const renderYear = (year: string) => {
    return (
      <Link to={`/${params.type}?year=${year}`} className="hover:text-white hover:underline">
        {year}
      </Link>
    );
  };

  if (!children.includes(' - ')) return <span>{renderYear(children.replace(' - ', ''))}</span>;
  if (children.endsWith(' - ')) return <span>{renderYear(children.replace(' - ', ''))} - Present</span>;

  const [start, end] = children.split(' - ');
  if (start === end) return <span>{renderYear(start.replace(' - ', ''))}</span>;

  return (
    <span>
      {renderYear(start)} - {renderYear(end)}
    </span>
  );
}

function Seasons({ children }: { children: number }) {
  return children === 1 ? <span>1 Season</span> : <span>{children} Seasons</span>;
}
