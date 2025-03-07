import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router';
import { MediaPlayer, MediaProvider, Track, Spinner } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

import BackButton from 'components/BackButton';
import NotFound from 'components/NotFound';

import Storage from './storage';
import { useSettings } from 'lib/hooks';
import { useTitle, useVideo, useSubtitles } from '../../hooks';
import { cn, generateItemPathFromParams } from 'lib/helpers';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

export default function Player() {
  const params = useParams();
  const location = useLocation();

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
            'fixed top-2 left-2 z-10',
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
            streamType="on-demand"
            autoPlay
            hideControlsOnMouseLeave
            storage={storage}
          >
            <MediaProvider>
              <Subtitles
                hasBuiltinSubtitle={(video.raw?.streams || []).some((stream) => stream.track === 'subtitle')}
              />
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

function Subtitles({ hasBuiltinSubtitle }: { hasBuiltinSubtitle: boolean }) {
  const settings = useSettings();
  const { subtitles } = useSubtitles();

  let foundDefault = hasBuiltinSubtitle;
  return subtitles.map(({ id, url, ...subtitle }) => {
    let isDefault = false;
    if (!foundDefault && subtitle.lang === settings.language) {
      foundDefault = true;
      isDefault = true;
    }

    return <Track id={id} key={id} src={url} kind="subtitles" {...subtitle} default={isDefault} />;
  });
}
