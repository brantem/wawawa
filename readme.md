### Search

```ts
const search = 'something';
const moviesUrl = `https://v3-cinemeta.strem.io/catalog/movie/top/search=${something}.json`;
const seriesUrl = `https://v3-cinemeta.strem.io/catalog/series/top/search=${something}.json`;
```

### List

```ts
const baseUrl = 'https://torrentio.strem.fun/qualityfilter=threed,4k,scr,cam';

// Movie
const movieId = 'tt0272152';
const url = `${baseUrl}/stream/movie/${movieId}.json`;

// Series
const seriesId = 'tt5691552';
const season = 2;
const episode = 9;
const seriesUrl = `${baseUrl}/stream/series/${encodeURIComponent(`${seriesId}:${season}:${episode}.json`)}.json`;
```

Example output:

```json
{
  "streams": [
    {
      "name": "Torrentio\n720p",
      "title": "K-PAX 2001 720p BluRay\n👤 16 💾 1.08 GB ⚙️ YTS",
      "infoHash": "278330bc07bc5448156a6319f3be9ead643aecf2",
      "fileIdx": 0,
      "behaviorHints": {
        "bingeGroup": "torrentio|720p|BluRay|x264",
        "filename": "K-PAX.2001.720p.BluRay.x264.AAC-[YTS.MX].mp4"
      }
    }
  ]
}
```

### Details

```ts
const baseUrl = 'https://v3-cinemeta.strem.io/meta';

// Movie
const movieId = 'tt0272152';
const url = `${baseUrl}/movie/${movieId}.json`;

// Series
const seriesId = 'tt5691552';
const seriesUrl = `${baseUrl}/series/${seriesId}.json`;
```

### Watch

need to install stremio service. `INFO_HASH` is obtained from the list of previous links

```
http://127.0.0.1:11470/{{INFO_HASH}}/0
```
