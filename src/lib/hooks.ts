import { useState, useEffect, useLayoutEffect } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useParams } from 'react-router';
import pick from 'just-pick';
import { useStoreWithEqualityFn } from 'zustand/traditional';

import type { Meta } from 'types';
import { fetcher, metaToItem } from 'lib/helpers';
import settings, { type SettingsState } from 'lib/settings';

export function useSettings<U = SettingsState>(selector: (state: SettingsState) => U = (state) => state as U) {
  return useStoreWithEqualityFn(settings, selector);
}

export function useDebounce<T extends any>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useWindowSize() {
  const [size, setSize] = useState<{ width: number | null; height: number | null }>({ width: null, height: null });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>();

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    const handleChange = () => {
      setMatches(window.matchMedia(query).matches);
    };
    handleChange();

    matchMedia.addEventListener('change', handleChange);
    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
};

export function useCurrentBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl' | undefined>(undefined);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia(breakpoints.xl).matches) return setBreakpoint('xl');
      if (window.matchMedia(breakpoints.lg).matches) return setBreakpoint('lg');
      if (window.matchMedia(breakpoints.md).matches) return setBreakpoint('md');
      if (window.matchMedia(breakpoints.sm).matches) return setBreakpoint('sm');
      setBreakpoint(undefined);
    };
    update();

    const queries = Object.values(breakpoints).map((v) => window.matchMedia(v));
    const listeners = queries.map((q) => {
      const handleChange = () => update();
      q.addEventListener('change', handleChange);
      return () => q.removeEventListener('change', handleChange);
    });

    return () => {
      listeners.forEach((cleanup) => cleanup());
    };
  }, []);

  return breakpoint;
}

export function useStreamingServer() {
  type Settings = {
    options: (
      | {
          id: 'localAddonEnabled';
        }
      | {
          id: 'remoteHttps';
          selections: {
            name: string;
            val: string;
          }[];
        }
      | {
          id: 'cacheSize';
          selections: {
            name: string;
            val: string;
          }[];
        }
    )[];
    values: Record<string, any>;
  };

  type DeviceInfo = {
    availableHardwareAccelerations: string[];
  };

  type NetworkInfo = {
    availableInterfaces: string[];
  };

  const streamingUrl = useSettings((state) => state.streaming.url);

  const { data, isLoading, mutate, isValidating } = useSWR(
    streamingUrl,
    async () => {
      const [settings, deviceInfo, networkInfo] = await Promise.all([
        fetcher<Settings>(`${streamingUrl}/settings`),
        fetcher<DeviceInfo>(`${streamingUrl}/device-info`),
        fetcher<NetworkInfo>(`${streamingUrl}/network-info`),
      ]);
      return { settings, deviceInfo, networkInfo };
    },
    { revalidateIfStale: true },
  );
  const { trigger, isMutating } = useSWRMutation(streamingUrl, async (_, { arg }: { arg: Record<string, any> }) => {
    try {
      const res = await fetch(`${streamingUrl}/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pick(data!.settings!.values || {}, [
            'cacheSize',
            'btMaxConnections',
            'btHandshakeTimeout',
            'btRequestTimeout',
            'btDownloadSpeedSoftLimit',
            'btDownloadSpeedHardLimit',
            'btMinPeersForStable',
            'remoteHttps',
            'proxyStreamsEnabled',
            'transcodeProfile',
          ]),
          ...arg,
        }),
      });
      if (!res.ok) return Promise.reject();
      if (!(await res.json())?.success) return Promise.reject();
    } catch {
      return Promise.reject();
    }
  });

  const settings = data?.settings || null;
  return {
    settings,
    deviceInfo: data?.deviceInfo || null,
    networkInfo: data?.networkInfo || null,
    isOnline: !!settings,
    isLoading,

    revalidate() {
      mutate();
    },
    isRevalidating: isValidating,

    async update(values: Record<string, any>) {
      trigger(values, {
        optimisticData(data: any) {
          return {
            ...data,
            settings: {
              ...data.settings,
              values: {
                ...data.settings.values,
                ...values,
              },
            },
          };
        },
      });
    },
    isUpdating: isMutating,
  };
}

export function useItem() {
  const params = useParams();

  const settings = useSettings();

  const url = `${settings.meta.url}/meta/${params.type}/${params.id}.json`;
  const { data, isLoading } = useSWR<{ meta: Meta } | null>(url, fetcher);

  return {
    item: data ? metaToItem(data.meta) : null,
    isLoading,
  };
}
