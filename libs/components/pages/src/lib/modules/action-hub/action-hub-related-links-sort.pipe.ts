import { Pipe, PipeTransform } from '@angular/core';

import { SkyPageLinksInput } from './types/page-links-input';

@Pipe({
  name: 'skyActionHubRelatedLinksSort',
})
export class SkyActionHubRelatedLinksSortPipe implements PipeTransform {
  public transform(relatedLinks: SkyPageLinksInput): SkyPageLinksInput {
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
    });
  }
}
