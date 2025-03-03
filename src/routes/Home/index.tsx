import { useState, useEffect } from 'react';

import Layout from 'components/layouts/Default';
import Hero from 'components/Hero';
import Search from './compoents/Search';
import Items from './compoents/Items';

import { Item } from 'types';
import { useSearchValue, useData } from './hooks';
import { cn } from 'lib/helpers';
import { getRandomInt } from './helpers';

// TODO: empty state

export default function Home() {
  const isSearching = Boolean(useSearchValue());

  const { movies, series, isLoading } = useData();

  const [hero, setHero] = useState<Item | null>(null);
  useEffect(() => {
    if (hero || isLoading) return;
    const items = [...movies, ...series].filter((item) => item.posterUrl && item.logoUrl);
    setHero(items[getRandomInt(0, items.length - 1)]);
  }, [isLoading]);

  return (
    <Layout>
      <Hero item={hero} isLogoALink>
        <div className="relative flex h-full flex-col items-center justify-center gap-4">
          <h1 className="text-center text-2xl font-semibold md:text-3xl">What would you like to watch?</h1>
          <Search />
        </div>
      </Hero>

      <div
        className={cn('flex flex-col gap-12 pb-4 md:gap-16 md:pb-8', series.rank > movies.rank && 'flex-col-reverse')}
      >
        <Items type="movie" title={isSearching ? 'Movies' : 'Popular Movies'} items={movies} isLoading={isLoading} />
        <Items type="series" title={isSearching ? 'Series' : 'Popular Series'} items={series} isLoading={isLoading} />
      </div>
    </Layout>
  );
}
