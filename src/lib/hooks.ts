import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useParams } from 'react-router';

import * as constants from 'constants';
import { metaToItem } from 'lib/helpers';

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

export function useItem() {
  const { type, id } = useParams();

  const { data, isLoading } = useSWR(`/${type}/${id}`, async () => {
    try {
      const res = await fetch(`${constants.CINEMETA_BASE_URL}/meta/${type}/${id}.json`);
      if (!res.ok) return null;

      return metaToItem((await res.json())?.meta);
    } catch (err) {
      console.error(err);
      return null;
    }
  });

  return {
    item: data || null,
    isLoading,
  };
}
