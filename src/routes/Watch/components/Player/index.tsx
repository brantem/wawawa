import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router';
import { MediaPlayer, MediaProvider, Track } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import BackButton from 'components/BackButton';

import { useTitle, useVideo, useSubtitles } from '../../hooks';
import { getLabel } from '../../helpers';
import Storage from './storage';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

// TODO: loading state

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

  return (
    <div className="group size-full overflow-hidden bg-black">
      <BackButton
        className="fixed top-4 left-4 z-10 opacity-0 transition-[color,opacity] group-hover:opacity-100"
        to={`/${type}/${id}${episodeId ? `/${episodeId}` : ''}/watch`}
      >
        <ArrowLeftIcon className="size-6 [&>path]:stroke-2" />
      </BackButton>

      {!isLoading && src ? (
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
      ) : null}
    </div>
  );
}
