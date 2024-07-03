import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { Observable, map, shareReplay, tap } from 'rxjs';

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
  size: number,
): number | undefined {
  let nearestSize: number | undefined;

  const sizes = iconsSizes.get(name);

  if (sizes) {
    if (sizes.includes(size)) {
      nearestSize = size;
    } else {
      let nearestSizeUnder = -Infinity;
      let nearestSizeOver = Infinity;

      for (const availableSize of sizes) {
        if (availableSize < size) {
          nearestSizeUnder = availableSize;
        } else {
          nearestSizeOver = availableSize;
          break;
        }
      }

      const underDiff = Math.abs(size - nearestSizeUnder);
      const overDiff = Math.abs(size - nearestSizeOver);

      nearestSize =
        underDiff < overDiff || isNaN(overDiff)
          ? nearestSizeUnder
          : nearestSizeOver;
    }
  }

  return nearestSize;
}

/**
 * @internal
 */
@Injectable()
export class SkyIconSvgResolverService {
  #http = inject(HttpClient);

  #spriteObs: Observable<Map<string, number[]>> | undefined;

  public resolveId(
    name: string,
    size = 16,
    variant: SkyIconVariantType = 'line',
  ): Observable<string> {
    if (!this.#spriteObs) {
      this.#spriteObs = this.#http
        .get(
          `https://sky.blackbaudcdn.net/static/skyux-icons/7/assets/svg/skyux-icons.svg`,
          {
            responseType: 'text',
          },
        )
        .pipe(tap(insertSprite), map(getIconsSizes), shareReplay(1));
    }

    return this.#spriteObs.pipe(
      map((iconsSizes) => {
        let url = `#sky-i-${name}`;

        // Find the icon with the optimal size nearest to the requested size.
        const nearestSize = getNearestSize(iconsSizes, name, size);

        if (nearestSize) {
          url = `${url}-${nearestSize}`;
        }

        url = `${url}-${variant}`;

        return url;
      }),
    );
  }
}
