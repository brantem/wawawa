import { Link } from 'react-router';

import type { Item } from 'types';

type CardsProps = {
  title: string;
  baseUrl: string;
  items: Item[];
  isLoading: boolean;
};

export default function Cards({ title, baseUrl, items, isLoading }: CardsProps) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-medium">{title}</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading
          ? [...new Array(5)].map((_, i) => <SkeletonCard key={i} />)
          : items.map((item) => <Card key={item.id} item={{ ...item, url: `${baseUrl}/${item.id}` }} />)}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div>
      <div className="aspect-[2/3] w-full animate-pulse rounded-md bg-neutral-900" />

      <div className="mt-3">
        <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-900" />
        <div className="mt-2.5 h-3.5 w-1/3 animate-pulse rounded bg-neutral-900" />
      </div>
    </div>
  );
}

function Card({ item }: { item: Item & { url: string } }) {
  return (
    <Link to={item.url} className="group rounded-md transition-colors outline-none">
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
            {item.name}
          </div>
        )}
      </div>

      <div className="mt-2">
        <h4 className="truncate font-medium">{item.name}</h4>
        <span className="mt-1 text-sm text-neutral-500">{item.release}</span>
      </div>
    </Link>
  );
}
