import { useSearchParams } from 'react-router';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <input
      type="text"
      className="w-3/4 rounded-full border border-neutral-200 bg-white px-5 py-2 text-neutral-950 outline-none md:w-2/4 md:px-6 md:py-3"
      placeholder="Titles"
      value={searchParams.get('q') || ''}
      onChange={(e) => {
        const q = e.target.value;
        if (!searchParams.has('q') && !q.trim()) return;
        setSearchParams(
          (prev) => {
            if (q) {
              prev.set('q', q);
            } else {
              prev.delete('q');
            }
            return prev;
          },
          { replace: searchParams.has('q') },
        );
      }}
    />
  );
}
