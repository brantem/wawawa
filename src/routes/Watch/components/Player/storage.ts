import type { MediaStorage } from '@vidstack/react';
import omit from 'just-omit';
import throttle from 'just-throttle';

import storage from 'lib/storage';
import type { Stream } from 'types/storage';

export default class Storage implements MediaStorage {
  #id: string;
  #url: string;
  #data: Omit<Stream, 'id' | 'url' | 'watchedAt'> = {
    volume: 1,
    muted: false,
    time: null,
    duration: null,
    lang: null,
    captions: true,
    rate: 1,
  };

  constructor(id: string, episodeId: string | null, url: string, duration: number | null) {
    this.#id = `${id}${episodeId ? `:${episodeId}` : ''}`;
    this.#url = url;
    this.#data.duration = duration;
  }

  async #get() {
    const data = await storage.get('streams', this.#id);
    if (data) {
      this.#data = { ...this.#data, ...omit(data, ['id', 'url', 'duration']) };
      if (!this.#data.duration && data.duration) this.#data.duration = data.duration;

      if (this.#url !== data.url) await this.#save();
      if (this.#data.duration && !data.duration) await this.#save();
    } else {
      storage.add('streams', { id: this.#id, url: this.#url, ...this.#data, watchedAt: Date.now() });
    }
    return this.#data;
  }

  async getVolume() {
    return (await this.#get()).volume;
  }
  async setVolume(volume: number) {
    this.#data.volume = volume;
    await this.#save();
  }

  async getMuted() {
    return (await this.#get()).muted;
  }
  async setMuted(muted: boolean) {
    this.#data.muted = muted;
    await this.#save();
  }

  async getTime() {
    return (await this.#get()).time;
  }
  async setTime(time: number, ended?: boolean) {
    const shouldClear = time < 0;
    this.#data.time = !shouldClear ? time : null;

    if (shouldClear || ended) {
      await this.#save();
    } else {
      await this.#saveThrottled();
    }
  }

  async getLang() {
    return (await this.#get()).lang;
  }
  async setLang(lang: string | null) {
    this.#data.lang = lang;
    await this.#save();
  }

  async getCaptions() {
    return (await this.#get()).captions;
  }
  async setCaptions(captions: boolean) {
    this.#data.captions = captions;
    await this.#save();
  }

  async getPlaybackRate() {
    return (await this.#get()).rate;
  }
  async setPlaybackRate(rate: number) {
    this.#data.rate = rate;
    await this.#save();
  }

  async #save() {
    if (this.#data === null) return;
    await storage.put('streams', { id: this.#id, url: this.#url, ...this.#data, watchedAt: Date.now() });
  }
  #saveThrottled = throttle(this.#save.bind(this), 1000);

  // noop
  async getAudioGain() {
    return null;
  }
  async getVideoQuality() {
    return null;
  }
}
