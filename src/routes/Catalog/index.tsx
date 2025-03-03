import { useRef, useCallback } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import Layout from 'components/layouts/Default';
import Filter from './components/Filter';
import ItemCard, { SkeletonItemCard } from 'components/ItemCard';

import { useData } from './hooks';
import { getDisplayText } from './helpers';

// TODO: cinemeta is a mess, try TMDB
// TODO: virtualized, search (not possible), empty state

export default function Catalog() {
  const observerRef = useRef<IntersectionObserver>(null);

  const { type } = useParams();
  const { data, isLoading, hasMore, loadMore, isLoadingMore } = useData();

  const bottomRef = useCallback(
    (node: HTMLDivElement) => {
      if (!hasMore || isLoadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          loadMore();
        },
        { rootMargin: '80%' },
      );

      if (node) observerRef.current.observe(node);
    },
    [loadMore, hasMore, isLoadingMore],
  );

  return (
    <Layout className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="-my-1 -ml-1 rounded-md stroke-white p-2 transition-colors hover:bg-white hover:stroke-neutral-950 hover:text-neutral-950"
          >
            <ArrowLeftIcon className="size-6 [&>path]:stroke-2" />
          </Link>

          <h1 className="text-3xl font-semibold">{getDisplayText(type!)}</h1>
        </div>

        <Filter />
      </div>

      <div className="relative grid grid-cols-5 gap-6 pb-8">
        {isLoading
          ? [...new Array(5)].map((_, i) => <SkeletonItemCard key={i} />)
          : data.map((item) => <ItemCard key={item.id} item={{ ...item, url: `/${type}/${item.id}` }} />)}

        {!isLoading && isLoadingMore
          ? (() => {
              const remainder = data.length % 5;
              return [...new Array(remainder === 0 ? 5 : 5 - remainder)].map((_, i) => <SkeletonItemCard key={i} />);
            })()
          : null}
      </div>

      <div ref={bottomRef} />
    </Layout>
  );
}
