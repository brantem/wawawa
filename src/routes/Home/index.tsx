import { useMemo } from 'react';

import Layout from 'components/layouts/Default';
import Hero from 'components/Hero';
import Search from './compoents/Search';
import Items from './compoents/Items';

import { useSearchValue, useData } from './hooks';
import { cn } from 'lib/helpers';
import { getRandomInt } from './helpers';

// TODO: empty state

export default function Home() {
  const isSearching = Boolean(useSearchValue());

  const { movies, series, isLoading } = useData();

  const hero = useMemo(() => {
    if (isLoading) return null;
    const items = [...movies, ...series].filter((item) => item.posterUrl && item.logoUrl);
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

      <div className={cn('flex flex-col gap-16 pb-8', series.rank > movies.rank && 'flex-col-reverse')}>
        <Items type="movie" title={isSearching ? 'Movies' : 'Popular Movies'} items={movies} isLoading={isLoading} />
        <Items type="series" title={isSearching ? 'Series' : 'Popular Series'} items={series} isLoading={isLoading} />
      </div>
    </Layout>
  );
}
