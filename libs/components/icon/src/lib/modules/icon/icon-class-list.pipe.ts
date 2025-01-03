import { Pipe, PipeTransform, inject } from '@angular/core';
import { SkyThemeSettings } from '@skyux/theme';

import { SkyIconResolverService } from './icon-resolver.service';
import { SkyIconVariantType } from './types/icon-variant-type';

/**
 * @internal
 */
@Pipe({
  name: 'skyIconClassList',
  standalone: false,
})
export class SkyIconClassListPipe implements PipeTransform {
  #resolver = inject(SkyIconResolverService);

  public transform(
    icon: string,
    themeSettings?: SkyThemeSettings,
    size?: string,
    fixedWidth?: boolean,
    variant?: SkyIconVariantType,
  ): string[] {
    let classList: string[];

    const { icon: resolvedIcon, iconType: resolvedIconType } =
      this.#resolver.resolveIcon(icon, variant, themeSettings);

    if (resolvedIconType === 'skyux') {
      classList = ['sky-i-' + resolvedIcon];
    } else {
      classList = ['fa', 'fa-' + resolvedIcon];
    }

    if (size) {
      classList.push('fa-' + size);
    }

    if (fixedWidth) {
      classList.push('fa-fw');
    }

    return classList;
  }
}
