import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import pick from 'just-pick';

import type { Subtitle } from './types';
import * as media from 'lib/media';
import { useSettings, useStreamingServer, useItem } from 'lib/hooks';
import { fetcher, getStreamProgress, generateItemPathFromParams, generateItemIdFromParams } from 'lib/helpers';
import storage from 'lib/storage';
import { getLabel } from './helpers';

export function useTitle() {
  const params = useParams();

  const { item: parent } = useItem();
  if (!parent) return '';
  if (parent.type === 'movie') return parent.title;

  const item = parent.items.find((parent) => parent.id === params.episodeId);
  if (!item) return parent.title;
  if (item.season === 0) return `${parent.title} - ${item.title}`;

  return `${parent.title} - S${item.season}:E${item.episode} "${item.title}"`;
}

export function useStreams() {
  type Raw = {
    name: string;
    title: string;
  } & (
    | {
        infoHash: string;
        fileIdx: string;
        behaviorHints: {
          filename: string;
        };
      }
    | {
        url: string;
      }
  );

  const params = useParams();

  const settings = useSettings();

  const url = `${settings.stream.url}/stream/${params.type}/${generateItemIdFromParams(params)}.json`;
  const { data, isLoading } = useSWR<{ streams: Raw[] } | null>(url, fetcher);

  const groups = new Set<string>();
  const streams = (data?.streams || []).map((stream) => {
    const group = stream.name.replace(/Torrentio\n/, '');
    groups.add(group);

    const [title, info] = stream.title.split('\n👤');
    const [, seeders, size, origin] = info.split('\n')[0].match(/^ (\d+) 💾 (.+) ⚙️ (.+)$/)!;

    let filename;
    if ('url' in stream) {
      filename = stream.url.split('/').pop()!;
    } else {
      filename = stream.behaviorHints.filename;
    }

    return {
      id: btoa('url' in stream ? stream.url : `${stream.infoHash}/${stream.fileIdx}`),
      group,
      title: title.replace('\n', ' '),
      filename,
      seeders,
      size,
      origin,
    };
  });

  return {
    groups: Array.from(groups),
    streams,
    isLoading,
  };
}

export function useSelectedStream() {
  const params = useParams();

  const { data, isLoading } = useSWR(
    `${generateItemPathFromParams(params)}:selected-stream`,
    async () => {
      const data = await storage.get('streams', generateItemIdFromParams(params));
      if (!data) return null;

      return {
        id: decodeURIComponent(data.url.split('/').pop()!),
        progress: getStreamProgress(data),
      };
    },
    { revalidateIfStale: true },
  );

  return { selected: data, isLoading };
}

export function useVideo() {
  type Probe = {
    format: {
      name: string;
      duration: number;
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

  const params = useParams();

  const settings = useSettings();

  const { data, isLoading } = useSWR(`${generateItemPathFromParams(params)}:streams:${params.streamId}`, async () => {
    // TODO: support magnet link
    let src = atob(decodeURIComponent(params.streamId!));
    if (/^https?:\/\//.test(src)) return { raw: null, src, duration: null };

    src = `${settings.streaming.url}/${src}`;

    const probe = await fetcher<Probe>(`${settings.streaming.url}/hlsv2/probe?mediaURL=${encodeURIComponent(src)}`);
    if (!probe) return { raw: null, src: null, duration: null };

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

    if (isFormatSupported && areStreamsSupported) {
      src = `${settings.streaming.url}/hlsv2/${crypto.randomUUID()}/master.m3u8?mediaURL=${encodeURIComponent(src)}`; // HLS
    }

    return { raw: probe, src, duration: probe.format.duration || null };
  });

  return { ...data!, isLoading };
}

async function fetchOpensubHash(streamingServerUrl: string, streamId: string): Promise<{ size: number; hash: string }> {
  let videoUrl;
  if (/^https?:\/\//.test(streamId)) {
    videoUrl = streamId;
  } else {
    videoUrl = `${streamingServerUrl}/${streamId}`;
  }

  const res = await fetcher(`${streamingServerUrl}/opensubHash?videoUrl=${encodeURIComponent(videoUrl)}`);
  return res?.result || { size: 0, hash: '' };
}

export function useSubtitles() {
  type Raw = {
    id: string;
    url: string;
    SubEncoding: string;
    lang: string; // ISO 639-2
  };

  const params = useParams();
  const streamId = decodeURIComponent(params.streamId!);

  const settings = useSettings();
  const server = useStreamingServer();

  const stream = useStreams().streams.find((stream) => stream.id === streamId)!;

  const [subtitles, setSubtitles] = useState<Subtitle[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stream || subtitles !== null || isLoading) return;
    (async () => {
      setIsLoading(true);
      const { size, hash } = server.isOnline
        ? await fetchOpensubHash(settings.streaming.url, atob(streamId))
        : { size: 0, hash: '' };

      const searchParams = new URLSearchParams();
      searchParams.set('filename', stream.filename);
      if (size) searchParams.set('videoSize', size.toString());
      if (hash) searchParams.set('videoHash', hash);

      const url = `${settings.subtitles.url}/subtitles/${params.type}/${generateItemIdFromParams(params)}/${searchParams.toString()}.json`;
      const { subtitles: raw } = (await fetcher<{ subtitles: Raw[] }>(url)) || { subtitles: [] };

      let m: Record<string, number> = {};
      setSubtitles(
        raw
          .map((raw) => {
            m[raw.lang] = (m[raw.lang] || 0) + 1;
            return {
              ...pick(raw, ['id', 'url', 'lang']),
              encoding: raw.SubEncoding.toLowerCase(),
              label: `${getLabel(raw.lang)} ${m[raw.lang]}`,
            };
          })
          .sort((a, b) => a.label.localeCompare(b.label)),
      );
      setIsLoading(false);
    })();
  }, [stream]);

  return {
    subtitles: subtitles || [],
    isLoading,
  };
}
