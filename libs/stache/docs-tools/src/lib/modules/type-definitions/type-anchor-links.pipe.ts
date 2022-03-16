import { Pipe, PipeTransform } from '@angular/core';

import { SkyDocsAnchorLinkConfig } from './anchor-link-service-config';
import { SkyDocsAnchorLinkServiceFormatType } from './anchor-link-service-format';
import { SkyDocsAnchorLinkService } from './anchor-link.service';

/**
 * Adds same-page anchor tags around known TypeScript types.
 */
@Pipe({
  name: 'skyDocsTypeAnchorLinks',
  pure: true,
})
export class SkyDocsTypeAnchorLinksPipe implements PipeTransform {
  constructor(private anchorLinkService: SkyDocsAnchorLinkService) {}

  public transform(
    value: string,
    formatType?: SkyDocsAnchorLinkServiceFormatType
  ): string {
    const anchorLinkConfig: SkyDocsAnchorLinkConfig = {
      applyCodeFormatting: formatType !== 'no-code-tags',
    };
    return this.anchorLinkService.applyTypeAnchorLinks(value, anchorLinkConfig);
  }
}
