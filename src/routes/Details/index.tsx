import { useMemo } from 'react';
import useSWR from 'swr';
import { Link, useParams } from 'react-router';
import { PlayIcon } from '@heroicons/react/20/solid';

import Layout from 'components/layouts/Default';
import Hero from 'components/Hero';
import Episodes from './components/Episodes';

import { Item } from 'types';
import * as constants from 'constants';
import { metaToItem } from 'lib/helpers';
import { getTotalSeasons } from './helpers';

// TODO: play & resume, list of other movies/series?

export default function Details() {
  const { item, isLoading } = useData();

  return (
    <Layout>
      <Hero item={item} isLoading={isLoading}>
        {item ? <PlayButton item={item} /> : null}
      </Hero>

      {item ? (
        <div className="flex flex-col gap-8 px-8">
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
                  <span className="text-neutral-500">Genres:</span> {item.genres.join(', ')}
                </span>
              ) : null}
            </div>
          ) : null}

          <p className="text-lg">{item.synopsis}</p>

          {item.type === 'series' ? <Episodes items={item.items} /> : null}
        </div>
      ) : null}
    </Layout>
  );
}

function useData() {
  const params = useParams<{ type: 'movies' | 'series'; id: string }>();
  const { data: item, isLoading } = useSWR(params, async ({ type, id }) => {
    let _type = type === 'movies' ? 'movie' : type;

    const res = await fetch(`${constants.CINEMETA_V3_BASE_URL}/meta/${_type}/${id}.json`);
    return metaToItem((await res.json()).meta);
  });

  return { item, isLoading };
}

function PlayButton({ item }: { item: Item }) {
  const to = useMemo(() => {
    if (item.type === 'movie') return 'watch';
    // TODO: resume last episode if unfinished, otherwise play next
    return `watch/${item.items.find((item) => item.season === 1 && item.episode === 1)!.id}`;
  }, [item]);

  return (
    <Link
      className="absolute right-8 bottom-8 flex items-center gap-2 rounded-full border border-neutral-200 bg-white py-2 pr-6 pl-5 font-semibold text-neutral-950 hover:bg-neutral-100"
      to={to}
    >
      <PlayIcon className="size-5" />
      <span>Play</span>
    </Link>
  );
}

function Release({ children }: { children: string }) {
  return children.endsWith(' - ') ? <span>{children}Present</span> : <span>{children}</span>;
}

function Seasons({ children }: { children: number }) {
  return children === 1 ? <span>1 Season</span> : <span>{children} Seasons</span>;
}
