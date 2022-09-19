import { Pipe, PipeTransform } from '@angular/core';

import { SkyActionHubNeedsAttention } from '../action-hub/types/action-hub-needs-attention';
import { SkyPageLink } from '../action-hub/types/page-link';

@Pipe({
  name: 'linkAs',
})
export class LinkAsPipe implements PipeTransform {
  public transform(
    value: SkyActionHubNeedsAttention | SkyPageLink | undefined,
    linkAs: 'button' | 'href' | 'skyHref' | 'skyAppLink'
  ): boolean {
    switch (linkAs) {
      case 'button':
        return (
          (value as SkyActionHubNeedsAttention)?.click !== undefined &&
          value.permalink === undefined
        );
      case 'href':
        return (
          value?.permalink !== undefined &&
          value.permalink.url !== undefined &&
          !value.permalink.url.includes('://')
        );
      case 'skyHref':
        return (
          value?.permalink !== undefined &&
          value.permalink.url !== undefined &&
          value.permalink.url.includes('://')
        );
      case 'skyAppLink':
        return (
          value?.permalink !== undefined &&
          value.permalink.url === undefined &&
          value.permalink.route !== undefined
        );
      default:
        return false;
    }
  }
}
