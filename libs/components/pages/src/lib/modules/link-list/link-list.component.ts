import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  Input,
  computed,
  contentChildren,
  signal,
} from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyAppLinkModule, SkyHrefModule } from '@skyux/router';

import { SkyPageLink } from '../action-hub/types/page-link';
import { SkyPageLinksInput } from '../action-hub/types/page-links-input';
import { LinkAsModule } from '../link-as/link-as.module';

import { SkyLinkListItemComponent } from './link-list-item.component';

/**
 * A component that displays a list of links, such as within a `<sky-page-links>` component.
 */
@Component({
  standalone: true,
  selector: 'sky-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
  imports: [
    LinkAsModule,
    NgTemplateOutlet,
    SkyAppLinkModule,
    SkyHrefModule,
    SkyWaitModule,
  ],
})
export class SkyLinkListComponent {
  /**
   * The text to display as the list's heading.
   */
  @Input()
  public headingText = '';

  /**
   * Option to pass links as an array of `SkyPageLink` objects or `'loading'` to display a loading indicator.
   */
  @Input()
  public set links(value: SkyPageLinksInput) {
    this.linksInput.set(value);
  }

  protected readonly linksInput = signal<SkyPageLinksInput>(undefined);
  protected readonly linkItems = contentChildren(SkyLinkListItemComponent);

  protected readonly hasLinks = computed<boolean>(() => {
    const linkItems = this.linkItems();
    const links = this.linksInput();
    if (linkItems.length > 0) {
      return true;
    }
    return Array.isArray(links) && links.length > 0;
  });

  protected readonly linksArray = computed<SkyPageLink[]>(() => {
    const links = this.linksInput();
    if (Array.isArray(links)) {
      return links;
    }
    return [];
  });
}
