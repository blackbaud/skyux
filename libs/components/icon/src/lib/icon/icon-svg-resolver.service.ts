import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, map, of, shareReplay, tap } from 'rxjs';

import { SkyIconVariantType } from './types/icon-variant-type';

function insertSprite(markup: string): void {
  document.body.insertAdjacentHTML('afterbegin', markup);
}

function getIconsSizes(): Map<string, number[]> {
  const iconsSizes = Array.from<SVGSymbolElement>(
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
  for (const id of iconsSizes.keys()) {
    // Dedupe and sort the icon sizes.
    iconsSizes.set(id, [...new Set(iconsSizes.get(id))].sort());
  }

  return iconsSizes;
}

function getNearestSize(
  iconsSizes: Map<string, number[]>,
  name: string,
  pixelSize: number,
): number | undefined {
  const sizes = iconsSizes.get(name);

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

/**
 * @internal
 */
@Injectable()
export class SkyIconSvgResolverService {
  readonly #http = inject(HttpClient, { optional: true });

  readonly #spriteObs = this.#http
    ?.get(
      `https://sky.blackbaudcdn.net/static/skyux-icons/7/assets/svg/skyux-icons.svg`,
      {
        responseType: 'text',
      },
    )
    .pipe(tap(insertSprite), map(getIconsSizes), shareReplay(1));

  public resolveHref(
    name: string,
    pixelSize = 16,
    variant: SkyIconVariantType = 'line',
  ): Observable<string> {
    return (
      this.#spriteObs?.pipe(
        map((iconsSizes) => {
          let href = `#sky-i-${name}`;

          // Find the icon with the optimal size nearest to the requested size.
          const nearestSize = getNearestSize(iconsSizes, name, pixelSize);

          if (!nearestSize) {
            throw new Error(`Icon with name '${name}' was not found.`);
          }

          href = `${href}-${nearestSize}-${variant}`;

          return href;
        }),
      ) ?? of('')
    );
  }
}
