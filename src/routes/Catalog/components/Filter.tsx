import { useSearchParams } from 'react-router';

import Select from 'components/Select';

import { useOptions } from '../hooks';

export default function Filter() {
  const options = useOptions();
  const [searchParams, setSearchParams] = useSearchParams();

  if (!options.year.length || !options.genres.length) return;

  const value = (() => {
    if (!searchParams.has('sort') && searchParams.has('year')) return 'year';
    return 'popularity';
  })();

  return (
    <div className="flex">
      <Select
        className="rounded-r-none max-md:flex-1"
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
        className="-ml-px rounded-l-none max-md:flex-1"
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
