export type Stream = {
  id: string;
  url: string;
  volume: number;
  muted: boolean;
  time: number | null;
  duration: number | null;
  lang: string | null;
  captions: boolean;
  rate: number;
  watchedAt: number;
};

export type Schema = {
  streams: {
    key: string;
    value: Stream;
  };
};
