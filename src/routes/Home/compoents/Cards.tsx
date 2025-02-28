import { Link } from 'react-router';

import type { Item } from 'types';
import { cn } from 'lib/helpers';

type CardsProps = {
  title: string;
  baseUrl: string;
  items: Item[];
  isLoading: boolean;
  view: 'grid' | 'horizontal';
};

export default function Cards({ view, ...props }: CardsProps) {
  if (view === 'horizontal') return <Horizontal {...props} />;
  return <Grid {...props} />;
}

function Grid({ title, baseUrl, items, isLoading }: Omit<CardsProps, 'view'>) {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading
          ? [...new Array(5)].map((_, i) => <SkeletonCard key={i} />)
          : items.map((item) => <Card key={item.id} item={{ ...item, url: `${baseUrl}/${item.id}` }} />)}
      </div>
    </div>
  );
}

function Horizontal({ title, baseUrl, items, isLoading }: Omit<CardsProps, 'view'>) {
  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="relative mt-4">
        <div className="absolute top-0 bottom-0 -left-8 z-10 w-8 bg-gradient-to-r from-neutral-950 to-transparent" />

        <div className="no-scrollbar -mx-8 -mt-1.25 flex snap-x gap-6 overflow-x-auto px-2 pt-1.25">
          <div className="snap-start scroll-mx-8" />
          {isLoading
            ? [...new Array(5)].map((_, i) => (
                <SkeletonCard
                  key={i}
                  className="w-[calc(100%/5-var(--spacing)*6-5px)] shrink-0 snap-start scroll-mx-8"
                />
              ))
            : items.map((item) => (
                <Card
                  key={item.id}
                  className="w-[calc(100%/5-var(--spacing)*6-5px)] shrink-0 snap-start scroll-mx-8"
                  item={{ ...item, url: `${baseUrl}/${item.id}` }}
                />
              ))}
          <div className="snap-start scroll-mx-8" />
        </div>

        <div className="absolute top-0 -right-8 bottom-0 z-10 w-8 bg-gradient-to-l from-neutral-950 to-transparent" />
      </div>
    </div>
  );
}

function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="aspect-[2/3] w-full animate-pulse rounded-md bg-neutral-900" />

      <div className="mt-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-900" />
        <div className="mt-2.5 h-3.5 w-1/3 animate-pulse rounded bg-neutral-900" />
      </div>
    </div>
  );
}

function Card({ className, item }: { className?: string; item: Item & { url: string } }) {
  return (
    <Link to={item.url} className={cn('group rounded-md transition-colors outline-none', className)} title={item.title}>
      <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-neutral-900 outline-0 outline-offset-2 outline-white transition-[outline] duration-100 group-hover:outline-3 group-focus:outline-3">
        {item.posterUrl ? (
          <img
            ref={(img) => {
              if (!img) return;
              img.onload = () => img.classList.remove('opacity-0');
            }}
            src={item.posterUrl}
            className="size-full object-cover opacity-0 transition-opacity"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center rounded-md border border-neutral-800 p-2 text-center font-medium">
            {item.title}
          </div>
        )}
      </div>

      <div className="mt-2">
        <h4 className="truncate font-medium">{item.title}</h4>
        <div className="mt-1 flex items-center gap-2 text-sm text-neutral-500">
          <span>{item.release.split(' - ')[0] /* only short the first release year */}</span>
          {item.runtime ? (
            <>
              <div className="size-1 rounded-full bg-neutral-600" />
              <span>{item.runtime}</span>
            </>
          ) : null}
          {item.rating ? (
            <>
              <div className="size-1 rounded-full bg-neutral-600" />
              <span>{item.rating}</span>
            </>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
