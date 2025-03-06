export type Settings = {
  catalog: {
    url: string;
    name: string;
  };
  meta: {
    url: string;
    name: string;
  };
  streams: {
    url: string;
    name: string;
  };
  subtitles: {
    url: string;
    name: string;
  };
  streaming: {
    url: string;
    // TODO
  };
  language: string;
};

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
  director: string[] | null;
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
    name?: string;
    title?: string;
    description?: string;
    overview?: string;
    thumbnail: string;
    released: string;
  }[];
};

export type Meta = MetaMovie | MetaSeries;

type BaseItem = Pick<Meta, 'id' | 'runtime'> & {
  title: string;
  synopsis: string;
  logoUrl: string;
  posterUrl: string;
  backgroundUrl: string;
  release: string;
  rating: string | null;
  genres: string[];
  directors: string[];
  casts: string[];
};

export type ItemMovie = BaseItem & {
  type: 'movie';
};
export type ItemSeries = BaseItem & {
  type: 'series';
  items: (Pick<MetaSeries['videos'][number], 'id' | 'season' | 'episode' | 'released'> & {
    title: string;
    synopsis: string;
    thumbnailUrl: string;
  })[];
};

export type Item = ItemMovie | ItemSeries;
