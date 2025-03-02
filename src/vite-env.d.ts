/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PROXY_URL: string;
  readonly VITE_TORRENTIO_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
