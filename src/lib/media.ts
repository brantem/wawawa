// based on: https://github.com/Stremio/stremio-video/blob/67cb5e84bb4c17f8414cde9a355698d98967dc67/src/mediaCapabilities.js

type Config = {
  codec: string;
  force?: boolean;
  mime: string;
  aliases?: string[];
};

const VIDEO_CODEC_CONFIGS: Config[] = [
  {
    codec: 'h264',
    force: Boolean(window.chrome || window.cast),
    mime: 'video/mp4; codecs="avc1.42E01E"',
  },
  {
    codec: 'h265',
    // Disabled because chrome only has partial support for h265/hvec,
    // force: Boolean(window.chrome || window.cast),
    mime: 'video/mp4; codecs="hev1.1.6.L150.B0"',
    aliases: ['hevc'],
  },
  {
    codec: 'vp8',
    mime: 'video/mp4; codecs="vp8"',
  },
  {
    codec: 'vp9',
    mime: 'video/mp4; codecs="vp9"',
  },
];

const AUDIO_CODEC_CONFIGS: Config[] = [
  {
    codec: 'aac',
    mime: 'audio/mp4; codecs="mp4a.40.2"',
  },
  {
    codec: 'mp3',
    mime: 'audio/mp4; codecs="mp3"',
  },
  {
    codec: 'ac3',
    mime: 'audio/mp4; codecs="ac-3"',
  },
  {
    codec: 'eac3',
    mime: 'audio/mp4; codecs="ec-3"',
  },
  {
    codec: 'vorbis',
    mime: 'audio/mp4; codecs="vorbis"',
  },
  {
    codec: 'opus',
    mime: 'audio/mp4; codecs="opus"',
  },
];

function canPlay(config: Config, video: HTMLVideoElement) {
  return config.force || video.canPlayType(config.mime) ? [config.codec].concat(config.aliases || []) : [];
}

function getMaxAudioChannels() {
  if (/firefox/i.test(window.navigator.userAgent)) return 6;
  if (!window.AudioContext || window.chrome || window.cast) return 2;

  const maxChannelCount = new AudioContext().destination.maxChannelCount;
  return maxChannelCount > 0 ? maxChannelCount : 2;
}

export function getCapabilities() {
  const video = document.createElement('video');

  const formats = ['mp4'];
  if (window.chrome || window.cast) formats.push('matroska,webm');

  return {
    formats,
    videoCodecs: VIDEO_CODEC_CONFIGS.reduce((codecs, config) => [...codecs, ...canPlay(config, video)], [] as string[]),
    audioCodecs: AUDIO_CODEC_CONFIGS.reduce((codecs, config) => [...codecs, ...canPlay(config, video)], [] as string[]),
    maxAudioChannels: getMaxAudioChannels(),
  };
}
