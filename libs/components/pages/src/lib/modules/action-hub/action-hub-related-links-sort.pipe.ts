import { Pipe, PipeTransform } from '@angular/core';

import { SkyPageLinkInterface } from './types/page-link-interface';

@Pipe({
  name: 'skyActionHubRelatedLinksSort',
  standalone: false,
})
export class SkyActionHubRelatedLinksSortPipe implements PipeTransform {
  public transform<T extends SkyPageLinkInterface[]>(
    relatedLinks: T | 'loading' | undefined,
  ): T | 'loading' | [] {
    if (relatedLinks === 'loading') {
      return 'loading';
    }
    if (!relatedLinks || relatedLinks.length === 0) {
      return [];
    }
    return relatedLinks.slice(0).sort((a, b) => {
      const aLabel = a.label.trim().toUpperCase();
      const bLabel = b.label.trim().toUpperCase();
      if (aLabel === bLabel) {
        return 0;
      }
      return aLabel < bLabel ? -1 : 1;
    }) as T;
  }
}
