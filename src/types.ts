export type Meta = {
  id: string;
  type: 'movie' | 'series';
  name: string;
  releaseInfo: string;
  logo: string;
  poster: string;
  background: string;
};

export type Item = {
  id: string;
  logoUrl: string;
  posterUrl: string;
  backgroundUrl: string;
  name: string;
  release: string;
};
