import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChildren,
  inject,
  input,
} from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';
import {
  SkyAppLinkModule,
  SkyHrefModule,
  SkyHrefResolverService,
} from '@skyux/router';
import { SkyThemeComponentClassDirective } from '@skyux/theme';

import { SkyPageLink } from '../action-hub/types/page-link';
import { SkyPageLinksInput } from '../action-hub/types/page-links-input';
import { LinkAsModule } from '../link-as/link-as.module';

import { SkyLinkListItemComponent } from './link-list-item.component';
import { DisplayPromise } from './types/display-promise';

/**
 * A component that displays a list of links, such as within a `<sky-page-links>` component.
 */
@Component({
  selector: 'sky-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
  imports: [
    LinkAsModule,
    NgTemplateOutlet,
    SkyAppLinkModule,
    SkyHrefModule,
    SkyWaitModule,
    AsyncPipe,
  ],
  hostDirectives: [SkyThemeComponentClassDirective],
})
export class SkyLinkListComponent {
  /**
   * The text to display as the list's heading.
   */
  public readonly headingText = input<string>();

  /**
   * Option to pass links as an array of `SkyPageLink` objects or `'loading'` to display a loading indicator.
   */
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

  protected readonly linksArray = computed<(SkyPageLink & DisplayPromise)[]>(
    () => {
      const links = this.links();
      if (Array.isArray(links)) {
        return links.map((link) => {
          return {
            ...link,
            display: link.permalink.url?.includes('://')
              ? this.#resolver
                  .resolveHref({ url: link.permalink.url })
                  .then((result) => !!result.userHasAccess)
              : Promise.resolve(true),
          };
        });
      }
      return [];
    },
  );

  readonly #resolver = inject(SkyHrefResolverService);
}
