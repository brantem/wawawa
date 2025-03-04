import { useRef, useCallback } from 'react';
import { useParams } from 'react-router';

import Layout from 'components/layouts/Default';
import BackButton from 'components/BackButton';
import Filter from './components/Filter';
import ItemCard, { SkeletonItemCard } from 'components/ItemCard';

import { useCurrentBreakpoint } from 'lib/hooks';
import { useData } from './hooks';
import { getDisplayText } from './helpers';

// TODO: cinemeta is a mess, try TMDB
// TODO: virtualized, search (not possible)

export default function Catalog() {
  const observerRef = useRef<IntersectionObserver>(null);
  const currentBreakpoint = useCurrentBreakpoint();

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

  const n = (() => {
    switch (currentBreakpoint) {
      case 'md':
        return 3;
      case 'lg':
        return 4;
      case 'xl':
        return 5;
      default:
        return 2;
    }
  })();

  return (
    <Layout className="max-md:px-4">
      <div className="flex justify-between gap-4 max-md:flex-col max-md:pt-4 md:items-center">
        <div className="flex items-center gap-2 md:h-8">
          <BackButton to="/" className="-my-1 -ml-1" />

          <h1 className="text-xl font-semibold">{getDisplayText(type!)}</h1>
        </div>

        {data.length ? <Filter /> : null}
      </div>

      <div className="relative grid grid-cols-2 gap-6 pb-4 max-md:gap-x-4 md:grid-cols-3 md:pb-8 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading ? (
          [...new Array(n)].map((_, i) => <SkeletonItemCard key={i} />)
        ) : data.length ? (
          data.map((item) => <ItemCard key={item.id} item={{ ...item, url: `/${type}/${item.id}` }} />)
        ) : (
          <>
            <div className="mb-14 aspect-[2/3]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h3 className="text-lg font-medium">No titles found</h3>
              <p className="text-neutral-500">Please refresh or try again later.</p>
            </div>
          </>
        )}

        {!isLoading && isLoadingMore
          ? (() => {
              const remainder = data.length % n;
              return [...new Array(remainder === 0 ? n : n - remainder)].map((_, i) => <SkeletonItemCard key={i} />);
            })()
          : null}
      </div>

      {!isLoading && data.length ? <div ref={bottomRef} /> : null}
    </Layout>
  );
}
