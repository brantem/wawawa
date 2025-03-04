import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router';
import { MediaPlayer, MediaProvider, Track, Spinner } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

import BackButton from 'components/BackButton';
import NotFound from 'routes/NotFound';

import { useTitle, useVideo, useSubtitles } from '../../hooks';
import { cn } from 'lib/helpers';
import { getLabel } from '../../helpers';
import Storage from './storage';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

export default function Player() {
  const { type, id, episodeId } = useParams();
  const loading = useLocation();

  const title = useTitle();
  const { src, duration, isLoading } = useVideo();
  const { subtitles } = useSubtitles();

  const storage = useMemo(() => {
    if (isLoading) return;
    return new Storage(id!, episodeId || null, loading.pathname, duration);
  }, [duration]);

  const backUrl = `/${type}/${id}${episodeId ? `/${episodeId}` : ''}/watch`;

  return (
    <div className="group size-full overflow-hidden bg-black">
      {isLoading || src ? (
        <BackButton
          className={cn(
            'fixed top-3 left-3 z-10',
            src && 'opacity-0 transition-[color,opacity] group-hover:opacity-100',
          )}
          to={backUrl}
        />
      ) : null}

      {!isLoading ? (
        src ? (
          <MediaPlayer
            title={title}
            src={{ src, type: 'video/mp4' }}
            streamType="on-demand"
            autoPlay
            hideControlsOnMouseLeave
            storage={storage}
          >
            <MediaProvider>
              {subtitles.map(({ id, url, ...subtitle }) => (
                <Track id={id} key={id} src={url} kind="subtitles" label={getLabel(subtitle.lang)} {...subtitle} />
              ))}
            </MediaProvider>
            <DefaultVideoLayout icons={defaultLayoutIcons} download={false} noAudioGain />
          </MediaPlayer>
        ) : (
          <NotFound title="Hmm… This stream won't load" back={{ url: backUrl, text: 'Try another stream' }} />
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
