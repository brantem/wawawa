import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import pick from 'just-pick';

import type { Settings } from 'types';
import * as constants from 'constants';
import { fetcher } from 'lib/helpers';

export type SettingsState = Settings & {
  set(name: Extract<keyof Settings, 'language'>, value: string): void;
  setUrl(name: Exclude<keyof Settings, 'language'>, url: string): Promise<void> | void;
};

export default createStore<SettingsState>()(
  persist(
    (set, get) => ({
      catalog: constants.CATALOG,
      meta: constants.META,
      stream: constants.STREAM,
      subtitles: constants.SUBTITLES,
      streaming: {
        url: constants.STREAMING_URL,
      },
      language: 'eng',
      set(name, value) {
        set({ [name]: value });
      },
      async setUrl(name, url) {
        if (url === get()[name].url) return;
        if (name === 'streaming') return set({ streaming: { url } });

        type Manifest = {
          name: string;
          version: string;
          resources: (string | { name: string })[];
        };

        const manifest = await fetcher<Manifest>(`${url}/manifest.json`);
        if (!manifest) throw new Error('MISSING_MANIFEST');

        const isValid = manifest.resources.some((res) => (typeof res === 'string' ? res : res.name) === name);
        if (!isValid) throw new Error('INVALID');

        set({ [name]: { url, ...pick(manifest, ['name']) } });
      },
    }),
    {
      name: 'settings',
    },
  ),
);
