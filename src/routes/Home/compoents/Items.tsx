import { ArrowRightIcon } from '@heroicons/react/16/solid';

import ItemCard, { SkeletonItemCard } from 'components/ItemCard';

import type { Item } from 'types';

type ItemsProps = {
  title: string;
  baseUrl: string;
  items: Item[];
  isLoading: boolean;
};

export default function Items({ title, baseUrl, items, isLoading }: ItemsProps) {
  return (
    <div className="group/container px-8">
      {!isLoading ? (
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">{title}</h2>

          <a
            href={baseUrl}
            className="flex items-center gap-2 text-sm text-neutral-500 transition-all hover:text-neutral-400"
          >
            <span className="relative -mr-6 bg-neutral-950 transition-[margin] group-hover/container:mr-0">
              Show More
            </span>
            <ArrowRightIcon className="size-4 opacity-0 transition-opacity group-hover/container:opacity-100" />
          </a>
        </div>
      ) : (
        <div className="h-7 w-16 animate-pulse rounded bg-neutral-900" />
      )}

      <div className="relative mt-4">
        <div className="absolute top-0 bottom-0 -left-8 z-10 w-3 bg-gradient-to-r from-neutral-950 to-transparent" />

        <div className="no-scrollbar -mx-8 -mt-1.25 flex snap-x gap-6 overflow-x-auto px-2 pt-1.25">
          <div className="snap-start scroll-mx-8" />
          {isLoading
            ? [...new Array(5)].map((_, i) => (
                <SkeletonItemCard
                  key={i}
                  className="w-[calc(100%/5-var(--spacing)*6-5px)] shrink-0 snap-start scroll-mx-8"
                />
              ))
            : items.map((item) => (
                <ItemCard
                  key={item.id}
                  className="w-[calc(100%/5-var(--spacing)*6-5px)] shrink-0 snap-start scroll-mx-8"
                  item={{ ...item, url: `${baseUrl}/${item.id}` }}
                />
              ))}
          <div className="snap-start scroll-mx-8" />
        </div>

        <div className="absolute top-0 -right-8 bottom-0 z-10 w-3 bg-gradient-to-l from-neutral-950 to-transparent" />
      </div>
    </div>
  );
}
