import { Component, input, viewChild } from '@angular/core';

import { SkyPageComponent } from '../page.component';
import { SkyPageModule } from '../page.module';

@Component({
  selector: 'sky-page-component-fixture',
  standalone: true,
  imports: [SkyPageModule],
  template: `
    <sky-page #pageEl>
      <sky-page-content>Some content</sky-page-content>
      @if (withLinks) {
        <sky-page-links>Links.</sky-page-links>
      }
    </sky-page>
  `,
})
export class PageFixtureComponent {
  public readonly withLinks = input<boolean>(false);

  public readonly page = viewChild(SkyPageComponent);
}
