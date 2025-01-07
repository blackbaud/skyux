import { Component, input } from '@angular/core';

import { SkyPageLinksInput } from '../../action-hub/types/page-links-input';
import { SkyLinkListModule } from '../link-list.module';

@Component({
  selector: 'sky-link-list-fixture',
  template: `
    <sky-link-list headingText="Heading..." [links]="links()">
      @if (showLinks()) {
        <sky-link-list-item>
          <a href="#">Link 1</a>
        </sky-link-list-item>
        <sky-link-list-item>
          <a href="#">Link 2</a>
        </sky-link-list-item>
      }
    </sky-link-list>
  `,
  imports: [SkyLinkListModule],
})
export class LinkListFixtureComponent {
  public readonly links = input<SkyPageLinksInput | undefined>();
  public readonly showLinks = input<boolean>(false);
}
