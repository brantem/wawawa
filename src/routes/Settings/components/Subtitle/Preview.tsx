import { useRef, useState } from 'react';

import * as constants from 'constants/settings';
import { useWindowSize, useMediaQuery } from 'lib/hooks';
import { useSubtitle } from './hooks';

// based on vidstack's default layout caption
// https://github.com/vidstack/player/blob/d89a19dc83fc4143a6afe40dddbbf0d3f8644aa2/packages/vidstack/styles/player/default/captions.css
// https://github.com/vidstack/player/blob/d89a19dc83fc4143a6afe40dddbbf0d3f8644aa2/packages/vidstack/src/core/font/font-vars.ts
export default function Preview() {
  const containerRef = useRef<HTMLDivElement>(null);

  const isSmall = useMediaQuery('(width < 1056px)');
  const { height } = useWindowSize();
  const subtitle = useSubtitle();

  const [useRealSize, setUseRealSize] = useState(false);
  const h = (isSmall || useRealSize ? height : containerRef.current?.clientHeight) || 0;

  return (
    <div>
      <div className="flex aspect-video w-full items-stretch overflow-hidden rounded-md bg-[url('/poster.webp')] bg-cover bg-center bg-no-repeat">
        <div ref={containerRef} className="m-[1%] flex w-full items-end">
          <div
            className="mb-4 flex w-full justify-center"
            style={{
              backgroundColor: `rgb(${hexToRgb(subtitle['display-bg'])} / ${percentToRatio(subtitle['display-bg-opacity'])})`,
            }}
          >
            <div
              className="rounded-xs text-center backdrop-blur-sm"
              style={
                {
                  '--font-size': `calc(${(h / 100) * 4.5}px * ${percentToRatio(subtitle['font-size'])})`,
                  fontVariant: subtitle['font-family'] === 'capitals' ? 'small-caps' : '',
                  fontFamily: getFontFamilyCSSVarValue(subtitle['font-family']),
                  fontSize: 'var(--font-size)',
                  color: `rgb(${hexToRgb(subtitle['text-color'])} / ${percentToRatio(subtitle['text-opacity'])})`,
                  backgroundColor:
                    subtitle['text-bg'] !== constants.SUBTITLE['text-bg'] // weird
                      ? `rgb(${hexToRgb(subtitle['text-bg'])} / ${percentToRatio(subtitle['text-bg-opacity'])})`
                      : 'rgba(0,0,0,0.7)',
                  textShadow: getTextShadowCssVarValue(subtitle['text-shadow']),
                  lineHeight: 'calc(var(--font-size) * 1.2)',
                  padding: `calc(var(--font-size) * 0.4) calc(var(--font-size) * 0.6)`,
                } as React.CSSProperties
              }
            >
              Captions look like this
            </div>
          </div>
        </div>
      </div>

      {!isSmall ? (
        <label className="mt-4 ml-9 flex w-fit items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-5 appearance-none rounded-sm border border-neutral-700 bg-neutral-950 text-white hover:border-neutral-600"
            checked={useRealSize}
            onChange={() => setUseRealSize((prev) => !prev)}
          />
          <span>Show real size</span>
        </label>
      ) : null}
    </div>
  );
}

// https://github.com/vidstack/player/blob/d89a19dc83fc4143a6afe40dddbbf0d3f8644aa2/packages/vidstack/src/utils/color.ts
function hexToRgb(hex: string) {
  const { style } = new Option();
  style.color = hex;
  return style.color.match(/\((.*?)\)/)![1].replace(/,/g, ' ');
}

// https://github.com/vidstack/player/blob/d89a19dc83fc4143a6afe40dddbbf0d3f8644aa2/packages/vidstack/src/core/font/font-vars.ts
function percentToRatio(value: string) {
  return (parseInt(value) / 100).toString();
}

function getFontFamilyCSSVarValue(value: string) {
  switch (value) {
    case 'mono-serif':
      return '"Courier New", Courier, "Nimbus Mono L", "Cutive Mono", monospace';
    case 'mono-sans':
      return '"Deja Vu Sans Mono", "Lucida Console", Monaco, Consolas, "PT Mono", monospace';
    case 'pro-sans':
      return 'Roboto, Helvetica, "Arial Unicode Ms", Arial, Verdana, "PT Sans Caption", sans-serif'; // different
    case 'casual':
      return '"Comic Sans MS", Impact, Handlee, fantasy';
    case 'cursive':
      return '"Monotype Corsiva", "URW Chancery L", "Apple Chancery", "Dancing Script", cursive';
    case 'capitals':
      return 'Helvetica, "Arial Unicode Ms", Arial, Verdana, "Marcellus SC", sans-serif + font-variant=small-caps'; // different
    default:
      return '"Times New Roman", Times, Georgia, Cambria, "PT Serif Caption", serif';
  }
}

function getTextShadowCssVarValue(value: string) {
  switch (value) {
    case 'drop shadow':
      return 'rgb(34, 34, 34) 1.86389px 1.86389px 2.79583px, rgb(34, 34, 34) 1.86389px 1.86389px 3.72778px, rgb(34, 34, 34) 1.86389px 1.86389px 4.65972px';
    case 'raised':
      return 'rgb(34, 34, 34) 1px 1px, rgb(34, 34, 34) 2px 2px';
    case 'depressed':
      return 'rgb(204, 204, 204) 1px 1px, rgb(34, 34, 34) -1px -1px';
    case 'outline':
      return 'rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px, rgb(34, 34, 34) 0px 0px 1.86389px';
    default:
      return '';
  }
}
