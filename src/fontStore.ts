import WebFont from 'webfontloader';

import { IOptionType } from './sidebar/customSelect';

const FONT_CACHE: {[key: string]: boolean} = {};
const FONT_VARIANT_CACHE: {[key: string]: boolean} = {};

export function loadFont(font: string) {
  if (!font || FONT_CACHE[font]) {
    return;
  }

  WebFont.load({
    classes: false,
    google: {
      families: [font],
    },
    fontactive(family) {
      FONT_CACHE[family] = true;
    },
  });
}

export function loadFontWithVariants(font: string, variants: string[]) {
  if (!font || FONT_VARIANT_CACHE[font]) {
    return;
  }

  const variantStr = variants.map(v => v === '400' ? 'regular' : v).join('|');

  WebFont.load({
    classes: false,
    google: {
      families: [`${font}:${variantStr}`],
    },
    fontactive(family) {
      FONT_CACHE[family] = true;
      FONT_VARIANT_CACHE[family] = true;
    },
  });
}

