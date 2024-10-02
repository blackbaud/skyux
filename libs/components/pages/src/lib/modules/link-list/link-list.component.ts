import { Component, computed, contentChildren, input } from '@angular/core';

import { SkyPageLink } from '../action-hub/types/page-link';
import { SkyPageLinksInput } from '../action-hub/types/page-links-input';

import { SkyLinkListItemComponent } from './link-list-item.component';

@Component({
  selector: 'sky-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
})
export class SkyLinkListComponent {
  public readonly headingText = input<string>();
  public readonly links = input<SkyPageLinksInput | undefined>();

  protected readonly linkItems = contentChildren(SkyLinkListItemComponent);

  protected readonly hasLinks = computed<boolean>(() => {
    const linkItems = this.linkItems();
    const links = this.links();
    if (linkItems.length > 0) {
      return true;
    }
    return Array.isArray(links) && links.length > 0;
  });

  protected readonly linksArray = computed<SkyPageLink[]>(() => {
    const links = this.links();
    if (Array.isArray(links)) {
      return links;
    }
    return [];
  });
}
