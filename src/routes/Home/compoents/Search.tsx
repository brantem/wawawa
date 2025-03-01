import { useSearchParams } from 'react-router';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <input
      type="text"
      className="w-2/4 rounded-full border border-neutral-200 bg-white px-6 py-3 text-neutral-950 outline-none"
      placeholder="Titles"
      value={searchParams.get('q') || ''}
      onChange={(e) => {
        setSearchParams(
          (prev) => {
            const q = e.target.value.trim();
            if (q) {
              prev.set('q', q.trim());
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
