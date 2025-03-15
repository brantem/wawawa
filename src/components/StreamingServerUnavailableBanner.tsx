import { Link } from 'react-router';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { createWithEqualityFn as create } from 'zustand/traditional';

import { useStreamingServer } from 'lib/hooks';

export default function StreamingServerUnavailableBanner() {
  const server = useStreamingServer();

  const { isHidden, onClose } = useStore();

  if (isHidden || server.isLoading || server.isOnline) return null;

  return (
    <div className="relative flex justify-between gap-2 border-l-4 border-yellow-500 py-1 pl-3 max-sm:flex-col sm:items-center sm:gap-4">
      <div>
        <h2 className="font-medium text-yellow-500">Streaming Server Unavailable</h2>
        <p className="text-sm text-neutral-500">Videos might not play because the streaming server is unavailable</p>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium max-sm:self-end">
        <Link
          to="/settings#streaming"
          className="rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1 hover:border-neutral-700 hover:bg-neutral-800"
        >
          Configure
        </Link>
        <a
          href="https://www.stremio.com/download-service"
          rel="noopener noreferrer"
          target="_blank"
          className="rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1 hover:border-neutral-700 hover:bg-neutral-800"
        >
          Install
        </a>

        <button
          className="top-px right-0.5 -mr-1.25 flex size-7.5 items-center justify-center rounded-full stroke-white hover:bg-white hover:stroke-neutral-950 hover:text-neutral-950 max-sm:absolute"
          onClick={onClose}
        >
          <XMarkIcon className="size-5" />
        </button>
      </div>
    </div>
  );
}

const KEY = 'streaming_server_unavailable_banner_dismissed';
const EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 1 day

type State = {
  isHidden: boolean;
  onClose(): void;
};

const useStore = create<State>((set) => {
  const data = localStorage.getItem(KEY);
  const expiration = data ? JSON.parse(data) : 0;
  return {
    isHidden: expiration && Date.now() <= expiration,
    onClose: () => {
      const expiration = Date.now() + EXPIRATION_TIME;
      localStorage.setItem(KEY, JSON.stringify(expiration));
      set({ isHidden: true });
    },
  };
});
