import { Injectable } from '@angular/core';

import { SkyIconVariantType } from './types/icon-variant-type';

async function getIconMap(): Promise<Map<string, number[]>> {
  const response = await fetch(
    `https://sky.blackbaudcdn.net/static/skyux-icons/10/assets/svg/skyux-icons.svg`,
  );

  /* istanbul ignore next */
  if (!response.ok) {
    throw new Error('Icon sprite could not be loaded.');
  }

  const markup = await response.text();

  document.body.insertAdjacentHTML('afterbegin', markup);
  return buildIconMap();
}

function buildIconMap(): Map<string, number[]> {
  const iconMap = Array.from<SVGSymbolElement>(
    document.querySelectorAll('#sky-icon-svg-sprite symbol'),
  ).reduce((map, el) => {
    const idParts = el.id.split('-');

    // Construct the icon name by removing `sky-i-` from the beginning
    // and `-<size>-<variant>` from the end.
    const name = idParts.slice(2, idParts.length - 2).join('-');

    let sizes = map.get(name);

    if (!sizes) {
      sizes = [];
      map.set(name, sizes);
    }

    // The penultimate segment is the size for which the icon has
    // been optimized.
    sizes.push(+idParts[idParts.length - 2]);

    return map;
  }, new Map<string, number[]>());

  // Sort all the sizes for later comparison.
  for (const id of iconMap.keys()) {
    // Dedupe and sort the icon sizes.
    iconMap.set(id, [...new Set(iconMap.get(id))].sort());
  }

  return iconMap;
}

function getNearestSize(
  iconMap: Map<string, number[]>,
  name: string,
  pixelSize: number,
): number | undefined {
  const sizes = iconMap.get(name);

  if (sizes) {
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

  return undefined;
}

let iconMapPromise: Promise<Map<string, number[]>> | undefined;

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyIconSvgResolverService {
  public async resolveHref(
    name: string,
    pixelSize = 16,
    variant: SkyIconVariantType = 'line',
  ): Promise<string> {
    if (!iconMapPromise) {
      iconMapPromise = getIconMap();
    }

    const iconMap = await iconMapPromise;

    let href = `#sky-i-${name}`;

    // Find the icon with the optimal size nearest to the requested size.
    const nearestSize = getNearestSize(iconMap, name, pixelSize);

    if (!nearestSize) {
      throw new Error(`Icon with name '${name}' was not found.`);
    }

    href = `${href}-${nearestSize}-${variant}`;

    return href;
  }

  public refreshIconMap(): void {
    iconMapPromise = Promise.resolve(buildIconMap());
  }

  public resetIconMap(): void {
    iconMapPromise = undefined;
  }
}
