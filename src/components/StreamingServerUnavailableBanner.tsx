import { useStreamingServer } from 'lib/hooks';
import { Link } from 'react-router';

export default function StreamingServerUnavailableBanner() {
  const server = useStreamingServer();

  // TODO: dismissible

  if (server.isLoading || server.settings) return null;

  return (
    <div className="flex items-end justify-between gap-2 border-l-4 border-yellow-500 py-1 pl-3 max-md:flex-col md:items-center md:gap-4">
      <div>
        <h2 className="font-medium text-yellow-500">Streaming Server Unavailable</h2>
        <p className="text-sm text-neutral-500">Videos might not play because the streaming server is unavailable</p>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium">
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
      </div>
    </div>
  );
}
