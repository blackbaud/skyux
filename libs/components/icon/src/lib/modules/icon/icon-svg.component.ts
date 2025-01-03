import { NgClass, NgStyle } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { catchError, of, switchMap } from 'rxjs';

import { SkyIconSvgResolverService } from './icon-svg-resolver.service';
import { SkyIconVariantType } from './types/icon-variant-type';

const SIZE_BASE = 16;

const SIZES = new Map([
  ['', SIZE_BASE],
  ['lg', 21.333 /* SIZE_BASE * (4/3) */],
  ['2x', 32 /* SIZE_BASE * 2 */],
  ['3x', 48 /* SIZE_BASE * 3 */],
  ['4x', 64 /* SIZE_BASE * 4 */],
  ['5x', 80 /* SIZE_BASE * 5 */],
]);

/**
 * @internal
 */
@Component({
  selector: 'sky-icon-svg',
  imports: [NgClass, NgStyle],
  templateUrl: './icon-svg.component.html',
  styleUrls: [
    './icon-svg.default.component.scss',
    './icon-svg.modern.component.scss',
  ],
})
export class SkyIconSvgComponent {
  readonly #resolverSvc = inject(SkyIconSvgResolverService);

  public readonly iconName = input.required<string>();
  public readonly iconSize = input<string>();
  public readonly iconVariant = input<SkyIconVariantType>();

  readonly #iconInfo = computed(() => {
    return {
      src: this.iconName(),
      size: this.iconSize(),
      variant: this.iconVariant(),
    };
  });

  protected readonly iconHref = toSignal(
    toObservable(this.#iconInfo).pipe(
      switchMap((info) =>
        this.#resolverSvc.resolveHref(
          info.src,
          SIZES.get(info.size ?? ''),
          info.variant,
        ),
      ),
      catchError(() => of('')),
    ),
  );
}
