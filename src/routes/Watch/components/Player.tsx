import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import { MediaPlayer, MediaProvider, Track } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import langs from 'langs';

import { Subtitle } from '../types';
import * as constants from 'constants';
import { useItem } from 'lib/hooks';
import { useStreams } from '../hooks';
import * as media from 'lib/media';

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

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

function getLabel(lang: string) {
  return (langs.where('2', lang) || langs.where('2T', lang) || langs.where('2B', lang))?.name || lang;
}

function useTitle() {
  const { episodeId } = useParams();

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

  const { '*': rawStreamId } = useParams();
  const streamId = atob(decodeURIComponent(rawStreamId!));

  const { data, isLoading } = useSWR(`/stream/${rawStreamId}`, async () => {
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

async function fetchOpensubHash(streamId: string): Promise<{ size: number; hash: string }> {
  let videoUrl;
  if (/^https?:\/\//.test(streamId)) {
    videoUrl = streamId;
  } else {
    videoUrl = `${constants.STREAMING_SERVER_BASE_URL}/${streamId}`;
  }

  const res = await fetch(`${constants.STREAMING_SERVER_BASE_URL}/opensubHash?videoUrl=${encodeURI(videoUrl)}`);
  const a = (await res.json()).result;
  return a;
}

function useSubtitles() {
  type Raw = {
    id: string;
    url: string;
    SubEncoding: string;
    lang: string;
  };

  const { type, id, episodeId, '*': rawStreamId } = useParams();
  const _episodeId = episodeId ? `:${episodeId}` : '';

  const streamId = decodeURIComponent(rawStreamId!);
  const stream = useStreams().streams.find((stream) => stream.id === streamId)!;

  const [subtitles, setSubtitles] = useState<Subtitle[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stream || subtitles !== null || isLoading) return;
    (async () => {
      setIsLoading(true);
      const { size, hash } = await fetchOpensubHash(atob(streamId));

      const searchParams = new URLSearchParams();
      searchParams.set('filename', stream.filename);
      searchParams.set('videoSize', size.toString());
      searchParams.set('videoHash', hash);

      const baseUrl = `${constants.OPENSUBTITLES_BASE_URL}/subtitles/${type}/${id}${_episodeId}`;
      const res = await fetch(`${baseUrl}/${searchParams.toString()}.json`);

      const raw: Raw[] = (await res.json())?.subtitles || [];

      let foundDefault = false;
      setSubtitles(
        raw.map((raw) => {
          const subtitle = {
            id: raw.id,
            url: `${constants.STREAMING_SERVER_BASE_URL}/subtitles.vtt?from=${raw.url}`,
            encoding: raw.SubEncoding.toLowerCase(),
            lang: raw.lang, // ISO 639-2
            default: false,
          };

          // TODO: customizeable default
          if (!foundDefault && subtitle.lang === 'eng') {
            foundDefault = true;
            subtitle.default = true;
          }

          return subtitle;
        }),
      );
      setIsLoading(false);
    })();
  }, [stream]);

  return {
    subtitles: subtitles || [],
    isLoading,
  };
}
