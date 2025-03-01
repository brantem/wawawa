import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

export default function Player() {
  return (
    <div className="size-full overflow-hidden">
      <MediaPlayer
        title="Sprite Fight"
        // non HLS
        src={{
          src: 'https://files.vidstack.io/sprite-fight/720p.mp4',
          type: 'video/mp4',
        }}
        // HLS
        // src="https://files.vidstack.io/sprite-fight/hls/stream.m3u8"
        streamType="on-demand"
        autoPlay
      >
        <MediaProvider />
        <DefaultVideoLayout icons={defaultLayoutIcons} download={false} />
      </MediaPlayer>
    </div>
  );
}
