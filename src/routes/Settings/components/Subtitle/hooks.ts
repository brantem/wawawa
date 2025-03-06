import { createWithEqualityFn as create } from 'zustand/traditional';

import * as constants from 'constants/settings';

const PREFIX = 'vds-player';

type SubtitleState = typeof constants.SUBTITLE & {
  set(name: keyof typeof constants.SUBTITLE, value: string): void;
};

export const useSubtitle = create<SubtitleState>()((set) => ({
  ...Object.keys(constants.SUBTITLE).reduce(
    (subtitle, key) => ({
      ...subtitle,
      [key]: localStorage.getItem(`${PREFIX}:${key}`) || constants.SUBTITLE[key as keyof typeof constants.SUBTITLE],
    }),
    {} as typeof constants.SUBTITLE,
  ),
  set(name, value) {
    set({ [name]: value });
    const key = `${PREFIX}:${name}`;
    if (value === constants.SUBTITLE[name]) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  },
}));
