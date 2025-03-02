import { Link } from 'react-router';

import Img from 'components/Img';

import type { Item } from 'types';
import { cn } from 'lib/helpers';

export default function ItemCard({ className, item }: { className?: string; item: Item & { url: string } }) {
  return (
    <Link to={item.url} className={cn('group rounded-md transition-colors outline-none', className)} title={item.title}>
      <div className="aspect-[2/3] w-full overflow-hidden rounded-md bg-neutral-900 outline-0 outline-offset-2 outline-white transition-[outline] duration-100 group-hover:outline-3 group-focus:outline-3">
        {item.posterUrl ? (
          <Img src={item.posterUrl} className="size-full object-cover" loading="lazy" />
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
export function SkeletonItemCard({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="aspect-[2/3] w-full animate-pulse rounded-md bg-neutral-900" />

      <div className="mt-3">
        <div className="h-5 w-2/3 animate-pulse rounded bg-neutral-900" />
        <div className="mt-2.5 h-3.5 w-1/3 animate-pulse rounded bg-neutral-900" />
      </div>
    </div>
  );
}
