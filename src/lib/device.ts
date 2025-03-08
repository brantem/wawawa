import Bowser from 'bowser';

// https://github.com/Stremio/stremio-web/blob/45f8afea91752c2691bfa8c6404c448422326455/src/common/Platform/device.ts

const APPLE_MOBILE_DEVICES = ['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'];

export function detect() {
  const { userAgent, platform, maxTouchPoints } = globalThis.navigator;

  // this detects ipad properly in safari
  // while bowser does not
  const isIOS = APPLE_MOBILE_DEVICES.includes(platform) || (userAgent.includes('Mac') && 'ontouchend' in document);

  // Edge case: iPad is included in this function
  // Keep in mind maxTouchPoints for Vision Pro might change in the future
  const isVisionOS = userAgent.includes('Macintosh') && maxTouchPoints === 5;

  const bowser = Bowser.getParser(userAgent);
  const os = bowser.getOSName().toLowerCase();

  const name = isVisionOS ? 'visionos' : isIOS ? 'ios' : os || 'unknown';
  const isMobile = ['ios', 'android'].includes(name);

  return { name, isMobile };
}
