import { Fragment, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { PlayIcon } from '@heroicons/react/20/solid';

import Layout from 'components/Layout';
import Hero from 'components/Hero';
import BackButton from 'components/BackButton';
import Progress from 'components/Progress';
import Episodes from './components/Episodes';
import NotFound from 'components/NotFound';

import type { Item } from 'types';
import type { Stream } from 'types/storage';
import { useMediaQuery, useItem } from 'lib/hooks';
import { useStreams } from './hooks';
import { getStreamProgress } from 'lib/helpers';
import { getLastWatched, getTotalSeasons } from './helpers';

// TODO: list of other movies/series?

export default function Details() {
  const isDesktop = useMediaQuery('(width >= 768px)');
  const params = useParams();

  const { item, isLoading } = useItem();
  const { streams } = useStreams();

  const lastWatched = getLastWatched(streams);

  // TODO: improve loading by delaying the skeleton

  return isLoading || item ? (
    <Layout className="max-md:pt-0">
      <Hero item={item} isLoading={isLoading}>
        <BackButton to="/" className="absolute top-3 -left-2 md:top-6" />

        {isDesktop && item ? (
          <PlayButton className="absolute right-0 bottom-8" item={item} lastWatched={lastWatched} />
        ) : null}
      </Hero>

      {!isDesktop && item ? <PlayButton item={item} lastWatched={lastWatched} /> : null}

      {item ? (
        <div className="flex flex-col gap-6 md:gap-8">
          <div className="flex items-center gap-2 text-neutral-500 md:text-lg">
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

          <p className="text-neutral-400 md:text-lg">{item.synopsis}</p>

          {item.type === 'series' ? <Episodes items={item.items} streams={streams} /> : null}
        </div>
      ) : null}
    </Layout>
  ) : (
    <NotFound />
  );
}

function PlayButton({ className, item, lastWatched }: { className?: string; item: Item; lastWatched: Stream | null }) {
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
    <div className={className}>
      <Link
        className="relative flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white py-2 pr-6 pl-5 font-semibold text-neutral-950 hover:bg-neutral-100"
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
