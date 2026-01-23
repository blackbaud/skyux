import { Pipe, PipeTransform } from '@angular/core';
import { Route } from '@angular/router';

import { SkyActionHubNeedsAttention } from '../action-hub/types/action-hub-needs-attention';
import { SkyPageLink } from '../action-hub/types/page-link';
import { SkyPageModalLink } from '../action-hub/types/page-modal-link';

@Pipe({
  name: 'linkAs',
})
export class LinkAsPipe implements PipeTransform {
  public transform(
    value:
      | SkyActionHubNeedsAttention
      | SkyPageLink
      | SkyPageModalLink
      | undefined,
    linkAs: 'button',
  ): value is SkyActionHubNeedsAttention & { click: () => void };

  public transform(
    value:
      | SkyActionHubNeedsAttention
      | SkyPageLink
      | SkyPageModalLink
      | undefined,
    linkAs: 'href' | 'skyHref',
  ): value is SkyActionHubNeedsAttention & { permalink: { url: string } };

  public transform(
    value:
      | SkyActionHubNeedsAttention
      | SkyPageLink
      | SkyPageModalLink
      | undefined,
    linkAs: 'skyAppLink',
  ): value is SkyActionHubNeedsAttention & { permalink: { route: Route } };

  public transform(
    value:
      | SkyActionHubNeedsAttention
      | SkyPageLink
      | SkyPageModalLink
      | undefined,
    linkAs: undefined,
  ): false;

  public transform(
    value:
      | SkyActionHubNeedsAttention
      | SkyPageLink
      | SkyPageModalLink
      | undefined,
    linkAs: 'button' | 'href' | 'skyHref' | 'skyAppLink' | undefined,
  ): boolean {
    const permalink = value?.permalink;
    const permalinkUrl = permalink?.url;

    switch (linkAs) {
      case 'button':
        return (
          !!(value as SkyActionHubNeedsAttention | SkyPageModalLink)?.click &&
          !permalink
        );
      case 'href':
        return permalinkUrl !== undefined && !permalinkUrl.includes('://');
      case 'skyHref':
        return permalinkUrl !== undefined && permalinkUrl.includes('://');
      case 'skyAppLink':
        return !!(permalink && permalinkUrl === undefined && permalink.route);
      default:
        return false;
    }
  }
}
