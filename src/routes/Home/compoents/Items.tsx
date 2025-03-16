import { Link } from 'react-router';
import { ArrowRightIcon } from '@heroicons/react/16/solid';

import ItemCard, { SkeletonItemCard, type ItemCardProps } from 'components/ItemCard';

type ItemsProps = {
  title: string;
  moreUrl?: string;
  items: ItemCardProps['item'][];
  isLoading: boolean;
};

export default function Items({ title, moreUrl, items, isLoading }: ItemsProps) {
  return (
    <div className="group/container">
      {!isLoading ? (
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>

          {items.length && moreUrl ? (
            <Link
              to={moreUrl}
              className="flex items-center gap-2 text-sm text-neutral-500 transition-all hover:text-neutral-400"
            >
              <span className="relative -mr-6 bg-neutral-950 transition-[margin] group-hover/container:mr-0">
                Show More
              </span>
              <ArrowRightIcon className="size-4 opacity-0 transition-opacity group-hover/container:opacity-100" />
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="h-7 w-16 animate-pulse rounded bg-neutral-900" />
      )}

      <div className="relative mt-4">
        <div className="absolute top-0 bottom-0 -left-4 z-10 w-4 bg-gradient-to-r from-neutral-950 to-transparent max-md:hidden md:-left-8" />

        <div className="no-scrollbar -mx-4 -mt-1.25 flex snap-x overflow-x-auto pt-1.25 md:-mx-8">
          <div className="mr-4 snap-start scroll-mx-4 md:mr-8 md:scroll-mx-8" />
          {isLoading ? (
            [...new Array(5)].map((_, i) => (
              <SkeletonItemCard
                key={i}
                className="mr-4 w-[calc(1024px/5-var(--spacing)*6-1.575px)] shrink-0 snap-start scroll-mx-4 md:scroll-mx-8"
              />
            ))
          ) : items ? (
            items.map((item) => (
              <ItemCard
                key={item.id}
                className="mr-4 w-[calc(1024px/5-var(--spacing)*6-1.575px)] shrink-0 snap-start scroll-mx-4 md:scroll-mx-8"
                item={item}
              />
            ))
          ) : (
            <div className="grid w-full grid-cols-3 rounded-md">
              <div className="mb-14 aspect-[2/3] w-[calc(1024px/5-var(--spacing)*6-1.575px)]" />
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-lg font-medium">No titles found</h3>
                <p className="text-neutral-500">Please refresh or try again later.</p>
              </div>
            </div>
          )}
          <div className="snap-start md:mr-4" />
        </div>

        <div className="absolute top-0 -right-4 bottom-0 z-10 w-4 bg-gradient-to-l from-neutral-950 to-transparent max-md:hidden md:-right-8" />
      </div>
    </div>
  );
}
