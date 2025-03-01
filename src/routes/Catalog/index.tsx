import { Link } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import Layout from 'components/layouts/Default';
import Filter from './components/Filter';
import ItemCard, { SkeletonItemCard } from 'components/ItemCard';

import { useData, useType } from './hooks';

// TODO: cinemeta is a mess, try TMDB
// TODO: infinite scroll, search (not possible), empty state

export default function Catalog() {
  const type = useType();
  const { data, isLoading } = useData();

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

          <h1 className="text-3xl font-semibold">{getDisplayText(type)}</h1>
        </div>

        <Filter />
      </div>

      <div className="grid grid-cols-5 gap-6 pb-8">
        {isLoading
          ? [...new Array(5)].map((_, i) => <SkeletonItemCard key={i} />)
          : data.map((item) => <ItemCard key={item.id} item={{ ...item, url: `/${type}/${item.id}` }} />)}
      </div>
    </Layout>
  );
}

function getDisplayText(s: string) {
  switch (s) {
    case 'movies':
      return 'Movies';
    case 'series':
      return 'Series';
    default:
      return s;
  }
}
