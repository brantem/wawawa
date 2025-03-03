import { MediaPlayer, MediaProvider, Track } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

import { useTitle, useStream, useSubtitles } from '../hooks';
import { getLabel } from '../helpers';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

// TODO: loading state

export default function Player() {
  const title = useTitle();
  const { src } = useStream();
  const { subtitles } = useSubtitles();

  return (
    <div className="size-full overflow-hidden bg-black">
      {src ? (
        <MediaPlayer
          title={title}
          src={{ src, type: 'video/mp4' }}
          streamType="on-demand"
          autoPlay
          onTimeUpdate={(e) => console.log(e.currentTime)}
        >
          <MediaProvider>
            {subtitles.map(({ id, url, ...subtitle }) => (
              <Track id={id} key={id} src={url} kind="subtitles" label={getLabel(subtitle.lang)} {...subtitle} />
            ))}
          </MediaProvider>
          <DefaultVideoLayout icons={defaultLayoutIcons} download={false} />
        </MediaPlayer>
      ) : null}
    </div>
  );
}
