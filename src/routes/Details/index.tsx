import useSWR from 'swr';
import { useParams } from 'react-router';

import Hero from 'components/Hero';

import { metaToItem } from 'lib/helpers';

export default function Details() {
  let params = useParams<{ type: 'movies' | 'series'; id: string }>();

  const { data } = useSWR(params, async ({ type, id }) => {
    let t = type as string;
    if (type === 'movies') t = 'movie';
    const res = await fetch(`https://v3-cinemeta.strem.io/meta/${t}/${id}.json`);
    return metaToItem((await res.json()).meta);
  });

  return (
    <div className="mx-auto max-w-5xl py-8">
      {data ? (
        <Hero item={data} />
      ) : (
        <div className="h-[500px] animate-pulse rounded-xl border border-neutral-900 bg-neutral-900" />
      )}
    </div>
  );
}
