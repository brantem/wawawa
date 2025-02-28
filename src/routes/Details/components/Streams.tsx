import { useState } from 'react';

import type { Item } from 'types';
import { useStreams } from 'lib/hooks';
import { PlayIcon } from '@heroicons/react/24/solid';

export default function Streams({ item }: { item: Item }) {
  const { groups, streams } = useStreams(item.type, item.id);

  const [group, setGroup] = useState('');

  if (!groups.length) return;

  return (
    <div>
      <div className="sticky top-0 z-10 -my-4 flex items-center justify-between gap-4 bg-neutral-950 py-4">
        <h2 className="text-xl font-semibold">Streams</h2>

        <select
          className="appearance-none rounded-full border border-neutral-200 bg-white px-3 py-1 text-center font-semibold text-neutral-950 outline-none hover:bg-neutral-100"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          {groups.map((group) => (
            <option key={group} value={group}>
              {getDisplayText(group)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-col gap-2">

              <div className="flex-1 truncate py-2">
                <span className="font-medium">{stream.title}</span>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span className="tabular-nums">{stream.seeders}</span>
                  <div className="size-1 rounded-full bg-neutral-600 group-hover:bg-neutral-400" />
                  <span className="tabular-nums">{stream.size}</span>
                  <div className="size-1 rounded-full bg-neutral-600 group-hover:bg-neutral-400" />
                  <span>{stream.origin}</span>
                </div>
              </div>

              <div className="flex aspect-square size-15 h-full items-center justify-center opacity-0 group-hover:opacity-100">
                <PlayIcon className="size-6" />
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}

function getDisplayText(s: string) {
  if (s.includes('4k')) return s.replace('4k', '4K');
  return s;
}
