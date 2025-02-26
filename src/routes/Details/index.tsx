import useSWR from 'swr';
import { useParams } from 'react-router';

import Hero from 'components/Hero';

import { metaToItem } from 'lib/helpers';

export default function Details() {
  let params = useParams<{ type: 'movies' | 'series'; id: string }>();

  const { data, isLoading } = useSWR(params, async ({ type, id }) => {
    let t = type as string;
    if (type === 'movies') t = 'movie';
    const res = await fetch(`https://v3-cinemeta.strem.io/meta/${t}/${id}.json`);
    return metaToItem((await res.json()).meta);
  });

  return (
    <div className="mx-auto max-w-5xl py-8">
      <Hero item={data} isLoading={isLoading} />
    </div>
  );
}
