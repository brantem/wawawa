import { useSearchParams } from 'react-router';
import useSWR from 'swr';

import Select from 'components/Select';

import * as constants from 'constants';
import { useType } from '../hooks';

export default function Filter() {
  const options = useOptions();
  const [searchParams, setSearchParams] = useSearchParams();

  const value = (() => {
    if (!searchParams.has('sort') && searchParams.has('year')) return 'year';
    return 'popularity';
  })();

  return (
    <div>
      <Select
        className="rounded-r-none"
        value={value}
        onChange={(e) => {
          setSearchParams((prev) => {
            switch (e.target.value) {
              case 'popularity':
                prev.delete('year');
                prev.set('sort', 'popularity');
                break;
              case 'year':
                prev.delete('sort');
                prev.set('year', options.year[0]);
                break;
            }
            return prev;
          });
        }}
      >
        <option value="popularity">Popularity</option>
        <option value="year">Year</option>
      </Select>

      <Select
        className="-ml-px rounded-l-none"
        value={(() => {
          if (value === 'year') return searchParams.get('year') || options.year[0];
          return searchParams.get('genre') || 'ALL';
        })()}
        onChange={(e) => {
          setSearchParams((prev) => {
            switch (value) {
              case 'popularity':
                if (e.target.value === 'ALL') {
                  prev.delete('genre');
                } else {
                  prev.set('genre', e.target.value);
                }
                break;
              case 'year':
                prev.set('year', e.target.value);
                break;
            }
            return prev;
          });
        }}
      >
        {value === 'popularity' ? <option value="ALL">Genre</option> : null}
        {(value === 'popularity' ? options.genres : options.year).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </div>
  );
}

function useOptions() {
  type Data = {
    catalogs: {
      id: 'top' | 'year';
      type: 'movie' | 'series';
      genres: string[];
    }[];
  };

  const { data, isLoading } = useSWR<Data>('manifest.json', async () => {
    const res = await fetch(`${constants.CINEMETA_BASE_URL}/manifest.json`);
    return await res.json();
  });

  const type = useType();
  const _type = type === 'movies' ? 'movie' : type;

  return {
    genres: (() => {
      const catalog = data?.catalogs.find((catalog) => catalog.id === 'top' && catalog.type === _type);
      if (!catalog) return [];
      return catalog.genres;
    })(),
    year: (() => {
      const catalog = data?.catalogs.find((catalog) => catalog.id === 'year' && catalog.type === _type);
      if (!catalog) return [];
      return catalog.genres;
    })(),
    isLoading,
  };
}
