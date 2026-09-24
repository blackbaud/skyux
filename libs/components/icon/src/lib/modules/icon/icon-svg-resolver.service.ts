import { inject, Injectable } from '@angular/core';

import { SKY_ICON_SVG_URL, SkyLogService } from '@skyux/core';

import { SkyIconColorModeType } from './types/icon-color-mode-type';
import { SkyIconVariantType } from './types/icon-variant-type';

const DEFAULT_SVG_URL = `https://sky.blackbaudcdn.net/static/skyux-icons/11/assets/svg/skyux-icons.svg`;

// A dark mode icon repeats the standard icon's ID with this as a final segment,
// e.g. `sky-i-my-icon-20-line-dark` is the dark mode version of
// `sky-i-my-icon-20-line`. The segment is stripped when the icon map is built
// so that both versions of an icon share a single entry, keyed by the name
// consumers ask for.
const DARK_MODE_SUFFIX = 'dark';

// The sizes an icon has been optimized for, split by the theme mode each size
// belongs to. Most icons have no dark mode version, leaving `dark` empty.
interface IconSizesByMode {
  standard: number[];
  dark: number[];
}

// The icon sprite is loaded into (and queried from) the document as a single
// global element, so only one SKY_ICON_SVG_URL can be active per application
// at a time. These track which URL "owns" the current icon map.
let iconMapPromise: Promise<Map<string, IconSizesByMode>> | undefined;
let loadedSvgUrl: string | undefined;

async function getIconMap(
  svgUrl: string,
): Promise<Map<string, IconSizesByMode>> {
  const response = await fetch(svgUrl);

  /* istanbul ignore next */
  if (!response.ok) {
    throw new Error('Icon sprite could not be loaded.');
  }

  const markup = await response.text();

  document.body.insertAdjacentHTML('afterbegin', markup);
  return buildIconMap();
}

function buildIconMap(): Map<string, IconSizesByMode> {
  const iconMap = Array.from<SVGSymbolElement>(
    document.querySelectorAll('#sky-icon-svg-sprite symbol'),
  ).reduce((map, el) => {
    let idParts = el.id.split('-');

    // Drop a trailing `dark` segment so a dark mode icon shares its standard
    // icon's entry rather than becoming an icon name of its own. Only the
    // final segment is checked, so an icon whose name ends in `-dark` is
    // still read as a standard icon.
    const isDarkModeIcon = idParts[idParts.length - 1] === DARK_MODE_SUFFIX;

    if (isDarkModeIcon) {
      idParts = idParts.slice(0, -1);
    }

    // Construct the icon name by removing `sky-i-` from the beginning
    // and `-<size>-<variant>` from the end.
    const name = idParts.slice(2, idParts.length - 2).join('-');

    let sizes = map.get(name);

    if (!sizes) {
      sizes = { standard: [], dark: [] };
      map.set(name, sizes);
    }

    // The penultimate segment is the size for which the icon has
    // been optimized.
    const size = +idParts[idParts.length - 2];

    if (isDarkModeIcon) {
      sizes.dark.push(size);
    } else {
      sizes.standard.push(size);
    }

    return map;
  }, new Map<string, IconSizesByMode>());

  // Sort all the sizes for later comparison.
  for (const sizes of iconMap.values()) {
    // Dedupe and sort the icon sizes. getNearestSize() walks the sizes in
    // ascending order, so they must be compared numerically; the built-in
    // string comparison would place 16 before 8.
    sizes.standard = [...new Set(sizes.standard)].sort((a, b) => a - b);
    sizes.dark = [...new Set(sizes.dark)].sort((a, b) => a - b);
  }

  return iconMap;
}

function getNearestSize(sizes: number[], pixelSize: number): number {
  let nearestSizeUnder = -Infinity;
  let nearestSizeOver = Infinity;

  for (const availableSize of sizes) {
    if (availableSize === pixelSize) {
      return pixelSize;
    } else if (availableSize < pixelSize) {
      nearestSizeUnder = availableSize;
    } else {
      nearestSizeOver = availableSize;
      break;
    }
  }

  const underDiff = Math.abs(pixelSize - nearestSizeUnder);
  const overDiff = Math.abs(pixelSize - nearestSizeOver);

  return isNaN(overDiff) || underDiff < overDiff
    ? nearestSizeUnder
    : nearestSizeOver;
}

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyIconSvgResolverService {
  #svgUrl = inject(SKY_ICON_SVG_URL, { optional: true }) ?? DEFAULT_SVG_URL;
  #logSvc = inject(SkyLogService);

  constructor() {
    this.#warnIfUrlMismatch();
  }

  /**
   * Resolves the sprite href for an icon.
   * @param name The icon name.
   * @param pixelSize The size the icon will be displayed at. The nearest size
   * the icon has been optimized for is used.
   * @param variant The icon variant.
   * @param colorMode The color mode to display the icon in. Ignored when the
   * icon has no dark mode version.
   */
  public async resolveHref(
    name: string,
    pixelSize = 16,
    variant: SkyIconVariantType = 'line',
    colorMode: SkyIconColorModeType = 'light',
  ): Promise<string> {
    if (!iconMapPromise) {
      loadedSvgUrl = this.#svgUrl;
      iconMapPromise = getIconMap(this.#svgUrl);
    }

    const iconMap = await iconMapPromise;
    const iconSizes = iconMap.get(name);

    if (!iconSizes?.standard.length) {
      throw new Error(`Icon with name '${name}' was not found.`);
    }

    // Mode takes priority over size. When the icon has a dark mode version, use
    // it even if the standard version offers a closer match to the requested
    // size.
    const useDarkMode = colorMode === 'dark' && iconSizes.dark.length > 0;

    // Find the icon with the optimal size nearest to the requested size.
    const nearestSize = getNearestSize(
      useDarkMode ? iconSizes.dark : iconSizes.standard,
      pixelSize,
    );

    const darkSuffix = useDarkMode ? `-${DARK_MODE_SUFFIX}` : '';

    return `#sky-i-${name}-${nearestSize}-${variant}${darkSuffix}`;
  }

  public refreshIconMap(): void {
    iconMapPromise = Promise.resolve(buildIconMap());
  }

  public resetIconMap(): void {
    iconMapPromise = undefined;
    loadedSvgUrl = undefined;
  }

  #warnIfUrlMismatch(): void {
    if (loadedSvgUrl && loadedSvgUrl !== this.#svgUrl) {
      this.#logSvc.warn(
        `SkyIconSvgResolverService only supports one SKY_ICON_SVG_URL value per application. An icon sprite has already been loaded from '${loadedSvgUrl}', so a sprite will not also be loaded from '${this.#svgUrl}'.`,
      );
    }
  }
}
