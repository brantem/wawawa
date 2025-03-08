import { CircleStackIcon } from '@heroicons/react/24/solid';

import Field from './Field';
import Select from 'components/Select';

import * as constants from 'constants/settings';
import { useDevice, useSettings } from 'lib/hooks';

export default function Resources() {
  const device = useDevice();
  const settings = useSettings();

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex items-center gap-3 md:h-8">
        <CircleStackIcon className="size-6" />
        <h2 className="flex items-center gap-2 text-lg font-semibold">Player</h2>
      </div>

      <div className="flex flex-col gap-4 md:pl-9">
        <Field label="External">
          <Select
            className="w-full md:w-56"
            value={settings.externalPlayer || ''}
            onChange={(e) => {
              let externalPlayer: string | null = e.target.value;
              if (!externalPlayer) externalPlayer = null;
              settings.setExternalPlayer(externalPlayer);
            }}
          >
            <option value="">Disabled</option>
            {constants.EXTERNAL_PLAYER.map((option) => {
              if (!option.platforms.includes(device.name)) return;
              return (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </Select>
        </Field>
      </div>
    </div>
  );
}
