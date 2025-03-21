import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

import { catchError, of, switchMap } from 'rxjs';

import { SkyIconSvgResolverService } from './icon-svg-resolver.service';
import { SkyIconSize } from './types/icon-size';
import { SkyIconVariantType } from './types/icon-variant-type';

const SIZE_BASE = 16;

const RELATIVE_SIZES = new Map([
  ['md', SIZE_BASE],
  ['lg', 21.333 /* SIZE_BASE * (4/3) */],
  ['2x', 32 /* SIZE_BASE * 2 */],
  ['3x', 48 /* SIZE_BASE * 3 */],
  ['4x', 64 /* SIZE_BASE * 4 */],
  ['5x', 80 /* SIZE_BASE * 5 */],
]);

const FIXED_SIZES = new Map([
  ['s', SIZE_BASE],
  ['m', 20],
  ['l', 24],
  ['xl', 32],
]);

function defaultSize(value: SkyIconSize | undefined): SkyIconSize {
  return value ?? 'm';
}

/**
 * @internal
 */
@Component({
  selector: 'sky-icon-svg',
  templateUrl: './icon-svg.component.html',
  styleUrls: ['./icon-svg.component.scss'],
  host: {
    '[class]':
      'relativeSize() ? "sky-icon-svg-relative-" + relativeSize() : "sky-icon-svg-" + iconSize()',
  },
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyIconSvgComponent {
  readonly #resolverSvc = inject(SkyIconSvgResolverService);

  public readonly iconName = input.required<string>();
  public readonly iconSize = input<SkyIconSize, SkyIconSize | undefined>('m', {
    transform: defaultSize,
  });
  public readonly relativeSize = input<string | undefined>();
  public readonly iconVariant = input<SkyIconVariantType>();

  readonly #iconInfo = computed(() => {
    return {
      src: this.iconName(),
      relativeSize: this.relativeSize(),
      iconSize: this.iconSize(),
      variant: this.iconVariant(),
    };
  });

  protected readonly iconHref = toSignal(
    toObservable(this.#iconInfo).pipe(
      switchMap((info) =>
        this.#resolverSvc.resolveHref(
          info.src,
          info.relativeSize !== undefined
            ? RELATIVE_SIZES.get(info.relativeSize)
            : FIXED_SIZES.get(info.iconSize),
          info.variant,
        ),
      ),
      catchError(() => of('')),
    ),
  );
}
