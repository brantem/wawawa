type BaseMeta = {
  id: string;
  name: string;
  description: string;
  releaseInfo: string;
  runtime: string;
  logo: string;
  poster: string;
  background: string;
  imdbRating?: string;
  genres: string[];
  director: string | null;
  cast: string[];
};

export type MetaMovie = BaseMeta & {
  type: 'movie';
};
export type MetaSeries = BaseMeta & {
  type: 'series';
  videos: {
    id: string;
    season: number;
    episode: number;
    name: string;
    description: string;
    thumbnail: string;
  }[];
};

export type Meta = MetaMovie | MetaSeries;

type BaseItem = Pick<Meta, 'id' | 'name' | 'description' | 'runtime' | 'genres' | 'director' | 'cast'> & {
  logoUrl: string;
  posterUrl: string;
  backgroundUrl: string;
  release: string;
  rating: string | null;
};

export type ItemMovie = BaseItem & {
  type: 'movie';
};
export type ItemSeries = BaseItem & {
  type: 'series';
  items: (Pick<MetaSeries['videos'][number], 'id' | 'season' | 'episode' | 'name' | 'description'> & {
    thumbnailUrl: string;
  })[];
};

export type Item = ItemMovie | ItemSeries;
