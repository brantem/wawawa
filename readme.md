### Search

```ts
const search = 'something';
const moviesUrl = `https://v3-cinemeta.strem.io/catalog/movie/top/search=${something}.json`;
const seriesUrl = `https://v3-cinemeta.strem.io/catalog/series/top/search=${something}.json`;
```

#### Filter

```txt
data:
https://v3-cinemeta.strem.io/manifest.json

by year:
https://v3-cinemeta.strem.io/catalog/movie/year/genre=2025.json

top:
https://v3-cinemeta.strem.io/catalog/movie/top.json

top by genre:
https://v3-cinemeta.strem.io/catalog/movie/top/genre=Adventure.json

featured:
https://v3-cinemeta.strem.io/catalog/series/imdbRating.json

featured with genre:
https://v3-cinemeta.strem.io/catalog/movie/imdbRating/genre=Adventure.json
```

this endpoint supports pagination. to retrieve the next page, include `skip={total previous items}` in the query. for example:

```
https://v3-cinemeta.strem.io/catalog/movie/year/skip=26&genre=2025.json
```

### Streams

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

need to install stremio service.

#### Basic Video

this version can be directly used in a `video` element. `INFO_HASH` and `FILE_IDX` are obtained from the list of previous links

```
http://127.0.0.1:11470/{{INFO_HASH}}/{{FILE_IDX}}
```

# blabla

```js
// how to build url

const streamingServerURL = 'http://127.0.0.1:11470/';
const stream = {
  infoHash: '77a996eed3467566031b666868d568314ef8c226',
  fileIdx: 0,
  announce: [], // alias is sources, what is the puporse of this?
  name: 'Torrentio\n1080p',
  description: 'The Gorge 2025 1080p WEB-DL HEVC x265 5.1 BONE\n👤 3605 💾 1.87 GB ⚙️ 1337x',
  behaviorHints: {
    bingeGroup: 'torrentio|1080p|WEB-DL|hevc',
    filename: 'The Gorge 2025 1080p WEB-DL HEVC x265 5.1 BONE.mkv',
  },
  deepLinks: {
    player:
      '#/player/eAEBTAGz%2FnsiaW5mb0hhc2giOiI3N2E5OTZlZWQzNDY3NTY2MDMxYjY2Njg2OGQ1NjgzMTRlZjhjMjI2IiwiZmlsZUlkeCI6MCwiYW5ub3VuY2UiOltdLCJuYW1lIjoiVG9ycmVudGlvXG4xMDgwcCIsImRlc2NyaXB0aW9uIjoiVGhlIEdvcmdlIDIwMjUgMTA4MHAgV0VCLURMIEhFVkMgeDI2NSA1LjEgQk9ORVxu8J%2BRpCAzNjA1IPCfkr4gMS44NyBHQiDimpnvuI8gMTMzN3giLCJiZWhhdmlvckhpbnRzIjp7ImJpbmdlR3JvdXAiOiJ0b3JyZW50aW98MTA4MHB8V0VCLURMfGhldmMiLCJmaWxlbmFtZSI6IlRoZSBHb3JnZSAyMDI1IDEwODBwIFdFQi1ETCBIRVZDIHgyNjUgNS4xIEJPTkUubWt2In19BXxmnA%3D%3D',
    externalPlayer: {
      download: 'magnet:?xt=urn:btih:77a996eed3467566031b666868d568314ef8c226&dn=Torrentio\n1080p',
      streaming: 'http://127.0.0.1:11470/77a996eed3467566031b666868d568314ef8c226/0?',
      playlist:
        'data:application/octet-stream;charset=utf-8;base64,I0VYVE0zVQojRVhUSU5GOjAKaHR0cDovLzEyNy4wLjAuMToxMTQ3MC83N2E5OTZlZWQzNDY3NTY2MDMxYjY2Njg2OGQ1NjgzMTRlZjhjMjI2LzA/',
      fileName: 'playlist.m3u',
      openPlayer: null,
      web: null,
      androidTv: null,
      tizen: null,
      webos: null,
    },
  }, // only important for stremio-web
  subtitles: [],
};
const seriesInfo = null;

convertStream(streamingServerURL, stream, seriesInfo, undefined);

// because stream.url doesnt exists and strem.infoHash does, the following function is called
createTorrent(streamingServerURL, stream.infoHash, stream.fileIdx, stream.announce, seriesInfo);

// because the first early return in the previous function is triggered
buildTorrent(streamingServerURL, stream.infoHash, stream.fileIdx, stream.announce);
const buildTorrentResult = {
  url: 'http://127.0.0.1:11470/77a996eed3467566031b666868d568314ef8c226/0',
  infoHash: '77a996eed3467566031b666868d568314ef8c226',
  fileIdx: 0,
  sources: [],
};

// TODO: read withStreamingServer.js:112 to withStreamingServer.js:133

// check if streamable
fetch(`${streamingServerURL}/hlsv2/probe?mediaURL=${encodeURIComponent(buildTorrentResult.url)}`);
// withStreamingServer.js:351

const convertStreamResultIfNotHLS = {
  mediaURL: buildTorrentResult.url,
  infoHash: buildTorrentResult.infoHash,
  fileIdx: buildTorrentResult.fileIdx,
  stream: {
    url: buildTorrentResult.url,
  },
};
// next withStreamingServer.js:140
// next HTMLVideo.js:541

const convertStreamResultIfHLS = {
  mediaURL: buildTorrentResult.url,
  infoHash: buildTorrentResult.infoHash,
  fileIdx: buildTorrentResult.fileIdx,
  stream: {
    url: `http://127.0.0.1:11470/hlsv2/${generateRandomId()}/master.m3u8?mediaURL=${decodeURIComponent(buildTorrentResult.url)}`,
    subtitles: stream.subtitles,
    behaviorHints: {
      headers: {
        'content-type': 'application/vnd.apple.mpegurl',
      },
    },
  },
};
// next HTMLVideo.js:529 to HTMLVideo.js:539
```
