import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Cog6ToothIcon } from '@heroicons/react/20/solid';

import Layout from 'components/Layout';
import Hero from 'components/Hero';
import StreamingServerUnavailableBanner from 'components/StreamingServerUnavailableBanner';
import Search from './compoents/Search';
import Items from './compoents/Items';

import type { Item } from 'types';
import { useSearchValue, useItems } from './hooks';
import { cn } from 'lib/helpers';
import { getRandomInt } from './helpers';

export default function Home() {
  const isSearching = Boolean(useSearchValue());

  const movies = useItems('movie');
  const series = useItems('series');

  const [hero, setHero] = useState<Item | null>(null);
  useEffect(() => {
    if (hero || movies.isLoading || series.isLoading) return;
    const items = [...movies.items, ...series.items].filter((item) => item.posterUrl && item.logoUrl);
    setHero(items[getRandomInt(0, items.length - 1)]);
  }, [movies.isLoading, series.isLoading]);

  return (
    <Layout className="max-md:pt-0">
      <Hero item={hero} isLogoALink>
        <div className="relative flex h-full flex-col items-center justify-center gap-4">
          <h1 className="text-center text-2xl font-semibold md:text-3xl">What would you like to watch?</h1>
          <Search />
        </div>

        <Link
          to="/settings"
          className="absolute top-2 -right-2 z-10 rounded-md stroke-white p-2 transition-colors hover:bg-white hover:stroke-neutral-950 hover:text-neutral-950 md:top-6"
        >
          <Cog6ToothIcon className="size-5" />
        </Link>
      </Hero>

      <StreamingServerUnavailableBanner />

      <div className={cn('flex flex-col gap-12 md:gap-16', series.rank > movies.rank && 'flex-col-reverse')}>
        <Items
          type="movie"
          title={isSearching ? 'Movies' : 'Popular Movies'}
          items={movies.items}
          isLoading={movies.isLoading}
        />
        <Items
          type="series"
          title={isSearching ? 'Series' : 'Popular Series'}
          items={series.items}
          isLoading={series.isLoading}
        />
      </div>
    </Layout>
  );
}
