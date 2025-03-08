// https://github.com/Stremio/stremio-web/blob/23819cc1339a0afa61f5768255b9a18cb37af199/src/routes/Settings/useStreamingServerSettingsInputs.js#L20-L53
export const STREAMING_PROFILE = [
  [
    {
      btDownloadSpeedHardLimit: 3670016,
      btDownloadSpeedSoftLimit: 2621440,
      btHandshakeTimeout: 20000,
      btMaxConnections: 55,
      btMinPeersForStable: 5,
      btRequestTimeout: 4000,
    },
    'Default',
  ],
  [
    {
      btDownloadSpeedHardLimit: 1677721.6,
      btDownloadSpeedSoftLimit: 1677721.6,
      btHandshakeTimeout: 20000,
      btMaxConnections: 35,
      btMinPeersForStable: 5,
      btRequestTimeout: 4000,
    },
    'Soft',
  ],
  [
    {
      btDownloadSpeedHardLimit: 39321600,
      btDownloadSpeedSoftLimit: 4194304,
      btHandshakeTimeout: 20000,
      btMaxConnections: 200,
      btMinPeersForStable: 10,
      btRequestTimeout: 4000,
    },
    'Fast',
  ],
  [
    {
      btDownloadSpeedHardLimit: 78643200,
      btDownloadSpeedSoftLimit: 8388608,
      btHandshakeTimeout: 25000,
      btMaxConnections: 400,
      btMinPeersForStable: 10,
      btRequestTimeout: 6000,
    },
    'Ultra Fast',
  ],
] as const;

// https://github.com/Stremio/stremio-web/blob/45f8afea91752c2691bfa8c6404c448422326455/src/common/CONSTANTS.js#L54-L105
export const EXTERNAL_PLAYER = [
  {
    label: 'Always Ask',
    value: 'choose',
    platforms: ['android'],
  },
  {
    label: 'VLC',
    value: 'vlc',
    platforms: ['ios', 'visionos', 'android'],
  },
  {
    label: 'MPV',
    value: 'mpv',
    platforms: ['macos'],
  },
  {
    label: 'IINA',
    value: 'iina',
    platforms: ['macos'],
  },
  {
    label: 'MX Player',
    value: 'mxplayer',
    platforms: ['android'],
  },
  {
    label: 'Just Player',
    value: 'justplayer',
    platforms: ['android'],
  },
  {
    label: 'Outplayer',
    value: 'outplayer',
    platforms: ['ios', 'visionos'],
  },
  {
    label: 'Moonplayer (VisionOS)',
    value: 'moonplayer',
    platforms: ['visionos'],
  },
  {
    label: 'M3U Playlist',
    value: 'm3u',
    platforms: ['ios', 'visionos', 'android', 'windows', 'linux', 'macos'],
  },
];

// https://github.com/vidstack/player/blob/d89a19dc83fc4143a6afe40dddbbf0d3f8644aa2/packages/vidstack/src/core/font/font-options.ts#L46-L56
export const SUBTITLE = {
  'font-family': 'pro-sans',
  'font-size': '100%',
  'text-color': '#ffffff',
  'text-shadow': 'none',
  'text-opacity': '100%',
  'text-bg': '#000000',
  'text-bg-opacity': '100%',
  'display-bg': '#000000',
  'display-bg-opacity': '0%',
};

// https://github.com/vidstack/player/blob/d89a19dc83fc4143a6afe40dddbbf0d3f8644aa2/packages/vidstack/src/core/font/font-options.ts#L13-L19
export const SUBTITLE_FONT_FAMILY = [
  ['mono-serif', 'Monospaced Serif'],
  ['pro-serif', 'Proportional Serif'],
  ['mono-sans', 'Monospaced Sans-Serif'],
  ['pro-sans', 'Proportional Sans-Serif'],
  ['casual', 'Casual'],
  ['cursive', 'Cursive'],
  ['capitals', 'Small Capitals'],
] as const;

// https://github.com/vidstack/player/blob/d89a19dc83fc4143a6afe40dddbbf0d3f8644aa2/packages/vidstack/src/core/font/font-options.ts#L23-L30
export const SUBTITLE_FONT_SIZE = {
  min: 0,
  max: 400,
  step: 5, // the original value is 25
} as const;

// https://github.com/vidstack/player/blob/d89a19dc83fc4143a6afe40dddbbf0d3f8644aa2/packages/vidstack/src/core/font/font-options.ts#L41-L44
export const SUBTITLE_TEXT_SHADOW = ['None', 'Drop Shadow', 'Raised', 'Depressed', 'Outline'] as const;

// https://github.com/vidstack/player/blob/d89a19dc83fc4143a6afe40dddbbf0d3f8644aa2/packages/vidstack/src/core/font/font-options.ts#L32-L39
export const SUBTITLE_OPACITY = {
  min: 0,
  max: 100,
  step: 5,
} as const;
