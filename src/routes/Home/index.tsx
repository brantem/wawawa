import useSWR from 'swr';

import Hero from 'components/Hero';
import Cards from './compoents/Cards';

import type { Meta } from 'types';
import { metaToItem } from 'lib/helpers';
import { getRandomInt } from './helpers';

export default function Home() {
  const { movies, series, isLoading } = useData();

  const hero = (() => {
    const items = getRandomInt(0, 1) ? movies : series;
    return items[getRandomInt(0, items.length - 1)];
  })();

  return (
    <div className="px-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 py-8">
        <Hero item={hero}>
          <div className="relative flex h-full flex-col items-center justify-center gap-4">
            <h1 className="text-center text-3xl font-semibold">What would you like to watch?</h1>
            <input
              type="text"
              className="w-2/4 rounded-full border border-neutral-200 bg-white px-6 py-3 text-neutral-950 outline-none"
              placeholder="Titles"
            />
          </div>
        </Hero>

        <Cards title="Movies" baseUrl="/movies" items={movies} isLoading={isLoading} />
        <Cards title="Series" baseUrl="/series" items={series} isLoading={isLoading} />
      </div>
    </div>
  );
}

const fetcher = async (url: string) => {
  const res = await fetch(`https://cinemeta-catalogs.strem.io/top/catalog${url}`);
  return res.json();
};

function useData() {
  const movies = useSWR<{ metas: Meta[] }>('/movie/top.json', fetcher);
  const series = useSWR<{ metas: Meta[] }>('/series/top.json', fetcher);

  return {
    movies: (movies.data?.metas || []).map(metaToItem),
    series: (series.data?.metas || []).map(metaToItem),
    isLoading: movies.isLoading || series.isLoading,
  };
}
