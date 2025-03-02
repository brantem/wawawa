import { useParams } from 'react-router';
import useSWR from 'swr';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';

import * as constants from 'constants';
import { useItem } from 'lib/hooks';
import * as media from 'lib/media';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

// TODO: support external subtitles

export default function Player() {
  const title = useTitle();
  const { src } = useStream();

  return (
    <div className="size-full overflow-hidden bg-black">
      {src ? (
        <MediaPlayer title={title} src={{ src, type: 'video/mp4' }} streamType="on-demand" autoPlay>
          <MediaProvider />
          <DefaultVideoLayout icons={defaultLayoutIcons} download={false} />
        </MediaPlayer>
      ) : null}
    </div>
  );
}

function useTitle() {
  const { episodeId } = useParams() as { episodeId: string };

  const { item: parent } = useItem();
  if (!parent) return '';
  if (parent.type === 'movie') return parent.title;

  const item = parent.items.find((parent) => parent.id === episodeId);
  if (!item) return parent.title;
  if (item.season === 0) return `${parent.title} - ${item.title}`;

  return `${parent.title} - S${item.season}:E${item.episode} "${item.title}"`;
}

const HLSV2_BASE_URL = `${constants.STREAMING_SERVER_BASE_URL}/hlsv2`;

function useStream() {
  type Probe = {
    format: {
      name: string;
    };
    streams: (
      | {
          id: number;
          track: 'video';
          codec: string;
        }
      | {
          id: number;
          track: 'audio';
          channels: number;
          codec: string;
        }
      | {
          id: number;
          track: 'subtitle';
          codec: string;
        }
    )[];
  };

  const { '*': streamId } = useParams() as { '*': string };

  const { data, isLoading } = useSWR(atob(decodeURIComponent(streamId)), async (streamId) => {
    // TODO: support magnet link

    if (/^https?:\/\//.test(streamId)) return streamId;

    const mediaUrl = `${constants.STREAMING_SERVER_BASE_URL}/${streamId}`;
    const res = await fetch(`${HLSV2_BASE_URL}/probe?mediaURL=${encodeURI(mediaUrl)}`);
    const probe: Probe = await res.json();

    const capabilities = media.getCapabilities();
    const isFormatSupported = capabilities.formats.some((format) => probe.format.name.includes(format));
    const areStreamsSupported = probe.streams.every((stream) => {
      if (stream.track === 'audio') {
        return stream.channels <= capabilities.maxAudioChannels && capabilities.audioCodecs.includes(stream.codec);
      } else if (stream.track === 'video') {
        return capabilities.videoCodecs.includes(stream.codec);
      }
      return true;
    });

    if (isFormatSupported && areStreamsSupported) return mediaUrl; // non HLS
    return `${HLSV2_BASE_URL}/${crypto.randomUUID()}/master.m3u8?mediaURL=${encodeURI(mediaUrl)}`; // HLS
  });

  return { src: data, isLoading };
}
