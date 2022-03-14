import { Pipe, PipeTransform } from '@angular/core';

import { SkyIconResolverService } from './icon-resolver.service';
import { SkyIconVariantType } from './types/icon-variant-type';

/**
 * @internal
 */
@Pipe({
  name: 'skyIconClassList',
})
export class SkyIconClassListPipe implements PipeTransform {
  constructor(private resolver: SkyIconResolverService) {}

  public transform(
    icon: string,
    iconType?: string,
    size?: string,
    fixedWidth?: boolean,
    variant?: SkyIconVariantType
  ): string[] {
    let classList: string[];

    if (iconType === 'skyux') {
      const resolvedIcon = this.resolver.resolveIcon(icon, variant);
      classList = ['sky-i-' + resolvedIcon];
    } else {
      classList = ['fa', 'fa-' + icon];
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
