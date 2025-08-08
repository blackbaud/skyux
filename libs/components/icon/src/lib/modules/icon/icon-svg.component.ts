import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

import { catchError, of, switchMap } from 'rxjs';

import { SkyIconSvgResolverService } from './icon-svg-resolver.service';
import { SkyIconSize } from './types/icon-size';
import { SkyIconVariantType } from './types/icon-variant-type';

const SIZE_BASE = 16;

const FIXED_SIZES = new Map([
  ['xxxs', 4],
  ['xxs', 8],
  ['xs', 12],
  ['s', SIZE_BASE],
  ['m', 20],
  ['l', 24],
  ['xl', 32],
  ['xxl', 40],
  ['xxxl', 48],
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
    '[class]': '"sky-icon-svg-" + iconSize()',
  },
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyIconSvgComponent {
  readonly #resolverSvc = inject(SkyIconSvgResolverService);

  public readonly iconName = input.required<string>();
  public readonly iconSize = input<SkyIconSize, SkyIconSize | undefined>('m', {
    transform: defaultSize,
  });
  public readonly iconVariant = input<SkyIconVariantType>();

  readonly #iconInfo = computed(() => {
    return {
      src: this.iconName(),
      iconSize: this.iconSize(),
      variant: this.iconVariant(),
    };
  });

  protected readonly iconHref = toSignal(
    toObservable(this.#iconInfo).pipe(
      switchMap((info) =>
        this.#resolverSvc.resolveHref(
          info.src,
          FIXED_SIZES.get(info.iconSize),
          info.variant,
        ),
      ),
      catchError(() => of('')),
    ),
  );
}
