import { ServerIcon } from '@heroicons/react/24/solid';
import pick from 'just-pick';

import Field from './Field';
import URLField from './URLField';
import Select from 'components/Select';

import * as constants from 'constants/settings';
import { useSettings, useStreamingServer } from 'lib/hooks';
import { cn } from 'lib/helpers';

export default function Streaming() {
  const settings = useSettings();
  const server = useStreamingServer();

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 md:h-8">
          <ServerIcon className="size-6" />
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <span>Streaming</span>
            <div className="flex items-center gap-1">
              <div
                className={cn(
                  'size-2 rounded-full border',
                  !server.isLoading && !server.isRevalidating
                    ? server.isOnline
                      ? 'border-green-400 bg-green-500'
                      : 'border-red-400 bg-red-500'
                    : 'animate-pulse border-neutral-400 bg-neutral-500',
                )}
              />
              {!server.isLoading && !server.isRevalidating ? (
                server.settings ? (
                  <span className="text-neutral-500">{server.settings.values['serverVersion']}</span>
                ) : (
                  <span className="text-sm font-medium text-neutral-500">Offline</span>
                )
              ) : null}
            </div>
          </h2>
        </div>

        {!server.isLoading && !server.isOnline && (
          <a
            href="https://www.stremio.com/download-service"
            rel="noopener noreferrer"
            target="_blank"
            className="rounded-full border border-neutral-800 bg-neutral-900 px-4 py-1 text-sm font-medium hover:border-neutral-700 hover:bg-neutral-800"
          >
            Install
          </a>
        )}
      </div>

      <div className="flex flex-col gap-4 md:pl-9">
        <URLField
          label="Server URL"
          value={settings.streaming.url}
          onChange={async (value) => {
            settings.set('streaming', value);
            if (settings.streaming.url !== value) server.revalidate();
          }}
        />

        <Field label="Cache Size">
          <Select
            className="min-w-56"
            value={server.settings?.values['cacheSize']}
            onChange={(e) => {
              let cacheSize;
              if (e.target.value === 'null') {
                cacheSize = null;
              } else {
                cacheSize = parseInt(e.target.value);
              }
              server.update({ cacheSize });
            }}
            disabled={server.isLoading || !server.isOnline}
          >
            {server.settings ? (
              server.settings.options
                .find((option) => option.id === 'cacheSize')!
                .selections.map((selection) => (
                  <option key={selection.val} value={selection.val === null ? 'null' : selection.val.toString()}>
                    {getDisplayText(selection.name)}
                  </option>
                ))
            ) : (
              <option>2 GB</option>
            )}
          </Select>
        </Field>

        <TorrentProfile />

        <Field label="Transcode Profile">
          <Select
            className="min-w-56"
            value={server.settings?.values['transcodeProfile'] ?? ''}
            onChange={(e) => server.update({ transcodeProfile: e.target.value === 'null' ? null : e.target.value })}
            disabled={server.isLoading || !server.isOnline}
          >
            <option value="null">Disabled</option>
            {server.deviceInfo?.availableHardwareAccelerations.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </div>
  );
}

function getDisplayText(s: string) {
  switch (s) {
    case 'no caching':
      return 'No Caching';
    case '∞':
      return 'Unlimited';
    default:
      if (s.endsWith('GB')) return s.replace('GB', ' GB');
      return s;
  }
}

function TorrentProfile() {
  const server = useStreamingServer();
  const values = server.settings?.values || {};

  const profile = pick(values, [
    'btMaxConnections',
    'btHandshakeTimeout',
    'btRequestTimeout',
    'btDownloadSpeedSoftLimit',
    'btDownloadSpeedHardLimit',
    'btMinPeersForStable',
  ]);

  const value = (() => {
    const keys = Object.keys(profile) as (keyof typeof profile)[];
    if (!keys.length) return null;

    const option = constants.STREAMING_PROFILE.find((option) => keys.every((key) => option[0][key] === profile[key]));
    if (!option) return 'Custom';

    return option[1];
  })();

  return (
    <Field label="Torrent Profile">
      <Select
        className="w-full md:w-56"
        value={value || ''}
        onChange={(e) => {
          if (e.target.value === 'Custom') {
            server.update(profile);
          } else {
            server.update(constants.STREAMING_PROFILE.find((option) => option[1] === e.target.value)![0]);
          }
        }}
        disabled={server.isLoading || !server.isOnline}
      >
        {constants.STREAMING_PROFILE.map(([_, label]) => (
          <option key={label} value={label}>
            {label}
          </option>
        ))}
        {value === 'Custom' ? <option value="Custom">Custom</option> : null}
      </Select>
    </Field>
  );
}
