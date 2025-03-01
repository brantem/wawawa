import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import Layout from 'components/layouts/Default';
import Hero from 'components/Hero';
import Cards from './compoents/Cards';

import type { Meta } from 'types';
import * as constants from 'constants';
import { cn, metaToItem } from 'lib/helpers';
import { getRandomInt } from './helpers';
import { useDebounce } from 'lib/hooks';

// TODO: genre

export default function Home() {
  const { movies, series, isLoading } = useData();

  const hero = useMemo(() => {
    if (isLoading) return null;
    const items = (getRandomInt(0, 1) ? movies : series).filter((item) => item.posterUrl && item.logoUrl);
    return items[getRandomInt(0, items.length - 1)];
  }, [isLoading]);

  return (
    <Layout>
      <Hero item={hero} isLogoALink>
        <div className="relative flex h-full flex-col items-center justify-center gap-4">
          <h1 className="text-center text-3xl font-semibold">What would you like to watch?</h1>
          <Search />
        </div>
      </Hero>

      <div className={cn('flex flex-col gap-16', series.rank > movies.rank && 'flex-col-reverse')}>
        <Cards title="Movies" baseUrl="/movies" items={movies} isLoading={isLoading} view="grid" />
        <Cards title="Series" baseUrl="/series" items={series} isLoading={isLoading} view="grid" />
      </div>
    </Layout>
  );
}

const fetcher = async ({ type, search }: { type: string; search: string }) => {
  const _search = search ? `/search=${search}` : '';
  const res = await fetch(`${constants.CINEMETA_BASE_URL}/catalog/${type}/top${_search}.json`);
  return res.json();
};

function useData() {
  const search = useDebounce(useSearchParams()[0].get('q'), 500);

  const movies = useSWR<{ metas: Meta[]; rank: number }>({ type: 'movie', search }, fetcher);
  const series = useSWR<{ metas: Meta[]; rank: number }>({ type: 'series', search }, fetcher);

  return {
    movies: Object.assign((movies.data?.metas || []).map(metaToItem), { rank: movies?.data?.rank || 0 }),
    series: Object.assign((series.data?.metas || []).map(metaToItem), { rank: series?.data?.rank || 0 }),
    isLoading: movies.isLoading || series.isLoading,
  };
}

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <input
      type="text"
      className="w-2/4 rounded-full border border-neutral-200 bg-white px-6 py-3 text-neutral-950 outline-none"
      placeholder="Titles"
      defaultValue={searchParams.get('q') || ''}
      onChange={(e) => {
        setSearchParams(
          (prev) => {
            const q = e.target.value.trim();
            if (q) {
              prev.set('q', q.trim());
            } else {
              prev.delete('q');
            }
            return prev;
          },
          { replace: true },
        );
      }}
    />
  );
}
