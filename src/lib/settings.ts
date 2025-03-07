import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import pick from 'just-pick';

import type { Settings } from 'types';
import * as constants from 'constants';
import { fetcher } from 'lib/helpers';

export type SettingsState = Settings & {
  set(name: Exclude<keyof Settings, 'options' | 'language'>, url: string): Promise<void> | void;

  setLanguage(language: string): void;
};

export default createStore<SettingsState>()(
  persist(
    (set, get) => ({
      options: {
        catalog: [constants.CATALOG],
        meta: [constants.META],
        stream: [constants.STREAM],
        subtitles: [constants.SUBTITLES],
      },
      catalog: constants.CATALOG,
      meta: constants.META,
      stream: constants.STREAM,
      subtitles: constants.SUBTITLES,
      streaming: {
        url: constants.STREAMING_URL,
      },
      async set(name, url) {
        if (url === get()[name].url) return;
        if (name === 'streaming') return set({ streaming: { url } });

        let option = get().options[name].find((option) => option.url === url);
        if (option) return set({ [name]: option });

        type Manifest = {
          name: string;
          version: string;
          resources: (string | { name: string })[];
        };

        const manifest = await fetcher<Manifest>(`${url}/manifest.json`);
        if (!manifest) throw new Error('MISSING_MANIFEST');

        const isValid = manifest.resources.some((res) => (typeof res === 'string' ? res : res.name) === name);
        if (!isValid) throw new Error('INVALID');

        option = { url, ...pick(manifest, ['name']) };
        set((prev) => ({
          options: {
            ...prev.options,
            [name]: [...prev.options[name], option],
          },
          [name]: option,
        }));
      },

      language: 'eng',
      setLanguage(language) {
        set({ language });
      },
    }),
    {
      name: 'settings',
    },
  ),
);
