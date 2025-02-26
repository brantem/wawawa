import useSWR from 'swr';
import { useParams } from 'react-router';

import Hero from 'components/Hero';

import { metaToItem } from 'lib/helpers';

// TODO: list of episodes, play & resume

export default function Details() {
  let params = useParams<{ type: 'movies' | 'series'; id: string }>();

  const { data, isLoading } = useSWR(params, async ({ type, id }) => {
    let t = type as string;
    if (type === 'movies') t = 'movie';
    const res = await fetch(`https://v3-cinemeta.strem.io/meta/${t}/${id}.json`);
    return metaToItem((await res.json()).meta);
  });

  return (
    <div className="mx-auto max-w-5xl py-8">
      <Hero item={data} isLoading={isLoading}>
        {data ? (
          <button className="absolute right-8 bottom-8 rounded-full border border-neutral-200 bg-white px-6 py-2 font-semibold text-neutral-950 hover:bg-neutral-100">
            Play
          </button>
        ) : null}
      </Hero>

      {data ? (
        <div className="flex flex-col gap-8 p-8">
          <div className="flex items-center gap-2 text-lg text-neutral-500">
            <Release>{data.release}</Release>
            {data.type === 'series' ? (
              <>
                <div className="size-1.25 rounded-full bg-neutral-600" />
                <Seasons>
                  {data.episodes.reduce((max, episode) => (episode.season > max ? episode.season : max), 1)}
                </Seasons>
              </>
            ) : null}
            {data.runtime ? (
              <>
                <div className="size-1.25 rounded-full bg-neutral-600" />
                <span>{data.runtime}</span>
              </>
            ) : null}
            {data.rating ? (
              <>
                <div className="size-1.25 rounded-full bg-neutral-600" />
                <span>{data.rating}</span>
              </>
            ) : null}
          </div>

          {data.director || data.cast.length || data.genres.length ? (
            <div className="flex flex-col gap-2 text-sm">
              {data.director ? (
                <span>
                  <span className="text-neutral-500">Director:</span> {data.director}
                </span>
              ) : null}
              {data.cast.length ? (
                <span>
                  <span className="text-neutral-500">Cast:</span> {data.cast.join(', ')}
                </span>
              ) : null}
              {data.genres.length ? (
                <span>
                  <span className="text-neutral-500">Genres:</span> {data.genres.join(', ')}
                </span>
              ) : null}
            </div>
          ) : null}

          <p className="text-lg">{data.description}</p>
        </div>
      ) : null}
    </div>
  );
}

function Release({ children }: { children: string }) {
  if (children.endsWith(' - ')) return <span>{children}Present</span>;
  return <span>{children}</span>;
}

function Seasons({ children }: { children: number }) {
  return children === 1 ? <span>1 Season</span> : <span>{children} Seasons</span>;
}
