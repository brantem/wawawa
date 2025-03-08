import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router';
import { MediaPlayer, MediaProvider, Track, Spinner } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

import BackButton from 'components/BackButton';
import NotFound from 'components/NotFound';

import Storage from './storage';
import { useSettings, useStreamingServer } from 'lib/hooks';
import { useTitle, useVideo, useSubtitles } from '../../hooks';
import { cn, generateItemPathFromParams } from 'lib/helpers';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

export default function Player() {
  const params = useParams();
  const location = useLocation();

  const server = useStreamingServer();
  const title = useTitle();
  const video = useVideo();

  const storage = useMemo(() => {
    if (video.isLoading) return;
    return new Storage(params, location.pathname, video.duration);
  }, [video.duration]);

  const backUrl = `/${generateItemPathFromParams(params)}/watch`;

  return (
    <div className="group size-full overflow-hidden bg-black">
      {video.isLoading || video.src ? (
        <BackButton
          className={cn(
            'fixed top-3 left-2 z-10',
            video.src && 'opacity-0 transition-[color,opacity] group-hover:opacity-100',
          )}
          to={backUrl}
        />
      ) : null}

      {!video.isLoading ? (
        video.src ? (
          <MediaPlayer
            title={title}
            src={{ src: video.src, type: 'video/mp4' }}
            storage={storage}
            streamType="on-demand"
            autoPlay
            hideControlsOnMouseLeave
            crossOrigin
          >
            <MediaProvider>
              <Subtitles
                hasBuiltinSubtitle={(video.raw?.streams || []).some((stream) => stream.track === 'subtitle')}
              />
            </MediaProvider>
            <DefaultVideoLayout icons={defaultLayoutIcons} download={false} noAudioGain />
          </MediaPlayer>
        ) : server.isOnline ? (
          <NotFound title="Hmm… This stream won't load" back={{ url: backUrl, text: 'Try another stream' }} />
        ) : (
          <NotFound
            title="Streaming Server Unavailable"
            description="This stream won't load as the server is unreachable. Ensure it's online"
            back={{ url: '/settings#streaming', text: 'Configure Server' }}
          />
        )
      ) : (
        <div className="vds-buffering-indicator" data-buffering>
          <Spinner.Root className="vds-buffering-spinner">
            <Spinner.Track className="vds-buffering-track" />
            <Spinner.TrackFill className="vds-buffering-track-fill" />
          </Spinner.Root>
        </div>
      )}
    </div>
  );
}

function Subtitles({ hasBuiltinSubtitle }: { hasBuiltinSubtitle: boolean }) {
  const settings = useSettings();
  const server = useStreamingServer();
  const { subtitles } = useSubtitles();

  let foundDefault = hasBuiltinSubtitle;
  return subtitles.map(({ id, url, lang, ...subtitle }) => {
    let isDefault = false;
    if (!foundDefault && lang === settings.language) {
      foundDefault = true;
      isDefault = true;
    }

    return (
      <Track
        id={id}
        key={id}
        kind="subtitles"
        type="srt"
        src={server.isOnline ? `${settings.streaming.url}/subtitles.srt?from=${url}` : url}
        {...subtitle}
        default={isDefault}
      />
    );
  });
}
